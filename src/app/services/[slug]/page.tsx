import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, PageHeader, QuoteBand } from "@/components/PageParts";
import { Arrow } from "@/components/SiteChrome";
import { services } from "@/content/services";
import { faqPages } from "@/content/faqs";
import { SERVICE_PAGE_TO_OPTION } from "@/lib/forms/schema";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { BRAND, routes, serviceFaq, serviceKeys, type ServiceKey } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceKeys.map((slug) => ({ slug }));
}

const quoteHeadings: Record<ServiceKey, string> = {
  biv: "Request a quote for a building insurance valuation",
  sfp: "Request a quote for a capital works or sinking fund plan",
  whs: "Request a quote for a work health and safety report",
  asb: "Request a quote for an asbestos report",
};

const isService = (s: string): s is ServiceKey => (serviceKeys as readonly string[]).includes(s);

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  return isService(slug) ? pageMetadata(slug) : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!isService(slug)) notFound();
  const s = services[slug];
  const faqKey = serviceFaq[slug];
  const quoteHref = `${routes.quote.path}?service=${SERVICE_PAGE_TO_OPTION[slug]}`;

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <JsonLd data={serviceJsonLd(slug, s.title, s.summary)} />
      <PageHeader trail={["home", slug]} title={s.title} intro={<p>{s.summary}</p>} mark={s.mark}>
        <div className="page-header__actions">
          <Link href={quoteHref} className="button button--primary">
            Request a quote for this service <Arrow />
          </Link>
          <Link href={routes[faqKey].path} className="text-link">
            Read the {faqPages[slug].title}
          </Link>
        </div>
      </PageHeader>

      <div className="article-layout">
        <aside className="article-layout__aside">
          <nav aria-labelledby="toc-title" className="toc">
            <h2 id="toc-title" className="toc__title">
              On this page
            </h2>
            <ol>
              {s.sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`}>{sec.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="aside-card">
            <h2 className="aside-card__title">Questions about this service?</h2>
            <p>
              <Link href={routes[faqKey].path}>{faqPages[slug].title}</Link>
            </p>
            <p>
              Call <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>
            </p>
          </div>
        </aside>
        <article className="prose article-layout__body">
          {s.sections.map((sec) => (
            <section key={sec.id} id={sec.id} aria-labelledby={`${sec.id}-h`} className="prose__section">
              <h2 id={`${sec.id}-h`}>{sec.heading}</h2>
              {sec.body}
            </section>
          ))}
        </article>
      </div>

      <QuoteBand heading={quoteHeadings[slug]} href={quoteHref} />
    </>
  );
}
