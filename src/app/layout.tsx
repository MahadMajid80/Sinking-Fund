import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer, Header } from "@/components/SiteChrome";
import { JsonLd } from "@/components/PageParts";
import { Enhancements } from "@/components/Enhancements";
import { SITE_URL } from "@/lib/site";
import { organizationJsonLd, robotsMeta } from "@/lib/seo";
import "./globals.css";

// Self-hosted subsets of the original theme fonts (no third-party font requests).
// Only the faces needed for first paint are preloaded; secondary weights load on demand.
const montserrat = localFont({
  src: [{ path: "../fonts/montserrat-latin-600-normal.woff2", weight: "600", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const montserratAccent = localFont({
  src: [
    { path: "../fonts/montserrat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/montserrat-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display-accent",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const lato = localFont({
  src: [
    { path: "../fonts/lato-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/lato-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const latoItalic = localFont({
  src: [{ path: "../fonts/lato-latin-400-italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-text-italic",
  display: "swap",
  preload: false,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sinking Fund",
  robots: robotsMeta,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#272727",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" data-scroll-behavior="smooth" className={`${montserrat.variable} ${montserratAccent.variable} ${lato.variable} ${latoItalic.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to Main Content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd()} />
        <Enhancements />
      </body>
    </html>
  );
}
