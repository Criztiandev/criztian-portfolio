import { randomUUID } from "node:crypto"

import { expect, test } from "@playwright/test"
import type { APIRequestContext, APIResponse, Page } from "@playwright/test"

function env(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not set`)
  }
  return value
}

const localHosts = ["127.0.0.1", "localhost"]
const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL")
const rest = `${supabaseUrl}/rest/v1`
const anon = { apikey: env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") }

test.skip(
  !process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD,
  "Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env.local to run the database tests"
)
test.skip(
  !localHosts.includes(new URL(supabaseUrl).hostname),
  "The database tests only run against the local Supabase stack"
)
test.describe.configure({ mode: "default" })

function uniqueSlug(): string {
  return `e2e-${randomUUID().slice(0, 8)}`
}

function postValues(slug: string) {
  return {
    title: `E2E entry ${slug}`,
    slug,
    summary: "Written by the end-to-end suite.",
    body: "Hello from the suite.",
    publishDate: "2026-10-10",
    visible: true,
  }
}

async function logIn(page: Page) {
  await page.goto("/login")
  await page.getByLabel("Email").fill(env("E2E_USER_EMAIL"))
  await page.getByLabel("Password").fill(env("E2E_USER_PASSWORD"))
  await page.getByRole("button", { name: "Log in" }).click()
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
}

function mutate(page: Page, procedure: string, input: object) {
  return page.request.post(`/api/trpc/cms.${procedure}`, { data: input })
}

function create(page: Page, values: object) {
  return mutate(page, "create", { collection: "posts", values })
}

function saveDraft(page: Page, id: number, values: object) {
  return mutate(page, "saveDraft", { id, collection: "posts", values })
}

async function createEntry(page: Page, slug: string): Promise<number> {
  const response = await create(page, postValues(slug))
  expect(response.status()).toBe(200)
  const body = await response.json()
  return body.result.data.id
}

async function getEntry(page: Page, id: number) {
  const response = await page.request.get("/api/trpc/cms.get", {
    params: { input: JSON.stringify({ id }) },
  })
  expect(response.status()).toBe(200)
  const body = await response.json()
  return body.result.data
}

async function restToken(request: APIRequestContext): Promise<string> {
  const session = await request.post(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      headers: anon,
      data: {
        email: env("E2E_USER_EMAIL"),
        password: env("E2E_USER_PASSWORD"),
      },
    }
  )
  const { access_token: token } = await session.json()
  return token
}

async function expectOk(response: APIResponse) {
  expect(response.status(), await response.text()).toBe(200)
}

async function expectError(
  response: APIResponse,
  status: number,
  code: string
) {
  expect(response.status()).toBe(status)
  expect(await response.json()).toMatchObject({ error: { data: { code } } })
}

async function expectRefused(response: APIResponse) {
  expect(response.status()).toBe(401)
  expect(await response.json()).toMatchObject({ code: "42501" })
}

function countValues() {
  document.body.dataset.cmsValues = "0"
  window.addEventListener("message", (event) => {
    if (event.data.type === "values") {
      const seen = Number(document.body.dataset.cmsValues)
      document.body.dataset.cmsValues = String(seen + 1)
    }
  })
}

function readValues(): number {
  return Number(document.body.dataset.cmsValues)
}

function fits(element: HTMLElement): boolean {
  return element.scrollWidth <= element.clientWidth
}

async function clearCollection(page: Page, collection: string) {
  const list = await page.request.get("/api/trpc/cms.list", {
    params: { input: JSON.stringify({ collection }) },
  })
  await expectOk(list)
  const listed = await list.json()
  for (const row of listed.result.data) {
    await expectOk(await mutate(page, "delete", { id: row.id }))
  }
}

test("keeps drafts private and refuses anonymous writes", async ({
  page,
  request,
}) => {
  const slug = uniqueSlug()
  const values = postValues(slug)
  const row = `${rest}/cms_entries?id=eq.`
  await logIn(page)
  const id = await createEntry(page, slug)

  const hidden = await request.get(`${row}${id}&select=id,published`, {
    headers: anon,
  })
  expect(hidden.status()).toBe(200)
  expect(await hidden.json()).toEqual([])

  const reads = [
    "select=draft",
    "select=*",
    "select=id,updated_at",
    "select=id,single",
    "select=id&draft=not.is.null",
  ]
  for (const read of reads) {
    await expectRefused(
      await request.get(`${rest}/cms_entries?${read}`, { headers: anon })
    )
  }
  await expectRefused(
    await request.post(`${rest}/cms_entries`, {
      headers: anon,
      data: { collection: "posts", published: postValues(`${slug}-anon`) },
    })
  )
  await expectRefused(
    await request.patch(`${row}${id}`, {
      headers: anon,
      data: { published: values },
    })
  )
  await expectRefused(await request.delete(`${row}${id}`, { headers: anon }))
  await expectRefused(
    await request.post(`${rest}/rpc/cms_publish_entry`, {
      headers: anon,
      data: { entry_id: id },
    })
  )

  await expectOk(await mutate(page, "publish", { id }))
  await expectOk(
    await saveDraft(page, id, { ...values, title: "Not live yet" })
  )
  const live = await request.get(`${row}${id}&select=id,published`, {
    headers: anon,
  })
  expect(await live.json()).toEqual([{ id, published: values }])
  await expectRefused(
    await request.get(`${row}${id}&select=draft`, { headers: anon })
  )

  await expectOk(await mutate(page, "delete", { id }))
})

test("lets a signed-in user create, save, publish and delete", async ({
  page,
}) => {
  const slug = uniqueSlug()
  const values = postValues(slug)
  const changed = { ...values, title: "A new title" }
  await logIn(page)

  await expectError(
    await create(page, { ...values, title: "" }),
    400,
    "BAD_REQUEST"
  )
  await expectError(
    await mutate(page, "create", { collection: "unknown", values }),
    400,
    "BAD_REQUEST"
  )

  const id = await createEntry(page, slug)
  expect(await getEntry(page, id)).toMatchObject({
    collection: "posts",
    draft: values,
    published: null,
    published_at: null,
    updated_by: expect.stringMatching(/^[0-9a-f-]{36}$/),
  })

  await expectOk(await mutate(page, "publish", { id }))
  const published = await getEntry(page, id)
  expect(published).toMatchObject({ draft: null, published: values })
  expect(published.published_at).not.toBeNull()
  await expectError(await mutate(page, "publish", { id }), 404, "NOT_FOUND")

  await expectOk(await saveDraft(page, id, values))
  expect(await getEntry(page, id)).toMatchObject({ draft: null })

  await expectOk(await saveDraft(page, id, changed))
  expect(await getEntry(page, id)).toMatchObject({
    draft: changed,
    published: values,
  })

  const list = await page.request.get("/api/trpc/cms.list", {
    params: { input: JSON.stringify({ collection: "posts" }) },
  })
  const listed = await list.json()
  expect(listed.result.data).toContainEqual(expect.objectContaining({ id }))

  await expectOk(await mutate(page, "delete", { id }))
  expect(await getEntry(page, id)).toBeNull()
  await expectError(await mutate(page, "delete", { id }), 404, "NOT_FOUND")
  await expectError(await saveDraft(page, id, values), 404, "NOT_FOUND")
})

test("keeps slugs unique among live entries", async ({ page, request }) => {
  const slug = uniqueSlug()
  const otherSlug = uniqueSlug()
  await logIn(page)

  const live = await createEntry(page, slug)
  await expectOk(await mutate(page, "publish", { id: live }))
  const taken = await create(page, postValues(slug))
  await expectError(taken, 409, "CONFLICT")
  expect(await taken.json()).toMatchObject({
    error: { message: "Another post already uses this slug" },
  })

  const first = await createEntry(page, otherSlug)
  const second = await createEntry(page, otherSlug)
  await expectError(
    await saveDraft(page, second, postValues(slug)),
    409,
    "CONFLICT"
  )
  await expectOk(await mutate(page, "publish", { id: first }))
  await expectError(
    await mutate(page, "publish", { id: second }),
    409,
    "CONFLICT"
  )

  const token = await restToken(request)
  const duplicate = await request.post(`${rest}/cms_entries`, {
    headers: { ...anon, Authorization: `Bearer ${token}` },
    data: { collection: "posts", published: postValues(slug) },
  })
  expect(duplicate.status()).toBe(409)
  expect(await duplicate.json()).toMatchObject({ code: "23505" })

  for (const id of [live, first, second]) {
    await expectOk(await mutate(page, "delete", { id }))
  }
})

test("keeps one entry for a single collection", async ({ page, request }) => {
  test.slow()
  const text = `Single ${uniqueSlug()}`
  const values = {
    heroHeading: "Criztian",
    heroText: text,
    contactHeading: "Contact",
  }
  const main = page.getByRole("main")

  async function homeHtml(): Promise<string> {
    const response = await request.get("/")
    return response.text()
  }

  await logIn(page)
  await clearCollection(page, "home")

  const sidebar = page.getByRole("complementary")
  const editorItem = sidebar.getByRole("link", { name: "Editor", exact: true })
  await expect(editorItem).toHaveAttribute("href", "/editor")
  await expect(
    sidebar.getByRole("link", { name: "Blog", exact: true })
  ).toBeVisible()
  await expect(sidebar.getByRole("link", { name: "Home page" })).toHaveCount(0)
  await expect(sidebar.getByRole("link", { name: "Theme" })).toHaveCount(0)
  await editorItem.click()
  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  await expect(page.getByRole("complementary")).toHaveCount(0)
  await expect(page).toHaveTitle("Home page | Criztian")
  await expect(main.getByRole("heading", { level: 1 })).toHaveText("Home page")
  await expect(
    main.getByRole("link", { name: "Back to dashboard" })
  ).toHaveAttribute("href", "/dashboard")
  const pages = main.getByRole("navigation", { name: "Pages" })
  await expect(pages.getByRole("link")).toHaveText(["Home page", "Theme"])
  await expect(
    pages.getByRole("link", { name: "Theme", exact: true })
  ).toHaveAttribute("href", "/editor/theme")
  await expect(
    main.getByRole("link", { name: "Home page", exact: true })
  ).toHaveAttribute("aria-current", "page")
  await expect(main.getByLabel("Hero heading")).toHaveValue("Criztian")
  const contactHeading = main.getByLabel("Contact heading")
  await expect(contactHeading).toBeHidden()
  await main.getByRole("button", { name: "Contact", exact: true }).click()
  await expect(contactHeading).toBeVisible()
  await expect(contactHeading).toHaveValue("Contact")

  const created = await mutate(page, "create", { collection: "home", values })
  await expectOk(created)
  const { id } = (await created.json()).result.data
  const entryUrl = new RegExp(`/editor/home/${id}$`)
  expect(await homeHtml()).not.toContain(text)

  await page.goto(`/preview/home/${id}`)
  await expect(
    page.getByText("Preview: you're seeing unpublished changes.")
  ).toBeVisible()
  await expect(page.locator('[data-cms-field="heroText"]')).toHaveText(text)
  await expect(
    page.getByRole("link", { name: "Back to editor" })
  ).toHaveAttribute("href", `/editor/home/${id}`)
  const wrongCollection = await page.request.get(`/preview/theme/${id}`)
  expect(wrongCollection.status()).toBe(404)

  await page.goto("/dashboard/home")
  await expect(page).toHaveURL(entryUrl)
  await page.goto("/editor")
  await expect(page).toHaveURL(entryUrl)
  await page.goto("/editor/home/new")
  await expect(page).toHaveURL(entryUrl)
  await expect(main.getByLabel("Hero text")).toHaveValue(text)

  const second = await mutate(page, "create", { collection: "home", values })
  await expectError(second, 409, "CONFLICT")
  const token = await restToken(request)
  const duplicate = await request.post(`${rest}/cms_entries`, {
    headers: { ...anon, Authorization: `Bearer ${token}` },
    data: { collection: "home", draft: values, single: true },
  })
  expect(duplicate.status()).toBe(409)
  expect(await duplicate.json()).toMatchObject({ code: "23505" })

  await expectOk(await mutate(page, "publish", { id }))
  await expect.poll(homeHtml).toContain(text)

  await expectOk(await mutate(page, "delete", { id }))
  await expect.poll(homeHtml).not.toContain(text)
})

test("draws the brand palette on the site only after Publish", async ({
  page,
  request,
}) => {
  test.slow()
  const blue = "#1d4ed8"
  const values = {
    background: "#0a0a0a",
    text: "#f4f4f1",
    primary: "#e1251b",
    accent: "#e1251b",
    muted: "#232323",
    headingFont: "anton",
    bodyFont: "inter",
  }
  const anton = /^"?Anton"?,/
  const inter = /^"?Inter"?,/
  const hardToRead =
    "Text is hard to read on this color. Pick two colors that are further apart."
  const html = page.locator("html")
  const main = page.getByRole("main")
  const form = main.locator("form")
  const dialog = page.getByRole("alertdialog")
  const textField = main.getByLabel("Text", { exact: true })
  const textPicker = main.getByLabel("Text color picker")
  const save = main.getByRole("button", { name: "Save draft" })
  const frame = page.frameLocator('iframe[title="Page preview"]')
  const frameSend = frame.locator("button", { hasText: "Send message" })
  const frameTitle = frame.locator("h1")
  const frameText = frame.locator("[data-cms-field=heroText]")
  const headingFont = main.getByLabel("Heading font")
  const bodyFont = main.getByLabel("Body font")

  async function homeHtml(): Promise<string> {
    const response = await request.get("/")
    return response.text()
  }

  async function loadedFonts(): Promise<string[]> {
    const canvas = page.frame({ url: /\/preview\/theme\/canvas$/ })
    if (canvas === null) {
      return []
    }
    return canvas.evaluate(() =>
      Array.from(document.fonts)
        .filter((face) => face.status === "loaded")
        .map((face) => face.family.replaceAll('"', ""))
    )
  }

  await page.emulateMedia({ colorScheme: "light" })
  await logIn(page)
  await expect(html).toHaveClass(/dark/)
  await clearCollection(page, "theme")
  await expect.poll(homeHtml).toContain("--primary:#e1251b")

  await expectError(
    await mutate(page, "create", {
      collection: "theme",
      values: { ...values, text: "#222222" },
    }),
    400,
    "BAD_REQUEST"
  )
  await expectError(
    await mutate(page, "create", {
      collection: "theme",
      values: { ...values, headingFont: "comic-sans" },
    }),
    400,
    "BAD_REQUEST"
  )

  await page.goto("/editor/theme")
  await expect(page).toHaveURL(/\/editor\/theme\/new$/)
  await expect(html).toHaveClass(/dark/)
  await expect(frame.locator("html")).toHaveClass(/dark/)
  await expect(frameSend).toHaveCSS("background-color", "rgb(225, 37, 27)")
  await expect(main.getByRole("heading", { level: 1 })).toHaveText("Theme")
  await expect(main.getByLabel("Background", { exact: true })).toHaveValue(
    values.background
  )
  await expect(main.getByLabel("Muted", { exact: true })).toHaveValue(
    values.muted
  )
  await expect(textField).toHaveValue(values.text)
  await expect(textPicker).toHaveValue(values.text)

  await textField.fill("#222")
  await expect(textPicker).toHaveValue(values.text)
  await textField.fill("#222222")
  await expect(textPicker).toHaveValue("#222222")
  await save.click()
  await expect(form.getByRole("alert")).toHaveText([hardToRead, hardToRead])
  await expect(main.getByLabel("Background", { exact: true })).toBeFocused()
  await expect(page).toHaveURL(/\/editor\/theme\/new$/)
  const listed = await page.request.get("/api/trpc/cms.list", {
    params: { input: JSON.stringify({ collection: "theme" }) },
  })
  expect((await listed.json()).result.data).toEqual([])

  await textField.fill(values.text)
  await expect(form.getByRole("alert")).toHaveCount(0)
  await textField.fill("#12")
  await save.click()
  await expect(form.getByRole("alert")).toHaveText("Enter a color like #1a2b3c")
  await expect(textField).toBeFocused()
  await expect(textField).toHaveValue("#12")
  await textField.fill(values.text)

  await main.getByLabel("Primary color picker").fill(blue)
  await expect(main.getByLabel("Primary", { exact: true })).toHaveValue(blue)
  await expect(frameSend).toHaveCSS("background-color", "rgb(29, 78, 216)")

  await expect(headingFont).toBeHidden()
  await main.getByRole("button", { name: "Fonts", exact: true }).click()
  await expect(textField).toBeHidden()
  await expect(headingFont).toHaveValue("anton")
  await expect(bodyFont).toHaveValue("inter")
  await expect(headingFont.locator("option")).toHaveText(["Anton", "Inter"])
  await expect(frameTitle).toHaveCSS("font-family", anton)
  await headingFont.selectOption({ label: "Inter" })
  await expect(frameTitle).toHaveCSS("font-family", inter)
  await expect(frameText).toHaveCSS("font-family", inter)
  await bodyFont.selectOption({ label: "Anton" })
  await expect(frameText).toHaveCSS("font-family", anton)
  await expect(frameTitle).toHaveCSS("font-family", inter)
  await expect(main.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-family",
    inter
  )
  await expect
    .poll(loadedFonts)
    .toEqual(expect.arrayContaining(["Inter", "Anton"]))

  await save.click()
  await expect(page.getByText("Draft saved")).toBeVisible()
  await expect(page).toHaveURL(/\/editor\/theme\/\d+$/)
  await expect(frameSend).toHaveCSS("background-color", "rgb(29, 78, 216)")
  await expect(frameTitle).toHaveCSS("font-family", inter)
  const id = Number(new URL(page.url()).pathname.split("/").pop())
  const saved = await homeHtml()
  expect(saved).toContain("--primary:#e1251b")
  expect(saved).toContain("--font-display:var(--font-anton)")
  expect(saved).not.toContain(blue)
  await page.goto("/editor")
  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  await expect(frameSend).toHaveCSS("background-color", "rgb(225, 37, 27)")
  await expect(frameTitle).toHaveCSS("font-family", anton)
  await page.goto(`/editor/theme/${id}`)

  await main.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(dialog.getByRole("listitem")).toHaveText([
    "BackgroundAfter: #0a0a0a",
    "TextAfter: #f4f4f1",
    `PrimaryAfter: ${blue}`,
    "AccentAfter: #e1251b",
    "MutedAfter: #232323",
    "Heading fontAfter: Inter",
    "Body fontAfter: Anton",
  ])
  await dialog.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect.poll(homeHtml).toContain(`--primary:${blue}`)
  await page.goto("/editor")
  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  await expect(frameSend).toHaveCSS("background-color", "rgb(29, 78, 216)")
  await expect(frameTitle).toHaveCSS("font-family", inter)

  await page.goto("/")
  await expect(html).toHaveClass(/dark/)
  const send = page.getByRole("button", { name: "Send message" })
  await expect(send).toHaveCSS("background-color", "rgb(29, 78, 216)")
  await expect(send).toHaveCSS("color", "rgb(255, 255, 255)")
  await expect(send).toHaveCSS("font-family", anton)
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-family",
    inter
  )
  await expect(page.getByRole("heading", { level: 2 })).toHaveCSS(
    "font-family",
    inter
  )

  await expectOk(await mutate(page, "delete", { id }))
  await expect.poll(homeHtml).toContain("--primary:#e1251b")

  await page.goto("/dashboard/messages")
  await expect(html).toHaveClass(/dark/)
  await page.getByRole("button", { name: "Log out" }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(html).toHaveClass(/dark/)
})

test("edits the home page beside the live page", async ({ page }) => {
  test.slow()
  const typed = "Typed in the editor"
  const canvasUrl = /\/preview\/home\/canvas$/
  const main = page.getByRole("main")
  const frame = page.frameLocator('iframe[title="Page preview"]')
  const heroHeading = main.getByLabel("Hero heading")
  const heroText = main.getByLabel("Hero text")
  const contactHeading = main.getByLabel("Contact heading")
  const hero = main.getByRole("button", { name: "Hero", exact: true })
  const contact = main.getByRole("button", { name: "Contact", exact: true })
  const stage = main.getByRole("group", { name: "Page preview" })
  const panel = main.locator("form > div:last-child > div:last-child")
  const menu = frame.locator('button[aria-label="Toggle menu"]')
  let contactCalls = 0
  let openedTabs = 0
  page.on("request", (sent) => {
    if (sent.url().includes("contact.submit")) {
      contactCalls += 1
    }
  })
  page.context().on("page", () => {
    openedTabs += 1
  })

  async function focusedTag(): Promise<string | undefined> {
    return page.evaluate(() => document.activeElement?.tagName)
  }

  async function frameWidth(): Promise<number | undefined> {
    return page.frame({ url: canvasUrl })?.evaluate(() => window.innerWidth)
  }

  async function frameScroll(): Promise<number | undefined> {
    return page.frame({ url: canvasUrl })?.evaluate(() => window.scrollY)
  }

  async function answerNo(click: () => Promise<void>): Promise<string> {
    let question = ""
    page.once("dialog", async (dialog) => {
      question = dialog.message()
      await dialog.dismiss()
    })
    await click()
    return question
  }

  await logIn(page)
  await clearCollection(page, "home")
  const missing = [
    "/preview/unknown/canvas",
    "/editor/unknown/new",
    "/editor/home/0",
    "/editor/home/abc",
    "/editor/unknown",
  ]
  for (const path of missing) {
    expect((await page.request.get(path)).status(), path).toBe(404)
  }

  await page.route("**/preview/home/canvas", (route) => route.abort())
  await page.goto("/editor/home/new")
  await expect(main.getByRole("status")).toHaveText("Loading preview...")
  await expect(main.getByRole("alert")).toHaveText(
    "The preview could not load. Save your draft, then reload the page.",
    { timeout: 20_000 }
  )
  await page.unroute("**/preview/home/canvas")

  await page.goto("/editor")
  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  await expect(main.getByRole("heading", { level: 1 })).toHaveText("Home page")
  await expect(frame.locator("h1")).toHaveText("Criztian")
  await expect(page.locator('iframe[title="Page preview"]')).toHaveAttribute(
    "aria-hidden",
    "true"
  )
  await expect(hero).toHaveAttribute("aria-current", "true")
  expect(await page.locator("html").evaluate(fits)).toBe(true)
  expect(await main.evaluate(fits)).toBe(true)
  expect(await panel.evaluate(fits)).toBe(true)

  await page.frame({ url: canvasUrl })?.evaluate(countValues)
  await heroHeading.press("End")
  await heroHeading.pressSequentially("abcde", { delay: 40 })
  await expect(frame.locator("h1")).toHaveText("Criztianabcde")
  expect(
    await page.frame({ url: canvasUrl })?.evaluate(readValues)
  ).toBeGreaterThanOrEqual(5)

  await heroHeading.fill(typed)
  await expect(frame.locator("h1")).toHaveText(typed)

  await contact.click()
  await expect(contact).toHaveAttribute("aria-current", "true")
  await expect(hero).not.toHaveAttribute("aria-current")
  await expect(contactHeading).toBeVisible()
  await expect(heroHeading).toBeHidden()
  await expect(frame.locator('[data-cms-card="Contact"]')).toHaveCSS(
    "outline-style",
    "solid"
  )
  await expect(frame.locator('[data-cms-card="Hero"]')).toHaveCSS(
    "outline-style",
    "none"
  )

  await frame.locator('[data-cms-field="heroText"]').click()
  await expect(hero).toHaveAttribute("aria-current", "true")
  await expect(heroText).toBeFocused()
  expect(await focusedTag()).toBe("TEXTAREA")

  await frame.locator('header a[href="/#work"]').first().click()
  expect(await focusedTag()).toBe("TEXTAREA")
  await frame
    .locator('header a[href="/#work"]')
    .first()
    .click({ button: "middle" })
  await frame.locator("button", { hasText: "Send message" }).click()
  await expect(contact).toHaveAttribute("aria-current", "true")
  await expect(heroText).toBeHidden()
  expect(await focusedTag()).toBe("BODY")

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.addEventListener("message", () => resolve(), { once: true })
        window.postMessage(
          { type: "select", card: null, field: "heroText" },
          window.location.origin
        )
      })
  )
  await expect(contact).toHaveAttribute("aria-current", "true")

  await main.getByRole("link", { name: "Theme", exact: true }).focus()
  await page.keyboard.press("Tab")
  await expect(stage).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(contactHeading).toBeFocused()

  await main.getByRole("button", { name: "Phone" }).click()
  await expect.poll(frameWidth).toBe(390)
  await expect(menu).toBeVisible()
  await menu.click()
  await expect(menu).toHaveAttribute("aria-expanded", "false")
  await stage.focus()
  await page.keyboard.press("PageDown")
  await expect.poll(frameScroll).toBeGreaterThan(0)
  await page.keyboard.press("Home")
  await expect.poll(frameScroll).toBe(0)

  await main.getByRole("button", { name: "Desktop" }).click()
  await expect.poll(frameWidth).toBe(1280)

  await contact.click()
  await contactHeading.fill("")
  await hero.click()
  await main.getByRole("button", { name: "Save draft" }).click()
  await expect(contact).toHaveAttribute("aria-current", "true")
  await expect(contactHeading).toBeFocused()
  await expect(main.locator("form").getByRole("alert")).toHaveText(
    "Contact heading is required"
  )
  const listed = await page.request.get("/api/trpc/cms.list", {
    params: { input: JSON.stringify({ collection: "home" }) },
  })
  expect((await listed.json()).result.data).toEqual([])

  const leave = "You have unsaved changes. Leave without saving?"
  const rows = [
    main.getByRole("link", { name: "Theme", exact: true }),
    main.getByRole("link", { name: "Back to dashboard" }),
  ]
  for (const row of rows) {
    expect(await answerNo(() => row.click())).toBe(leave)
  }

  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  expect(page.frame({ url: canvasUrl })).not.toBeNull()
  await expect(frame.locator("h1")).toHaveText(typed)
  await expect(frame.getByText("Enter your name")).toHaveCount(0)
  expect(contactCalls).toBe(0)
  expect(openedTabs).toBe(0)
})

test("shows a post on the site only after Publish", async ({
  page,
  request,
}) => {
  test.slow()
  const slug = uniqueSlug()
  const otherSlug = uniqueSlug()
  const first = {
    ...postValues(slug),
    summary: "A **strong** summary.",
    body: "## Heading\n\n**bold text**\n\n| a<br>b |\n| --- |\n| c |",
    publishDate: "2099-01-01",
  }
  const second = postValues(otherSlug)
  const draftTitle = `Not live ${slug}`
  const post = page.locator("article")
  const postTitle = post.getByRole("heading", { level: 1 })

  async function siteStatus(path: string): Promise<number> {
    const response = await request.get(path)
    return response.status()
  }

  await logIn(page)
  const created = await create(page, first)
  await expectOk(created)
  const { id } = (await created.json()).result.data
  const preview = `/preview/posts/${id}`
  await page.reload()
  await expect(
    page.getByRole("main").getByRole("row", { name: first.title })
  ).toContainText("A strong summary.")

  expect(await siteStatus(`/blog/${slug}`)).toBe(404)
  await page.goto("/blog")
  await expect(page.getByRole("link", { name: first.title })).toHaveCount(0)

  const anonymous = await request.get(preview, { maxRedirects: 0 })
  expect(anonymous.status()).toBe(307)
  expect(anonymous.headers().location).toMatch(/\/login$/)
  await page.goto(preview)
  await expect(
    page.getByText("Preview: you're seeing unpublished changes.")
  ).toBeVisible()
  await expect(postTitle).toHaveText(first.title)
  await expect(
    page.getByRole("link", { name: "Back to editor" })
  ).toHaveAttribute("href", `/editor/posts/${id}`)
  expect(await page.content()).toContain("--primary:")
  const missing = [`/preview/unknown/${id}`, "/preview/posts/0", `${preview}x`]
  for (const path of missing) {
    const response = await page.request.get(path)
    expect(response.status(), path).toBe(404)
  }

  await expectOk(await mutate(page, "publish", { id }))
  await expect.poll(() => siteStatus(`/blog/${slug}`)).toBe(200)
  await page.goto("/blog")
  await expect(page.locator("main li").first()).toContainText(first.title)
  await expect(page.locator("main li").first().locator("strong")).toHaveText(
    "strong"
  )
  await page.goto(`/blog/${slug}`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A strong summary."
  )
  await expect(postTitle).toHaveText(first.title)
  await expect(
    post.getByRole("heading", { level: 2, name: "Heading" })
  ).toBeVisible()
  await expect(post.locator("strong")).toHaveText("bold text")
  await expect(post.locator("th br")).toHaveCount(1)

  await expectOk(await saveDraft(page, id, { ...first, title: draftTitle }))
  await page.goto(preview)
  await expect(postTitle).toHaveText(draftTitle)

  const otherId = await createEntry(page, otherSlug)
  await expectOk(await mutate(page, "publish", { id: otherId }))
  await expect.poll(() => siteStatus(`/blog/${otherSlug}`)).toBe(200)
  await page.goto("/blog")
  await expect(page.getByRole("link", { name: second.title })).toBeVisible()
  await expect(page.getByRole("link", { name: first.title })).toBeVisible()
  await expect(page.getByText(draftTitle)).toHaveCount(0)
  await page.goto(`/blog/${slug}`)
  await expect(postTitle).toHaveText(first.title)

  await expectOk(await saveDraft(page, otherId, { ...second, visible: false }))
  await expectOk(await mutate(page, "publish", { id: otherId }))
  await expect.poll(() => siteStatus(`/blog/${otherSlug}`)).toBe(404)
  const blogHtml = await request.get("/blog")
  expect(await blogHtml.text()).not.toContain(second.title)

  await expectOk(await mutate(page, "delete", { id }))
  await expectOk(await mutate(page, "delete", { id: otherId }))
  await expect.poll(() => siteStatus(`/blog/${slug}`)).toBe(404)
})

test("lists entries and deletes one from the row menu", async ({
  page,
  request,
}) => {
  test.slow()
  const draft = postValues(uniqueSlug())
  const changed = postValues(uniqueSlug())
  const live = postValues(uniqueSlug())
  const changedTitle = `Changed ${changed.slug}`
  const main = page.getByRole("main")
  const dialog = page.getByRole("alertdialog")
  const draftRow = main.getByRole("row", { name: draft.title })
  const liveRow = main.getByRole("row", { name: live.title })

  async function siteStatus(path: string): Promise<number> {
    const response = await request.get(path)
    return response.status()
  }

  async function openDelete(title: string) {
    await main.getByRole("button", { name: `Actions for ${title}` }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
  }

  await logIn(page)
  const draftId = await createEntry(page, draft.slug)
  const changedId = await createEntry(page, changed.slug)
  await expectOk(await mutate(page, "publish", { id: changedId }))
  await expectOk(
    await saveDraft(page, changedId, { ...changed, title: changedTitle })
  )
  const liveId = await createEntry(page, live.slug)
  await expectOk(await mutate(page, "publish", { id: liveId }))
  await expect.poll(() => siteStatus(`/blog/${live.slug}`)).toBe(200)

  await page.reload()
  await expect(draftRow).toContainText("Draft")
  await expect(draftRow).toContainText(draft.summary)
  await expect(main.getByRole("row", { name: changedTitle })).toContainText(
    "Changes not published"
  )
  await expect(main.getByRole("row", { name: changed.title })).toHaveCount(0)
  await expect(liveRow).toContainText("Published")
  await expect(main.locator('a[href="/editor/posts/new"]')).toHaveText(
    "New post"
  )
  await expect(liveRow.getByRole("link", { name: live.title })).toHaveAttribute(
    "href",
    `/editor/posts/${liveId}`
  )
  await draftRow
    .getByRole("cell")
    .first()
    .click({ position: { x: 4, y: 4 } })
  await expect(page).toHaveURL(new RegExp(`/editor/posts/${draftId}$`))
  await page.goBack()
  await expect(draftRow).toBeVisible()

  await main.getByRole("button", { name: `Actions for ${live.title}` }).click()
  await expect(page.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
    "href",
    `/editor/posts/${liveId}`
  )
  await page.getByRole("menuitem", { name: "Delete" }).click()
  await expect(dialog).toContainText("Delete this post?")
  await expect(dialog).toContainText(live.title)
  await expect(dialog).toContainText("It comes off the site right away.")
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(liveRow).toBeVisible()

  await openDelete(draft.title)
  await expect(dialog).toContainText("It was never published")
  await dialog.getByRole("button", { name: "Cancel" }).click()
  await expect(dialog).toBeHidden()
  await expect(draftRow).toBeVisible()

  await openDelete(live.title)
  await dialog.getByRole("button", { name: "Delete" }).click()
  await expect(page.getByText("Post deleted")).toBeVisible()
  await expect(liveRow).toHaveCount(0)
  await expect(draftRow).toBeVisible()
  expect(await getEntry(page, liveId)).toBeNull()
  await expect.poll(() => siteStatus(`/blog/${live.slug}`)).toBe(404)

  await expectOk(await mutate(page, "delete", { id: draftId }))
  await expectOk(await mutate(page, "delete", { id: changedId }))
})

test("shows the empty, loading and error states of the list", async ({
  page,
}) => {
  test.slow()
  const list = "**/api/trpc/cms.list*"
  const main = page.getByRole("main")
  const table = main.getByRole("table")
  const alert = main.getByRole("alert")
  const held = Promise.withResolvers<void>()
  await logIn(page)
  const id = await createEntry(page, uniqueSlug())

  await page.route(list, (route) =>
    route.fulfill({ json: [{ result: { data: [] } }] })
  )
  await page.reload()
  await expect(main.getByText("Nothing here yet.")).toBeVisible()
  await expect(
    main.getByText("Use New post to add the first one.")
  ).toBeVisible()
  await page.unroute(list)

  await page.route(list, async (route) => {
    await held.promise
    await route.continue()
  })
  await page.reload()
  await expect(main.getByRole("status")).toHaveText("Loading...")
  held.resolve()
  await expect(table).toBeVisible()
  await page.unroute(list)

  await page.route(list, (route) => route.abort())
  await page.reload()
  await expect(alert).toContainText("Could not load this list.", {
    timeout: 20_000,
  })
  await page.unroute(list)
  await alert.getByRole("button", { name: "Try again" }).click()
  await expect(table).toBeVisible()

  await expectOk(await mutate(page, "delete", { id }))
})

test("saves a draft in the editor and keeps it off the site", async ({
  page,
  request,
}) => {
  test.slow()
  const slug = uniqueSlug()
  const title = `Editor ${slug}`
  const savedTitle = `Saved ${slug}`
  const summary = "Written in the editor."
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  let clickedDate = 15
  if (now.getDate() === 15) {
    clickedDate = 17
  }
  const keyedDate = clickedDate + 1
  const pickedDay = `${now.getFullYear()}-${month}-${keyedDate}`
  const postCanvasUrl = /\/preview\/posts\/canvas$/
  const main = page.getByRole("main")
  const form = main.locator("form")
  const frame = page.frameLocator('iframe[title="Page preview"]')
  const heading = main.getByRole("heading", { level: 1 })
  const back = main.getByRole("link", { name: "Back to Blog" })
  const content = main.getByRole("button", { name: "Content", exact: true })
  const settings = main.getByRole("button", { name: "Settings", exact: true })
  const titleField = main.getByLabel("Title", { exact: true })
  const summaryBox = main.getByRole("textbox", { name: "Summary" })
  const bulletList = main
    .getByRole("group", { name: "Summary" })
    .getByRole("button", { name: "Bullet list" })
  const body = main.getByRole("textbox", { name: "Body" })
  const visible = main.getByRole("switch", { name: "Show on site" })
  const date = main.getByRole("button", { name: /Publish date/ })
  const calendar = page.getByRole("dialog", { name: "Publish date" })
  const save = main.getByRole("button", { name: "Save draft" })
  const panel = main.locator("form > div:last-child > div:last-child")
  const bodyTools = main.getByRole("group", { name: "Body" })

  await logIn(page)
  await main.locator('a[href="/editor/posts/new"]').click()
  await expect(page).toHaveURL(/\/editor\/posts\/new$/)
  await expect(page).toHaveTitle("New post | Criztian")
  await expect(heading).toHaveText("New post")
  await expect(
    main.getByRole("button", { name: "Publish", exact: true })
  ).toBeEnabled()
  await expect(back).toHaveAttribute("href", "/dashboard/posts")
  await expect(content).toHaveAttribute("aria-current", "true")
  await expect(visible).toBeHidden()
  await settings.click()
  await expect(settings).toHaveAttribute("aria-current", "true")
  await expect(visible).toBeChecked()
  await expect(titleField).toBeHidden()
  await content.click()
  await expect(titleField).toHaveAttribute(
    "placeholder",
    "Give the post a title"
  )
  await expect(summaryBox.locator("p")).toHaveCSS(
    "content",
    '"Say in a sentence what the post is about"',
    { pseudo: "before" }
  )
  await expect(body.locator("p")).toHaveCSS(
    "content",
    '"Write the post here"',
    { pseudo: "before" }
  )
  await expect(summaryBox).toHaveCSS("min-height", "96px")
  await expect(summaryBox).toHaveAttribute(
    "aria-describedby",
    "cms-field-summary-helper"
  )
  expect(await page.locator("html").evaluate(fits)).toBe(true)
  expect(await main.evaluate(fits)).toBe(true)
  expect(await panel.evaluate(fits)).toBe(true)
  await expect(page.locator('iframe[title="Page preview"]')).toHaveAttribute(
    "aria-hidden",
    "true"
  )

  await expect(frame.locator("article")).toBeVisible()
  await page.frame({ url: postCanvasUrl })?.evaluate(countValues)
  await titleField.pressSequentially("Hello", { delay: 40 })
  await expect(frame.locator("article h1")).toHaveText("Hello")
  expect(await page.frame({ url: postCanvasUrl })?.evaluate(readValues)).toBe(1)
  await titleField.fill("")

  await body.click()
  await bodyTools.getByRole("button", { name: "Insert table" }).click()
  await expect(body.locator(".tableWrapper")).toHaveCSS("overflow-x", "auto")
  await bodyTools.getByRole("button", { name: "Undo" }).click()
  await expect(body.locator("table")).toHaveCount(0)

  await save.click()
  await expect(form.getByRole("alert")).toHaveText([
    "Title is required",
    "Enter a slug",
    "Summary is required",
    "Body is required",
  ])
  await expect(titleField).toBeFocused()
  await expect(titleField).toHaveAttribute(
    "aria-describedby",
    "cms-field-title-error"
  )
  await expect(summaryBox).toHaveAttribute(
    "aria-describedby",
    "cms-field-summary-helper cms-field-summary-error"
  )
  await bulletList.click()
  await expect(summaryBox).toBeFocused()
  await expect(summaryBox.locator("li")).toHaveCount(1)
  await expect(form.getByRole("alert")).toHaveText([
    "Title is required",
    "Enter a slug",
    "Summary is required",
    "Body is required",
  ])
  await bulletList.click()
  await expect(summaryBox.locator("li")).toHaveCount(0)

  await titleField.fill(title)
  await expect(heading).toHaveText(title)
  await expect(frame.locator("article h1")).toHaveText(title)
  await main.getByLabel("Slug").fill(slug)
  await summaryBox.click()
  await page.keyboard.type(summary)
  await body.click()
  await page.keyboard.type("Plain and ")
  await bodyTools.getByRole("button", { name: "Bold" }).click()
  await expect(body).toBeFocused()
  await page.keyboard.type("bold text")
  await expect(frame.locator("article strong")).toHaveText("bold text")

  await frame.locator('[data-cms-field="title"]').click()
  await expect(titleField).toBeFocused()
  await frame.locator('[data-cms-field="publishDate"]').click()
  await expect(settings).toHaveAttribute("aria-current", "true")
  await expect(date).toBeFocused()
  await expect(titleField).toBeHidden()
  await date.click()
  await expect(calendar).toBeVisible()
  await frame.locator("article p").first().click()
  await expect(calendar).toBeHidden()
  await expect(content).toHaveAttribute("aria-current", "true")
  await expect(body).toBeFocused()
  await frame.locator('[data-cms-field="publishDate"]').click()
  await expect(date).toBeFocused()

  await date.click()
  await calendar
    .getByRole("button", { name: new RegExp(` ${clickedDate}th, `) })
    .click()
  await expect(calendar).toBeHidden()
  await expect(date).toContainText(` ${clickedDate}, `)
  await date.press("Enter")
  await expect(
    calendar.getByRole("button", { name: "Go to the Previous Month" })
  ).toBeFocused()
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  await page.keyboard.press("ArrowRight")
  await expect(
    calendar.getByRole("button", { name: new RegExp(` ${keyedDate}th, `) })
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(calendar).toBeHidden()
  await expect(date).toBeFocused()
  await expect(date).toContainText(` ${keyedDate}, `)
  await expect(frame.locator("article time")).toHaveText(pickedDay)
  await date.click()
  await expect(calendar).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(calendar).toBeHidden()
  await expect(date).toBeVisible()
  await expect(page).toHaveURL(/\/editor\/posts\/new$/)
  await expect(page.getByText("Draft saved")).toHaveCount(0)

  await save.click()
  await expect(page.getByText("Draft saved")).toBeVisible()
  await expect(page).toHaveURL(/\/editor\/posts\/\d+$/)
  const id = Number(new URL(page.url()).pathname.split("/").pop())
  await expect(page).toHaveTitle("Edit post | Criztian")
  await expect(main.getByText("Draft", { exact: true })).toBeVisible()
  await expect(frame.locator("article h1")).toHaveText(title)
  expect(await getEntry(page, id)).toMatchObject({
    published: null,
    draft: {
      title,
      slug,
      summary,
      body: "Plain and **bold text**",
      publishDate: pickedDay,
      visible: true,
    },
  })

  const sitePage = await request.get(`/blog/${slug}`)
  expect(sitePage.status()).toBe(404)
  const anonRow = await request.get(
    `${rest}/cms_entries?id=eq.${id}&select=id,published`,
    { headers: anon }
  )
  expect(await anonRow.json()).toEqual([])

  await titleField.fill(savedTitle)
  await save.click()
  await expect
    .poll(async () => (await getEntry(page, id)).draft.title)
    .toBe(savedTitle)
  await expect(save).toBeEnabled()
  await back.click()
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
  await expect(main.getByRole("row", { name: savedTitle })).toBeVisible()
  await page.goBack()
  await expect(titleField).toHaveValue(savedTitle)

  const missing = [
    "/editor/posts/0",
    "/editor/posts/abc",
    "/editor/messages/1",
    "/dashboard/posts/new",
    `/dashboard/posts/${id}`,
  ]
  for (const path of missing) {
    const response = await page.request.get(path)
    expect(response.status(), path).toBe(404)
  }

  await page.route("**/api/trpc/cms.saveDraft*", (route) => route.abort())
  await titleField.fill(`${savedTitle} again`)
  await body.click()
  await save.click()
  await expect(form.getByRole("alert")).toBeInViewport()
  await page.unroute("**/api/trpc/cms.saveDraft*")
  await titleField.fill(savedTitle)

  const broken = await request.patch(`${rest}/cms_entries?id=eq.${id}`, {
    headers: { ...anon, Authorization: `Bearer ${await restToken(request)}` },
    data: { draft: { ...postValues(slug), publishDate: "soon" } },
  })
  expect(broken.status()).toBe(204)
  await page.goto(`/editor/posts/${id}`)
  await expect(content).toHaveAttribute("aria-current", "true")
  await expect(main.getByRole("status")).toHaveText(
    "This cannot be previewed yet. Save draft to see what needs fixing."
  )
  await save.click()
  await expect(settings).toHaveAttribute("aria-current", "true")
  await expect(form.getByRole("alert")).toHaveText("Enter a valid date")
  await expect(date).toBeFocused()

  await expectOk(await mutate(page, "delete", { id }))
})

test("warns before leaving the editor with unsaved changes", async ({
  page,
  request,
}) => {
  test.slow()
  const values = postValues(uniqueSlug())
  const changedTitle = `Changed ${values.slug}`
  const question = "You have unsaved changes. Leave without saving?"
  const main = page.getByRole("main")
  const form = main.locator("form")
  const titleField = main.getByLabel("Title", { exact: true })
  const slugField = main.getByLabel("Slug")
  const save = main.getByRole("button", { name: "Save draft" })
  const back = main.getByRole("link", { name: "Back to Blog" })
  let prompts: string[] = []

  function unloadGuarded(): Promise<boolean> {
    return page.evaluate(
      () =>
        !window.dispatchEvent(new Event("beforeunload", { cancelable: true }))
    )
  }

  function answerNextPrompt(accept: boolean) {
    prompts = []
    page.once("dialog", async (dialog) => {
      prompts.push(dialog.message())
      if (accept) {
        await dialog.accept()
        return
      }
      await dialog.dismiss()
    })
  }

  async function siteStatus(path: string): Promise<number> {
    const response = await request.get(path)
    return response.status()
  }

  await logIn(page)
  const liveId = await createEntry(page, values.slug)
  await expectOk(await mutate(page, "publish", { id: liveId }))
  await expect.poll(() => siteStatus(`/blog/${values.slug}`)).toBe(200)
  const draftId = await createEntry(page, uniqueSlug())
  const editorUrl = new RegExp(`/editor/posts/${liveId}$`)

  await page.goto(`/editor/posts/${liveId}`)
  await expect(main.getByText("Published", { exact: true })).toBeVisible()
  await expect(titleField).toHaveValue(values.title)
  expect(await unloadGuarded()).toBe(false)
  await main.getByRole("textbox", { name: "Body" }).click()
  await back.click()
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
  await page.goBack()
  await expect(page).toHaveURL(editorUrl)

  await titleField.fill(changedTitle)
  await expect.poll(unloadGuarded).toBe(true)
  answerNextPrompt(false)
  await back.click()
  expect(prompts).toEqual([question])
  await expect(page).toHaveURL(editorUrl)
  await expect(titleField).toHaveValue(changedTitle)
  answerNextPrompt(false)
  await main.getByRole("link", { name: "Theme", exact: true }).click()
  expect(prompts).toEqual([question])
  await expect(page).toHaveURL(editorUrl)

  await save.click()
  await expect(page.getByText("Draft saved")).toBeVisible()
  await expect(
    main.getByText("Changes not published", { exact: true })
  ).toBeVisible()
  await expect.poll(unloadGuarded).toBe(false)
  const live = await request.get(
    `${rest}/cms_entries?id=eq.${liveId}&select=id,published`,
    { headers: anon }
  )
  expect(await live.json()).toEqual([{ id: liveId, published: values }])
  const sitePage = await request.get(`/blog/${values.slug}`)
  const html = await sitePage.text()
  expect(html).toContain(values.title)
  expect(html).not.toContain(changedTitle)

  await page.goto(`/editor/posts/${draftId}`)
  await slugField.fill(values.slug)
  await save.click()
  await expect(form.getByRole("alert")).toHaveText(
    "Another post already uses this slug"
  )
  await expect(slugField).toBeFocused()
  answerNextPrompt(true)
  await back.click()
  expect(prompts).toEqual([question])
  await expect(page).toHaveURL(/\/dashboard\/posts$/)

  await expectOk(await mutate(page, "delete", { id: draftId }))
  await expectOk(await mutate(page, "delete", { id: liveId }))
})

test("checks the changes, then publishes from the editor", async ({
  page,
  request,
}) => {
  test.slow()
  const slug = uniqueSlug()
  const sharedSlug = uniqueSlug()
  const values = {
    ...postValues(slug),
    body: "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.",
  }
  const secondTitle = `Second ${slug}`
  const thirdTitle = `Third ${slug}`
  const main = page.getByRole("main")
  const dialog = page.getByRole("alertdialog")
  const rows = dialog.getByRole("listitem")
  const toastTitle = page.locator("[data-slot=toast-title]")
  const chip = main.getByText("Published", { exact: true })
  const titleField = main.getByLabel("Title", { exact: true })
  const save = main.getByRole("button", { name: "Save draft" })
  const publish = main.getByRole("button", { name: "Publish", exact: true })
  const confirm = dialog.getByRole("button", { name: "Publish", exact: true })
  const cancel = dialog.getByRole("button", { name: "Cancel" })

  async function siteStatus(path: string): Promise<number> {
    const response = await request.get(path)
    return response.status()
  }

  async function siteShows(text: string): Promise<boolean> {
    const response = await request.get(`/blog/${slug}`)
    const html = await response.text()
    return html.includes(text)
  }

  async function liveRows(id: number) {
    const response = await request.get(
      `${rest}/cms_entries?id=eq.${id}&select=id,published`,
      { headers: anon }
    )
    return response.json()
  }

  await logIn(page)
  const created = await create(page, values)
  await expectOk(created)
  const { id } = (await created.json()).result.data

  await page.goto(`/editor/posts/${id}`)
  await expect(main.getByText("Draft", { exact: true })).toBeVisible()
  await publish.click()
  await expect(dialog).toContainText("Publish this post?")
  await expect(rows).toHaveText([
    `TitleAfter: ${values.title}`,
    `SlugAfter: ${slug}`,
    `SummaryAfter: ${values.summary}`,
    "BodyAfter: First paragraph. Second paragraph. Third paragraph.",
    "Publish dateAfter: Oct 10, 2026",
    "Show on siteAfter: Yes",
  ])
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(publish).toBeFocused()
  expect(await siteStatus(`/blog/${slug}`)).toBe(404)
  expect(await liveRows(id)).toEqual([])

  await publish.click()
  await confirm.click()
  await expect(dialog).toBeHidden()
  await expect(toastTitle.filter({ hasText: "Published" })).toBeVisible()
  await expect(chip).toBeVisible()
  await expect(publish).toBeDisabled()
  await expect(publish).toBeFocused()
  await expect.poll(() => siteStatus(`/blog/${slug}`)).toBe(200)

  await titleField.fill(secondTitle)
  await expect(publish).toBeEnabled()
  await main
    .getByRole("textbox", { name: "Body" })
    .getByText("Second paragraph.")
    .click()
  await page.keyboard.press("End")
  await page.keyboard.type(" Edited.")
  await publish.click()
  await expect(toastTitle.filter({ hasText: "Draft saved" })).toBeVisible()
  await expect(rows).toHaveText([
    `TitleBefore: ${values.title}After: ${secondTitle}`,
    "BodyBefore: Second paragraph.After: Second paragraph. Edited.",
  ])
  await cancel.click()
  await expect(dialog).toBeHidden()
  await expect(
    main.getByText("Changes not published", { exact: true })
  ).toBeVisible()
  expect(await liveRows(id)).toEqual([{ id, published: values }])
  expect((await getEntry(page, id)).draft.title).toBe(secondTitle)

  await titleField.fill(thirdTitle)
  await save.click()
  await expect(save).toBeEnabled()
  await expect(save).toBeFocused()
  await publish.click()
  await expect(rows.first()).toHaveText(
    `TitleBefore: ${values.title}After: ${thirdTitle}`
  )
  await confirm.click()
  await expect(dialog).toBeHidden()
  await expect(chip).toBeVisible()
  await expect.poll(() => siteShows(thirdTitle)).toBe(true)

  await titleField.fill("")
  await publish.click()
  await expect(main.locator("form").getByRole("alert")).toHaveText(
    "Title is required"
  )
  await expect(dialog).toBeHidden()
  expect((await getEntry(page, id)).draft).toBeNull()
  await titleField.fill(thirdTitle)

  const firstId = await createEntry(page, sharedSlug)
  const secondId = await createEntry(page, sharedSlug)
  await expectOk(await mutate(page, "publish", { id: firstId }))
  await page.goto(`/editor/posts/${secondId}`)
  await publish.click()
  await confirm.click()
  await expect(dialog.getByRole("alert")).toHaveText(
    "Another post already uses this slug"
  )
  await expect(confirm).toBeEnabled()
  await cancel.click()
  await expect(dialog).toBeHidden()
  expect((await getEntry(page, secondId)).published).toBeNull()

  await expectOk(await mutate(page, "delete", { id }))
  await expectOk(await mutate(page, "delete", { id: firstId }))
  await expectOk(await mutate(page, "delete", { id: secondId }))
})

test("takes a new post from the editor to the site", async ({
  page,
  request,
}) => {
  test.slow()
  const slug = uniqueSlug()
  const title = `Journey ${slug}`
  const summary = "Clicked from New post to the site."
  const main = page.getByRole("main")
  const dialog = page.getByRole("alertdialog")
  const frame = page.frameLocator('iframe[title="Page preview"]')
  const publish = main.getByRole("button", { name: "Publish", exact: true })
  const postTitle = page.locator("article").getByRole("heading", { level: 1 })
  const sidebar = page.getByRole("complementary")
  const blogItem = sidebar.getByRole("link", { name: "Blog" })
  const blogRow = main.getByRole("link", { name: "Blog", exact: true })

  async function blogLists(): Promise<boolean> {
    const response = await request.get("/blog")
    const html = await response.text()
    return html.includes(title)
  }

  await logIn(page)
  await expect(blogItem).toHaveAttribute("aria-current", "page")
  await main.locator('a[href="/editor/posts/new"]').click()
  await expect(page).toHaveURL(/\/editor\/posts\/new$/)
  await expect(blogRow).toHaveAttribute("aria-current", "page")
  await main.getByLabel("Title", { exact: true }).fill(title)
  await main.getByLabel("Slug").fill(slug)
  await main.getByRole("textbox", { name: "Summary" }).click()
  await page.keyboard.type(summary)
  await main.getByRole("textbox", { name: "Body" }).click()
  await page.keyboard.type("Journey body.")
  await expect(frame.locator("article h1")).toHaveText(title)

  await publish.click()
  await expect(page.getByText("Draft saved")).toBeVisible()
  await expect(dialog.getByRole("listitem")).toHaveText([
    `TitleAfter: ${title}`,
    `SlugAfter: ${slug}`,
    `SummaryAfter: ${summary}`,
    "BodyAfter: Journey body.",
    /^Publish dateAfter: /,
    "Show on siteAfter: Yes",
  ])
  await expect(page).toHaveURL(/\/editor\/posts\/new$/)
  const hidden = await request.get(`/blog/${slug}`)
  expect(hidden.status()).toBe(404)
  expect(await blogLists()).toBe(false)

  await dialog.getByRole("button", { name: "Publish", exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/editor\/posts\/\d+$/)
  const id = Number(new URL(page.url()).pathname.split("/").pop())
  await expect(main.getByText("Published", { exact: true })).toBeVisible()
  await expect(blogRow).toHaveAttribute("aria-current", "page")

  await expect.poll(blogLists).toBe(true)
  await page.goto("/blog")
  await page.getByRole("link", { name: title }).click()
  await expect(page).toHaveURL(new RegExp(`/blog/${slug}$`))
  await expect(postTitle).toHaveText(title)

  await expectOk(await mutate(page, "delete", { id }))
})

test("takes the home text and a color from the editor to the site", async ({
  page,
  request,
}) => {
  test.slow()
  const text = `Journey ${uniqueSlug()}`
  const green = "#15803d"
  const greenFill = "rgb(21, 128, 61)"
  const main = page.getByRole("main")
  const dialog = page.getByRole("alertdialog")
  const sidebar = page.getByRole("complementary")
  const frame = page.frameLocator('iframe[title="Page preview"]')
  const frameText = frame.locator("[data-cms-field=heroText]")
  const frameSend = frame.locator("button", { hasText: "Send message" })
  const publish = main.getByRole("button", { name: "Publish", exact: true })
  const confirm = dialog.getByRole("button", { name: "Publish", exact: true })
  const published = main.getByText("Published", { exact: true })

  async function homeHtml(): Promise<string> {
    const response = await request.get("/")
    return response.text()
  }

  await logIn(page)
  await clearCollection(page, "home")
  await clearCollection(page, "theme")
  await expect.poll(homeHtml).toContain("--primary:#e1251b")

  await sidebar.getByRole("link", { name: "Editor", exact: true }).click()
  await expect(page).toHaveURL(/\/editor\/home\/new$/)
  await main.getByLabel("Hero text").fill(text)
  await expect(frameText).toHaveText(text)
  await main.getByRole("button", { name: "Save draft" }).click()
  await expect(page.getByText("Draft saved")).toBeVisible()
  await expect(page).toHaveURL(/\/editor\/home\/\d+$/)
  await expect(main.getByText("Draft", { exact: true })).toBeVisible()
  expect(await homeHtml()).not.toContain(text)

  await publish.click()
  await expect(dialog.getByRole("listitem")).toHaveText([
    "Hero headingAfter: Criztian",
    `Hero textAfter: ${text}`,
    "Contact headingAfter: Contact",
  ])
  expect(await homeHtml()).not.toContain(text)
  await confirm.click()
  await expect(dialog).toBeHidden()
  await expect(published).toBeVisible()
  await expect.poll(homeHtml).toContain(text)

  await main.getByRole("link", { name: "Theme", exact: true }).click()
  await expect(page).toHaveURL(/\/editor\/theme\/new$/)
  await expect(frameText).toHaveText(text)
  await main.getByLabel("Primary", { exact: true }).fill(green)
  await expect(frameSend).toHaveCSS("background-color", greenFill)

  await publish.click()
  await expect(dialog.getByRole("listitem")).toHaveText([
    "BackgroundAfter: #0a0a0a",
    "TextAfter: #f4f4f1",
    `PrimaryAfter: ${green}`,
    "AccentAfter: #e1251b",
    "MutedAfter: #232323",
    "Heading fontAfter: Anton",
    "Body fontAfter: Inter",
  ])
  await expect(page).toHaveURL(/\/editor\/theme\/new$/)
  expect(await homeHtml()).toContain("--primary:#e1251b")
  await confirm.click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/editor\/theme\/\d+$/)
  await expect(published).toBeVisible()

  await main.getByRole("link", { name: "Back to dashboard" }).click()
  await expect(page).toHaveURL(/\/dashboard\/posts$/)
  await expect.poll(homeHtml).toContain(`--primary:${green}`)
  const opened = page.waitForEvent("popup")
  await sidebar.getByRole("link", { name: "View site" }).click()
  const site = await opened
  await expect(site).toHaveURL("/")
  await expect(site.locator("[data-cms-field=heroText]")).toHaveText(text)
  await expect(site.getByRole("button", { name: "Send message" })).toHaveCSS(
    "background-color",
    greenFill
  )

  await clearCollection(page, "home")
  await clearCollection(page, "theme")
  await expect.poll(homeHtml).not.toContain(text)
  await expect.poll(homeHtml).toContain("--primary:#e1251b")
})
