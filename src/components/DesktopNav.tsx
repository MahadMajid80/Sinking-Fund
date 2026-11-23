"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { MegaData, MegaTile } from "@/lib/mega";
import { isGroup, primaryNav, type NavGroup } from "@/lib/nav";
import { BRAND, routes } from "@/lib/site";

type Close = (focusButton?: boolean) => void;

function TileArrow() {
  return (
    <svg className="mega-tile__arrow" width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A row of tiles: one per service (dot in the service's diamond colour) and a dark action tile. */
function TilePanel({
  tiles,
  pathname,
  onNavigate,
  action,
}: {
  tiles: MegaTile[];
  pathname: string;
  onNavigate: () => void;
  action: { href: string; title: string; text: string };
}) {
  return (
    <ul className="mega__row">
      {tiles.map((t) => (
        <li key={t.href}>
          <Link href={t.href} className="mega-tile" data-quadrant={t.quadrant} aria-current={t.href === pathname ? "page" : undefined} onClick={onNavigate}>
            <span className="mega-tile__top">
              <span className="mega-tile__dot" aria-hidden="true" />
              <TileArrow />
            </span>
            <span className="mega-tile__title">{t.title}</span>
            <span className="mega-tile__text">{t.text}</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href={action.href} className="mega-tile mega-tile--dark" aria-current={action.href === pathname ? "page" : undefined} onClick={onNavigate}>
          <span className="mega-tile__top">
            <Image src="/images/marks/brand.png" alt="" width={22} height={25} className="mega-tile__mark" />
            <TileArrow />
          </span>
          <span className="mega-tile__title">{action.title}</span>
          <span className="mega-tile__text">{action.text}</span>
        </Link>
      </li>
    </ul>
  );
}

function ServicesPanel({ data, pathname, onNavigate }: { data: MegaData; pathname: string; onNavigate: () => void }) {
  return (
    <TilePanel
      tiles={data.services}
      pathname={pathname}
      onNavigate={onNavigate}
      action={{ href: routes.quote.path, title: "Request a quote", text: "Tell us about the property and the reports you need." }}
    />
  );
}

function FaqPanel({ data, pathname, onNavigate }: { data: MegaData; pathname: string; onNavigate: () => void }) {
  return (
    <TilePanel
      tiles={data.faq}
      pathname={pathname}
      onNavigate={onNavigate}
      action={{ href: routes.contact.path, title: "Ask us a question", text: `Send a message or call ${BRAND.phoneDisplay.replace(/ /g, "\u00a0")}.` }}
    />
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
        <li className="nav__item">
          <Link href="/" className="nav__link" aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
        </li>
        {primaryNav.map((item) =>
          isGroup(item) ? (
            <MegaDisclosure
              key={item.id}
              group={item}
              pathname={pathname}
              open={openId === item.id}
              onOpen={() => setOpenId(item.id)}
              // Close only this menu: a delayed close must not shut a menu that has just opened.
              onClose={() => setOpenId((id) => (id === item.id ? null : id))}
            >
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
