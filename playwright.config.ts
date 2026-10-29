import { existsSync } from "node:fs"
import path from "node:path"

import { defineConfig, devices } from "@playwright/test"

const appUrl = "http://127.0.0.1:3010"
const supabaseMockUrl = "http://127.0.0.1:3012"
const envFile = path.join(import.meta.dirname, ".env.local")
if (existsSync(envFile)) {
  process.loadEnvFile(envFile)
}

const defaults = {
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:56321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_e2e",
}
for (const [name, value] of Object.entries(defaults)) {
  if (!process.env[name]) {
    process.env[name] = value
  }
}
if (!process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseMockUrl
}

export default defineConfig({
  testDir: "test/e2e",
  testMatch: "*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  expect: { timeout: 15_000 },
  use: { baseURL: appUrl, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node test/e2e/postgrest.mock.ts 3012",
      url: supabaseMockUrl,
    },
    {
      command: "pnpm build && pnpm exec next start -p 3010",
      url: appUrl,
      timeout: 180_000,
    },
  ],
})
