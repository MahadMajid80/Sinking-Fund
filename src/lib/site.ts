/**
 * Site-wide configuration and the canonical route inventory.
 *
 * Every public, indexable page is listed in `routes`. The sitemap, canonical URLs,
 * breadcrumbs and the QA crawler are all generated from this one list.
 */

/** Production origin, e.g. https://www.sinkingfund.com.au (no trailing slash). Set at build time. */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/**
 * Pages are indexable only when SITE_INDEXABLE=true is set for the confirmed production build.
 * Everything else (local, previews, staging) is noindex, nofollow and disallowed in robots.txt.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const BRAND = {
  wordmark: "Sinking Fund",
  company: "BIV Reports Pty Limited",
  phoneDisplay: "(02) 9114 9800",
  phoneHref: "tel:+61291149800",
  phoneE164: "+61 2 9114 9800",
  /** Footer attribution, exactly as in the export. Proposed update is in docs/review-log.md (R-20). */
  copyright: "© 2008-2018 BIV Reports Pty Limited",
} as const;

export type RouteKey =
  | "home"
  | "about"
  | "biv"
  | "sfp"
  | "whs"
  | "asb"
  | "faqBiv"
  | "faqSfp"
  | "faqWhs"
  | "faqAsb"
  | "testimonials"
  | "contact"
  | "quote"
  | "legal";

export interface RouteInfo {
  path: string;
  title: string;
  description: string;
  /** Short label used in navigation and breadcrumbs. */
  label: string;
  /** Original archive file this route replaces. */
  source: string;
  /** WordPress post ID from the exported shortlink, used for ?p= legacy redirects. */
  wpId?: number;
  parent?: RouteKey;
}

export const routes: Record<RouteKey, RouteInfo> = {
  home: {
    path: "/",
    title: "Property Compliance & Valuations | Sinking Fund",
    description:
      "Building insurance valuations, capital works and sinking fund plans, strata WHS reports and asbestos registers for owners corporations and strata managers.",
    label: "Home",
    source: "index.html",
  },
  about: {
    path: "/about-us/",
    title: "About Sinking Fund | BIV Reports Pty Limited",
    description:
      "Registered valuers since 1984 with expertise in strata property. Read the history, values, vision and mission of BIV Reports Pty Limited.",
    label: "About us",
    source: "about-us/index.html",
    wpId: 3828,
  },
  biv: {
    path: "/services/biv/",
    title: "Building Insurance Valuation Services | Sinking Fund",
    description:
      "Building insurance valuations and Certificates of Value for strata and community schemes, prepared by a Registered Valuer. Turnaround around 3 to 7 business days.",
    label: "Building Insurance Valuation",
    source: "services/biv/index.html",
    wpId: 3835,
  },
  sfp: {
    path: "/services/sfp/",
    title: "Capital Works & Sinking Fund Plans | Sinking Fund",
    description:
      "10 and 15 year capital works fund plans, sinking fund plans and maintenance fund plans for owners corporations, with photos and easy to read reports.",
    label: "Capital Works or Sinking Fund Plan",
    source: "services/sfp/index.html",
    wpId: 3841,
  },
  whs: {
    path: "/services/whs/",
    title: "Work Health & Safety Reports | Sinking Fund",
    description:
      "Strata WHS reports and safety reports (OHS reports in Victoria) that identify hazards and include a risk assessment for each one, with colour photographs.",
    label: "Work Health and Safety",
    source: "services/whs/index.html",
    wpId: 3837,
  },
  asb: {
    path: "/services/asb/",
    title: "Asbestos Register & Management Plan Reports | Sinking Fund",
    description:
      "Asbestos Reports that include both an asbestos register and an asbestos management plan, with a risk assessment and photographs of each identified item.",
    label: "Asbestos Report",
    source: "services/asb/index.html",
    wpId: 3839,
  },
  faqBiv: {
    path: "/building-insurance-valuation/",
    title: "Building Insurance Valuation FAQs | Sinking Fund",
    description:
      "Answers to common questions about building insurance valuations: what they include, who needs one, and how often a valuation should be reviewed.",
    label: "Building Insurance Valuation",
    source: "building-insurance-valuation/index.html",
    wpId: 3891,
  },
  faqSfp: {
    path: "/sinking-fund-plans/",
    title: "Capital Works & Sinking Fund Plan FAQs | Sinking Fund",
    description:
      "Answers to common questions about capital works and sinking fund plans: what they are, why owners need one, and how often a plan should be reviewed.",
    label: "Capital Works or Sinking Fund Plans",
    source: "sinking-fund-plans/index.html",
    wpId: 3893,
  },
  faqWhs: {
    path: "/work-health-and-safety/",
    title: "Work Health & Safety Report FAQs | Sinking Fund",
    description:
      "Answers to common questions about work health and safety inspections for strata and property owners, including duty of care and re-inspection cycles.",
    label: "Work Health and Safety",
    source: "work-health-and-safety/index.html",
    wpId: 3895,
  },
  faqAsb: {
    path: "/asbestos-reports/",
    title: "Asbestos Report FAQs | Sinking Fund",
    description:
      "Answers to common questions about asbestos reports, asbestos registers and asbestos management plans, including fees, variations and annual reviews.",
    label: "Asbestos Reports",
    source: "asbestos-reports/index.html",
    wpId: 3897,
  },
  testimonials: {
    path: "/testimonials/",
    title: "Client Testimonials | Sinking Fund",
    description:
      "What strata managers, real estate agents and owners corporations say about our sinking fund plans, building insurance valuations and reports.",
    label: "Testimonials",
    source: "testimonials/index.html",
    wpId: 3905,
  },
  contact: {
    path: "/contact-us/",
    title: "Contact Sinking Fund | BIV Reports Pty Limited",
    description:
      "Call (02) 9114 9800 or send a message about building insurance valuations, sinking fund plans, WHS reports or asbestos reports.",
    label: "Contact us",
    source: "contact-us/index.html",
    wpId: 1437,
  },
  quote: {
    path: "/quote-request/",
    title: "Request a Property Services Quote | Sinking Fund",
    description:
      "Request a quote for a building insurance valuation, sinking fund plan, maintenance plan, WHS, OHS, window safety or asbestos report.",
    label: "Request a Quote",
    source: "quote-request/index.html",
    wpId: 4493,
  },
  legal: {
    path: "/legal/",
    title: "Disclaimer & Privacy | Sinking Fund",
    description: "Website disclaimer, privacy statement and links policy for Sinking Fund, a BIV Reports Pty Limited website.",
    label: "Legal",
    source: "legal/index.html",
    wpId: 3983,
  },
};

export const routeList = Object.entries(routes).map(([key, r]) => ({ key: key as RouteKey, ...r }));

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export const serviceKeys = ["biv", "sfp", "whs", "asb"] as const;
export type ServiceKey = (typeof serviceKeys)[number];

export const serviceFaq: Record<ServiceKey, RouteKey> = {
  biv: "faqBiv",
  sfp: "faqSfp",
  whs: "faqWhs",
  asb: "faqAsb",
};
