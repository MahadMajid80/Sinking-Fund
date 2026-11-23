import "server-only";
import { faqPages } from "@/content/faqs";
import { services } from "@/content/services";
import { routes, serviceFaq, serviceKeys, type ServiceKey } from "./site";

/**
 * Plain data for the desktop menu panels, built on the server from the page content so the
 * menus stay in step with the pages (and the long page content never ships to the browser).
 */
export interface MegaTile {
  href: string;
  title: string;
  text: string;
  /** Diamond quadrant colour of the service (the dot on the tile). */
  quadrant: "top" | "left" | "right" | "bottom";
}
export interface MegaData {
  services: MegaTile[];
  faq: MegaTile[];
}

/** Menu titles match the navigation labels. */
const serviceTitles: Record<ServiceKey, string> = {
  biv: "Building insurance valuation",
  sfp: "Capital works or sinking fund plan",
  whs: "Work health and safety",
  asb: "Asbestos report",
};
/** One-line descriptions, condensed from each service's own summary. */
const serviceLines: Record<ServiceKey, string> = {
  biv: "Certificates of value for the replacement and reinstatement cost of your buildings.",
  sfp: "10 and 15 year plans compliant with s80 of the Strata Schemes Management Act.",
  whs: "Safety reports covering both a duty of care and WHS legislative requirements.",
  asb: "An asbestos register and an asbestos management plan in one report.",
};
const faqTitles: Record<ServiceKey, string> = {
  biv: "Building insurance valuation FAQs",
  sfp: "Capital works or sinking fund plan FAQs",
  whs: "Work health and safety FAQs",
  asb: "Asbestos report FAQs",
};
const faqTopics: Record<ServiceKey, string> = {
  biv: "building insurance valuations",
  sfp: "capital works and sinking fund plans",
  whs: "work health and safety reports",
  asb: "asbestos reports",
};

export function megaData(): MegaData {
  return {
    services: serviceKeys.map((key) => ({
      href: routes[key].path,
      title: serviceTitles[key],
      text: serviceLines[key],
      quadrant: services[key].quadrant,
    })),
    faq: serviceKeys.map((key) => ({
      href: routes[serviceFaq[key]].path,
      title: faqTitles[key],
      text: `${faqPages[key].faqs.length} questions owners ask about ${faqTopics[key]}.`,
      quadrant: services[key].quadrant,
    })),
  };
}
