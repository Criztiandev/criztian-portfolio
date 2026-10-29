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

test("stores a contact message, emails it and lists it on the dashboard", async ({
  page,
  request,
}) => {
  const name = `E2E ${Date.now()}`
  await page.goto("/")
  await page.getByLabel("Name").fill(name)
  await page.getByLabel("Email").fill("ada@example.com")
  await page
    .getByLabel("Message")
    .fill("Hello from the end-to-end suite, please ignore.")
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByRole("status")).toHaveText(
    "Thanks, your message is on its way."
  )

  const emails = await (await request.get(env("RESEND_BASE_URL"))).json()
  expect(emails).toContainEqual(
    expect.objectContaining({
      to: env("EMAIL_TO"),
      from: env("EMAIL_FROM"),
      subject: `New contact message from ${name}`,
      reply_to: "ada@example.com",
      text: expect.stringContaining("please ignore"),
    })
  )

  await logIn(page, env("E2E_USER_PASSWORD"))
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
  const sidebar = page.getByRole("complementary")
  await expect(sidebar.getByText(env("E2E_USER_EMAIL"))).toBeVisible()
  await expect(sidebar.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  await sidebar.getByRole("link", { name: "Messages" }).click()
  await expect(page).toHaveURL(/\/dashboard\/messages$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Messages" })
  ).toBeVisible()
  const row = page.getByRole("row", { name })
  const toggle = row.getByRole("button", { name: `Message from ${name}` })
  const text = row.getByText("Hello from the end-to-end suite, please ignore.")
  await expect(row).toContainText("ada@example.com")
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await expect(text).toHaveCSS("text-overflow", "ellipsis")
  await row
    .getByRole("cell")
    .nth(1)
    .click({ position: { x: 100, y: 10 } })
  await expect(toggle).toHaveAttribute("aria-expanded", "true")
  await expect(text).toHaveCSS("white-space", "pre-wrap")
  await expect(row.getByText("ada@example.com")).toHaveCSS(
    "white-space",
    "pre-wrap"
  )
  await expect(
    row.getByRole("link", { name: `Reply to ${name}` })
  ).toHaveAttribute("href", "mailto:ada@example.com")
  const unknown = await page.request.get("/dashboard/unknown")
  expect(unknown.status()).toBe(404)

  await sidebar.getByRole("button", { name: "Log out" }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login$/)
})

test("shows the empty and error states of the messages", async ({ page }) => {
  test.slow()
  const list = "**/api/trpc/contact.list*"
  const main = page.getByRole("main")
  const alert = main.getByRole("alert")
  await logIn(page, env("E2E_USER_PASSWORD"))
  await expect(page).toHaveURL(/\/dashboard\/posts$/)

  await page.route(list, (route) =>
    route.fulfill({ json: [{ result: { data: [] } }] })
  )
  await page.goto("/dashboard/messages")
  await expect(main.getByText("No messages yet.")).toBeVisible()
  await page.unroute(list)

  await page.route(list, (route) => route.abort())
  await page.reload()
  await expect(alert).toContainText("Could not load the messages.", {
    timeout: 20_000,
  })
  await page.unroute(list)
  await alert.getByRole("button", { name: "Try again" }).click()
  await expect(
    main.getByRole("table").or(main.getByText("No messages yet."))
  ).toBeVisible()
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
