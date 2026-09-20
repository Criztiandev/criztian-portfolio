import { defineConfig, devices } from "@playwright/test"

const APP_URL = "http://localhost:3000"

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Guards the reuseExistingServer case below: against a running `next dev`,
  // parallel workers force concurrent cold compiles that race on .next manifests.
  workers: 1,
  reporter: "list",
  use: {
    baseURL: APP_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // `next dev` rewrites .next manifests as it compiles each route, which on
    // this machine loses a rename race with the virus scanner and serves a 500.
    // A production build writes .next once, before any test runs.
    command: "pnpm build && pnpm start",
    url: APP_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
