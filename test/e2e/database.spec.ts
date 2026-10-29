import { randomUUID } from "node:crypto"

import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

function env(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not set`)
  }
  return value
}

const localHosts = ["127.0.0.1", "localhost"]
const supabaseHost = new URL(env("NEXT_PUBLIC_SUPABASE_URL")).hostname

test.skip(
  !process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD,
  "Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env.local to run the database tests"
)
test.skip(
  !localHosts.includes(supabaseHost),
  "The database tests only run against the local Supabase stack"
)

async function logIn(page: Page, password: string) {
  await page.goto("/login")
  await page.getByLabel("Email").fill(env("E2E_USER_EMAIL"))
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Log in" }).click()
}

test("rejects a wrong password", async ({ page }) => {
  await logIn(page, "not-the-password")
  await expect(page.locator("form").getByRole("alert")).toHaveText(
    "Invalid login credentials"
  )
})

test("logs in to the dashboard and out again", async ({ page }) => {
  await logIn(page, env("E2E_USER_PASSWORD"))
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
  const sidebar = page.getByRole("complementary")
  await expect(sidebar.getByText(env("E2E_USER_EMAIL"))).toBeVisible()
  await expect(sidebar.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  await expect(sidebar.getByRole("link", { name: "Messages" })).toHaveCount(0)
  const unknown = await page.request.get("/dashboard/unknown")
  expect(unknown.status()).toBe(404)

  await sidebar.getByRole("button", { name: "Log out" }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login$/)
})

test("keeps public signups closed", async ({ request }) => {
  const response = await request.post(
    `${env("NEXT_PUBLIC_SUPABASE_URL")}/auth/v1/signup`,
    {
      headers: { apikey: env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") },
      data: {
        email: `intruder-${Date.now()}@example.com`,
        password: randomUUID(),
      },
    }
  )
  expect(response.status()).toBe(422)
  expect(await response.json()).toMatchObject({
    msg: "Signups not allowed for this instance",
  })
})
