import type { Metadata } from "next";
import { BRAND, SITE_INDEXABLE, SITE_URL, absoluteUrl, routes, type RouteKey } from "./site";

const OG_IMAGE = {
  url: "/images/og-sinking-fund.jpg",
  width: 1200,
  height: 630,
  alt: "Red-brick two-storey property with white sash windows",
};

export const robotsMeta: Metadata["robots"] = SITE_INDEXABLE
  ? { index: true, follow: true }
  : { index: false, follow: false, googleBot: { index: false, follow: false } };

/** Builds unique title, description, self-referencing absolute canonical and social tags for a route. */
export function pageMetadata(key: RouteKey): Metadata {
  const r = routes[key];
  const url = absoluteUrl(r.path);
  return {
    title: { absolute: r.title },
    description: r.description,
    alternates: { canonical: url },
    robots: robotsMeta,
    openGraph: {
      type: "website",
      locale: "en_AU",
      siteName: BRAND.wordmark,
      url,
      title: r.title,
      description: r.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description: r.description,
      images: [OG_IMAGE.url],
    },
  };
}

export const ORG_ID = `${SITE_URL}/#organization`;

/** Organization data limited to verified identifiers from the export (name, website name, phone, logo). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND.company,
    alternateName: BRAND.wordmark,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/marks/brand.png"),
    telephone: BRAND.phoneE164,
    contactPoint: [{ "@type": "ContactPoint", telephone: BRAND.phoneE164, contactType: "customer service", availableLanguage: "en-AU" }],
  };
}

export function breadcrumbJsonLd(trail: RouteKey[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: routes[k].label,
      item: absoluteUrl(routes[k].path),
    })),
  };
}

export function serviceJsonLd(key: RouteKey, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: absoluteUrl(routes[key].path),
    provider: { "@id": ORG_ID },
  };
}
