"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isGroup, primaryNav } from "@/lib/nav";
import { BRAND, routes } from "@/lib/site";

/**
 * Mobile navigation drawer built on the native <dialog> element: showModal() makes the rest
 * of the page inert, traps focus, and closes on Escape. Focus returns to the menu button.
 */
export function MobileNav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = () => dialog.current?.open && dialog.current.close();

  // Close the drawer after client-side navigation.
  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <>
      <button ref={opener} type="button" className="menu-button" aria-haspopup="dialog" aria-controls="mobile-nav" onClick={() => dialog.current?.showModal()}>
        <span className="menu-button__icon" aria-hidden="true" />
        Menu
      </button>
      <dialog
        id="mobile-nav"
        ref={dialog}
        className="drawer"
        aria-label="Menu"
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="drawer__panel">
          <div className="drawer__top">
            <span className="wordmark wordmark--small" aria-hidden="true">
              <Image src="/images/marks/brand.png" alt="" width={26} height={30} className="wordmark__mark" />
              <span>{BRAND.wordmark}</span>
            </span>
            <button type="button" className="drawer__close" onClick={close}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="drawer__list">
              <li>
                <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                  Home
                </Link>
              </li>
              {primaryNav.map((item) =>
                isGroup(item) ? (
                  <li key={item.id} className="drawer__group">
                    <span className="drawer__group-label" id={`m-${item.id}`}>
                      {item.label}
                    </span>
                    <ul aria-labelledby={`m-${item.id}`}>
                      {item.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} aria-current={l.href === pathname ? "page" : undefined}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={item.href === pathname ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="drawer__actions">
            <Link href={routes.quote.path} className="button button--primary">
              Request a Quote
            </Link>
            <a href={BRAND.phoneHref} className="button button--quiet">
              Call {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
