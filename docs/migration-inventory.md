# Migration inventory

Source of record: `Sinking Fund – Property Compliance and Valuations.zip`, a static WordPress export (BeTheme, Revolution Slider, Contact Form 7, jQuery front-end scripts). It contains 137 files, 14 HTML pages, and 8 uploads in `wp-content/uploads/2018/04/`.

**Export-wide findings**

- Every page has `<meta name="robots" content="noindex, nofollow">`. Canonicals are the relative `index.html`, and shortlinks point at `http://localhost:8080/?p=ID`. No production hostname, mail configuration, meta descriptions, Open Graph, Twitter, JSON-LD, robots.txt or sitemap is present.
- Duplicate titles: `Building Insurance Valuation – Sinking Fund` (service and FAQ) and `Work Health and Safety – Sinking Fund` (service and FAQ).
- Header: a live-text wordmark "Sinking Fund" (`#logo`, Montserrat 300, 45px, `#272727`). The menu is Home, About us, Services ▸ (4), Testimonials, FAQ ▸ (4, parent link `index.html#`), "Contact us (02) 9114 9800", Request a Quote.
- Footer: `© 2008-2018 BIV Reports Pty Limited`, then Legal, About us, Testimonials, "Contact us (02) 9114 9800".
- Inner pages use a "subheader" with the page title over `gaussian-blur2.jpg`. The new header replaces that background with the pale brand band and the original photographs, and keeps the file in `source-assets/`.
- Fonts: Lato (body), Montserrat (wordmark, hero) and Open Sans (old hero buttons). The rebuild self-hosts Lato 400/400i/700 and Montserrat 300 latin subsets.

## Page map

Title changes give every page a unique, descriptive title. The old titles are listed for reference. Every page now has its own meta description and an absolute self-referencing canonical (see `src/lib/site.ts`).

| # | Archive file | WP ID | New route | Old title → new title | H1 (new) |
|---|---|---|---|---|---|
| 1 | `index.html` | front page | `/` | Sinking Fund – Property Compliance and Valuations → Property Compliance & Valuations \| Sinking Fund | Welcome to Sinking Fund |
| 2 | `about-us/index.html` | 3828 | `/about-us/` | About us – Sinking Fund → About Sinking Fund \| BIV Reports Pty Limited | About us |
| 3 | `services/biv/index.html` | 3835 | `/services/biv/` | Building Insurance Valuation – Sinking Fund → Building Insurance Valuation Services \| Sinking Fund | Building Insurance Valuation |
| 4 | `services/sfp/index.html` | 3841 | `/services/sfp/` | Capital Works or Sinking Fund Plan – Sinking Fund → Capital Works & Sinking Fund Plans \| Sinking Fund | Capital Works or Sinking Fund Plan |
| 5 | `services/whs/index.html` | 3837 | `/services/whs/` | Work Health and Safety – Sinking Fund → Work Health & Safety Reports \| Sinking Fund | Work Health and Safety |
| 6 | `services/asb/index.html` | 3839 | `/services/asb/` | Asbestos Report – Sinking Fund → Asbestos Register & Management Plan Reports \| Sinking Fund | Asbestos Report |
| 7 | `building-insurance-valuation/index.html` | 3891 | `/building-insurance-valuation/` | Building Insurance Valuation – Sinking Fund → Building Insurance Valuation FAQs \| Sinking Fund | Building Insurance Valuation FAQs |
| 8 | `sinking-fund-plans/index.html` | 3893 | `/sinking-fund-plans/` | Capital Works or Sinking Fund Plans – Sinking Fund → Capital Works & Sinking Fund Plan FAQs \| Sinking Fund | Capital Works or Sinking Fund Plan FAQs |
| 9 | `work-health-and-safety/index.html` | 3895 | `/work-health-and-safety/` | Work Health and Safety – Sinking Fund → Work Health & Safety Report FAQs \| Sinking Fund | Work Health and Safety FAQs |
| 10 | `asbestos-reports/index.html` | 3897 | `/asbestos-reports/` | Asbestos Reports – Sinking Fund → Asbestos Report FAQs \| Sinking Fund | Asbestos Report FAQs |
| 11 | `testimonials/index.html` | 3905 | `/testimonials/` | Testimonials – Sinking Fund → Client Testimonials \| Sinking Fund | Testimonials |
| 12 | `contact-us/index.html` | 1437 | `/contact-us/` | Contact us (02) 9114 9800 – Sinking Fund → Contact Sinking Fund \| BIV Reports Pty Limited | Contact us |
| 13 | `quote-request/index.html` | 4493 | `/quote-request/` | Quote Request – Sinking Fund → Request a Property Services Quote \| Sinking Fund | Request a Quote |
| 14 | `legal/index.html` | 3983 | `/legal/` | Legal – Sinking Fund → Disclaimer & Privacy \| Sinking Fund | Legal |

All 14 paths are preserved exactly, with trailing slashes matching the WordPress directory URLs. **Confirm the live host, `www` or non-`www`, and the slash convention against the live site or Search Console before launch** (the live site wasn't reachable from the build environment).

## Content by page

The copy is verbatim. Source headings were H2/H3/H4/H5 in arbitrary order and are normalised to one H1 with H2 sections (and H3 inside the homepage history block). The "Content file" column shows where to edit.

### 1. Home (`index.html`) → `src/app/page.tsx`

| Source section | Source content | New treatment |
|---|---|---|
| Revolution Slider hero | "Welcome to" / "Sinking Fund" / "Property compliance and valuation", buttons "Learn more" (about) and "Contact us" (contact), background `house-1723353_1920-1.jpg` | Light hero with a framed photo (owner-supplied city towers; the red-brick photo is kept for social sharing). H1 "Welcome to Sinking Fund", the supporting line, **Request a Quote** (primary, new, factual), **Contact us** (secondary), "Learn more about us" (source link, label clarified), click-to-call, and a company badge "BIV Reports Pty Limited". |
| (new) facts strip | — | Four figures taken from the source copy: since 1984 (About and History), 20%+ of NSW strata schemes inspected (History), 3–7 business day turnaround (service pages), $5M PI (BIV and SFP). They're subject to the same review items as the source claims (R-09, R-10, R-16). |
| 4 icon boxes | BIV / WHS Reports / Sinking Fund Plans / Asbestos Reports, with marks `biv.png`, `whs.png`, `m-sfp.png`, `ar.png` and summaries | Four-card grid, one link per card, summaries verbatim. **Label change:** "BIV" → "Building Insurance Valuation" for clarity (R-21). The new section heading "Our services" was added for structure. Source card order (BIV, WHS, SFP, Asbestos) is kept. |
| "A word about us" / "Our History" | Since 1984… paragraph; links "Learn more" (about) and "Testimonials"; `UEV-IMG_9987-min.jpg` | History band with the photo. Links kept ("Learn more about us"). |
| (new) | — | A pausable moving strip of 8 shorter testimonials (full quotes and attributions, verbatim) and a link to all 15. |
| Closing | "Our clients have the most accurate…" and the Request a Quote button | Closing quote band with the same copy, plus Request a Quote and a click-to-call. |

### 2. About us → `src/app/about-us/page.tsx`
Sections: Our History, Our Values (Innovative, Vigilant, Professional, Independent), Our Vision and Our Mission, all verbatim. The values became a definition list. The apartment photo is reused, and there's a new factual intro: "Sinking Fund is a BIV Reports Pty Limited website."

### 3–6. Service pages → `src/content/services.tsx` (template `src/app/services/[slug]/page.tsx`)

| Page | Sections (in order) | Disclosures preserved |
|---|---|---|
| BIV | Why do I need an Insurance Valuation? · Building Insurance Valuations · Experience · Professional Indemnity Insurance · Re-valuation frequency · Ordering · Compliance · Further Services · Turnaround time and fees | $5,000,000 PI, Cover of Excellence, 3–7 business days, beat written quotes by 12% |
| SFP | Why do I need… · Capital Works or Sinking Fund Plans · Ordering · NSW – Strict duty… · Reviews – Best approach · Points of consideration · Goal · What a plan is NOT · Final points · Risk Management · Further Services · Turnaround time and fees | $5M PI, case citations, 3–7 days, 12% |
| WHS | Do I need a Safety Report? · WHS Reports – Safety Reports · Safety obligations · Legislative obligations (2 legislation links) · Types of Hazards · Proper Risk Assessment · Ordering · Further Services · Turnaround | 3–7 days, 12% |
| Asbestos | Why do I need… · Asbestos Reports · Register · Management Plan · Legislative requirements · Assumed asbestos · Testing · It is prudent… · Fines (table) · Ordering · Further Services · Turnaround | from $330 inc gst, fines table, 3–7 days, 12% |

New per-page elements: an intro taken from the homepage card summary, the service mark, a table of contents, a "Request a quote for this service" link (`/quote-request/?service=…`), a link to the paired FAQ, and a closing quote band. Underlined emphasis in the source (`<u>`) is kept as styled emphasis.

### 7–10. FAQ pages → `src/content/faqs.tsx` (template `src/components/FaqTemplate.tsx`)
Six questions each, 24 in total, from BeTheme accordions whose answers were hidden in the markup. They're now native `<details>`/`<summary>` with every answer in the initial HTML. The first item is open by default. The BIV revaluation-frequency list (`Type | Frequency`) is rendered as a two-column table. Each FAQ links to its paired service page, the other FAQs and a preselected quote. A short factual intro sentence per page is new.

### 11. Testimonials → `src/content/testimonials.ts`
15 testimonials, with quotes and attributions verbatim and in source order (two typos preserved, see R-17). Each is a card with the full quote. There's no carousel and no review schema.

### 12. Contact us → `src/app/contact-us/page.tsx`, `src/components/forms/ContactForm.tsx`
Source headings "Send us a Message below." (now the intro) and "We respect your privacy, and keep all client communications strictly confidential." (now in the aside, with a link to the privacy statement).

### 13. Quote Request → `src/app/quote-request/page.tsx`, `src/components/forms/QuoteForm.tsx`
Source headings "Job Description", "Provide a quotation for the selected service at the property listed below." and "Please select the services you require, complete the form below and submit." are all kept. The aside repeats the source turnaround and fee statement.

### 14. Legal → `src/app/legal/page.tsx`
Disclaimer, Privacy and Links, verbatim. The source bold labels became H2s, and there's an in-page jump menu.

## Form field mapping

### Contact (CF7 form 4476)

| CF7 name | Source prompt | New key | New label | Required |
|---|---|---|---|---|
| `your-name` | Your Name (required) | `name` | Your name | Yes (export) |
| `your-email` | Your Email (required) | `email` | Your email | Yes (export) |
| `tel-no` | Your Phone Number | `phone` | Your phone number | No |
| `Message-pref[]` | Preference (required): Call back, "Email  back" (double space), Send info | `contactPreference` | Preference | Yes, at least one (export) |
| `Enquiry-Type[]` | Is your query regarding any of the following? (7 services) | `enquiryTypes` | same | No |
| `your-subject` | Subject | `subject` | Subject | No |
| `your-message` | Your Message | `message` | Your message | No |

### Quote (CF7 form 4491)

| CF7 name | Source prompt (stored as default value) | New key | New label (email label) | Required |
|---|---|---|---|---|
| `Enquiry-Type[]` | (no marker) | `services` | Services required | **Yes, at least one (new decision, see below)** |
| `strata-plan-no` | Strata Plan Number | `strataPlanNumber` | Strata plan number | No |
| `no-of-lots` | Number of Lots | `numberOfLots` | Number of lots (whole number) | No |
| `site-address` | Site Address | `siteAddress` | Site address | No |
| `strata-manager` | Strata Manager* | `managerName` | Strata manager name | Yes (export) |
| `manager-company` | Company* | `managerCompany` | Company | Yes (export), **confirm** |
| `manager-tel-no` | Phone Number | `managerPhone` | Phone number (Strata manager phone number) | No |
| `manager-email` | Email* | `managerEmail` | Email (Strata manager email), used as Reply-To | Yes (export) |
| `manager-address` | Address* | `managerAddress` | Address (Strata manager address) | Yes (export) |
| `site-contact-name` | Name* | `siteContactName` | Name (Site contact name) | Yes (export) |
| `site-mobile-no` | **Phone Number** | `siteContactPhone` | Phone number (Site contact phone number) | No |
| `site-phone-no` | **Mobile Number** | `siteContactMobile` | Mobile number (Site contact mobile number) | No |
| `site-contact-address` | Address* | `siteContactAddress` | Address (Site contact address) | Yes (export) |
| `special-instructions` | Special Instructions (textarea default) | `specialInstructions` | Special Instructions | No |
| `message-pref[]` | Preference: Call back, "Email  back" | `replyPreference` | Preference | No |

**Defects fixed**
- Prompts stored as default `value`s ("Strata Plan Number", "Email*" and so on) are now labels, and every field starts empty.
- The swapped internal names (`site-mobile-no` labelled "Phone Number", `site-phone-no` labelled "Mobile Number") are mapped to unambiguous new keys. The Playwright test `delivers with phone and mobile values under the correct labels` checks that the delivered email shows each value under the right label.
- The "Email  back" double-space option value is normalised to the `email-back` value with the label "Email back".

**Validation decision.** The instructions say "Please select the services you require", but the CF7 checkbox group had no required marker. The new form requires **at least one service**, because a quote request without a service can't be actioned. **Owner to confirm:** whether *Company* and *Strata manager address* should stay required for **self-managed schemes** (the testimonials include a self-managed scheme secretary). The recommendation is to make *Company* optional; this hasn't been done yet.

## Media

| Original | New path | Use |
|---|---|---|
| `house-1723353_1920-1.jpg` (1920×1080) | `public/images/red-brick-property.jpg` | Home hero (LCP), FAQ and testimonial page headers, social image `og-sinking-fund.jpg` (1200×630) |
| `UEV-IMG_9987-min.jpg` (3264×2448) | `public/images/apartment-building.jpg` (2400 wide) | Home history, About, service page headers |
| `biv.png`, `whs.png`, `m-sfp.png`, `ar.png` (72×95) | `public/images/marks/{biv,whs,sfp,asb}.png` | Service cards, service and FAQ headers |
| `biv-icon.png` (88×100) | `public/images/marks/brand.png`, `src/app/{icon.png,apple-icon.png,favicon.ico}` | Favicons and Organization logo |
| `gaussian-blur2.jpg` | kept in `source-assets/` only | Legacy subheader background, intentionally replaced |
| Owner-supplied `modern-buildings-against-a-clear-blue-sky…jpg` (2576×1718, not in the export) | `source-assets/supplied/`, cropped to `public/images/city-towers.jpg` (1600 wide, signage cropped out) | Homepage hero. Appears to be Hong Kong Central; swap for a Sydney photo when available, and confirm the licence covers web use |

Responsive AVIF and WebP variants are generated by `next/image`. Every image has explicit dimensions. The hero is `priority`/`fetchpriority=high`, and below-the-fold images lazy-load. The service marks are low-resolution 72×95 PNGs and look soft on high-density screens. **Recommendation:** supply vector (SVG) versions of the marks.

## Internal links

All source internal links resolve to the correct new route. The FAQ parent menu item (`index.html#`) has become a keyboard-accessible disclosure button. The WHS page's two external NSW legislation links are kept as-is pending R-11. The crawler checks every internal link on all 14 pages (all return 200).

## Items needing review
See [`review-log.md`](review-log.md) (R-01 to R-25).
