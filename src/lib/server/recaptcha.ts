import "server-only";

/**
 * Google reCAPTCHA v2 ("I'm not a robot" checkbox) verification.
 *
 * The check is switched on by setting RECAPTCHA_CHECKBOX_SECRET_KEY in the hosting environment (never in code).
 * - No secret set: not checked (the honeypot, minimum fill time and rate limit still apply).
 * - Token missing or rejected by Google: the message is refused.
 * - Google unreachable, or the secret itself is wrong: logged and the message is accepted, so a
 *   configuration problem never silently loses real enquiries.
 */
export type CaptchaResult = "verified" | "rejected" | "skipped";

export const recaptchaSecretSet = () => (process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim() !== "";

export async function verifyRecaptcha(token: unknown, ip: string | null): Promise<CaptchaResult> {
  const secret = (process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim();
  if (!secret) return "skipped";
  const response = typeof token === "string" ? token.slice(0, 4000) : "";
  if (!response) return "rejected";
  let data: { success?: boolean; "error-codes"?: string[] } | null = null;
  try {
    const params = new URLSearchParams({ secret, response });
    if (ip) params.set("remoteip", ip);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(8000),
    });
    data = await res.json();
  } catch {
    data = null;
  }
  if (!data) {
    console.warn("[enquiry] could not reach Google to verify reCAPTCHA; accepted without it");
    return "skipped";
  }
  if (data.success) return "verified";
  const codes = data["error-codes"] ?? [];
  if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) {
    console.warn("[enquiry] the reCAPTCHA secret key is wrong; not being checked");
    return "skipped";
  }
  console.warn(`[enquiry] reCAPTCHA rejected: ${codes.join(",")}`);
  return "rejected";
}
