import Link from "next/link";
import type { Metadata } from "next";
import { BRAND, routes } from "@/lib/site";
import { PageHeader } from "@/components/PageParts";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Sinking Fund" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
    <PageHeader title="Page Not Found" intro={<p>This address doesn’t match a page on Sinking Fund. It may have moved when the site was updated.</p>} photo="none" />
    <div className="container container--narrow status-page">
      <ul className="status-page__links">
        <li>
          <Link href="/">Go to the Home Page</Link>
        </li>
        <li>
          <Link href={routes.biv.path}>Building Insurance Valuation</Link>
        </li>
        <li>
          <Link href={routes.sfp.path}>Capital Works or Sinking Fund Plan</Link>
        </li>
        <li>
          <Link href={routes.whs.path}>Work Health and Safety</Link>
        </li>
        <li>
          <Link href={routes.asb.path}>Asbestos Report</Link>
        </li>
        <li>
          <Link href={routes.contact.path}>Contact Us</Link> or call <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>
        </li>
      </ul>
    </div>
    </>
  );
}
