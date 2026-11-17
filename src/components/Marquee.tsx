"use client";

import { useState, type ReactNode } from "react";

/**
 * Slowly scrolling testimonial strip. Moving content has a visible pause control (WCAG 2.2.2),
 * pauses on hover and keyboard focus, and is static under prefers-reduced-motion.
 * The duplicate track used for the seamless loop is hidden from assistive technology.
 */
export function Marquee({ children, label }: { children: ReactNode; label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="marquee" data-paused={paused || undefined}>
      <div className="marquee__viewport" role="region" aria-label={label} tabIndex={0}>
        <ul className="marquee__track">
          {children}
        </ul>
        <ul className="marquee__track" aria-hidden="true" inert>
          {children}
        </ul>
      </div>
      <button type="button" className="marquee__toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        <span className={paused ? "icon-play" : "icon-pause"} aria-hidden="true" />
        {paused ? "Play testimonials" : "Pause testimonials"}
      </button>
    </div>
  );
}
