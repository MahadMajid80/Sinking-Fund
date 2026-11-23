import Link from "next/link";
import type { Metadata } from "next";
import { BRAND } from "@/lib/site";
import { PageHeader } from "@/components/PageParts";

// Landing page for form submissions made without JavaScript. Not indexed, not in the sitemap.
export const metadata: Metadata = { title: { absolute: "Message Sent | Sinking Fund" }, robots: { index: false, follow: false } };

export default function SentPage() {
  return (
    <>
    <PageHeader title="Message Sent" intro={<p>Thank you. Your details were sent to our team and we will respond using the preference you chose.</p>} photo="none" />
    <div className="container container--narrow status-page">
      <p>
        If your request is urgent, call <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>.
      </p>
      <p>
        <Link href="/">Return to the home page</Link>
      </p>
    </div>
    </>
  );
}
