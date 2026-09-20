import { defineConfig, devices } from "@playwright/test"

const APP_URL = "http://localhost:3000"

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
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
    // Deliberately a production build, not `pnpm dev`: it writes .next once,
    // before any test runs, so the suite cannot inherit dev-server bundler bugs.
    command: "pnpm build && pnpm start",
    url: APP_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
