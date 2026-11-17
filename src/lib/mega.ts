import "server-only";
import { faqPages } from "@/content/faqs";
import { services } from "@/content/services";
import { routes, serviceFaq, serviceKeys } from "./site";

/**
 * Plain data for the desktop mega menus, built on the server from the page content so the
 * menus always match the pages (and the long page content never ships to the browser).
 */
export interface MegaService {
  href: string;
  title: string;
  summary: string;
  mark: string;
}
export interface MegaFaqTopic {
  href: string;
  title: string;
  count: number;
  mark: string;
  questions: { href: string; question: string }[];
}
export interface MegaData {
  services: MegaService[];
  faq: MegaFaqTopic[];
}

/** Menu labels match the existing navigation. */
const serviceLabels = { biv: "Building Insurance Valuation", sfp: "Capital Works or Sinking Fund Plan", whs: "Work Health and Safety", asb: "Asbestos Report" } as const;
const faqLabels = { biv: "Building Insurance Valuation", sfp: "Capital Works or Sinking Fund Plans", whs: "Work Health and Safety", asb: "Asbestos Reports" } as const;

export function megaData(): MegaData {
  return {
    services: serviceKeys.map((key) => ({
      href: routes[key].path,
      title: serviceLabels[key],
      summary: services[key].summary,
      mark: services[key].mark,
    })),
    faq: serviceKeys.map((key) => {
      const href = routes[serviceFaq[key]].path;
      const page = faqPages[key];
      return {
        href,
        title: faqLabels[key],
        count: page.faqs.length,
        mark: services[key].mark,
        questions: page.faqs.slice(0, 3).map((f) => ({ href: `${href}#${f.id}`, question: f.question })),
      };
    }),
  };
}
