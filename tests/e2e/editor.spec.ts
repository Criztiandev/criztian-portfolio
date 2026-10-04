import type { Locator, Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

import { LOGIN_PATH } from "@/data/auth.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { EDITOR_PATH, EDITOR_PREVIEW_PATH } from "@/data/site-content.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"
import { buildDeckShapes } from "@/features/portfolio/projects.rules"

import {
  createTestOwner,
  deleteTestOwner,
  TEST_OWNER_EMAIL,
  TEST_OWNER_PASSWORD,
} from "./owner-account"

const PREVIEW_FRAME = "iframe[title='Site preview']"

const PROJECT_TITLE_LABEL = /^Project \d+ title$/

const EDITED_PROJECT_TITLE_LABEL = "Project 2 title"

const PREVIEW_SCROLL_TIMEOUT_MS = 10_000

const DRAFT_SAVE_PROCEDURE = "siteContent.saveDraft"

const CURSOR_SELECTOR = "[data-cursor-state]"

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

  await waitForRunningPreview(page)
}

async function waitForRunningPreview(page: Page): Promise<void> {
  await page
    .frameLocator(PREVIEW_FRAME)
    .locator("[data-status='running']")
    .waitFor({ timeout: 60_000 })
}

async function fillAndSaveDraft(
  page: Page,
  field: Locator,
  value: string
): Promise<void> {
  const saved = page.waitForResponse(function isDraftSave(response) {
    return response.url().includes(DRAFT_SAVE_PROCEDURE)
  })

  await field.fill(value)

  expect((await saved).ok()).toBe(true)
  await expect(page.locator("[data-save-state]")).toHaveAttribute(
    "data-save-state",
    "saved"
  )
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

async function readVisibleProjectTitles(page: Page): Promise<string[]> {
  const titles: string[] = []

  for (const field of await page.getByLabel(PROJECT_TITLE_LABEL).all()) {
    const title = (await field.inputValue()).trim()

    if (title !== "") {
      titles.push(title)
    }
  }

  return titles
}

async function expectPreviewDeck(page: Page, titles: string[]) {
  const deck = page.frameLocator(PREVIEW_FRAME).locator("#project")
  const captions = deck.locator("[data-caption]")

  await expect(deck).toHaveAttribute(
    "data-dot-shapes",
    buildDeckShapes(titles.length)
  )
  await expect(captions).toHaveCount(titles.length)
  await expect(deck.locator("[data-fit-box]")).toHaveCount(titles.length)
  await expect(deck.locator("[data-fit-box] h3")).toContainText(titles)

  for (let stepIndex = 0; stepIndex < titles.length; stepIndex += 1) {
    await expect(captions.nth(stepIndex)).toHaveAttribute(
      "data-caption",
      formatSceneStepId(PROJECTS_SCENE_ID, stepIndex)
    )
  }
}

async function isTitleShown(title: Locator): Promise<boolean> {
  return title.evaluate(function hitTestTitle(element) {
    const rect = element.getBoundingClientRect()
    const hit = element.ownerDocument.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    )

    return hit !== null && element.contains(hit)
  })
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

test("keeps the adaptive cursor out of the editor and its preview", async ({
  page,
}) => {
  await signInToEditor(page)
  await page.mouse.move(400, 300)

  await expect(page.locator(CURSOR_SELECTOR)).toHaveCount(0)
  await expect(
    page.frameLocator(PREVIEW_FRAME).locator(CURSOR_SELECTOR)
  ).toHaveCount(0)
  await expect(page.locator("html")).not.toHaveAttribute("data-cursor")
})

test("renders the projects deck in the preview", async ({ page }) => {
  test.setTimeout(120_000)

  await signInToEditor(page)

  await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("button", { name: "Projects" })
    .click()

  const originalTitles = await readVisibleProjectTitles(page)

  expect(originalTitles.length).toBeGreaterThan(1)

  await expectPreviewDeck(page, originalTitles)

  const firstCard = page
    .frameLocator(PREVIEW_FRAME)
    .locator("#project [data-fit-box]")
    .first()
  const firstTitle = firstCard.locator("h3")

  await expect
    .poll(
      function readFirstTitleShown() {
        return isTitleShown(firstTitle)
      },
      { timeout: PREVIEW_SCROLL_TIMEOUT_MS }
    )
    .toBe(true)

  const plateBox = await firstCard.locator(":scope > div").first().boundingBox()
  const titleBox = await firstTitle.boundingBox()

  expect(plateBox).not.toBeNull()
  expect(titleBox).not.toBeNull()
  expect((plateBox?.y ?? 0) + (plateBox?.height ?? 0)).toBeLessThanOrEqual(
    titleBox?.y ?? Number.NaN
  )

  const titleField = page.getByLabel(EDITED_PROJECT_TITLE_LABEL, {
    exact: true,
  })
  const originalTitle = await titleField.inputValue()

  expect(originalTitle.trim()).not.toBe("")

  try {
    await fillAndSaveDraft(page, titleField, "")

    const blankedTitles = await readVisibleProjectTitles(page)

    expect(blankedTitles.length).toBe(originalTitles.length - 1)

    await expectPreviewDeck(page, blankedTitles)
  } finally {
    await fillAndSaveDraft(page, titleField, originalTitle)
  }

  await expectPreviewDeck(page, originalTitles)

  await page.reload()
  await waitForRunningPreview(page)

  expect(await readVisibleProjectTitles(page)).toEqual(originalTitles)
  await expectPreviewDeck(page, originalTitles)
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
  await expect(
    page.frameLocator(PREVIEW_FRAME).locator("html")
  ).not.toHaveClass(/\blenis\b/)

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
