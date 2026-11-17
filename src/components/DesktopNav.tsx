"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isGroup, primaryNav, type NavGroup } from "@/lib/nav";

/** Disclosure-pattern menus (button + list), operable by keyboard, closed by Escape or focus leaving. */
function Disclosure({ group, pathname, open, onToggle, onClose }: { group: NavGroup; pathname: string; open: boolean; onToggle: () => void; onClose: (focusButton: boolean) => void }) {
  const wrapper = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const active = group.links.some((l) => l.href === pathname);
  const listId = `nav-${group.id}`;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) onClose(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, onClose]);

  return (
    <li
      ref={wrapper}
      className="nav__item nav__item--group"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onClose(true);
          button.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && !wrapper.current?.contains(e.relatedTarget as Node)) onClose(false);
      }}
    >
      <button ref={button} type="button" className="nav__link nav__toggle" aria-expanded={open} aria-controls={listId} data-active={active || undefined} onClick={onToggle}>
        {group.label}
        <span className="nav__chevron" aria-hidden="true" />
      </button>
      <ul id={listId} className="nav__menu" hidden={!open}>
        {group.links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="nav__menu-link" aria-current={l.href === pathname ? "page" : undefined} onClick={() => onClose(false)}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <nav className="nav" aria-label="Main">
      <ul className="nav__list">
        {primaryNav.map((item) =>
          isGroup(item) ? (
            <Disclosure
              key={item.id}
              group={item}
              pathname={pathname}
              open={openId === item.id}
              onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
              onClose={() => setOpenId((id) => (id === item.id ? null : id))}
            />
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
