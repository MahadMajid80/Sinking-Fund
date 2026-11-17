import Image from "next/image";
import { PageHeader, QuoteBand } from "@/components/PageParts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("about");

// Transcribed verbatim from about-us/index.html.
const values = [
  {
    name: "Innovative",
    text: "our enviable and unique experience provides us a strong foundation, original in its intent, to provide our clients leading solutions to meet today’s industry challenges. We can provide clients with creative and relevant results, ensuring accountability throughout the process and remaining responsible for the outcome.",
  },
  {
    name: "Vigilant",
    text: "on a weekly basis, we review Court cases dealing with negligence, work health and safety, asbestos, amongst other topics, and any changes to legislation that may be relevant to the property industry. We are intimately aware of proposed changes to legislation and have instigated some of these changes.",
  },
  {
    name: "Professional",
    text: "we are Registered Valuers (since 1984), licensed Real Estate Agents and are appropriately qualified Asbestos and Work Health and Safety specialists serving the property industry. Our Directors serve on both government and industry committees providing advice on strata and other property issues. We abide by our respective Institutes' Code of Professional Conduct and Ethics.",
  },
  {
    name: "Independent",
    text: "our role is to provide independent professional advice to our clients. We are not affiliated with any maintenance companies, nor do our recommendations or our work practices rely on referrals to these types of companies. We are similar to independent auditors providing practical recommendations.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader trail={["home", "about"]} title="About us" intro={<p>Sinking Fund is a BIV Reports Pty Limited website.</p>} photo="none" />

      <section className="about-history" aria-labelledby="history-h">
        <div className="about-history__inner">
          <div className="prose">
            <h2 id="history-h">Our History</h2>
            <p>
              Since 1984, we have over 30 years experience in valuing a very wide variety of properties, from carrying out due diligence on the largest property
              transactions in Australia through to the smallest of suburban cottages. We are experts in the presentation of expert evidence in both Federal and State Court
              systems. We have particular expertise in strata property having inspected over 20% of the strata schemes in New South Wales.
            </p>
          </div>
          <figure className="about-history__media" data-reveal>
            <Image
              src="/images/apartment-building.jpg"
              alt="Modern apartment buildings with balconies around a shared lawn"
              width={2400}
              height={1800}
              quality={70}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </figure>
        </div>
      </section>

      <section className="values" aria-labelledby="values-h">
        <div className="container">
          <h2 id="values-h" className="section-title">
            Our Values
          </h2>
          <dl className="values__list">
            {values.map((v) => (
              <div key={v.name} className="values__item" data-reveal>
                <dt>{v.name}</dt>
                <dd>{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="vision" aria-label="Vision and mission">
        <div className="container vision__grid">
          <div>
            <h2>Our Vision</h2>
            <p>Our clients have the most accurate and practical property reports available, in an Easy to Read Report format.</p>
            <p>Our advice is properly researched in detail, and is simply the best available in the market.</p>
          </div>
          <div>
            <h2>Our Mission</h2>
            <p>Our mission starts with our clients, by simply making their work easier and enjoyable.</p>
            <p>We work together with our clients to achieve a positive and rewarding outcome.</p>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
