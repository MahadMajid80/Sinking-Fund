import { defineConfig } from "@playwright/test";

/**
 * End-to-end tests run against a production build started with the MOCK mail transport:
 *
 *   MAIL_TRANSPORT=mock CONTACT_TO=enquiries@example.test QUOTE_TO=quotes@example.test \
 *   MAIL_FROM=website@example.test npm start -- -p 3100
 *   BASE_URL=http://localhost:3100 npm run test:e2e
 *
 * Mock delivery writes messages to .mail-outbox/ (nothing is sent). Real SMTP delivery is a
 * separate manual check, recorded separately in docs/qa-report.md.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3100",
    launchOptions: process.env.CHROME_PATH !== "bundled" ? { executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome" } : {},
    trace: "retain-on-failure",
  },
});
