import { expect, test } from "@playwright/test"

import { FONT_OPTIONS } from "../../src/data/font.data.ts"

test("renders the home page sections", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(
    "Criztian — Custom websites for small businesses."
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your place deserves a website as good as it is."
  )
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "Your customers check your website before they walk in.",
    "WORK",
    "How it works",
    "Hi, I'm Criztian.",
    "PRICES",
    "Let's talk about your place.",
  ])
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
  await expect(
    page.getByRole("heading", { level: 1, name: "This page doesn't exist." })
  ).toBeVisible()
  await expect(body).toHaveCSS("background-color", "rgb(10, 10, 10)")

  await page.goto("/no-such-page")
  await expect(
    page.getByRole("heading", { level: 1, name: "This page doesn't exist." })
  ).toBeVisible()
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

test("Book a call opens the booking popup and Escape returns focus", async ({
  page,
}) => {
  await page.route("https://cal.com/**", (route) => route.abort())
  await page.goto("/")
  const book = page
    .locator('[data-cms-card="Hero"]')
    .getByRole("link", { name: "Book a call" })
  const popup = page.getByRole("dialog", { name: "Book a call" })
  await book.click()
  await expect(popup).toBeVisible()
  await expect(popup.getByText("Loading times…")).toBeVisible()
  const box = await popup.boundingBox()
  expect(box?.width).toBe(720)
  await page.keyboard.press("Escape")
  await expect(popup).toBeHidden()
  await expect(book).toBeFocused()
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("the menu's Book a call swaps the menu for a full-screen popup", async ({
    page,
  }) => {
    await page.route("https://cal.com/**", (route) => route.abort())
    await page.goto("/")
    await page.getByRole("button", { name: "Open menu" }).click()
    const menu = page.getByRole("dialog", { name: "Menu" })
    await menu.getByRole("link", { name: "Book a call" }).click()
    const popup = page.getByRole("dialog", { name: "Book a call" })
    await expect(popup).toBeVisible()
    await expect(menu).toBeHidden()
    await expect(popup.getByRole("button", { name: "Close" })).toBeFocused()
    expect(await popup.boundingBox()).toEqual({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    })
  })

  test("the menu toggles and closes after navigating", async ({ page }) => {
    await page.goto("/")
    const toggle = page.getByRole("button", { name: "Open menu" })
    const menu = page.getByRole("dialog", { name: "Menu" })
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
    await expect(menu).toBeHidden()
    await toggle.click()
    await expect(menu).toBeVisible()
    await menu.getByRole("link", { name: "Prices" }).click()
    await expect(page).toHaveURL(/\/#prices$/)
    await expect(menu).toBeHidden()
  })
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

test("the Roudon-Smith case study opens from its work row", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.getByRole("link", { name: "Read the case study" }).click()
  await expect(page).toHaveURL(/\/work\/roudon-smith$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Roudon-Smith Winery: the wine club first."
  )
  const unknown = await request.get("/work/jnt-express")
  expect(unknown.status()).toBe(404)
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
