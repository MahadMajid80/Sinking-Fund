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
      { href: routes.biv.path, label: "Building Insurance Valuation" },
      { href: routes.sfp.path, label: "Capital Works or Sinking Fund Plan" },
      { href: routes.whs.path, label: "Work Health and Safety" },
      { href: routes.asb.path, label: "Asbestos Report" },
    ],
  },
  { href: routes.testimonials.path, label: "Testimonials" },
  {
    id: "faq",
    label: "FAQ",
    links: [
      { href: routes.faqBiv.path, label: "Building Insurance Valuation" },
      { href: routes.faqSfp.path, label: "Capital Works or Sinking Fund Plans" },
      { href: routes.faqWhs.path, label: "Work Health and Safety" },
      { href: routes.faqAsb.path, label: "Asbestos Reports" },
    ],
  },
  { href: routes.contact.path, label: "Contact" },
];

export const footerNav: NavLink[] = [
  { href: routes.legal.path, label: "Legal" },
  { href: routes.about.path, label: "About Us" },
  { href: routes.testimonials.path, label: "Testimonials" },
  { href: routes.contact.path, label: "Contact Us" },
];
