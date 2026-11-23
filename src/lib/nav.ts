import { routes } from "./site";

export interface NavLink {
  href: string;
  label: string;
}
export interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}
export type NavItem = NavLink | NavGroup;

export const isGroup = (i: NavItem): i is NavGroup => "links" in i;

/** Primary navigation. Labels are the original menu labels, lightly shortened. */
export const primaryNav: NavItem[] = [
  { href: routes.about.path, label: "About" },
  {
    id: "services",
    label: "Services",
    links: [
      { href: routes.biv.path, label: "Building insurance valuation" },
      { href: routes.sfp.path, label: "Capital works or sinking fund plan" },
      { href: routes.whs.path, label: "Work health and safety" },
      { href: routes.asb.path, label: "Asbestos report" },
    ],
  },
  { href: routes.testimonials.path, label: "Testimonials" },
  {
    id: "faq",
    label: "FAQ",
    links: [
      { href: routes.faqBiv.path, label: "Building insurance valuation" },
      { href: routes.faqSfp.path, label: "Capital works or sinking fund plans" },
      { href: routes.faqWhs.path, label: "Work health and safety" },
      { href: routes.faqAsb.path, label: "Asbestos reports" },
    ],
  },
  { href: routes.contact.path, label: "Contact" },
];

export const footerNav: NavLink[] = [
  { href: routes.legal.path, label: "Legal" },
  { href: routes.about.path, label: "About us" },
  { href: routes.testimonials.path, label: "Testimonials" },
  { href: routes.contact.path, label: "Contact us" },
];
