/**
 * Branded homepage preloader, shown on every visit to the homepage on every device for at
 * least 2 seconds: the four diamonds of the mark assemble, the wordmark appears, then the
 * overlay lifts away (fully gone at about 2.6 s). Pure CSS timing, so it hides itself even
 * without JavaScript; it never intercepts pointer events and is decorative (aria-hidden).
 * Under prefers-reduced-motion it still shows for 2 seconds, without movement.
 * Rendered by the homepage only (src/app/page.tsx), so it replays whenever the homepage loads.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__inner">
        <svg className="preloader__mark" viewBox="0 0 100 100" width="72" height="72">
          <path className="pl-d pl-d1" d="M50 4 73 27 50 50 27 27Z" fill="#3f57a3" />
          <path className="pl-d pl-d2" d="M27 27 50 50 27 73 4 50Z" fill="#599b51" />
          <path className="pl-d pl-d3" d="M73 27 96 50 73 73 50 50Z" fill="#e7c733" />
          <path className="pl-d pl-d4" d="M50 50 73 73 50 96 27 73Z" fill="#cc222e" />
        </svg>
        <span className="preloader__word">Sinking Fund</span>
        <span className="preloader__bar" />
      </div>
    </div>
  );
}
