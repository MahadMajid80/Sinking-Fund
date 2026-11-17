# QA report

**Date:** 16 November 2026  
**Build:** Next.js 16.4.6, React 19.3.1, Node 22.23  
**Environment:** local production builds (`next build` + `next start`) in a Linux container, Chrome stable (headless). The live site and its hosting, Search Console and mail provider were **not accessible**, so every result below is a lab or local result. Raw outputs are in `qa/`.

## 1. Summary

| Area | Result |
|---|---|
| Type check (`tsc --noEmit`) | Pass |
| Lint (`eslint .`, Next core-web-vitals + TS) | Pass, 0 problems |
| Production build | Pass. 14 content pages statically generated; 2 API routes and 1 status page dynamic |
| SEO/migration crawl, **preview** config | **333/333 checks pass** (`qa/crawl-report-preview.md`) |
| SEO/migration crawl, **production** config | **333/333 checks pass** (`qa/crawl-report-production.md`) |
| Playwright end-to-end, including axe | **59/59 pass** (`qa/playwright-results.txt`) |
| axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice) | 0 violations on all 14 pages, the open mobile drawer, the open desktop menu and the contact error state |
| Lighthouse (lab), mobile and desktop | Performance 93–100; Accessibility, Best Practices and SEO 100 on all 5 audited pages. Mobile LCP is 0.8 s on inner pages and 2.9 s simulated on the homepage (hero photo; observed unthrottled about 0.25 s) |
| Mail, **mock transport** (automated) | Pass. Delivery, labels, Reply-To, failure state and duplicates covered |
| Mail, **SMTP code path** (local SMTP sink, manual) | Pass. Accepted, recipient-rejected and unconfigured cases (see §5) |
| Mail, **real provider delivery** | **Pending owner input**: provider, credentials, verified sender, inbox |
| Core Web Vitals, **field data** | **Pending launch**: no CrUX or Search Console data for the new site |

## 2. SEO and migration crawl (all 14 routes)

`scripts/crawl.mjs` reads the route inventory from `src/lib/site.ts` and checks the following for each route:

- status 200;
- an exact unique title and a unique description of 70–170 characters;
- exactly one H1, with no skipped heading levels;
- an absolute self-referencing canonical;
- the robots meta tag and the `X-Robots-Tag` header;
- `html lang="en-AU"`;
- Open Graph (title, description, URL, absolute image, `en_AU` locale) and a Twitter `summary_large_image` card;
- JSON-LD that parses, with Organization on every page, BreadcrumbList ending at the page, Service on service pages, and no FAQPage, Review or AggregateRating;
- the `tel:+61291149800` link.

Site-wide, it also checks:

- every internal link (200);
- every image and icon (200, `image/*`);
- that the sitemap holds exactly the 14 canonical URLs (production) or is empty (preview);
- robots.txt, which allows crawling and lists the sitemap in production and disallows everything in preview;
- three unknown URLs, which each return a real 404 with the 404 page;
- 12 legacy redirect cases: `index.html`, `?p=`, `?page_id=`, combined `index.html?p=`, query passthrough, old upload paths and a missing trailing slash. Each is a single 301/308 hop to a 200 destination. An unknown `?p=` isn't redirected.

Host and HTTPS enforcement (`ENFORCE_CANONICAL_HOST=true`) was tested with `curl` against forwarded Host and Proto headers. `sinkingfund.com.au` over HTTPS, `www` over HTTP, `index.html` over HTTP on the apex, and `?p=3828` over HTTP on the apex each resolve in **one 301** to `https://www.sinkingfund.com.au/…`, and query strings are kept. The canonical host is still **pending confirmation**.

The production-config crawl used `SITE_URL=https://www.sinkingfund.com.au` as a stand-in. Rebuild with the confirmed origin.

## 3. End-to-end tests (Playwright, Chrome)

All 59 tests pass (including the step-by-step contact and quote forms: per-step validation, Enter to continue, Back keeps values, review with Change, focus management, and the one-page no-JavaScript fallback):

- **Homepage:** H1, CTAs and targets, four cards with exactly one link each to the correct service, an LCP image that isn't lazy-loaded and has `fetchpriority=high`, and the click-to-call link.
- **Service and FAQ pairing (×4):** service → FAQ → service links, the quote link with the correct `?service=` value, six `<details>` per FAQ, all 24 answers in the initial HTML (requested without JavaScript), and 15 testimonials with exact attributions.
- **Navigation:** the Services menu opens with Enter, Tab moves into the menu, Escape closes it and returns focus to the button, the FAQ menu navigates, the skip link works, and focus is visible on the first 12 Tab stops.
- **Mobile drawer (390px):** focus stays inside the modal for 25 Tab presses, Escape closes it and focus returns to the Menu button, navigating closes the drawer, and the drawer's quote and phone actions are present.
- **Reflow:** no horizontal scroll on any of the 14 pages at **320, 390, 768, 1024 and 1440px**. At 200% root text size, nothing overflows the viewport except the fines table, which scrolls inside its own labelled, focusable region (allowed under WCAG 1.4.10).
- **Motion:** with `prefers-reduced-motion: reduce`, the hero, Ken Burns, scroll-reveal and marquee animations are all `none`, and the marquee becomes a static scrollable strip. The testimonial strip's pause control sets `aria-pressed` and pauses the animation. The header gains a shadow after scrolling.
- **Preloader:** it's `aria-hidden` with `pointer-events: none`. It's homepage-only. It's still visible at 1.7 s and hidden by about 2.6 s on every homepage load, and it's absent on /about-us/, /services/biv/ and /contact-us/. It also shows (without movement) under reduced motion.
- **404:** unknown paths return HTTP 404 with the branded page.
- **axe:** all 14 pages, the open drawer and the open desktop menu.
- **Contact form:** an error summary that gets focus, inline errors with `aria-invalid`, summary links that move focus, an email-format error, and an axe scan in the error state. Successful delivery is checked in the mock outbox: the recipient, the Reply-To set to the visitor's email, the subject, and every label and value including multi-select labels and multi-line messages, with no personal data in the URL. On delivery failure the alert gets focus, a phone link appears, and the entered values are kept. A double click sends exactly one email.
- **Quote form:** `?service=biv` and `?service=asbestos` preselect, the selection stays editable, and invalid values are ignored. The service-page CTA carries the selection. Fields start empty, with prompts as labels. Seven required-field errors appear, and the lot count must be a whole number. Delivered email shows the **phone and mobile values under the correct labels**, and the subject lists the services.
- **API protections:** the sixth request in the window returns 429 with `Retry-After`. A duplicate `submissionId` sends once. Honeypot and too-fast submissions are dropped silently with 200 and nothing sent. The API returns 413 for oversized bodies, 400 for malformed JSON, over-long fields and CRLF header injection, rejects unknown checkbox values, and returns 405 for GET. A no-JavaScript form POST returns 303 to `/enquiry/sent/` or `/enquiry/error/?reason=invalid`, with no personal data in the URL.

## 4. Accessibility

### Automated
axe-core finds 0 violations (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`). Lighthouse accessibility scores 100 on all audited pages.

### Manual WCAG 2.2 AA pass (by inspection and keyboard, in Chrome)

| Criterion | Result |
|---|---|
| 1.1.1 Non-text content | Content photos have descriptive alt text. Decorative marks and header photo slices have `alt=""`. |
| 1.3.1 Info and relationships | Landmarks (header, nav ×3 labelled, main, footer). Fieldsets with legends for checkbox groups and quote sections. Tables have captions and `th` scope. FAQ uses native details/summary. Breadcrumbs are an ordered list with `aria-current`. |
| 1.4.3 / 1.4.11 Contrast | See the table below. All text pairs meet AA. Field borders `#767B7C` on white are 4.4:1 (non-text ≥ 3:1). Focus ring `#0B6573` is 6.7:1 on white and 5.8:1 on the band; inside the charcoal band it switches to white. |
| 1.4.4 / 1.4.10 Resize and reflow | Tested at 320px and at 200% text. The header wraps instead of overflowing. |
| 1.4.12 Text spacing | No fixed-height text containers. |
| 2.1.1 / 2.1.2 Keyboard | All menus, the drawer, accordions and forms work by keyboard. The drawer uses native `showModal()`, so it traps focus and Escape closes it. |
| 2.4.1 Bypass blocks | A skip link to `#main`. |
| 2.4.3 Focus order | The form comes before the aside in DOM order. The visual order matches. |
| 2.4.7 Visible focus / 2.4.11 Focus not obscured | A 3px ring everywhere. `scroll-padding-top` stops the sticky header covering focused elements and anchor targets. |
| 2.5.3 Label in name | The wordmark link's name "Sinking Fund, home" contains its visible text. |
| 2.5.8 Target size (minimum) | Buttons and menu items are ≥ 44px high, checkboxes have 44px rows, and inline text links are exempt. |
| 3.2.6 Consistent help | The phone number appears in the same place in the header and footer on every page. |
| 3.3.1 / 3.3.3 Error identification and suggestion | Each error names the field and how to fix it, with an "Error:" prefix for screen readers and a focused summary. |
| 3.3.7 Redundant entry | No information is re-requested within a submission. |
| 2.2.2 / 2.3.3 Motion | One short, non-looping animation, removed under reduced motion. No autoplay or carousel. |

**Not performed:** screen-reader testing with NVDA, JAWS, VoiceOver or TalkBack on real devices, and testing with users with disabilities. Recommended before launch.

### Contrast of the tokens in use

| Foreground / background | Ratio | Use |
|---|---|---|
| `#FFFFFF` / `#DB3A1B` | 4.53 | Primary button text (brand orange-red kept) |
| `#DB3A1B` / `#FCFCFC` | 4.42 | **Not used for text** (fails 4.5). Links use `#B32E12` instead |
| `#B32E12` / `#FCFCFC` | 6.17 | Links and error text |
| `#B32E12` / `#E4EDEE` | 5.32 | Links on the pale band |
| `#272727` / `#CCAF2D` | 6.93 | Gold secondary button |
| `#0B9AAF` / `#FFFFFF` | 3.36 | Teal used only for decorative rules |
| `#08707F` / `#E4EDEE` | 4.86 | Teal text ("Our History") |
| `#626262` / `#FCFCFC` / `#E4EDEE` | 5.95 / 5.13 | Body text |
| `#FFFFFF` / `#272727` | 14.94 | Headings on dark surfaces |
| `#5B5B5B` / `#FFFFFF` | 6.79 | Body text (all surfaces are light) |
| `#B32E12` / `#FDF1EE` | 5.73 | Active navigation item |
| `#4F5354` / `#E6F0F1` (darkest point of the inner-header panel) | 6.71 | Inner-page header intro text; breadcrumb links `#B32E12` are 5.46 on the same tint |
| Pattern overlays | n/a | Dot and line patterns are at most 13% ink at 1px. They sit behind text but never under it at a level that changes measured contrast (axe passes on every page) |

## 5. Mail delivery

| Mode | How tested | Result |
|---|---|---|
| **Mock** (`MAIL_TRANSPORT=mock`) | Playwright, automated | Messages written to `.mail-outbox/`; the content assertions above pass. **Nothing is delivered.** |
| **SMTP code path** (nodemailer → local `smtp-server` sink on 127.0.0.1:2525) | Manual `curl`, 16 Nov 2026 | Quote: `200 {ok:true, transport:"smtp"}`. The message arrived with From = `MAIL_FROM`, To = `QUOTE_TO`, Reply-To = the strata manager's email, `X-Enquiry-Reference`, and correct labels (site contact phone `02 2222 2222` and mobile `0433 333 333` under the right labels). Contact with the recipient rejected by the server (550): `502 delivery_failed`, so failure isn't reported as success. With no transport configured: `503 unconfigured`. Logs contained only `{form, outcome, reference}`. |
| **Real provider** | Not possible without credentials | **Pending.** After configuring, send one Contact and one Quote from production, confirm both arrive in the enquiry inbox (not spam), check SPF/DKIM/DMARC pass in the headers, and reply to confirm Reply-To. |

## 6. Performance (lab only)

Lighthouse 13.6.0, Chrome headless, default throttling, local production build:

| Page | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 93 | 100 | 100 | 100 | 2.9 s | 0 | 160 ms | 311 KiB |
| / | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms | 331 KiB |
| /services/sfp/ | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 90 ms | 292 KiB |
| /services/sfp/ | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | 316 KiB |
| /building-insurance-valuation/ | mobile | 99 | 100 | 100 | 100 | 0.8 s | 0 | 140 ms | 262 KiB |
| /building-insurance-valuation/ | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 294 KiB |
| /contact-us/ | mobile | 99 | 100 | 100 | 100 | 0.8 s | 0 | 110 ms | 274 KiB |
| /contact-us/ | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 306 KiB |
| /quote-request/ | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 70 ms | 275 KiB |
| /quote-request/ | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 307 KiB |

**Preloader trade-off:** at the owner's request, the branded preloader covers the homepage for at least 2 seconds on every load. Inner pages don't have it. FCP, LCP and CLS are unaffected because content paints underneath. Re-measured (mobile) after the floating header and taller hero:

| Page | Form factor | Perf | A11y | LCP | Speed Index | CLS |
|---|---|---|---|---|---|---|
| / | mobile | 90 | 100 | 3.0 s | 3.1 s | 0 |
| /services/sfp/ | mobile | 100 | 100 | 0.8 s | 0.8 s | 0 |

Remove `<Preloader />` from `src/app/page.tsx`, or shorten its timing in `globals.css`, if speed matters more than the branded intro.

Performance decisions behind these numbers:
- Hero and page-header entrance animations move text without fading it, so the largest text paints immediately.
- The homepage hero photo is the LCP element. It's cropped and served at about 16 KB on mobile (AVIF/WebP, quality 60, sized to the frame) and is preloaded with high fetch priority. Lighthouse's simulated slow-4G LCP for the homepage is 2.9 s, because its model counts the page's JavaScript requests that start before the image paints. The observed, unthrottled LCP is about 0.25 s. Confirm with field data after launch; if mobile LCP runs above 2.5 s at the 75th percentile, show the photo only from tablet width up.
- Inner pages have no header photographs, so their LCP is the title text (0.8 s simulated).
- Only the four font faces needed for first paint are preloaded. Montserrat 500/600 and Lato italic load on demand.
- Scroll reveals are pure CSS scroll-driven animations with no JavaScript. They use a clip-path wipe and the `translate` property, never opacity, so text is never semi-transparent and contrast holds during the animation. Browsers without support show content immediately.
- The only client JavaScript is the menus, drawer, forms, the marquee pause control, and one small enhancement module (header state, count-up figures, card spotlight, table-of-contents highlight).

Lab tests don't measure INP. Lab TBT is ≤ 160 ms.

HTML reports are in `qa/lighthouse/*.report.html`.

## 7. Screenshots

The `qa/screenshots/` folder contains desktop (1440) and mobile (390) captures:

- `home-*`
- `services-sfp-*` (service)
- `building-insurance-valuation-*` (FAQ)
- `contact-us-*`
- `quote-request-service-biv-*` (quote with a preselected service)
- `hero-1440` (first viewport after the skyline draws in), `mobile-menu-390` and `contact-errors-390` (interaction states)

Full-page captures turn off the scroll-linked reveals so every section shows in its final state. In a browser, sections wipe in as they scroll into view.

## 8. Outstanding owner inputs

1. **Production domain and canonical convention:** `www` or apex, HTTPS, trailing slash. Set `SITE_URL` and rebuild.
2. **Mail:** provider and SMTP credentials, a verified sender address with SPF/DKIM/DMARC, and the enquiry inbox(es) for Contact and Quote.
3. **Launch access:** Search Console (Domain property), the live sitemap or a crawl of the current site, analytics or landing-page data, and backlinks if available, to confirm the redirect inventory and get a baseline.
4. **Content approvals:** decisions on review log items R-01 to R-25, with priority on the High items (legislation, valuation frequency, penalties, privacy).
5. **Quote form required fields:** confirm *Company* and *Strata manager address* for self-managed schemes (the recommendation is to make Company optional).
6. **Hosting choice:** Vercel or a Node server (`README.md` → Deployment). The site can't be a static-only upload, because the form handlers need Node.
7. **Optional:** SVG versions of the four service marks (the PNGs are 72×95), and confirmed service areas (R-24).

## 9. Cutover checklist

1. Pre-launch:
   - Get the owner's approvals (§8).
   - Set the production environment variables, including `SITE_URL`, `SITE_INDEXABLE=true` (production only), `ENFORCE_CANONICAL_HOST=true` and the mail variables.
   - Keep the preview deployments without `SITE_INDEXABLE`.
2. Baseline:
   - Export the live sitemap, Search Console top pages and queries (last 3 months), indexed pages and backlinks.
   - Crawl the live site.
   - Add any extra public URLs to `src/lib/redirects.ts`.
3. Pre-flight, on the production deployment under a temporary hostname:
   - Run `npm run crawl` with `EXPECT_ORIGIN` set to the production origin and `EXPECT_INDEXABLE=true`.
   - Send one real Contact and one real Quote.
4. Lower the DNS TTL (e.g. 300 s) 24–48 hours before the switch.
5. Switch DNS or the domain to the new deployment. Make sure TLS certificates cover both `www` and the apex.
6. Verify immediately:
   - `curl -I` the apex, `www`, `http://`, `/index.html`, `/?p=3828` and an old upload path. Each should be one 301 to the canonical URL.
   - Confirm the homepage and a service page return 200 with no `X-Robots-Tag` header and `index, follow`.
   - Check that robots.txt lists the sitemap.
   - Submit a test enquiry on both forms.
7. In Search Console:
   - Submit `sitemap.xml`.
   - Use URL Inspection on `/`, `/services/biv/`, `/services/sfp/`, `/building-insurance-valuation/` and `/quote-request/` (Live test, then Request indexing).
8. Monitor:
   - Daily for 2 weeks: Page indexing, Crawl stats, 404s and server errors, and enquiry volume against the baseline.
   - At 4 weeks: compare clicks and impressions by page against the baseline, and Core Web Vitals once field data appears.

## 10. Rollback checklist

1. Keep the WordPress hosting, database and DNS records unchanged and available for at least 30 days after cutover.
2. Rollback triggers:
   - forms failing to deliver and not fixable within hours;
   - widespread 5xx errors;
   - an indexing error such as a stray `noindex` on production.
3. To roll back:
   - Point DNS (or the domain assignment) back to the WordPress host. Because the URL paths are unchanged, no redirect cleanup is needed.
   - On WordPress, **remove `noindex, nofollow`**, since the export shows it set site-wide.
   - Resubmit the old sitemap.
4. Record the cause, fix it on a preview deployment, re-run `npm run check`, `npm run crawl` and `npm run test:e2e`, then repeat the cutover.
