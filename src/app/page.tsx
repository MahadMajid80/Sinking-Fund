import Image from "next/image";
import Link from "next/link";
import { QuoteBand } from "@/components/PageParts";
import { Marquee } from "@/components/Marquee";
import { Preloader } from "@/components/Preloader";
import { Arrow } from "@/components/SiteChrome";
import { services } from "@/content/services";
import { testimonials, splitAttribution } from "@/content/testimonials";
import { pageMetadata } from "@/lib/seo";
import { BRAND, routes, type ServiceKey } from "@/lib/site";

export const metadata = pageMetadata("home");

/** Source card order from index.html. */
const homeOrder: ServiceKey[] = ["biv", "whs", "sfp", "asb"];

/** Shorter testimonials for the moving strip (full set on /testimonials/). */
const stripIds = ["rebecca-jarrett", "michael-antonakiou", "leo-paternoster", "andrew-gavin", "active-strata-services", "nicole-fytanis", "helen-davies", "steve-obrien"];
const strip = stripIds.map((id) => testimonials.find((t) => t.id === id)!);

/** Facts taken from the source copy (see docs/migration-inventory.md). */
const facts = [
  { value: 1984, from: 1960, prefix: "", suffix: "", label: "the year we started valuing properties" },
  { value: 35, from: 0, prefix: "", suffix: "%+", label: "of NSW strata schemes inspected" },
  { value: 7, from: 7, prefix: "3–", suffix: "", label: "business day normal turnaround" },
  { value: 5, from: 0, prefix: "$", suffix: "M", label: "professional indemnity insurance" },
];

export default function HomePage() {
  return (
    <>
      <Preloader />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__inner">
          <div className="hero__text">
            <p className="hero__kicker">
              <Image src="/images/marks/brand.png" alt="" width={18} height={20} />
              {BRAND.company}
            </p>
            <h1 id="hero-title" className="hero__title">
              <span className="hero__title-lead">Welcome to</span> <span className="hero__title-name">Sinking Fund Plan</span>
            </h1>
            <p className="hero__lede">Property compliance and valuation</p>
            <div className="hero__actions">
              <Link href={routes.quote.path} className="button button--primary">
                Request a quote <Arrow />
              </Link>
              <Link href={routes.contact.path} className="button button--outline">
                Contact us
              </Link>
            </div>
            <p className="hero__more">
              <Link href={routes.about.path}>Learn more about us</Link>
              <span aria-hidden="true" className="hero__dot" />
              <a href={BRAND.phoneHref}>
                <span className="visually-hidden">Call </span>
                {BRAND.phoneDisplay}
              </a>
            </p>
          </div>
          <figure className="hero__media">
            <div className="hero__frame">
              <Image
                src="/images/city-towers.jpg"
                alt="Modern office and apartment towers against a clear blue sky"
                width={1600}
                height={1350}
                priority
                fetchPriority="high"
                quality={60}
                sizes="(min-width: 1024px) 46vw, calc(100vw - 3.5rem)"
              />
            </div>
            <div className="hero__chip" aria-hidden="true">
              <Image src="/images/marks/brand.png" alt="" width={22} height={25} />
              <span>
                <strong>Registered Valuers</strong>
                since 1984
              </span>
            </div>
          </figure>
        </div>
        <ul className="facts" aria-label="At a glance">
          {facts.map((f) => (
            <li key={f.label} className="facts__item">
              <span className="facts__value">
                {f.prefix}
                <span data-count={f.value} data-from={f.from}>
                  {f.value}
                </span>
                {f.suffix}
              </span>
              <span className="facts__label">{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <h2 id="services-title" className="section-title">
              Our services
            </h2>
            <p>Our clients have the most accurate and practical property reports available, in an easy to read report format.</p>
          </div>
          <ul className="service-grid">
            {homeOrder.map((k) => {
              const s = services[k];
              return (
                <li key={k} className={`service-card service-card--${s.quadrant}`} data-spotlight data-reveal>
                  <Image src={s.mark} alt="" width={54} height={71} className="service-card__mark" />
                  <h3 className="service-card__title">
                    <Link href={routes[k].path} className="service-card__link">
                      {s.cardTitle}
                    </Link>
                  </h3>
                  <p>{s.summary}</p>
                  <span className="service-card__more" aria-hidden="true">
                    Explore <Arrow />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="story" aria-labelledby="history-title">
        <div className="story__inner">
          <figure className="story__media" data-reveal>
            <div className="story__frame">
              <Image
                src="/images/apartment-building.jpg"
                alt="Modern apartment buildings with balconies around a shared lawn"
                fill
                quality={70}
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </figure>
          <div className="story__text" data-reveal>
            <h2 id="history-title" className="section-title">
              A word about us
            </h2>
            <h3>Our history</h3>
            <p>
              Since 1984, we have over 40 years experience in valuing a very wide variety of properties, from carrying out due diligence on the largest property
              transactions in Australia through to the smallest of suburban cottages. We are experts in the presentation of expert evidence in both Federal and State
              Court systems. We have particular expertise in strata property having inspected over 35% of the strata schemes in New South Wales.
            </p>
            <p className="link-row">
              <Link href={routes.about.path} className="link-arrow">
                Learn more about us <Arrow />
              </Link>
              <Link href={routes.testimonials.path} className="link-arrow">
                Testimonials <Arrow />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="voices" aria-labelledby="voices-title">
        <div className="voices__head container" data-reveal>
          <h2 id="voices-title" className="section-title">
            What clients say
          </h2>
          <Link href={routes.testimonials.path} className="link-arrow">
            Read all 15 client testimonials <Arrow />
          </Link>
        </div>
        <Marquee label="Client testimonials">
          {strip.map((t) => {
            const { name, rest } = splitAttribution(t);
            return (
              <li key={t.id} className="voice">
                <figure>
                  <blockquote>
                    <p>{t.quote}</p>
                  </blockquote>
                  <figcaption>
                    <strong>{name}</strong>
                    {rest}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </Marquee>
      </section>

      <QuoteBand
        body={
          <p>
            Our clients have the most accurate and practical property reports available, in an easy to read report format. Our advice is properly researched in detail,
            and is simply the best available in the market.
          </p>
        }
      />
    </>
  );
}
