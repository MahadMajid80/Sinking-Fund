import AxeBuilder from "@axe-core/playwright";
import { test, expect, routes } from "./helpers";

const services = [
  { path: "/services/biv/", faq: "/building-insurance-valuation/", option: "biv" },
  { path: "/services/sfp/", faq: "/sinking-fund-plans/", option: "sfp" },
  { path: "/services/whs/", faq: "/work-health-and-safety/", option: "whs" },
  { path: "/services/asb/", faq: "/asbestos-reports/", option: "asbestos" },
];

test.describe("homepage", () => {
  test("hero, CTAs and four service cards with one link each", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Welcome to\s+Sinking Fund/);
    await expect(page.getByText("Property compliance and valuation").first()).toBeVisible();
    const hero = page.locator(".hero");
    await expect(hero.getByRole("link", { name: "Request a Quote" })).toHaveAttribute("href", "/quote-request/");
    await expect(hero.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact-us/");
    await expect(hero.getByRole("link", { name: "Learn more about us" })).toHaveAttribute("href", "/about-us/");
    const cards = page.locator(".service-card");
    await expect(cards).toHaveCount(4);
    for (let i = 0; i < services.length; i++) {
      await expect(cards.nth(i).getByRole("link")).toHaveCount(1);
    }
    const hrefs = await cards.getByRole("link").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.sort()).toEqual(services.map((s) => s.path).sort());
    // LCP image is prioritised, not lazy.
    const heroImg = page.locator(".hero__frame img");
    await expect(heroImg).not.toHaveAttribute("loading", "lazy");
    await expect(heroImg).toHaveAttribute("fetchpriority", "high");
    await expect(page.getByRole("link", { name: "(02) 9114 9800" }).first()).toHaveAttribute("href", "tel:+61291149800");
  });
});

test.describe("service and FAQ pairing", () => {
  for (const s of services) {
    test(`${s.path} links to ${s.faq} and back, with quote preselection`, async ({ page }) => {
      await page.goto(s.path);
      await expect(page.locator(`main a[href="${s.faq}"]`).first()).toBeVisible();
      await expect(page.locator(`main a[href="/quote-request/?service=${s.option}"]`).first()).toBeVisible();
      await page.locator(`main a[href="${s.faq}"]`).first().click();
      await expect(page).toHaveURL(s.faq);
      await expect(page.locator("details.faq__item")).toHaveCount(6);
      await expect(page.locator(`main a[href="${s.path}"]`).first()).toBeVisible();
    });
  }

  test("all 24 FAQ answers are in the initial HTML (no JavaScript needed)", async ({ request }) => {
    let total = 0;
    for (const s of services) {
      const html = await (await request.get(s.faq)).text();
      const count = (html.match(/<details/g) ?? []).length;
      expect(count).toBe(6);
      expect(html).toMatch(/class="faq__a prose"><p>/);
      total += count;
    }
    expect(total).toBe(24);
  });

  test("testimonials page lists all 15 with exact attributions", async ({ page }) => {
    await page.goto("/testimonials/");
    await expect(page.locator(".testimonial")).toHaveCount(15);
    await expect(page.getByText("Christine Nesbit Principle and Licensee - Albury Wadonga Real Estate")).toBeVisible();
    await expect(page.getByText("Steve O'Brien - Strata Partners")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop menus open with the keyboard and close with Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Services" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator("#nav-services");
    await expect(menu).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(menu.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    // FAQ menu
    const faq = page.getByRole("button", { name: "FAQ" });
    await faq.click();
    await page.locator("#nav-faq").getByRole("link", { name: "Asbestos Reports" }).click();
    await expect(page).toHaveURL("/asbestos-reports/");
    await expect(page.getByRole("button", { name: "FAQ" })).toHaveAttribute("aria-expanded", "false");
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/services/biv/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("keyboard focus is always visible", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const style = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const cs = getComputedStyle(el);
        const card = el.closest(".service-card");
        const cardCs = card ? getComputedStyle(card) : null;
        return { outline: cs.outlineStyle, width: cs.outlineWidth, card: cardCs?.outlineStyle ?? "none" };
      });
      expect(style.outline !== "none" || style.card !== "none", JSON.stringify(style)).toBeTruthy();
    }
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("drawer traps focus, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Menu" });
    await open.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    // Focus is inside the modal and stays there.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => !!document.activeElement?.closest("dialog") || document.activeElement === document.body);
      expect(inside).toBeTruthy();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    // Navigating from the drawer closes it.
    await open.click();
    await dialog.getByRole("link", { name: "Work Health and Safety" }).first().click();
    await expect(page).toHaveURL("/services/whs/");
    await expect(dialog).toBeHidden();
    await open.click();
    await expect(dialog.getByRole("link", { name: "Request a Quote" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Call \(02\) 9114 9800/ })).toHaveAttribute("href", "tel:+61291149800");
  });
});

test.describe("responsive reflow", () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`no horizontal scrolling at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const r of routes) {
        await page.goto(r);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${r} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("200% text zoom keeps content readable without horizontal scroll (640px ≈ 1280px at 200%)", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/services/asb/");
    await page.addStyleTag({ content: "html{font-size:200%}" });
    // Wide data tables scroll inside their own focusable region (allowed by WCAG 1.4.10);
    // the page itself must not scroll horizontally.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("motion", () => {
  test("reduced motion disables hero, reveal and marquee animation", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const names = await page.evaluate(() =>
      [".hero__title", ".hero__frame img", "[data-reveal]", ".marquee__track"].map((sel) => getComputedStyle(document.querySelector(sel)!).animationName),
    );
    expect(names).toEqual(["none", "none", "none", "none"]);
    await expect(page.getByRole("button", { name: /testimonials/ })).toBeHidden();
    await ctx.close();
  });

  test("testimonial strip can be paused", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Pause testimonials" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Play testimonials" })).toHaveAttribute("aria-pressed", "true");
    const state = await page.evaluate(() => getComputedStyle(document.querySelector(".marquee__track")!).animationPlayState);
    expect(state).toBe("paused");
  });

  test("header turns solid after scrolling", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => "scrolled" in document.documentElement.dataset)).toBe(false);
    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => "scrolled" in document.documentElement.dataset)).toBe(true);
  });
});

test.describe("preloader", () => {
  test("shows on every homepage load for at least 2 seconds, never blocks clicks, then hides", async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.goto("/");
      const pl = page.locator(".preloader");
      await expect(pl).toHaveAttribute("aria-hidden", "true");
      expect(await pl.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
      await page.waitForTimeout(1700);
      await expect(pl).toBeVisible();
      await expect(pl).toBeHidden({ timeout: 3000 });
    }
  });

  test("is not shown on other pages", async ({ page }) => {
    for (const path of ["/about-us/", "/services/biv/", "/contact-us/"]) {
      await page.goto(path);
      await expect(page.locator(".preloader")).toHaveCount(0);
    }
  });

  test("also shows (without movement) under reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(1500);
    await expect(page.locator(".preloader")).toBeVisible();
    await expect(page.locator(".preloader")).toBeHidden({ timeout: 2500 });
    await ctx.close();
  });
});

test.describe("errors", () => {
  test("unknown URL returns a real 404 page", async ({ page }) => {
    const res = await page.goto("/no-such-page/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });
});

test.describe("axe accessibility scan (WCAG 2.2 A/AA)", () => {
  for (const r of routes) {
    test(`axe: ${r}`, async ({ page }) => {
      await page.goto(r);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} (${v.nodes[0]?.target})`)).toEqual([]);
    });
  }

  test("axe: mobile drawer open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("axe: desktop menu open", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: "Services" }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("navigation scroll position", () => {
  test("pages opened from the menu start at the top, and Back returns to the previous place", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about-us/");
    for (const href of ["/testimonials/", "/contact-us/", "/about-us/"]) {
      await page.evaluate(() => window.scrollTo(0, 700));
      await page.locator(`nav.nav a[href="${href}"]`).click();
      await expect(page).toHaveURL(href);
      await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
    }
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);
    // A script click, so the browser doesn't scroll the link into view first.
    await page.evaluate(() => (document.querySelector('nav.nav a[href="/testimonials/"]') as HTMLElement).click());
    await expect(page).toHaveURL("/testimonials/");
    await page.goBack();
    await expect(page).toHaveURL("/about-us/");
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(600);
  });

  test("section links clear the floating header", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/services/biv/");
    await page.locator(".toc a").nth(3).click();
    await page.waitForTimeout(1000);
    const gap = await page.evaluate(() => {
      const target = document.querySelector(decodeURIComponent(location.hash))!.getBoundingClientRect().top;
      return target - document.querySelector(".site-header__inner")!.getBoundingClientRect().bottom;
    });
    expect(gap).toBeGreaterThan(0);
  });
});
