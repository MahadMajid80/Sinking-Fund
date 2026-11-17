import Image from "next/image";
import Link from "next/link";
import { BRAND, routes } from "@/lib/site";
import { footerNav, primaryNav, isGroup } from "@/lib/nav";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Floating glass header: a rounded bar inset from the page edges that sits over the tinted
 * page heroes, with the navigation in a pill track. Gains depth once the page scrolls
 * (html[data-scrolled] is set by Enhancements).
 */
export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="wordmark" aria-label={`${BRAND.wordmark}, home`}>
          <Image src="/images/marks/brand.png" alt="" width={30} height={34} className="wordmark__mark" />
          <span>{BRAND.wordmark}</span>
        </Link>
        <DesktopNav />
        <div className="site-header__actions">
          <a href={BRAND.phoneHref} className="phone-link">
            <span className="phone-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </span>
            <span className="visually-hidden">Call </span>
            <span className="phone-link__number">{BRAND.phoneDisplay}</span>
          </a>
          <Link href={routes.quote.path} className="button button--primary button--small site-header__cta">
            Request a Quote
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const services = primaryNav.find((i) => isGroup(i) && i.id === "services");
  const faqs = primaryNav.find((i) => isGroup(i) && i.id === "faq");
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="wordmark wordmark--footer" aria-label={`${BRAND.wordmark}, home`}>
            <Image src="/images/marks/brand.png" alt="" width={38} height={43} className="wordmark__mark" />
            <span>{BRAND.wordmark}</span>
          </Link>
          <p className="site-footer__tagline">Property compliance and valuation</p>
          <a href={BRAND.phoneHref} className="site-footer__phone">
            {BRAND.phoneDisplay}
          </a>
          <Link href={routes.quote.path} className="button button--primary">
            Request a Quote <Arrow />
          </Link>
        </div>
        {[services, faqs].map((group) =>
          group && isGroup(group) ? (
            <nav key={group.id} aria-labelledby={`footer-${group.id}`} className="site-footer__col">
              <h2 id={`footer-${group.id}`}>{group.label}</h2>
              <ul>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null,
        )}
        <nav aria-labelledby="footer-company" className="site-footer__col">
          <h2 id="footer-company">Company</h2>
          <ul>
            {footerNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer__legal">{BRAND.copyright}</p>
      </div>
      <p className="site-footer__giant" aria-hidden="true">
        {BRAND.wordmark}
      </p>
    </footer>
  );
}
