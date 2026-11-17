# Redirect inventory

Every page path in the export is **preserved**, so no page URL changes. Redirects exist only for legacy URL forms that may be linked or indexed. All of them are applied in `src/proxy.ts` (logic in `src/lib/redirects.ts`) as a **single 301 hop**. Host and HTTPS normalisation (when `ENFORCE_CANONICAL_HOST=true`), `index.html`, `?p=` and old asset paths are combined, so no request chains.

| Legacy pattern | Destination | Evidence in export | Status |
|---|---|---|---|
| `/index.html`, `/{path}/index.html` | `/`, `/{path}/` | All internal links and canonicals in the export use `index.html` | Implemented, tested |
| `/?p=3828` | `/about-us/` | `<link rel="shortlink">` | Implemented, tested |
| `/?p=3835` | `/services/biv/` | shortlink | Implemented |
| `/?p=3841` | `/services/sfp/` | shortlink | Implemented |
| `/?p=3837` | `/services/whs/` | shortlink | Implemented |
| `/?p=3839` | `/services/asb/` | shortlink | Implemented |
| `/?p=3891` | `/building-insurance-valuation/` | shortlink | Implemented |
| `/?p=3893` | `/sinking-fund-plans/` | shortlink | Implemented |
| `/?p=3895` | `/work-health-and-safety/` | shortlink | Implemented |
| `/?p=3897` | `/asbestos-reports/` | shortlink | Implemented, tested |
| `/?p=3905` | `/testimonials/` | shortlink | Implemented, tested (other query parameters are kept) |
| `/?p=1437` | `/contact-us/` | shortlink | Implemented |
| `/?p=4493` | `/quote-request/` | shortlink | Implemented, tested via `?page_id=` |
| `/?p=3983` | `/legal/` | shortlink | Implemented |
| `?page_id=` with the same IDs | as above | WordPress alternative form | Implemented |
| `/wp-content/uploads/2018/04/house-1723353_1920-1.jpg` | `/images/red-brick-property.jpg` | upload | Implemented, tested |
| `/wp-content/uploads/2018/04/UEV-IMG_9987-min.jpg` | `/images/apartment-building.jpg` | upload | Implemented |
| `/wp-content/uploads/2018/04/{biv,whs,m-sfp,ar}.png` | `/images/marks/{biv,whs,sfp,asb}.png` | upload | Implemented, tested (m-sfp) |
| `/wp-content/uploads/2018/04/biv-icon.png` | `/images/marks/brand.png` | upload | Implemented |
| Any other host or `http://` | `SITE_URL` + same path and query | — | Implemented behind `ENFORCE_CANONICAL_HOST=true`, tested |
| `/{path}` without trailing slash | `/{path}/` | WordPress convention | Next.js `trailingSlash: true` (308) |

**Deliberately not redirected**
- Unknown `?p=` IDs: the page renders normally, with no guessing.
- WordPress system paths (`/wp-admin/`, `/wp-login.php`, `/feed/`, category, tag and attachment URLs): these return a real **404**. Add specific redirects to `pathRedirects` in `src/lib/redirects.ts` **only** if the live sitemap, Search Console or a crawl shows they're public and receive traffic or links.
- `gaussian-blur2.jpg`: legacy background, not used. It returns 404 unless found to be linked externally.

**Pre-launch verification (pending access)**
1. Export the live `sitemap.xml` (or `/wp-sitemap.xml`) and Search Console's indexed pages. Confirm every URL is in the table above or in the 14 preserved routes.
2. Confirm the live canonical host (`www` or apex) and the HTTPS and slash conventions. Set `SITE_URL` to match.
3. Crawl the live site (Screaming Frog or similar) for linked PDFs and other uploads not in the export, and add any to `assetRedirects` or `public/`.
4. After launch, run `npm run crawl` against production and spot-check the legacy URLs with `curl -I`.
