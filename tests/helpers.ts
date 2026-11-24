import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test as base } from "@playwright/test";

export const OUTBOX = path.resolve(process.env.MAIL_MOCK_DIR || ".mail-outbox");

export interface MockMail {
  transport: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  reference: string;
  form: string;
}

export async function readOutbox(): Promise<MockMail[]> {
  try {
    const files = (await readdir(OUTBOX)).filter((f) => f.endsWith(".json"));
    return Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(OUTBOX, f), "utf8")) as MockMail));
  } catch {
    return [];
  }
}

export async function mailByReference(ref: string): Promise<MockMail[]> {
  return (await readOutbox()).filter((m) => m.reference === ref);
}

/** Extracts "Label:\nvalue" pairs from the plain-text email body. */
export function fieldsFromText(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const blocks = text.split("\n\n").slice(1);
  for (const b of blocks) {
    const [label, ...rest] = b.split("\n");
    if (label?.endsWith(":")) out[label.slice(0, -1).toLowerCase()] = rest.join("\n").trim();
  }
  // Labels are looked up without regard to capitalisation (field labels are Title Case on the site).
  return new Proxy(out, { get: (o, k) => (typeof k === "string" ? o[k.toLowerCase()] : undefined) });
}

let ipCounter = Math.floor(Math.random() * 200);
/** Each test gets its own client IP so rate limits don't leak between tests. */
export const test = base.extend<{ clientIp: string }>({
  clientIp: async ({}, provide) => {
    ipCounter += 1;
    await provide(`203.0.113.${ipCounter % 250}`);
  },
  page: async ({ page, clientIp }, provide) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": clientIp });
    await provide(page);
  },
});
export { expect } from "@playwright/test";

/** Fill time guard: the server drops submissions made faster than 2.5 s after render. */
export const humanPause = (page: import("@playwright/test").Page) => page.waitForTimeout(2700);

export const routes = [
  "/",
  "/about-us/",
  "/services/biv/",
  "/services/sfp/",
  "/services/whs/",
  "/services/asb/",
  "/building-insurance-valuation/",
  "/sinking-fund-plans/",
  "/work-health-and-safety/",
  "/asbestos-reports/",
  "/testimonials/",
  "/contact-us/",
  "/quote-request/",
  "/legal/",
];
