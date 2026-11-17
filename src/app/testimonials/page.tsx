import { PageHeader, QuoteBand } from "@/components/PageParts";
import { testimonials, splitAttribution } from "@/content/testimonials";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("testimonials");

// No Review/AggregateRating markup: these are first-party testimonials, kept for users only.
export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        trail={["home", "testimonials"]}
        title="Testimonials"
        intro={<p>What strata managers, real estate agents and owners have told us about our reports and service.</p>}
        photo="brick"
      />
      <div className="container">
        <ul className="testimonial-list">
          {testimonials.map((t) => {
            const { name, rest } = splitAttribution(t);
            return (
              <li key={t.id} id={t.id} className="testimonial" data-reveal>
                <figure>
                  <blockquote>
                    <p>{t.quote}</p>
                  </blockquote>
                  <figcaption>
                    {name ? <strong>{name}</strong> : null}
                    {rest}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
      <QuoteBand />
    </>
  );
}
