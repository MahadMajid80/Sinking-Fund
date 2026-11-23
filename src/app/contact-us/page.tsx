import Link from "next/link";
import { PageHeader } from "@/components/PageParts";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { BRAND, routes } from "@/lib/site";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <PageHeader trail={["home", "contact"]} title="Contact Us" intro={<p>Send us a Message below.</p>} photo="none" />
      <div className="form-layout">
        <div className="form-layout__main">
          <h2 className="form-layout__title">Send a Message</h2>
          <ContactForm />
        </div>
        <aside className="form-layout__aside">
          <h2>Call Us</h2>
          <p className="big-phone">
            <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>
          </p>
          <h2>Need a Price?</h2>
          <p>
            Use the <Link href={routes.quote.path}>quote request form</Link> to give us the property and site access details we need.
          </p>
          <h2>Privacy</h2>
          <p>We respect your privacy, and keep all client communications strictly confidential.</p>
          <p>
            <Link href={`${routes.legal.path}#privacy`}>Read our privacy statement</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
