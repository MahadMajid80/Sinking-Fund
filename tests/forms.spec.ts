import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect, fieldsFromText, humanPause, mailByReference, readOutbox } from "./helpers";

const uid = () => Math.random().toString(36).slice(2, 10);

/** Clicks Continue on the visible step. */
const next = (page: Page) => page.locator(".form-step:not([hidden]) .step-nav__next").click();
const activeStep = (page: Page) => page.locator(".form-step:not([hidden])");

/** Contact form: fills step 1 and continues to step 2 ("Your enquiry"). */
async function contactToStep2(page: Page, name = "Test Person", email = "test@example.com") {
  await page.getByLabel("Your name (required)").fill(name);
  await page.getByLabel("Your email (required)").fill(email);
  await next(page);
}

test.describe("contact form", () => {
  test("is split into two steps with a progress bar", async ({ page }) => {
    await page.goto("/contact-us/");
    const stepper = page.getByRole("navigation", { name: "Form progress" });
    await expect(stepper.locator("li")).toHaveText([/About You/, /Your Enquiry/]);
    await expect(stepper.locator('[aria-current="step"]')).toContainText("About You");
    await expect(activeStep(page)).toHaveAttribute("data-step", "about");
    await expect(page.getByLabel("Your message")).toBeHidden();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("checks the first step before moving on, with a focused error summary", async ({ page }) => {
    await page.goto("/contact-us/");
    await next(page);
    const summary = page.locator(".form-alert");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("There are problems with 2 fields");
    await expect(page.getByLabel("Your name (required)")).toHaveAttribute("aria-invalid", "true");
    await expect(activeStep(page)).toHaveAttribute("data-step", "about");
    // Summary links move focus to the field.
    await summary.getByRole("link", { name: "Enter your email." }).click();
    await expect(page.getByLabel("Your email (required)")).toBeFocused();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("rejects an invalid email format on the first step", async ({ page }) => {
    await page.goto("/contact-us/");
    await page.getByLabel("Your name (required)").fill("Test Person");
    await page.getByLabel("Your email (required)").fill("not-an-email");
    await next(page);
    await expect(page.locator("#contact-email-error")).toContainText("name@example.com");
  });

  test("Enter continues, Back keeps values, and the step title takes focus", async ({ page }) => {
    await page.goto("/contact-us/");
    await page.getByLabel("Your name (required)").fill("Keyboard User");
    await page.getByLabel("Your email (required)").fill("keys@example.com");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Your Enquiry" })).toBeFocused();
    await page.getByLabel("Subject").fill("Keep me");
    await activeStep(page).getByRole("button", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "About You" })).toBeFocused();
    await expect(page.getByLabel("Your name (required)")).toHaveValue("Keyboard User");
    await next(page);
    await expect(page.getByLabel("Subject")).toHaveValue("Keep me");
  });

  test("the second step reviews the first and Change returns to it", async ({ page }) => {
    await page.goto("/contact-us/");
    await contactToStep2(page, "Review Person", "review@example.com");
    const review = page.getByRole("region", { name: "Check your details" });
    await expect(review).toContainText("Review Person");
    await expect(review).toContainText("review@example.com");
    await expect(review).toContainText("Not provided");
    await review.getByRole("button", { name: "Change about you" }).click();
    await expect(activeStep(page)).toHaveAttribute("data-step", "about");
    // Completed steps in the progress bar are buttons too.
    await next(page);
    await page.getByRole("navigation", { name: "Form progress" }).getByRole("button", { name: /About You/ }).click();
    await expect(activeStep(page)).toHaveAttribute("data-step", "about");
  });

  test("delivers via mock transport with correct labels, recipients and Reply-To", async ({ page }) => {
    const token = uid();
    await page.goto("/contact-us/");
    await page.getByLabel("Your name (required)").fill(`Jane Citizen ${token}`);
    await page.getByLabel("Your email (required)").fill("jane@example.com");
    await page.getByLabel("Your phone number").fill("02 9114 9800");
    await next(page);
    await page.getByLabel("Asbestos Report").check();
    await page.getByLabel("OHS Report (VIC)").check();
    await page.getByLabel("Subject").fill("Strata plan enquiry");
    await page.getByLabel("Your message").fill("Line one\nLine two");
    await page.getByLabel("Call back").check();
    await page.getByLabel("Send info").check();
    await humanPause(page);
    await page.getByRole("button", { name: "Send message" }).click();
    const heading = page.getByRole("heading", { name: "Message sent" });
    await expect(heading).toBeFocused();
    const ref = (await page.locator(".form-success__ref").textContent())!.replace("Reference: ", "").trim();
    const mails = await mailByReference(ref);
    expect(mails).toHaveLength(1);
    const m = mails[0];
    expect(m.transport).toBe("mock");
    expect(m.to).toEqual(["enquiries@example.test"]);
    expect(m.replyTo).toBe("jane@example.com");
    expect(m.subject).toBe("Website enquiry: Strata plan enquiry");
    const f = fieldsFromText(m.text);
    expect(f["Your name"]).toBe(`Jane Citizen ${token}`);
    expect(f["Your email"]).toBe("jane@example.com");
    expect(f["Your phone number"]).toBe("02 9114 9800");
    expect(f["Preference"]).toBe("Call Back, Send Info");
    expect(f["Is your query regarding any of the following?"]).toBe("Asbestos Report, OHS Report (VIC)");
    expect(f["Your message"]).toBe("Line one\nLine two");
    // Personal values never appear in the URL.
    expect(page.url()).not.toContain("jane");
  });

  test("the second step still requires a reply preference", async ({ page }) => {
    await page.goto("/contact-us/");
    await contactToStep2(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator(".form-alert")).toBeFocused();
    await expect(page.locator("#contact-preference-error")).toHaveText(/Choose at least one way/);
  });

  test("shows a delivery failure and keeps the entered values", async ({ page }) => {
    await page.goto("/contact-us/");
    await contactToStep2(page, "Delivery Test", "delivery@example.com");
    await page.getByLabel("Your message").fill("Please fail: MOCK_DELIVERY_FAILURE");
    await page.getByLabel("Email back").check();
    await humanPause(page);
    await page.getByRole("button", { name: "Send message" }).click();
    const alert = page.locator(".form-alert");
    await expect(alert).toBeFocused();
    await expect(alert).toContainText("Your message was not sent");
    await expect(alert.getByRole("link", { name: "(02) 9114 9800" })).toHaveAttribute("href", "tel:+61291149800");
    await expect(page.getByLabel("Email back")).toBeChecked();
    await activeStep(page).getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Your name (required)")).toHaveValue("Delivery Test");
  });

  test("double clicking submit sends one email", async ({ page }) => {
    const token = uid();
    await page.goto("/contact-us/");
    await contactToStep2(page, `Double ${token}`, "double@example.com");
    await page.getByLabel("Call back").check();
    await humanPause(page);
    await page.getByRole("button", { name: "Send message" }).dblclick();
    await expect(page.getByRole("heading", { name: "Message sent" })).toBeVisible();
    await page.waitForTimeout(500);
    const matches = (await readOutbox()).filter((m) => m.text.includes(`Double ${token}`));
    expect(matches).toHaveLength(1);
  });

  test("without JavaScript every step is shown on one page", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/contact-us/");
    await expect(page.locator(".form-step")).toHaveCount(2);
    for (const s of await page.locator(".form-step").all()) await expect(s).toBeVisible();
    await expect(page.locator(".stepper")).toBeHidden();
    await expect(page.locator(".step-nav__next").first()).toBeHidden();
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
    await context.close();
  });
});

test.describe("quote form", () => {
  test("preselects a validated service and keeps it editable", async ({ page }) => {
    await page.goto("/quote-request/?service=biv");
    await expect(page.getByLabel("Building Insurance Valuation")).toBeChecked();
    await expect(page.getByText("Building Insurance Valuation is selected. You can change or add services.")).toBeVisible();
    await page.getByLabel("Building Insurance Valuation").uncheck();
    await page.getByLabel("Sinking Fund Plan").check();
    await expect(page.getByLabel("Building Insurance Valuation")).not.toBeChecked();

    await page.goto("/quote-request/?service=asbestos");
    await expect(page.getByLabel("Asbestos Report")).toBeChecked();

    await page.goto("/quote-request/?service=<script>");
    for (const label of ["Building Insurance Valuation", "Asbestos Report", "Sinking Fund Plan"]) await expect(page.getByLabel(label)).not.toBeChecked();
  });

  test("service page CTA carries the selection into the form", async ({ page }) => {
    await page.goto("/services/asb/");
    await page.getByRole("link", { name: "Request a quote for this service" }).click();
    await expect(page).toHaveURL("/quote-request/?service=asbestos");
    await expect(page.getByLabel("Asbestos Report")).toBeChecked();
  });

  test("has two steps, starts empty and validates each step", async ({ page }) => {
    await page.goto("/quote-request/");
    await expect(page.getByRole("navigation", { name: "Form progress" }).locator("li")).toHaveText([/Property and Site Access/, /Strata Manager/]);
    for (const id of ["quote-strata-plan", "quote-lots", "quote-site-address"]) await expect(page.locator(`#${id}`)).toHaveValue("");
    await next(page);
    const summary = page.locator(".form-alert");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("There are problems with 3 fields");
    await expect(summary).toContainText("Select at least one service to quote.");
    await page.getByLabel("Asbestos Report").check();
    const site = page.getByRole("group", { name: "Site access contact" });
    await site.getByLabel("Name (required)").fill("Sam Site");
    await site.getByLabel("Address (required)").fill("Unit 1, 1 Example Street");
    await page.locator("#quote-lots").fill("twelve");
    await next(page);
    await expect(page.locator("#quote-lots-error")).toContainText("whole number");
    await page.locator("#quote-lots").fill("12");
    await next(page);
    await expect(activeStep(page)).toHaveAttribute("data-step", "manager");
    await page.getByRole("button", { name: "Send quote request" }).click();
    await expect(page.locator(".form-alert")).toContainText("There are problems with 4 fields");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("delivers with phone and mobile values under the correct labels", async ({ page }) => {
    const token = uid();
    await page.goto("/quote-request/?service=sfp");
    await page.getByLabel("WHS Report").check();
    await page.getByLabel("Strata plan number").fill(`SP${token}`);
    await page.getByLabel("Number of lots").fill("12");
    await page.getByLabel("Site address").fill("1 Example Street, Sydney NSW 2000");
    const site = page.getByRole("group", { name: "Site access contact" });
    await site.getByLabel("Name (required)").fill("Sam Site");
    await site.getByLabel("Phone number").fill("02 2222 2222");
    await site.getByLabel("Mobile number").fill("0433 333 333");
    await site.getByLabel("Address (required)").fill("Unit 1, 1 Example Street");
    await next(page);
    const mgr = activeStep(page);
    await mgr.getByLabel("Strata manager name (required)").fill("Morgan Manager");
    await mgr.getByLabel("Company (required)").fill("Example Strata Pty Ltd");
    await mgr.getByLabel("Phone number").fill("02 1111 1111");
    await mgr.getByLabel("Email (required)").fill("manager@example.com");
    await mgr.getByLabel("Address (required)").fill("PO Box 1, Sydney NSW 2001");
    await page.getByLabel("Special Instructions").fill("Key with building manager");
    await page.getByRole("group", { name: "Preference" }).getByLabel("Email back").check();
    const review = page.getByRole("region", { name: "Check your details" });
    await expect(review).toContainText("WHS Report, Sinking Fund Plan");
    await expect(review).toContainText("0433 333 333");
    await humanPause(page);
    await page.getByRole("button", { name: "Send quote request" }).click();
    await expect(page.getByRole("heading", { name: "Quote request sent" })).toBeFocused();
    const ref = (await page.locator(".form-success__ref").textContent())!.replace("Reference: ", "").trim();
    const [m] = await mailByReference(ref);
    expect(m.to).toEqual(["quotes@example.test"]);
    expect(m.replyTo).toBe("manager@example.com");
    expect(m.subject).toBe("Quote request: WHS Report, Sinking Fund Plan");
    const f = fieldsFromText(m.text);
    expect(f["Services required"]).toBe("WHS Report, Sinking Fund Plan");
    expect(f["Strata plan number"]).toBe(`SP${token}`);
    expect(f["Strata manager phone number"]).toBe("02 1111 1111");
    expect(f["Site contact phone number"]).toBe("02 2222 2222");
    expect(f["Site contact mobile number"]).toBe("0433 333 333");
    expect(f["Preference"]).toBe("Email Back");
    expect(m.html).toContain("<th align=\"left\" valign=\"top\" style=\"border-bottom:1px solid #ddd;width:220px\">Site Contact Mobile Number</th><td style=\"border-bottom:1px solid #ddd;white-space:pre-wrap\">0433 333 333</td>");
  });

  test("a server-side error on the first step returns there", async ({ page }) => {
    await page.goto("/quote-request/?service=biv");
    const site = page.getByRole("group", { name: "Site access contact" });
    await site.getByLabel("Name (required)").fill("Sam Site");
    await site.getByLabel("Address (required)").fill("Unit 1");
    await next(page);
    // Clear a required first-step field behind the form's back, then submit from step 2.
    await page.evaluate(() => {
      const el = document.getElementById("quote-site-contact-name") as HTMLInputElement;
      el.value = "";
    });
    const mgr = activeStep(page);
    await mgr.getByLabel("Strata manager name (required)").fill("M");
    await mgr.getByLabel("Company (required)").fill("C");
    await mgr.getByLabel("Email (required)").fill("m@example.com");
    await mgr.getByLabel("Address (required)").fill("A");
    await page.getByRole("button", { name: "Send quote request" }).click();
    await expect(activeStep(page)).toHaveAttribute("data-step", "property");
    await expect(page.locator(".form-alert")).toBeFocused();
  });
});

test.describe("API protections", () => {
  const valid = (id = uid()) => ({
    name: "API Test",
    email: "api@example.com",
    contactPreference: ["email-back"],
    formStartedAt: Date.now() - 10_000,
    submissionId: `sub-${id}-${id}`,
  });

  test("throttles after 5 submissions from one client", async ({ request }) => {
    const ip = `198.51.100.${Math.floor(Math.random() * 250)}`;
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await request.post("/api/contact/", { data: valid(), headers: { "x-forwarded-for": ip } });
      statuses.push(res.status());
      if (res.status() === 429) expect(Number(res.headers()["retry-after"])).toBeGreaterThan(0);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
  });

  test("duplicate submission IDs send once", async ({ request }) => {
    const headers = { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250)}` };
    const body = valid();
    const before = (await readOutbox()).length;
    const a = await (await request.post("/api/contact/", { data: body, headers })).json();
    const b = await (await request.post("/api/contact/", { data: body, headers })).json();
    expect(a.ok).toBe(true);
    expect(b).toEqual({ ok: true, duplicate: true });
    expect((await readOutbox()).length).toBe(before + 1);
  });

  test("honeypot and too-fast submissions are dropped silently", async ({ request }) => {
    const headers = { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250)}` };
    const before = (await readOutbox()).length;
    const hp = await request.post("/api/contact/", { data: { ...valid(), website: "http://spam.example" }, headers });
    const fast = await request.post("/api/contact/", { data: { ...valid(), formStartedAt: Date.now() }, headers });
    expect(hp.status()).toBe(200);
    expect(fast.status()).toBe(200);
    expect((await readOutbox()).length).toBe(before);
  });

  test("rejects oversized, malformed and unexpected payloads", async ({ request }) => {
    const headers = { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250)}` };
    const big = await request.post("/api/contact/", { data: { ...valid(), message: "x".repeat(40_000) }, headers });
    expect(big.status()).toBe(413);
    const bad = await request.post("/api/contact/", { data: "{not json", headers: { ...headers, "content-type": "application/json" } });
    expect(bad.status()).toBe(400);
    const tooLong = await request.post("/api/contact/", { data: { ...valid(), subject: "s".repeat(151) }, headers });
    expect(tooLong.status()).toBe(400);
    expect((await tooLong.json()).errors.subject).toContain("150 characters");
    const injected = await request.post("/api/contact/", { data: { ...valid(), name: "Evil\r\nBcc: x@example.com" }, headers });
    expect(injected.status()).toBe(400);
    const unknownOption = await request.post("/api/quote/", {
      data: { services: ["not-a-service"], formStartedAt: Date.now() - 10_000 },
      headers,
    });
    expect((await unknownOption.json()).errors.services).toBeTruthy();
    // GET is a status check: yes/no values only, never a key.
    const get = await request.get("/api/contact/");
    expect(get.status()).toBe(200);
    const status = await get.json();
    expect(typeof status.recaptchaSecretKeySet).toBe("boolean");
    expect(JSON.stringify(status)).not.toMatch(/secret"\s*:\s*"|6L/);
  });

  test("no-JavaScript form posts redirect to a status page without personal data in the URL", async ({ request }) => {
    const headers = { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250)}`, "content-type": "application/x-www-form-urlencoded" };
    const ok = await request.post("/api/contact/", {
      data: "name=No+JS&email=nojs%40example.com&contactPreference=call-back&contactPreference=send-info&message=Hello",
      headers,
      maxRedirects: 0,
    });
    expect(ok.status()).toBe(303);
    expect(ok.headers().location).toMatch(/\/enquiry\/sent\/\?form=contact$/);
    const invalid = await request.post("/api/quote/", { data: "managerName=X", headers, maxRedirects: 0 });
    expect(invalid.status()).toBe(303);
    expect(invalid.headers().location).toMatch(/\/enquiry\/error\/\?form=quote&reason=invalid$/);
    expect(invalid.headers().location).not.toContain("X");
  });
});
