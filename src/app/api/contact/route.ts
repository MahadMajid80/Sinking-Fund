import { contactForm } from "@/lib/forms/schema";
import { handleSubmission } from "@/lib/server/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleSubmission(req, contactForm);
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
