import Link from "next/link";
import { PageHeader, QuoteBand } from "./PageParts";
import { faqPages } from "@/content/faqs";
import { services } from "@/content/services";
import { SERVICE_PAGE_TO_OPTION } from "@/lib/forms/schema";
import { routes, serviceFaq, serviceKeys, type ServiceKey } from "@/lib/site";

/**
 * FAQ page: native <details>/<summary> so every answer is in the initial HTML and works
 * without JavaScript. No FAQPage schema is emitted (not a rich-result target).
 */
export function FaqTemplate({ service }: { service: ServiceKey }) {
  const page = faqPages[service];
  const s = services[service];
  const faqKey = serviceFaq[service];
  const quoteHref = `${routes.quote.path}?service=${SERVICE_PAGE_TO_OPTION[service]}`;

  return (
    <>
      <PageHeader trail={["home", faqKey]} title={page.title} intro={<p>{page.intro}</p>} mark={s.mark} photo="brick">
        <div className="page-header__actions">
          <Link href={routes[service].path} className="text-link">
            About Our {s.title} Service
          </Link>
        </div>
      </PageHeader>

      <div className="container container--narrow faq">
        <h2 className="visually-hidden">Questions and Answers</h2>
        <div className="faq__list">
          {page.faqs.map((f, i) => (
            <details key={f.id} id={f.id} className="faq__item" open={i === 0 ? true : undefined} data-reveal>
              <summary>
                <span className="faq__q">{f.question}</span>
              </summary>
              <div className="faq__a prose">{f.answer}</div>
            </details>
          ))}
        </div>

        <nav className="faq__related" aria-labelledby="faq-related-title">
          <h2 id="faq-related-title">More FAQs</h2>
          <ul>
            {serviceKeys
              .filter((k) => k !== service)
              .map((k) => (
                <li key={k}>
                  <Link href={routes[serviceFaq[k]].path}>{faqPages[k].title}</Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <QuoteBand
        heading={`Ready to Order? Request a Quote`}
        body={
          <p>
            Read more about our <Link href={routes[service].path}>{s.title}</Link> service, including what we do when we receive your instructions.
          </p>
        }
        href={quoteHref}
      />
    </>
  );
}
