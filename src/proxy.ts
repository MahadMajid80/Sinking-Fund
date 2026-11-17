import { NextResponse, type NextRequest } from "next/server";
import { legacyRedirect } from "@/lib/redirects";

/**
 * Legacy URL handling (Next.js 16 "proxy", formerly middleware).
 * Set ENFORCE_CANONICAL_HOST=true on the production deployment to redirect other hosts
 * and plain HTTP to SITE_URL in the same hop.
 */
export function proxy(request: NextRequest) {
  const decision = legacyRedirect(request.nextUrl, {
    canonicalOrigin: process.env.SITE_URL,
    enforceHost: process.env.ENFORCE_CANONICAL_HOST === "true",
    proto: request.headers.get("x-forwarded-proto"),
    host: request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  });
  if (decision) return NextResponse.redirect(decision.location, decision.status);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|images/|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)"],
};
