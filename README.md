# Sinking Fund (BIV Reports Pty Limited)

Next.js rebuild of the Sinking Fund WordPress site: property compliance and valuation services for strata managers, owners corporations and property owners.

- **Stack:** Next.js 16.4.6 (App Router, Turbopack), React 19.3, TypeScript (strict). No CSS framework and no client-side state library.
- **Rendering:** all 14 content pages are statically generated. Only the two form endpoints and the no-JavaScript error page run on the server.
- **Content:** transcribed verbatim from the WordPress export. Proposed factual, legal and editorial changes are **not applied**; they're listed in [`docs/review-log.md`](docs/review-log.md) for owner approval.

| Document | Purpose |
|---|---|
| [`docs/migration-inventory.md`](docs/migration-inventory.md) | Each original HTML file mapped to its route, title, sections, media, links, form fields and issues |
| [`docs/review-log.md`](docs/review-log.md) | Dated claims, legislation, figures and typos needing owner approval, with official references |
| [`docs/redirects.md`](docs/redirects.md) | Legacy URL inventory and redirect rules |
| [`docs/qa-report.md`](docs/qa-report.md) | Actual test results, outstanding owner inputs, cutover and rollback checklist |

## Design and motion

The look is light and modern, built on the source brand. It uses the Montserrat Light wordmark with the original diamond mark, the orange-red `#DB3A1B`, charcoal `#272727`, and the four quadrant colours sampled from the marks.

- **Surfaces:** white and near-white only. Depth comes from subtle patterns (dot grid, fine line grid, a diamond lattice and soft brand-colour glows), not dark bands or full-bleed photographs.
- **Hero background:** a soft teal-to-blush tint with slowly drifting brand-colour glows, a line grid that is strongest behind the photo, an outlined diamond cluster peeking from behind the photo's corner, and the four-colour strip of the mark along the bottom edge.
- **Hero photo:** a framed city-towers photograph supplied by the owner (`source-assets/supplied/`, cropped to `public/images/city-towers.jpg`) with an offset dot-pattern panel and a "Registered Valuers since 1984" badge. The supplied photo appears to show Hong Kong's Central district, so replace it with a Sydney shot when one is available. Keep the file name, or update `src/app/page.tsx`.
- **Floating glass header:** a rounded, translucent bar inset from the page edges, with the logo, the main links in a pill track (the current page shows as a raised white segment), a phone link with an icon, and the quote button. It floats over the page heroes and gains a deeper shadow once the page scrolls. Below 74em the links move into the Menu drawer.
- **Compact headers:** a homepage hero (a little taller on large screens, about 76% of the viewport) with the photo and a facts strip, and slim inner-page headers (breadcrumb, title, one-line intro) set in a contained, softly tinted panel with a four-colour base strip and an outlined diamond motif, so the header is clearly distinct from the white page body.
- **Preloader:** the four diamonds of the mark assemble, the wordmark and colour bar appear, then the overlay lifts away. Details:
  - visible for at least 2 seconds and fully gone at about 2.6 seconds
  - homepage only: it runs on every load of the homepage, on every device, and never on inner pages
  - with reduced motion turned on, it still shows for 2 seconds as a still logo screen
  - pure CSS timing, so it hides itself even without JavaScript
  - never intercepts clicks
  - decorative (`aria-hidden`)
  - see `src/components/Preloader.tsx`
- **Motion:**
  - a gentle zoom-settle on the hero photo
  - wipe-in scroll reveals (CSS only)
  - count-up figures
  - service cards with a pointer-following tint in each quadrant colour
  - a pausable testimonial strip
  - a reading-progress bar and section-tracking table of contents on service pages

Accessibility guardrails: all motion stops under `prefers-reduced-motion`. The moving testimonial strip has a pause button and pauses on hover and focus. Reveals never fade text. Everything works without JavaScript.

## Quick start

```bash
npm ci
cp .env.example .env.local     # then set MAIL_TRANSPORT=mock for local work
npm run dev                    # http://localhost:3000
```

Production build:

```bash
npm run check                  # typecheck + lint + build
npm start                      # next start (Node 20.9+)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run typecheck` | `next typegen` (route types), then `tsc --noEmit` |
| `npm run lint` | ESLint (`eslint-config-next` core-web-vitals + TypeScript) |
| `npm run check` | typecheck, lint, build |
| `npm run assets` | Re-optimises images, favicons and the social image from `source-assets/` |
| `npm run crawl` | SEO and migration crawler against a running build (see below) |
| `npm run test:e2e` | Playwright suite (navigation, forms, a11y with axe, reflow, redirects) |

## Environment

All configuration is in [`.env.example`](.env.example). Everything is server-side. Nothing uses `NEXT_PUBLIC_`.

| Variable | Notes |
|---|---|
| `SITE_URL` | Canonical origin. Read **at build time** for canonicals, Open Graph, JSON-LD, sitemap and robots. |
| `SITE_INDEXABLE` | `true` **only** on the confirmed production build. Otherwise every page is `noindex, nofollow`, sends `X-Robots-Tag: noindex, nofollow`, robots.txt disallows everything and the sitemap is empty. |
| `ENFORCE_CANONICAL_HOST` | `true` on production to 301 other hostnames and HTTP to `SITE_URL`, combined with legacy redirects into one hop. |
| `MAIL_TRANSPORT` | `smtp` (real), `mock` (writes JSON to `.mail-outbox/`, sends nothing), or unset (forms tell visitors to call). |
| `SMTP_*`, `MAIL_FROM` | SMTP credentials and a **verified sender** on a domain with SPF/DKIM for that SMTP provider. |
| `CONTACT_TO`, `QUOTE_TO`, `ENQUIRY_TO` | Comma-separated recipient inboxes. `ENQUIRY_TO` is the fallback. |
| `RATE_LIMIT_*`, `UPSTASH_REDIS_REST_*` | Throttling (see below). |

## Forms

**Steps.** Both forms are shown one step at a time:

| Form | Steps |
|---|---|
| Contact | About you → Your enquiry → How we reply |
| Quote | Services and site → Strata manager → Site access contact → Final details |

The steps are defined in `contactSteps` and `quoteSteps` in `src/lib/forms/schema.ts`. To regroup fields, edit those lists and move the matching fields between the step panels in `ContactForm.tsx` and `QuoteForm.tsx`.

- **Progress bar:** names every step. Completed steps are buttons, so visitors can go back to them.
- **Moving on:** Continue (or Enter in a field) checks only the current step, using the server's own rules.
- **Last step:** shows a "Check your details" review with a Change button for each earlier step.
- **Errors on submit:** any error, from the browser or the server, returns the visitor to the first step that has one.
- **Focus:** moves to the new step's title, or to the error summary when there are errors.
- **No JavaScript:** a `<noscript>` rule shows every step on one page and hides the step controls. The form posts natively as before.

Field names, validation and the server contract are unchanged.

Both forms post to route handlers (`/api/contact/`, `/api/quote/`). The pipeline lives in `src/lib/server/submission.ts`:

1. **Body limits:** 32 KB cap; JSON or `application/x-www-form-urlencoded` only. Per-field length limits are in `src/lib/forms/schema.ts`.
2. **Spam controls:** an off-screen honeypot field plus a 2.5-second minimum fill time. Caught submissions get a neutral `200` and are not sent.
3. **Rate limit:** 5 per form, per IP, per 10 minutes, returning `429` with `Retry-After`. The in-memory store suits one Node server. On serverless or multi-instance hosting, set the Upstash variables for a shared counter. The client IP comes from `X-Forwarded-For`, so run behind a proxy or platform that sets that header (Vercel, nginx, Cloudflare). Don't expose `next start` directly to the internet.
4. **Validation:** the same dependency-free validator runs in the browser (inline and summary errors) and on the server (authoritative). Checkbox values are allow-listed. Control characters and header-injection attempts are rejected.
5. **Duplicate protection:** each form fill carries a `submissionId`. Repeats return `{ ok: true, duplicate: true }` without sending again, and the button ignores double submits.
6. **Delivery:** success is reported **only after the SMTP server accepts the message**. `Reply-To` is set only to a validated email (the visitor's, or the strata manager's for quotes). The sender is always `MAIL_FROM`.
7. **Privacy:** logs record only `{ form, outcome, reference }`. No personal values go into URLs, logs or analytics (none is installed).
8. **No-JavaScript fallback:** forms are real HTML forms. Without JavaScript they POST natively and are redirected (`303`) to `/enquiry/sent/` or `/enquiry/error/?reason=…` (noindex, no personal data).

The quote form preselects a service from `?service=biv|sfp|whs|asbestos|ohs-vic|window-safety|maintenance-plan-vic`. Values outside the allow-list are ignored, and the selection stays editable. Field mapping from the old Contact Form 7 names, including the swapped Phone/Mobile fields, is in the migration inventory.

## SEO

- Each route has a unique title, description and absolute self-referencing canonical, all generated from `src/lib/site.ts` (the single route inventory). The sitemap and the QA crawler use the same list.
- Open Graph and Twitter cards use the original red-brick photo. Favicons come from the original multicolour mark. Document language is `en-AU`.
- JSON-LD covers `Organization` (verified identifiers only: company name, site name, phone, logo), `BreadcrumbList` on inner pages, and `Service` on the four service pages. There's no review or rating markup and no `FAQPage` markup, on purpose.
- Legacy URLs (`index.html`, `?p=` and `?page_id=` shortlinks, old upload paths) get one-hop 301s in `src/proxy.ts`. Unknown paths return a real 404.

## Deployment

**Option A: Vercel (simplest).** Import the repo, set the environment variables for Production (and only `SITE_URL` for Preview, so previews stay noindexed), plus the Upstash variables for shared rate limiting. Add the domain(s), then set `ENFORCE_CANONICAL_HOST=true` and `SITE_INDEXABLE=true` on Production and redeploy.

**Option B: Node server (VPS, container, or cPanel with "Setup Node.js App").** Node 20.9+:

```bash
npm ci && SITE_URL=https://… SITE_INDEXABLE=true npm run build
PORT=3000 npm start            # behind nginx/Apache proxying the domain, which sets X-Forwarded-For/Proto
```

The in-memory rate limiter works on a single instance. The form handlers need a Node runtime, so this site **can't** be a purely static upload.

## Project structure

```
src/
  app/                 routes (14 pages, 404, enquiry status pages, api/contact, api/quote,
                       sitemap.ts, robots.ts, icons)
  components/          header/nav (DesktopNav, MobileNav), PageParts, FaqTemplate, forms/
  content/             services.tsx, faqs.tsx, testimonials.ts (verbatim source copy)
  lib/                 site.ts (route inventory), seo.ts, nav.ts, redirects.ts,
                       forms/schema.ts (shared validation), server/ (mail, rate limit, handler)
  proxy.ts             legacy redirects and host/HTTPS enforcement
source-assets/         original WordPress uploads (source of record, incl. legacy gaussian-blur2.jpg)
public/images/         optimised assets
scripts/               optimise-assets, crawl, screenshots
tests/                 Playwright specs
docs/                  inventory, review log, redirects, QA report
qa/                    crawl reports, Lighthouse reports, screenshots
```

## Editing content

Copy lives in `src/content/*` and the page files under `src/app/*`. Titles and descriptions live in `src/lib/site.ts`. After an owner approves a change in `docs/review-log.md`, edit the copy, mark the log entry as applied, and run `npm run check && npm run crawl`.
