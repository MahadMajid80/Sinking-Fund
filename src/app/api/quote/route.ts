import { quoteForm } from "@/lib/forms/schema";
import { handleSubmission } from "@/lib/server/submission";
import { recaptchaSecretSet } from "@/lib/server/recaptcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleSubmission(req, quoteForm);
}

/** Status check (yes/no values only, never the keys themselves). */
export function GET() {
  return Response.json(
    {
      ok: true,
      recaptchaSecretKeySet: recaptchaSecretSet(),
      emailDelivery: process.env.MAIL_FROM && process.env.SMTP_HOST ? "smtp" : "not configured",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
