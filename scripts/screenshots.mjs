// Captures full-page screenshots of key pages at desktop and mobile widths.
// Usage: BASE_URL=http://localhost:3000 OUT=qa/screenshots node scripts/screenshots.mjs [paths...]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL || "http://localhost:3000";
const out = process.env.OUT || "qa/screenshots";
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/services/sfp/", "/building-insurance-valuation/", "/contact-us/", "/quote-request/?service=biv"];
const widths = (process.env.WIDTHS || "1440,390").split(",").map(Number);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome" });
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    if (p === "/") await page.waitForTimeout(2800); // let the homepage preloader finish
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    // Scroll-linked reveals depend on viewport position; show final states in full-page captures.
    await page.addStyleTag({ content: "[data-reveal]{animation:none!important}" });
    await page.waitForTimeout(1200);
    const name = (p === "/" ? "home" : p.replace(/[/?=]+/g, "-").replace(/^-|-$/g, "")) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: process.env.FULL !== "0" });
    console.log("saved", name);
  }
  await page.close();
}
await browser.close();
