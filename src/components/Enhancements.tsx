"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One small client module for all progressive enhancements. Every page is fully usable and
 * readable without it; it only adds motion and state:
 *  - header switches from transparent to solid after scrolling
 *  - [data-count] numbers count up when they enter view
 *  - [data-spotlight] cards follow the pointer with a soft glow
 *  - the service page table of contents highlights the section in view
 * Scroll reveals are pure CSS (scroll-driven animations), so they need no JavaScript.
 */
export function Enhancements() {
  const pathname = usePathname();

  // Header state.
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      if (window.scrollY > 24) root.dataset.scrolled = "";
      else delete root.dataset.scrolled;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Counters, spotlight and table of contents (re-bound per page).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    // The homepage preloader lifts at about 2.5 s; other pages have none.
    const readyAt = document.querySelector(".preloader") ? performance.now() + 2500 : 0;

    if (!reduce && "IntersectionObserver" in window) {
      const counters = document.querySelectorAll<HTMLElement>("[data-count]");
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            const el = e.target as HTMLElement;
            const to = Number(el.dataset.count);
            const from = Number(el.dataset.from ?? 0);
            // Wait for the homepage preloader so the count is seen from the start.
            const start = Math.max(performance.now(), readyAt);
            const dur = 1400;
            const tick = (t: number) => {
              const p = Math.max(0, Math.min(1, (t - start) / dur));
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = String(Math.round(from + (to - from) * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            el.textContent = String(from);
            requestAnimationFrame(tick);
          }
        },
        { threshold: 0.6 },
      );
      counters.forEach((c) => io.observe(c));
      cleanups.push(() => io.disconnect());
    }

    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => document.removeEventListener("pointermove", onMove));

    const toc = document.querySelector(".toc");
    if (toc && "IntersectionObserver" in window) {
      const links = new Map<string, HTMLAnchorElement>();
      toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((a) => links.set(a.hash.slice(1), a));
      const visible = new Set<string>();
      const sio = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.add(e.target.id);
            else visible.delete(e.target.id);
          }
          const first = [...links.keys()].find((id) => visible.has(id));
          links.forEach((a, id) => (id === first ? a.setAttribute("data-active", "") : a.removeAttribute("data-active")));
        },
        { rootMargin: "-20% 0px -60% 0px" },
      );
      links.forEach((_, id) => {
        const el = document.getElementById(id);
        if (el) sio.observe(el);
      });
      cleanups.push(() => sio.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
