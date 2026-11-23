import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND, routes, type RouteKey } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Arrow } from "./SiteChrome";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ trail }: { trail: RouteKey[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {trail.map((k, i) =>
          i === trail.length - 1 ? (
            <li key={k} aria-current="page">
              {routes[k].label}
            </li>
          ) : (
            <li key={k}>
              <Link href={routes[k].path}>{routes[k].label}</Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/**
 * Compact, light inner-page header: breadcrumbs, title and a one-line introduction on a
 * subtle grid pattern. Replaces the legacy gaussian-blur2.jpg subheader. Kept short so the
 * page body leads.
 */
export function PageHeader({
  trail,
  title,
  intro,
  mark,
  children,
}: {
  trail?: RouteKey[];
  title: string;
  intro?: ReactNode;
  mark?: string;
  /** Retained for compatibility; header photos are no longer used. */
  photo?: "apartment" | "brick" | "none";
  children?: ReactNode;
}) {
  return (
    <>
      {trail ? <JsonLd data={breadcrumbJsonLd(trail)} /> : null}
      <div className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__text">
            {trail ? <Breadcrumbs trail={trail} /> : null}
            <div className="page-hero__title-row">
              {mark ? <Image src={mark} alt="" width={54} height={71} className="page-hero__mark" /> : null}
              <h1 className="page-hero__title">{title}</h1>
            </div>
            {intro ? <div className="page-hero__intro">{intro}</div> : null}
            {children}
          </div>
          <span className="page-hero__motif" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

/** Closing call to action: a light panel on a soft brand-colour pattern. */
export function QuoteBand({ heading = "Request a quote", body, href = routes.quote.path }: { heading?: string; body?: ReactNode; href?: string }) {
  return (
    <section className="cta-band" aria-labelledby="cta-band-heading">
      <div className="cta-band__inner" data-reveal>
        <h2 id="cta-band-heading">{heading}</h2>
        {body ? <div className="cta-band__body">{body}</div> : null}
        <div className="cta-band__actions">
          <Link href={href} className="button button--primary">
            Request a quote <Arrow />
          </Link>
          <a href={BRAND.phoneHref} className="button button--outline">
            Call {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
