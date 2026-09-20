import type { Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

import { LOGIN_PATH } from "@/data/auth.data"
import { EDITOR_PATH, EDITOR_PREVIEW_PATH } from "@/data/site-content.data"

import {
  createTestOwner,
  deleteTestOwner,
  TEST_OWNER_EMAIL,
  TEST_OWNER_PASSWORD,
} from "./owner-account"

const PREVIEW_FRAME = "iframe[title='Site preview']"

test.describe.configure({ mode: "serial" })

test.beforeAll(async function createOwner() {
  await createTestOwner()
})

test.afterAll(async function removeOwner() {
  await deleteTestOwner()
})

async function signInToEditor(page: Page): Promise<void> {
  await page.goto(`${LOGIN_PATH}?next=${EDITOR_PATH}`)
  await page.getByLabel("Email").fill(TEST_OWNER_EMAIL)
  await page.getByLabel("Password").fill(TEST_OWNER_PASSWORD)
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.waitForURL(`**${EDITOR_PATH}`)

  await page
    .frameLocator(PREVIEW_FRAME)
    .locator("[data-status='running']")
    .waitFor({ timeout: 60_000 })
}

async function publishFromEditor(page: Page): Promise<void> {
  page.once("dialog", function acceptConfirmation(dialog) {
    void dialog.accept()
  })

  await page.getByRole("button", { name: "Publish" }).click()

  await expect(page.locator("[data-unpublished]")).toHaveAttribute(
    "data-unpublished",
    "false"
  )
}

async function readPublishedHeroName(page: Page): Promise<string> {
  await page.goto("/")

  const name = await page.locator("h1").textContent()

  return name ?? ""
}

test("sends a logged-out visitor from the editor to the login page", async ({
  page,
}) => {
  await page.goto(EDITOR_PATH)

  await expect(page).toHaveURL(function isLoginWithReturnPath(url: URL) {
    return (
      url.pathname === LOGIN_PATH &&
      url.searchParams.get("next") === EDITOR_PATH
    )
  })
})

test("sends a logged-out visitor from the preview to the login page", async ({
  page,
}) => {
  await page.goto(EDITOR_PREVIEW_PATH)

  await expect(page).toHaveURL(function isLoginWithReturnPath(url: URL) {
    return (
      url.pathname === LOGIN_PATH &&
      url.searchParams.get("next") === EDITOR_PREVIEW_PATH
    )
  })
})

test("edits the hero live, autosaves the draft, and publishes it", async ({
  page,
  browser,
}) => {
  await signInToEditor(page)

  const nameInput = page.getByLabel("Name")
  const originalName = await nameInput.inputValue()
  const editedName = `Editor ${Date.now().toString().slice(-5)}`

  await nameInput.fill(editedName)

  await expect(page.frameLocator(PREVIEW_FRAME).locator("h1")).toHaveText(
    editedName
  )

  await expect(page.locator("[data-save-state]")).toHaveAttribute(
    "data-save-state",
    "saved"
  )
  await expect(page.locator("[data-unpublished]")).toHaveAttribute(
    "data-unpublished",
    "true"
  )

  await page.reload()
  await expect(page.getByLabel("Name")).toHaveValue(editedName)

  const visitorContext = await browser.newContext()
  const visitorPage = await visitorContext.newPage()

  expect(await readPublishedHeroName(visitorPage)).toBe(originalName)

  await publishFromEditor(page)

  expect(await readPublishedHeroName(visitorPage)).toBe(editedName)

  await page.getByLabel("Name").fill(originalName)
  await expect(page.locator("[data-save-state]")).toHaveAttribute(
    "data-save-state",
    "saved"
  )
  await publishFromEditor(page)

  expect(await readPublishedHeroName(visitorPage)).toBe(originalName)

  await visitorContext.close()
})
