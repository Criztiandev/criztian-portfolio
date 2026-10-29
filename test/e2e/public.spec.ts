import { expect, test } from "@playwright/test"

import { FONT_OPTIONS } from "../../src/data/font.data.ts"

const validMessage = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello, I would like to work with you on a project.",
  website: "",
}

test("renders the home page with the contact form", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(
    "Criztian — Custom websites for small businesses."
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Criztian")
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Send message" })).toBeVisible()
})

test("the public site stays dark on a light system", async ({ page }) => {
  const body = page.locator("body")
  await page.emulateMedia({ colorScheme: "light" })
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/dark/)
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        "--background"
      )
    )
  ).toBe("#0a0a0a")
  await expect(body).toHaveCSS("background-color", "rgb(10, 10, 10)")
  await expect(body).toHaveCSS("color", "rgb(244, 244, 241)")

  await page.goto("/blog/does-not-exist")
  await expect(page.getByText("This page could not be found.")).toBeVisible()
  await expect(body).toHaveCSS("background-color", "rgb(10, 10, 10)")

  await page.goto("/no-such-page")
  await expect(page.getByText("This page could not be found.")).toBeVisible()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(body).toHaveCSS("background-color", "rgb(10, 10, 10)")
  await expect(body).toHaveCSS("color", "rgb(244, 244, 241)")
})

test("every listed font has its variable, and Inter is the body default", async ({
  page,
}) => {
  await page.goto("/no-such-page")
  await expect(page.locator("body")).toHaveCSS("font-family", /^"?Inter"?,/)
  for (const font of FONT_OPTIONS) {
    const family = await page.evaluate(
      (name) =>
        getComputedStyle(document.documentElement).getPropertyValue(name),
      `--font-${font.value}`
    )
    expect(family, font.value).toContain(font.label)
  }
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("the menu toggles and closes after navigating", async ({ page }) => {
    await page.goto("/")
    const toggle = page.getByRole("button", { name: "Toggle menu" })
    const menu = page.locator("#mobile-nav")
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
    await expect(menu).toBeHidden()
    await toggle.click()
    await expect(toggle).toHaveAttribute("aria-expanded", "true")
    await menu.getByRole("link", { name: "Prices" }).click()
    await expect(page).toHaveURL(/\/#prices$/)
    await expect(menu).toBeHidden()
  })
})

test("the contact form validates before sending", async ({ page }) => {
  let apiCalls = 0
  page.on("request", (request) => {
    if (request.url().includes("/api/trpc")) {
      apiCalls += 1
    }
  })
  await page.goto("/")
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByText("Enter your name")).toBeVisible()
  await expect(page.getByText("Enter a valid email address")).toBeVisible()
  await expect(page.getByText("Write at least 10 characters")).toBeVisible()
  expect(apiCalls).toBe(0)
})

test("the contact form sends valid input to the API", async ({ page }) => {
  await page.route("**/api/trpc/**", (route) => route.abort())
  await page.goto("/")
  await page.getByLabel("Name").fill(validMessage.name)
  await page.getByLabel("Email").fill(validMessage.email)
  await page.getByLabel("Message").fill(validMessage.message)
  const sent = page.waitForRequest("**/api/trpc/contact.submit**")
  await page.getByRole("button", { name: "Send message" }).click()
  expect((await sent).postDataJSON()).toEqual({ "0": validMessage })
})

test("the login form validates before calling Supabase", async ({ page }) => {
  let authCalls = 0
  page.on("request", (request) => {
    if (request.url().includes("/auth/v1/")) {
      authCalls += 1
    }
  })
  await page.goto("/login")
  await expect(page).toHaveTitle("Log in | Criztian")
  await page.getByRole("button", { name: "Log in" }).click()
  await expect(page.locator("form").getByRole("alert")).toHaveText([
    "Enter a valid email address",
    "Enter your password",
  ])
  expect(authCalls).toBe(0)
})

test("the dashboard redirects anonymous visitors to the login page", async ({
  page,
  request,
}) => {
  const paths = [
    "/dashboard",
    "/dashboard/posts",
    "/dashboard/home",
    "/dashboard/theme",
    "/dashboard/messages",
    "/editor",
    "/editor/home/new",
    "/editor/posts/new",
    "/preview/posts/1",
    "/preview/home/canvas",
  ]
  for (const path of paths) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(307)
    expect(response.headers().location).toMatch(/\/login$/)
  }
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible()
})

test("the API rejects a filled honeypot as invalid input", async ({
  request,
}) => {
  const response = await request.post("/api/trpc/contact.submit", {
    data: { ...validMessage, website: "https://spam.example" },
  })
  expect(response.status()).toBe(400)
  expect(await response.json()).toMatchObject({
    error: { message: "Invalid input", data: { code: "BAD_REQUEST" } },
  })
})

test("the API requires a session to list messages", async ({ request }) => {
  const response = await request.get("/api/trpc/contact.list")
  expect(response.status()).toBe(401)
  expect(await response.json()).toMatchObject({
    error: { message: "Sign in to continue", data: { code: "UNAUTHORIZED" } },
  })
})

test("the blog index is prerendered", async ({ page, request }) => {
  const response = await request.get("/blog")
  expect(response.status()).toBe(200)
  expect(response.headers()["x-nextjs-cache"]).toMatch(
    /^(HIT|STALE|MISS|REVALIDATED)$/
  )
  await page.goto("/blog")
  await expect(page).toHaveTitle("Blog | Criztian")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog")
})

test("public pages ship no editor code", async ({ page }) => {
  const scripts: Promise<string>[] = []
  page.on("response", (response) => {
    if (response.request().resourceType() === "script") {
      scripts.push(response.text())
    }
  })
  for (const path of ["/", "/login", "/blog"]) {
    await page.goto(path, { waitUntil: "networkidle" })
  }
  const bodies = await Promise.all(scripts)
  expect(bodies.length).toBeGreaterThan(0)
  for (const body of bodies) {
    expect(body.includes("ProseMirror")).toBe(false)
  }
})

test("unknown or malformed blog slugs return 404", async ({ request }) => {
  for (const path of ["/blog/does-not-exist", "/blog/Not_A_Slug"]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test("the API requires a session for every cms procedure", async ({
  request,
}) => {
  const responses = [
    await request.get("/api/trpc/cms.list"),
    await request.get("/api/trpc/cms.get"),
    await request.post("/api/trpc/cms.create", { data: {} }),
    await request.post("/api/trpc/cms.saveDraft", { data: {} }),
    await request.post("/api/trpc/cms.publish", { data: {} }),
    await request.post("/api/trpc/cms.delete", { data: {} }),
  ]
  for (const response of responses) {
    expect(response.status(), response.url()).toBe(401)
    expect(await response.json()).toMatchObject({
      error: { message: "Sign in to continue", data: { code: "UNAUTHORIZED" } },
    })
  }
})
