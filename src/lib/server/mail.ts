import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Mail transports. Configuration is server-side only (never NEXT_PUBLIC_*).
 *
 * MAIL_TRANSPORT=smtp  Real delivery through SMTP (nodemailer). Requires SMTP_HOST, SMTP_PORT,
 *                      SMTP_USER, SMTP_PASS and a recipient list. Chosen automatically when SMTP_HOST is set.
 *                      Same variable names as the BIV Reports site:
 *                        SMTP_USER        the sending mailbox, e.g. website@sinkingfundplan.com.au (also the From address)
 *                        QUOTE_TO_EMAIL   who receives enquiries, comma separated (both forms)
 *                      Optional: MAIL_FROM (another From), CONTACT_TO / QUOTE_TO (per form), SMTP_SECURE.
 * MAIL_TRANSPORT=mock  Writes each message as JSON to MAIL_MOCK_DIR (default .mail-outbox).
 *                      For automated tests and local development only. Messages are NOT delivered.
 *                      Any field containing MOCK_DELIVERY_FAILURE makes the mock reject the message,
 *                      so tests can exercise the delivery failure state.
 * unset                The forms report that online delivery is unavailable and show the phone number.
 */

export interface OutgoingMail {
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  /** Opaque reference included in logs; contains no personal data. */
  reference: string;
  form: "contact" | "quote";
}

export type MailResult = { ok: true; transport: "smtp" | "mock"; messageId: string } | { ok: false; reason: "unconfigured" | "rejected" };

export const MOCK_FAILURE_TOKEN = "MOCK_DELIVERY_FAILURE";

function list(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function recipientsFor(form: "contact" | "quote"): string[] {
  const specific = list(form === "contact" ? process.env.CONTACT_TO : process.env.QUOTE_TO);
  if (specific.length) return specific;
  const shared = list(process.env.ENQUIRY_TO);
  return shared.length ? shared : list(process.env.QUOTE_TO_EMAIL);
}

/** The From address: MAIL_FROM, or the SMTP mailbox itself under the site's name. */
function fromAddress(): string | undefined {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  const user = (process.env.SMTP_USER || "").trim();
  return user.includes("@") ? `"Sinking Fund Website" <${user}>` : undefined;
}

export function mailTransportName(): "smtp" | "mock" | null {
  const t = process.env.MAIL_TRANSPORT;
  if (t === "smtp" || t === "mock") return t;
  return (process.env.SMTP_HOST || "").trim() ? "smtp" : null;
}

/** For the status check: which transport is active and which settings are missing (names only, never values). */
export function mailStatus(): { emailDelivery: "smtp" | "mock" | "not configured"; missing: string[] } {
  const transport = mailTransportName();
  if (transport === "mock") return { emailDelivery: "mock", missing: [] };
  const missing: string[] = [];
  if (!(process.env.SMTP_HOST || "").trim()) missing.push("SMTP_HOST");
  if (!(process.env.SMTP_USER || "").trim()) missing.push("SMTP_USER");
  if (!(process.env.SMTP_PASS || "").trim()) missing.push("SMTP_PASS");
  if (!fromAddress()) missing.push("MAIL_FROM");
  if (!recipientsFor("contact").length || !recipientsFor("quote").length) missing.push("QUOTE_TO_EMAIL");
  return { emailDelivery: transport === "smtp" && missing.length === 0 ? "smtp" : "not configured", missing };
}

export async function sendMail(mail: OutgoingMail): Promise<MailResult> {
  const transport = mailTransportName();
  if (!transport) return { ok: false, reason: "unconfigured" };

  if (transport === "mock") {
    if (mail.text.includes(MOCK_FAILURE_TOKEN)) return { ok: false, reason: "rejected" };
    const dir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.MAIL_MOCK_DIR || ".mail-outbox");
    await mkdir(dir, { recursive: true });
    const messageId = `mock-${mail.reference}`;
    await writeFile(
      path.join(dir, `${Date.now()}-${mail.form}-${mail.reference}.json`),
      JSON.stringify({ transport: "mock", messageId, from: process.env.MAIL_FROM ?? "mock@localhost", ...mail }, null, 2),
    );
    return { ok: true, transport: "mock", messageId };
  }

  const from = fromAddress();
  if (!from || !process.env.SMTP_HOST || mail.to.length === 0) return { ok: false, reason: "unconfigured" };

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  try {
    const info = await transporter.sendMail({
      from,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      headers: { "X-Enquiry-Reference": mail.reference },
    });
    // Accepted only if the SMTP server accepted at least one recipient and rejected none.
    if (!info.accepted?.length || info.rejected?.length) {
      console.warn(`[mail] ${mail.form} ${mail.reference}: SMTP server did not accept every recipient`);
      return { ok: false, reason: "rejected" };
    }
    return { ok: true, transport: "smtp", messageId: info.messageId };
  } catch (err) {
    // Error code only (e.g. EAUTH, ECONNECTION, 535): no personal data, no credentials.
    const e = err as { code?: string; responseCode?: number };
    console.warn(`[mail] ${mail.form} ${mail.reference}: SMTP send failed (${e.code ?? "error"}${e.responseCode ? ` ${e.responseCode}` : ""})`);
    return { ok: false, reason: "rejected" };
  }
}
