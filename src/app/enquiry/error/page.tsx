import Link from "next/link";
import type { Metadata } from "next";
import { BRAND, routes } from "@/lib/site";
import { PageHeader } from "@/components/PageParts";

// Shown only after a form submitted without JavaScript could not be accepted.
export const metadata: Metadata = { title: { absolute: "Message not sent | Sinking Fund" }, robots: { index: false, follow: false } };

const reasons: Record<string, string> = {
  invalid: "Some required details were missing or in the wrong format.",
  rate_limited: "Too many messages have been sent from this connection. Wait a few minutes before trying again.",
  delivery_failed: "Our email service didn’t accept the message.",
  unconfigured: "Online enquiries are not available at the moment.",
};

export default async function ErrorPage({ searchParams }: PageProps<"/enquiry/error">) {
  const sp = await searchParams;
  const reason = typeof sp.reason === "string" ? sp.reason : "";
  const form = sp.form === "quote" ? "quote" : "contact";
  const back = form === "quote" ? routes.quote.path : routes.contact.path;
  return (
    <>
    <PageHeader title="Message not sent" intro={<p>{reasons[reason] ?? "Your message could not be sent."}</p>} photo="none" />
    <div className="container container--narrow status-page">
      <p>
        <Link href={back}>Go back to the {form === "quote" ? "quote request" : "contact"} form</Link> and try again, or call{" "}
        <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>.
      </p>
    </div>
    </>
  );
}
