import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Mail transports. Configuration is server-side only (never NEXT_PUBLIC_*).
 *
 * MAIL_TRANSPORT=smtp  Real delivery through SMTP (nodemailer). Requires SMTP_HOST, SMTP_PORT,
 *                      SMTP_USER, SMTP_PASS, MAIL_FROM and CONTACT_TO / QUOTE_TO.
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
  return specific.length ? specific : list(process.env.ENQUIRY_TO);
}

export function mailTransportName(): "smtp" | "mock" | null {
  const t = process.env.MAIL_TRANSPORT;
  return t === "smtp" || t === "mock" ? t : null;
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

  const from = process.env.MAIL_FROM;
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
    if (!info.accepted?.length || info.rejected?.length) return { ok: false, reason: "rejected" };
    return { ok: true, transport: "smtp", messageId: info.messageId };
  } catch {
    return { ok: false, reason: "rejected" };
  }
}
