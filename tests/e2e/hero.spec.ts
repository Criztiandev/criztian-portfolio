import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const GL_PROBLEM_PATTERN = /INVALID_|GL_INVALID|WebGL: /

function collectPageProblems(page: Page): string[] {
  const problems: string[] = []

  page.on("pageerror", function onPageError(error) {
    problems.push(error.message)
  })

  page.on("console", function onConsole(message) {
    const isError = message.type() === "error"
    const isGlProblem = GL_PROBLEM_PATTERN.test(message.text())

    if (isError || isGlProblem) {
      problems.push(message.text())
    }
  })

  return problems
}

async function waitForRunningStage(page: Page) {
  const stage = page.locator("[data-status]").first()

  await expect(stage).toHaveAttribute("data-status", "running", {
    timeout: 15000,
  })

  return stage
}

async function scrollQuoteIntoView(page: Page) {
  await page.evaluate(function centreQuote() {
    document
      .querySelector("#quote blockquote")
      ?.scrollIntoView({ block: "center", behavior: "instant" })
  })
}

test.describe("hero dot field", () => {
  test("renders the name as an accessible heading exactly once", async ({
    page,
  }) => {
    await page.goto("/")

    const heading = page.getByRole("heading", { level: 1, name: "Criztian" })

    await expect(heading).toHaveCount(1)
    await expect(page.locator("h1")).toHaveCount(1)
  })

  test("starts the webgl field and samples the display font", async ({
    page,
  }) => {
    const consoleErrors: string[] = []

    page.on("pageerror", function onPageError(error) {
      consoleErrors.push(error.message)
    })

    page.on("console", function onConsole(message) {
      if (message.type() === "error") {
        consoleErrors.push(message.text())
      }
    })

    await page.goto("/")

    const stage = page.locator("[data-status]").first()

    await expect(stage).toHaveAttribute("data-status", "running", {
      timeout: 15000,
    })

    const canvas = page.locator("canvas")
    const pointCount = Number(await canvas.getAttribute("data-point-count"))

    expect(pointCount).toBeGreaterThan(500)

    const box = await canvas.boundingBox()

    expect(box?.width ?? 0).toBeGreaterThan(0)
    expect(box?.height ?? 0).toBeGreaterThan(0)

    expect(consoleErrors).toEqual([])
  })

  test("keeps the contact anchor reachable", async ({ page }) => {
    await page.goto("/#contact")

    await expect(page.locator("#contact")).toBeVisible()
  })
})

test.describe("scroll morph", () => {
  test("re-forms the name as a cube above the quote and back", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-morph", "name")

    await scrollQuoteIntoView(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 5000,
    })

    const quote = page.locator("#quote blockquote p")

    await expect(quote).toBeVisible()
    await expect(quote).not.toHaveText("")
    await expect(quote).toHaveCSS("clip-path", "inset(0%)", { timeout: 5000 })
    await expect(page.locator("canvas")).toHaveCount(1)

    await page.evaluate(function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "instant" })
    })

    await expect(stage).toHaveAttribute("data-morph", "name", {
      timeout: 5000,
    })

    expect(problems).toEqual([])
  })

  test("lands on the cube when opened at the quote", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 10000,
    })
    await expect(page.locator("#quote blockquote")).toBeVisible()

    expect(problems).toEqual([])
  })

  test("scatters the formed cube under the pointer without errors", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 10000,
    })

    const slot = await page.locator("#quote > div").first().boundingBox()

    expect(slot).not.toBeNull()

    if (slot !== null) {
      const sweepY = slot.y + slot.height * 0.3

      await page.mouse.move(slot.x, sweepY)
      await page.mouse.move(slot.x + slot.width, sweepY, { steps: 20 })
      await page.waitForTimeout(500)
    }

    await expect(stage).toHaveAttribute("data-morph", "cube")
    await expect(stage).toHaveAttribute("data-status", "running")

    expect(problems).toEqual([])
  })

  test("rebuilds cleanly when the viewport narrows", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await page.setViewportSize({ width: 820, height: 900 })
    await page.waitForTimeout(600)
    await scrollQuoteIntoView(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 5000,
    })
    await expect(stage).toHaveAttribute("data-status", "running")

    expect(problems).toEqual([])
  })
})

test.describe("scroll morph with reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("shows the settled cube and the quote without animating", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 10000,
    })
    await expect(page.locator("#quote blockquote p")).toHaveCSS(
      "clip-path",
      "inset(0%)"
    )

    expect(problems).toEqual([])
  })
})

test.describe("hero dot field on a phone", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })

  test("runs the webgl field on a narrow touch viewport", async ({ page }) => {
    await page.goto("/")

    const stage = page.locator("[data-status]").first()

    await expect(stage).toHaveAttribute("data-status", "running", {
      timeout: 15000,
    })

    const canvas = page.locator("canvas")
    const pointCount = Number(await canvas.getAttribute("data-point-count"))

    expect(pointCount).toBeGreaterThan(500)
  })

  test("re-forms the cube on a narrow touch viewport", async ({ page }) => {
    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await scrollQuoteIntoView(page)

    await expect(stage).toHaveAttribute("data-morph", "cube", {
      timeout: 5000,
    })
  })
})
