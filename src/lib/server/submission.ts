import "server-only";
import { randomUUID } from "node:crypto";
import {
  type FormDefinition,
  type FormValues,
  HONEYPOT_FIELD,
  LIMITS,
  MIN_FILL_MS,
  isValidEmail,
  normalise,
  optionLabel,
  validate,
} from "@/lib/forms/schema";
import { recipientsFor, sendMail } from "./mail";
import { renderEmail } from "./email-template";
import { checkRateLimit } from "./rate-limit";
import { verifyRecaptcha } from "./recaptcha";

/**
 * Shared POST handler for both forms.
 *
 * Accepts JSON (enhanced, client-side submission) and application/x-www-form-urlencoded
 * (no-JavaScript fallback). JSON callers receive JSON; form posts receive a 303 redirect
 * to a status page. Personal values never appear in URLs or logs.
 */

type Outcome = "sent" | "duplicate" | "invalid" | "rate_limited" | "delivery_failed" | "unconfigured" | "spam" | "too_large" | "bad_request" | "captcha_failed";

const recent = new Map<string, { state: "pending" | "sent"; at: number }>();
const DEDUPE_MS = 30 * 60 * 1000;

function log(form: string, outcome: Outcome, reference?: string) {
  // Routine log: form, outcome and an opaque reference only. No personal data.
  console.info(JSON.stringify({ event: "form_submission", form, outcome, reference }));
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function subjectFor(def: FormDefinition, values: FormValues): string {
  if (def.id === "contact") {
    const subject = (values.subject as string) || "General enquiry";
    return `Website enquiry: ${subject}`.slice(0, 180);
  }
  const services = (values.services as string[]).map((v) => optionLabel(def, "services", v)).join(", ");
  return `Quote request: ${services}`.slice(0, 180);
}

async function readBody(req: Request): Promise<{ data: Record<string, unknown>; isForm: boolean } | "too_large" | "bad_request"> {
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > LIMITS.payloadBytes) return "too_large";
  const type = req.headers.get("content-type") || "";
  const raw = await req.text();
  if (Buffer.byteLength(raw) > LIMITS.payloadBytes) return "too_large";
  if (type.includes("application/json")) {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "bad_request";
      return { data: parsed as Record<string, unknown>, isForm: false };
    } catch {
      return "bad_request";
    }
  }
  if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw);
    const data: Record<string, unknown> = {};
    for (const key of new Set(params.keys())) {
      const all = params.getAll(key);
      data[key] = all.length > 1 || key.endsWith("[]") ? all : all[0];
      if (key.endsWith("[]")) data[key.slice(0, -2)] = all;
    }
    return { data, isForm: true };
  }
  return "bad_request";
}

const statusPath = (form: string, status: string) => `/enquiry/${status === "sent" ? "sent" : "error"}/?form=${form}${status === "sent" ? "" : `&reason=${status}`}`;

function respond(isForm: boolean, req: Request, form: string, status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  if (isForm) {
    const key = body.ok ? "sent" : String(body.code ?? "error");
    return new Response(null, { status: 303, headers: { Location: new URL(statusPath(form, key), req.url).toString(), ...headers } });
  }
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function handleSubmission(req: Request, def: FormDefinition): Promise<Response> {
  const form = def.id;
  const parsed = await readBody(req);
  if (parsed === "too_large") {
    log(form, "too_large");
    return Response.json({ ok: false, code: "too_large", message: "The form is too large to send. Shorten your message and try again." }, { status: 413 });
  }
  if (parsed === "bad_request") {
    log(form, "bad_request");
    return Response.json({ ok: false, code: "bad_request", message: "The form could not be read. Refresh the page and try again." }, { status: 400 });
  }
  const { data, isForm } = parsed;

  // reCAPTCHA ("I'm not a robot"), checked once RECAPTCHA_CHECKBOX_SECRET_KEY is set in the hosting environment.
  const ip = clientIp(req);
  const captcha = await verifyRecaptcha(data["g-recaptcha-response"], ip === "unknown" ? null : ip);
  if (captcha === "rejected") {
    log(form, "captcha_failed");
    return respond(isForm, req, form, 403, { ok: false, code: "captcha_failed", message: "Tick “I’m not a robot”, then send again." });
  }

  // Spam controls: honeypot and minimum fill time. Bots receive a neutral acknowledgement
  // and nothing is sent. Humans are never affected because the field is hidden from them.
  // A verified reCAPTCHA overrides them, so a fast but genuine person is never dropped.
  const startedAt = Number(data.formStartedAt);
  if (captcha !== "verified" && ((typeof data[HONEYPOT_FIELD] === "string" && data[HONEYPOT_FIELD] !== "") || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS))) {
    log(form, "spam");
    return respond(isForm, req, form, 200, { ok: true, reference: randomUUID().slice(0, 8) });
  }

  const rate = await checkRateLimit(form, clientIp(req));
  if (!rate.allowed) {
    log(form, "rate_limited");
    return respond(
      isForm,
      req,
      form,
      429,
      { ok: false, code: "rate_limited", retryAfter: rate.retryAfterSeconds, message: "Too many messages have been sent from this connection. Wait a few minutes, or call us." },
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
  }

  const values = normalise(def, data);
  const errors = validate(def, values);
  if (Object.keys(errors).length) {
    log(form, "invalid");
    return respond(isForm, req, form, 400, { ok: false, code: "invalid", errors, message: "Some details need attention." });
  }

  // Idempotency: the client sends a per-fill submission ID so double clicks or retries
  // after a timeout don't create duplicate emails.
  const submissionId = typeof data.submissionId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(data.submissionId) ? data.submissionId : null;
  const now = Date.now();
  for (const [k, v] of recent) if (now - v.at > DEDUPE_MS) recent.delete(k);
  if (submissionId) {
    const seen = recent.get(`${form}:${submissionId}`);
    if (seen?.state === "sent") {
      log(form, "duplicate");
      return respond(isForm, req, form, 200, { ok: true, duplicate: true });
    }
    if (seen?.state === "pending") {
      log(form, "duplicate");
      return respond(isForm, req, form, 409, { ok: false, code: "in_progress", message: "This message is already being sent." });
    }
    recent.set(`${form}:${submissionId}`, { state: "pending", at: now });
  }

  const reference = randomUUID().slice(0, 8).toUpperCase();
  const replyEmail = (form === "contact" ? values.email : values.managerEmail) as string;
  const site = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "sinkingfund.com.au").split(",")[0].trim();
  const { text, html, attachments } = renderEmail(def, values, reference, site);
  const result = await sendMail({
    form,
    reference,
    to: recipientsFor(form),
    replyTo: isValidEmail(replyEmail) ? replyEmail : undefined,
    subject: subjectFor(def, values),
    text,
    html,
    attachments,
  });

  if (!result.ok) {
    if (submissionId) recent.delete(`${form}:${submissionId}`);
    const code = result.reason === "unconfigured" ? "unconfigured" : "delivery_failed";
    log(form, code, reference);
    return respond(isForm, req, form, result.reason === "unconfigured" ? 503 : 502, {
      ok: false,
      code,
      message: "Your message could not be sent. Nothing was lost on this page. Try again, or call us on (02) 9114 9800.",
    });
  }

  if (submissionId) recent.set(`${form}:${submissionId}`, { state: "sent", at: Date.now() });
  log(form, "sent", reference);
  return respond(isForm, req, form, 200, { ok: true, reference, transport: result.transport });
}
