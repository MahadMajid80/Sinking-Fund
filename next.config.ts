import type { NextConfig } from "next";

// Same rule as SITE_INDEXABLE in src/lib/site.ts: on, or automatic once sinkingfundplan.com.au is the Vercel production domain.
const onRealDomain = /(^|\.)sinkingfund(plan)?\.com\.au$/.test((process.env.VERCEL_PROJECT_PRODUCTION_URL || "").toLowerCase());
const indexable =
  process.env.SITE_INDEXABLE === "true" ||
  (process.env.SITE_INDEXABLE !== "false" && process.env.VERCEL_ENV === "production" && onRealDomain);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  // Matches the WordPress directory-style URLs (/about-us/).
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [40, 60, 70, 75],
  },
  async headers() {
    const headers = [{ source: "/:path*", headers: securityHeaders }];
    if (!indexable) {
      // Previews and non-production builds must never be indexed.
      headers.push({ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] });
    }
    return headers;
  },
};

export default nextConfig;
