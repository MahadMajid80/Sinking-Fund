// SEO and migration crawler for a running production build.
//
// Usage:
//   BASE_URL=http://localhost:3000 EXPECT_ORIGIN=https://www.example.com.au EXPECT_INDEXABLE=true node scripts/crawl.mjs
//
// Verifies, for every route in the inventory: HTTP status, exact title, meta description,
// one H1, absolute self-referencing canonical, robots directives (meta + X-Robots-Tag),
// Open Graph and Twitter tags, JSON-LD validity and types, internal links, images,
// sitemap entries, robots.txt, 404 handling and legacy redirects (single hop, no loops).
// Writes qa/crawl-report.json and qa/crawl-report.md and exits non-zero on failure.
import { parse } from "node-html-parser";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const ORIGIN = (process.env.EXPECT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
const INDEXABLE = process.env.EXPECT_INDEXABLE === "true";
const OUT = process.env.OUT || "qa";

// Route inventory is read from the source so the crawl and the site cannot drift apart.
const siteSrc = await readFile(path.resolve(import.meta.dirname, "../src/lib/site.ts"), "utf8");
const routes = [...siteSrc.matchAll(/(\w+): \{\s*path: "([^"]+)",\s*title: "([^"]+)",\s*description:\s*"([^"]+)"/g)].map((m) => ({
  key: m[1],
  path: m[2],
  title: m[3],
  description: m[4],
}));

const results = [];
const failures = [];
const check = (scope, name, ok, detail = "") => {
  results.push({ scope, name, ok, detail });
  if (!ok) failures.push(`${scope}: ${name}${detail ? ` (${detail})` : ""}`);
};
const get = (url, opts = {}) => fetch(url, { redirect: "manual", ...opts });

const linkTargets = new Set();
const imageTargets = new Set();
const titles = new Map();
const descriptions = new Map();

for (const r of routes) {
  const res = await get(BASE + r.path);
  const html = await res.text();
  const doc = parse(html);
  const scope = r.path;
  check(scope, "status 200", res.status === 200, String(res.status));

  const xrt = res.headers.get("x-robots-tag");
  check(scope, "X-Robots-Tag", INDEXABLE ? !xrt : /noindex/.test(xrt ?? ""), xrt ?? "absent");

  const title = doc.querySelector("title")?.text ?? "";
  check(scope, "title matches inventory", title === r.title, title);
  titles.set(title, [...(titles.get(title) ?? []), r.path]);

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  check(scope, "meta description", desc === r.description && desc.length >= 70 && desc.length <= 170, `${desc.length} chars`);
  descriptions.set(desc, [...(descriptions.get(desc) ?? []), r.path]);

  const h1s = doc.querySelectorAll("h1");
  check(scope, "exactly one H1", h1s.length === 1, h1s.map((h) => h.text.trim().replace(/\s+/g, " ")).join(" | "));

  // Heading hierarchy: no level skipped when descending (h2 -> h4).
  const levels = doc.querySelectorAll("h1,h2,h3,h4,h5,h6").map((h) => Number(h.tagName[1]));
  let skip = "";
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) skip = `h${levels[i - 1]}→h${levels[i]}`;
  check(scope, "heading levels not skipped", !skip, skip);

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
  check(scope, "absolute self-referencing canonical", canonical === ORIGIN + r.path, canonical ?? "missing");

  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  check(scope, "robots meta", INDEXABLE ? /index, follow/.test(robots) && !/noindex|nofollow/.test(robots) : /noindex/.test(robots) && /nofollow/.test(robots), robots);

  check(scope, "html lang en-AU", doc.querySelector("html")?.getAttribute("lang") === "en-AU");

  const og = (p) => doc.querySelector(`meta[property="${p}"]`)?.getAttribute("content");
  const tw = (n) => doc.querySelector(`meta[name="${n}"]`)?.getAttribute("content");
  check(scope, "og:title/description/url", og("og:title") === r.title && og("og:description") === r.description && og("og:url") === ORIGIN + r.path);
  check(scope, "og:image absolute", (og("og:image") ?? "").startsWith(ORIGIN + "/images/"), og("og:image"));
  check(scope, "og:locale en_AU", og("og:locale") === "en_AU");
  check(scope, "twitter:card", tw("twitter:card") === "summary_large_image");

  const ld = doc.querySelectorAll('script[type="application/ld+json"]').map((s) => {
    try {
      return JSON.parse(s.text);
    } catch {
      return null;
    }
  });
  check(scope, "JSON-LD parses", ld.every(Boolean));
  const types = ld.filter(Boolean).map((d) => d["@type"]);
  check(scope, "Organization JSON-LD", types.includes("Organization"));
  if (r.path !== "/") {
    const bc = ld.find((d) => d?.["@type"] === "BreadcrumbList");
    check(scope, "BreadcrumbList ends at this page", bc?.itemListElement?.at(-1)?.item === ORIGIN + r.path);
  }
  if (r.path.startsWith("/services/")) check(scope, "Service JSON-LD", types.includes("Service"));
  check(scope, "no FAQPage/Review/AggregateRating schema", !types.some((t) => ["FAQPage", "Review", "AggregateRating"].includes(t)));

  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (href.startsWith("/") && !href.startsWith("//")) linkTargets.add(href.split("#")[0]);
  }
  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (src?.startsWith("/")) imageTargets.add(src.replace(/&amp;/g, "&"));
    if (!img.getAttribute("alt") && img.getAttribute("alt") !== "") check(scope, "img has alt attribute", false, src);
  }
  check(scope, "phone link tel:+61291149800", html.includes('href="tel:+61291149800"'));
}

for (const [t, paths] of titles) check("site", "unique title", paths.length === 1, `${t}: ${paths.join(", ")}`);
for (const [, paths] of descriptions) check("site", "unique description", paths.length === 1, paths.join(", "));

for (const href of linkTargets) {
  const res = await get(BASE + href);
  check("links", `internal link ${href}`, res.status === 200, String(res.status));
}
for (const src of imageTargets) {
  const res = await get(BASE + src);
  const type = res.headers.get("content-type") ?? "";
  check("assets", `image ${src.slice(0, 80)}`, res.status === 200 && type.startsWith("image/"), `${res.status} ${type}`);
}
for (const p of ["/favicon.ico", "/icon.png", "/apple-icon.png", "/images/og-sinking-fund.jpg"]) {
  const res = await get(BASE + p);
  check("assets", p, res.status === 200, String(res.status));
}

// Sitemap and robots.
{
  const sm = await (await get(BASE + "/sitemap.xml")).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (INDEXABLE) {
    const expected = routes.map((r) => ORIGIN + r.path).sort();
    check("sitemap", "contains exactly the 14 canonical URLs", JSON.stringify(locs.sort()) === JSON.stringify(expected), `${locs.length} entries`);
  } else {
    check("sitemap", "empty on non-indexable builds", locs.length === 0, `${locs.length} entries`);
  }
  const robots = await (await get(BASE + "/robots.txt")).text();
  check("robots.txt", INDEXABLE ? "allows crawl and lists sitemap" : "disallows all", INDEXABLE ? /Allow: \//.test(robots) && robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`) : /Disallow: \/\s*$/m.test(robots), robots.replace(/\n/g, " ⏎ "));
}

// 404s.
for (const p of ["/this-page-does-not-exist/", "/services/unknown/", "/wp-admin/"]) {
  const res = await get(BASE + p);
  const html = await res.text();
  check("404", `${p} returns real 404`, res.status === 404 && html.includes("Page not found"), String(res.status));
}

// Legacy redirects: one hop, permanent, final URL is 200.
const redirects = [
  ["/index.html", "/"],
  ["/about-us/index.html", "/about-us/"],
  ["/services/biv/index.html", "/services/biv/"],
  ["/?p=3828", "/about-us/"],
  ["/?p=3835", "/services/biv/"],
  ["/?page_id=4493", "/quote-request/"],
  ["/index.html?p=3897", "/asbestos-reports/"],
  ["/?p=3905&utm_source=newsletter", "/testimonials/?utm_source=newsletter"],
  ["/wp-content/uploads/2018/04/house-1723353_1920-1.jpg", "/images/red-brick-property.jpg"],
  ["/wp-content/uploads/2018/04/m-sfp.png", "/images/marks/sfp.png"],
  ["/about-us", "/about-us/"],
  ["/services/sfp", "/services/sfp/"],
];
for (const [from, to] of redirects) {
  const res = await get(BASE + from);
  const loc = res.headers.get("location") ?? "";
  const target = loc.startsWith("http") ? new URL(loc) : new URL(loc, BASE);
  const finalPath = target.pathname + target.search;
  const ok1 = [301, 308].includes(res.status) && finalPath === to;
  const next = await get(BASE + finalPath);
  check("redirects", `${from} → ${to}`, ok1 && next.status === 200, `${res.status} → ${finalPath} (${next.status})`);
}
// Unknown WordPress IDs are not redirected (no guessing) and the home page still renders.
{
  const res = await get(BASE + "/?p=99999");
  check("redirects", "unknown ?p= id is not redirected", res.status === 200);
}

await mkdir(OUT, { recursive: true });
const passed = results.filter((r) => r.ok).length;
const md = [
  `# Crawl report`,
  ``,
  `- Base URL: ${BASE}`,
  `- Expected canonical origin: ${ORIGIN}`,
  `- Indexable build: ${INDEXABLE}`,
  `- Checks: ${results.length}, passed: ${passed}, failed: ${results.length - passed}`,
  ``,
  failures.length ? `## Failures\n\n${failures.map((f) => `- ${f}`).join("\n")}\n` : `All checks passed.\n`,
  `## Routes`,
  ``,
  `| Path | Title | Status |`,
  `|---|---|---|`,
  ...routes.map((r) => `| ${r.path} | ${r.title} | ${results.filter((x) => x.scope === r.path).every((x) => x.ok) ? "pass" : "FAIL"} |`),
  ``,
].join("\n");
const suffix = INDEXABLE ? "production" : "preview";
await writeFile(path.join(OUT, `crawl-report-${suffix}.json`), JSON.stringify({ base: BASE, origin: ORIGIN, indexable: INDEXABLE, results }, null, 2));
await writeFile(path.join(OUT, `crawl-report-${suffix}.md`), md);
console.log(md);
process.exit(failures.length ? 1 : 0);
