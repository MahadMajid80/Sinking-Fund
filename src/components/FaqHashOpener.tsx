"use client";

import { useEffect } from "react";

/**
 * Opens the FAQ answer named in the URL (#question-id), e.g. from a question in the FAQ mega
 * menu. Runs on load, on hash changes, and after same-page links that only change the hash
 * (Next.js updates the URL without a hashchange event).
 */
export function FaqHashOpener() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement && !el.open) el.open = true;
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (a instanceof HTMLAnchorElement && a.pathname === location.pathname) window.setTimeout(open, 50);
    };
    open();
    window.addEventListener("hashchange", open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
