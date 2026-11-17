import { routes } from "./site";

/**
 * Legacy URL redirect inventory. Applied by src/proxy.ts as a single permanent (301) hop.
 *
 * Live status of these legacy URLs could not be verified from the build environment
 * (no access to the production host or Search Console). They are low-risk because each
 * maps to the closest replacement and none shadows a new page. Review before launch:
 * see docs/redirects.md.
 */

/** WordPress shortlinks (/?p=ID and /?page_id=ID) from the exported <link rel="shortlink"> tags. */
export const wpIdRedirects: Record<string, string> = Object.fromEntries(
  Object.values(routes)
    .filter((r) => r.wpId)
    .map((r) => [String(r.wpId), r.path]),
);

/** Old upload paths, in case they are linked or indexed by image search. */
export const assetRedirects: Record<string, string> = {
  "/wp-content/uploads/2018/04/house-1723353_1920-1.jpg": "/images/red-brick-property.jpg",
  "/wp-content/uploads/2018/04/UEV-IMG_9987-min.jpg": "/images/apartment-building.jpg",
  "/wp-content/uploads/2018/04/biv.png": "/images/marks/biv.png",
  "/wp-content/uploads/2018/04/whs.png": "/images/marks/whs.png",
  "/wp-content/uploads/2018/04/m-sfp.png": "/images/marks/sfp.png",
  "/wp-content/uploads/2018/04/ar.png": "/images/marks/asb.png",
  "/wp-content/uploads/2018/04/biv-icon.png": "/images/marks/brand.png",
};

/**
 * Other changed paths. Empty by design: all 14 page paths are preserved, and no other public
 * WordPress URLs were evidenced in the export. Add entries here only after confirming them in the
 * live sitemap, Search Console or a crawl (e.g. category, feed or attachment URLs).
 */
export const pathRedirects: Record<string, string> = {};

export interface RedirectDecision {
  location: string;
  status: 301;
}

/**
 * Returns a single-hop redirect for a legacy request, or null to continue.
 * Handles host/HTTPS normalisation (when enabled), index.html paths, WordPress shortlinks,
 * missing trailing slashes on legacy paths and old asset paths together, so a request needs
 * at most one redirect to reach its final URL.
 */
export function legacyRedirect(url: URL, opts: { canonicalOrigin?: string; enforceHost?: boolean; proto?: string | null; host?: string | null }): RedirectDecision | null {
  let changed = false;
  let pathname = url.pathname;
  const params = new URLSearchParams(url.search);

  // index.html -> clean directory path.
  if (/(^|\/)index\.html?$/i.test(pathname)) {
    pathname = pathname.replace(/index\.html?$/i, "");
    changed = true;
  }

  // WordPress shortlinks.
  const wpId = params.get("p") ?? params.get("page_id");
  if (wpId && /^\d+$/.test(wpId)) {
    const target = wpIdRedirects[wpId];
    if (target) {
      pathname = target;
      params.delete("p");
      params.delete("page_id");
      changed = true;
    }
  }

  if (assetRedirects[pathname]) {
    pathname = assetRedirects[pathname];
    changed = true;
  }

  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (pathRedirects[withSlash]) {
    pathname = pathRedirects[withSlash];
    changed = true;
  }

  let origin = url.origin;
  if (opts.enforceHost && opts.canonicalOrigin) {
    const canonical = new URL(opts.canonicalOrigin);
    const requestHost = opts.host ?? url.host;
    const requestProto = (opts.proto ?? url.protocol.replace(":", "")).split(",")[0].trim();
    if (requestHost !== canonical.host || requestProto !== canonical.protocol.replace(":", "")) {
      origin = canonical.origin;
      changed = true;
    }
  }

  if (!changed) return null;

  // Ensure directory-style pages end with a slash so the redirect lands on the final URL.
  if (!/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith("/")) pathname += "/";
  const search = params.toString();
  return { location: `${origin}${pathname}${search ? `?${search}` : ""}`, status: 301 };
}
