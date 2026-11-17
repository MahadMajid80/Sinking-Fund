import Link from "next/link";
import { PageHeader } from "@/components/PageParts";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { pageMetadata } from "@/lib/seo";
import { BRAND, routes } from "@/lib/site";

export const metadata = pageMetadata("quote");

export default function QuotePage() {
  return (
    <>
      <PageHeader
        trail={["home", "quote"]}
        title="Request a Quote"
        intro={
          <>
            <p>Provide a quotation for the selected service at the property listed below.</p>
            <p>Please select the services you require, complete the form below and submit.</p>
          </>
        }
        photo="none"
      />
      <div className="form-layout">
        <div className="form-layout__main">
          <h2 className="form-layout__title">Job Description</h2>
          <QuoteForm />
        </div>
        <aside className="form-layout__aside">
          <h2>Turnaround</h2>
          <p>Our normal turnaround time is around 3 to 7 business days, and we will beat any competitors written quote by 12%.</p>
          <h2>Prefer to talk?</h2>
          <p className="big-phone">
            <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>
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
