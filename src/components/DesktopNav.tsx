"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { MegaData } from "@/lib/mega";
import { isGroup, primaryNav, type NavGroup } from "@/lib/nav";
import { BRAND, routes } from "@/lib/site";

type Close = (focusButton?: boolean) => void;

function MegaArrow() {
  return (
    <svg className="mega__arrow" width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServicesPanel({ data, pathname, onNavigate }: { data: MegaData; pathname: string; onNavigate: () => void }) {
  return (
    <div className="mega__grid">
      <ul className="mega__cards">
        {data.services.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="mega-card" aria-current={s.href === pathname ? "page" : undefined} onClick={onNavigate}>
              <Image src={s.mark} alt="" width={44} height={52} className="mega-card__mark" />
              <span className="mega-card__body">
                <span className="mega-card__title">
                  {s.title}
                  <MegaArrow />
                </span>
                <span className="mega-card__text">{s.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mega__aside">
        <p className="mega__aside-title">Not sure which report you need?</p>
        <p className="mega__aside-text">Tell us about the property and we’ll recommend the right service.</p>
        <Link href={routes.quote.path} className="button button--primary button--small" onClick={onNavigate}>
          Request a Quote
        </Link>
        <a href={BRAND.phoneHref} className="mega__phone">
          Call {BRAND.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

function FaqPanel({ data, pathname, onNavigate }: { data: MegaData; pathname: string; onNavigate: () => void }) {
  return (
    <div className="mega__grid">
      <ul className="mega__topics">
        {data.faq.map((t) => (
          <li key={t.href} className="mega-topic">
            <Link href={t.href} className="mega-topic__head" aria-current={t.href === pathname ? "page" : undefined} onClick={onNavigate}>
              <Image src={t.mark} alt="" width={34} height={40} className="mega-topic__mark" />
              <span className="mega-topic__title">{t.title}</span>
            </Link>
            <ul className="mega-topic__questions">
              {t.questions.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} onClick={onNavigate}>
                    {q.question}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={t.href} className="mega-topic__all" onClick={onNavigate}>
              See all {t.count} questions<span className="visually-hidden"> on {t.title}</span>
              <MegaArrow />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mega__aside">
        <p className="mega__aside-title">Still have a question?</p>
        <p className="mega__aside-text">Our valuers are happy to help with anything the FAQs don’t cover.</p>
        <Link href={routes.contact.path} className="button button--quiet button--small" onClick={onNavigate}>
          Contact us
        </Link>
        <a href={BRAND.phoneHref} className="mega__phone">
          Call {BRAND.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

/**
 * A menu button that opens a mega panel (disclosure pattern): opens on click, Enter/Space or
 * mouse hover (with a short delay), closes with Escape, an outside click, focus leaving or the
 * pointer leaving. The panel spans the header bar.
 */
function MegaDisclosure({
  group,
  pathname,
  open,
  onOpen,
  onClose,
  children,
}: {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: Close;
  children: ReactNode;
}) {
  const wrapper = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const viaHover = useRef(false);
  const active = group.links.some((l) => l.href === pathname);
  const panelId = `nav-${group.id}`;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, onClose]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hoverOpen = () => {
    window.clearTimeout(timer.current);
    if (open) return;
    timer.current = window.setTimeout(() => {
      viaHover.current = true;
      onOpen();
    }, 120);
  };
  const hoverClose = () => {
    window.clearTimeout(timer.current);
    if (!open || !viaHover.current) return;
    timer.current = window.setTimeout(() => onClose(), 220);
  };

  return (
    <li
      ref={wrapper}
      className="nav__item nav__item--group"
      onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hoverClose()}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onClose(true);
          button.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && !wrapper.current?.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        ref={button}
        type="button"
        className="nav__link nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        data-active={active || undefined}
        onClick={() => {
          window.clearTimeout(timer.current);
          // A click on a menu that hover just opened keeps it open (and pinned).
          if (open && viaHover.current) {
            viaHover.current = false;
            return;
          }
          viaHover.current = false;
          if (open) onClose();
          else onOpen();
        }}
      >
        {group.label}
        <span className="nav__chevron" aria-hidden="true" />
      </button>
      <div id={panelId} className={`mega mega--${group.id}`} hidden={!open}>
        {children}
      </div>
    </li>
  );
}

export function DesktopNav({ mega }: { mega: MegaData }) {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState(pathname);
  const close = useCallback(() => setOpenId(null), []);

  // Close on navigation (including Back/Forward): reset during render when the route changes.
  if (routePath !== pathname) {
    setRoutePath(pathname);
    setOpenId(null);
  }

  return (
    <nav className="nav" aria-label="Main">
      <ul className="nav__list">
        {primaryNav.map((item) =>
          isGroup(item) ? (
            <MegaDisclosure key={item.id} group={item} pathname={pathname} open={openId === item.id} onOpen={() => setOpenId(item.id)} onClose={close}>
              {item.id === "services" ? <ServicesPanel data={mega} pathname={pathname} onNavigate={close} /> : <FaqPanel data={mega} pathname={pathname} onNavigate={close} />}
            </MegaDisclosure>
          ) : (
            <li key={item.href} className="nav__item">
              <Link href={item.href} className="nav__link" aria-current={item.href === pathname ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
