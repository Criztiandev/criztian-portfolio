import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const GL_PROBLEM_PATTERN = /INVALID_|GL_INVALID|WebGL: /

const SCENE_WALK = [
  { selector: "#quote", scene: "cube" },
  { selector: "#services", scene: "services" },
  { selector: "#about", scene: "about" },
  { selector: "#project", scene: "project" },
  { selector: "#process", scene: "process" },
  { selector: "[data-dot-scene='dust']", scene: "dust" },
  { selector: "[data-dot-scene='footer']", scene: "footer" },
]

const JUMP_SKIPPED_SCENES = ["cube", "services", "about", "project", "process"]

const HEADER_LINE_PX = 72

function readLocationHash() {
  return window.location.hash
}

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

async function scrollSceneToPinStart(page: Page, selector: string) {
  await page.evaluate(function scrollToScene(sceneSelector) {
    document
      .querySelector(sceneSelector)
      ?.scrollIntoView({ block: "start", behavior: "instant" })
  }, selector)
}

async function countLitPixels(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox()

  if (box === null) {
    return 0
  }

  const image = await page.screenshot({ clip: box })

  return page.evaluate(
    async function countLit(source) {
      const picture = new Image()

      await new Promise(function waitForImage(resolve) {
        picture.onload = resolve
        picture.src = source
      })

      const canvas = document.createElement("canvas")

      canvas.width = picture.width
      canvas.height = picture.height

      const context = canvas.getContext("2d", { willReadFrequently: true })

      if (context === null) {
        return 0
      }

      context.drawImage(picture, 0, 0)

      const pixels = context.getImageData(0, 0, picture.width, picture.height)
      let lit = 0

      for (let index = 0; index < pixels.data.length; index += 4) {
        if ((pixels.data[index] ?? 0) > 128) {
          lit += 1
        }
      }

      return lit
    },
    "data:image/png;base64," + image.toString("base64")
  )
}

async function scrollToTop(page: Page) {
  await page.evaluate(function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "instant" })
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
    const problems = collectPageProblems(page)

    await page.goto("/")

    await waitForRunningStage(page)

    const canvas = page.locator("canvas")
    const pointCount = Number(await canvas.getAttribute("data-point-count"))

    expect(pointCount).toBeGreaterThan(500)

    const box = await canvas.boundingBox()

    expect(box?.width ?? 0).toBeGreaterThan(0)
    expect(box?.height ?? 0).toBeGreaterThan(0)

    expect(problems).toEqual([])
  })

  test("keeps the contact anchor reachable", async ({ page }) => {
    await page.goto("/#contact")

    await expect(page.locator("#contact")).toBeVisible()

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "dust", {
      timeout: 10000,
    })
  })
})

test.describe("scroll timeline", () => {
  test("re-forms the name as a cube above the quote and back", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "name")

    await scrollSceneToPinStart(page, "#quote")

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 5000,
    })

    const quote = page.locator("#quote blockquote p")

    await expect(quote).toBeVisible()
    await expect(quote).not.toHaveText("")
    await expect(quote).toHaveCSS("clip-path", "inset(0%)", { timeout: 5000 })
    await expect(page.locator("canvas")).toHaveCSS("opacity", "1")
    await page.waitForTimeout(600)

    expect(
      await countLitPixels(page, "#quote [data-dot-slot]")
    ).toBeGreaterThan(500)
    await expect(page.locator("canvas")).toHaveCount(1)

    await scrollToTop(page)

    await expect(stage).toHaveAttribute("data-scene", "name", {
      timeout: 5000,
    })

    expect(problems).toEqual([])
  })

  test("walks every scene down the page and back", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    for (const step of SCENE_WALK) {
      await scrollSceneToPinStart(page, step.selector)

      await expect(stage).toHaveAttribute("data-scene", step.scene, {
        timeout: 5000,
      })
    }

    await scrollToTop(page)

    await expect(stage).toHaveAttribute("data-scene", "name", {
      timeout: 5000,
    })
    await expect(page.locator("canvas")).toHaveCount(1)

    expect(problems).toEqual([])
  })

  test("jumps straight to the destination scene from the nav", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")
    await waitForRunningStage(page)

    const jump = await page.evaluate(function followJump() {
      return new Promise<{ scenes: string[]; endedByLenis: boolean }>(
        function record(resolve) {
          const stage = document.querySelector("[data-status]")
          const scenes: string[] = []
          let endedByLenis = false
          const observer = new MutationObserver(function onSceneChange() {
            scenes.push(stage?.getAttribute("data-scene") ?? "")
          })

          function finish() {
            observer.disconnect()
            window.removeEventListener("scrollend", onScrollEnd)
            resolve({ scenes, endedByLenis })
          }

          function onScrollEnd(event: Event) {
            if (event instanceof CustomEvent && event.detail?.lenisScrollEnd) {
              endedByLenis = true
              finish()
            }
          }

          window.addEventListener("scrollend", onScrollEnd)
          window.setTimeout(finish, 5000)

          if (stage !== null) {
            observer.observe(stage, {
              attributes: true,
              attributeFilter: ["data-scene"],
            })
          }

          document
            .querySelector<HTMLAnchorElement>("header a[href='#contact']")
            ?.click()
        }
      )
    })
    const trail = jump.scenes

    expect(jump.endedByLenis).toBe(true)
    expect(trail).toContain("dust")

    for (const skipped of JUMP_SKIPPED_SCENES) {
      expect(trail).not.toContain(skipped)
    }

    const firstDust = trail.indexOf("dust")

    for (const scene of trail.slice(firstDust)) {
      expect(scene).toBe("dust")
    }

    const contactTop = await page.evaluate(function readContactTop() {
      return document.querySelector("#contact")?.getBoundingClientRect().top
    })

    expect(Math.abs((contactTop ?? 0) - HEADER_LINE_PX)).toBeLessThanOrEqual(1)
    expect(await page.evaluate(readLocationHash)).toBe("#contact")
    expect(problems).toEqual([])
  })

  test("lands on the cube when opened at the quote", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 10000,
    })
    await expect(page.locator("#quote blockquote")).toBeVisible()

    expect(problems).toEqual([])
  })

  test("lands on the projects scene when opened at the projects", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#project")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "project", {
      timeout: 10000,
    })
    await expect(page.locator("#project h2")).toBeVisible()

    expect(problems).toEqual([])
  })

  test("scatters the formed cube under the pointer without errors", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 10000,
    })

    const slot = await page.locator("#quote [data-dot-slot]").boundingBox()

    expect(slot).not.toBeNull()

    if (slot !== null) {
      const sweepY = slot.y + slot.height * 0.3

      await page.mouse.move(slot.x, sweepY)
      await page.mouse.move(slot.x + slot.width, sweepY, { steps: 20 })
      await page.waitForTimeout(500)
    }

    await expect(stage).toHaveAttribute("data-scene", "cube")
    await expect(stage).toHaveAttribute("data-status", "running")

    expect(problems).toEqual([])
  })

  test("rebuilds cleanly when the viewport narrows", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await page.setViewportSize({ width: 820, height: 900 })
    await page.waitForTimeout(600)
    await scrollSceneToPinStart(page, "#quote")

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 5000,
    })
    await expect(stage).toHaveAttribute("data-status", "running")

    expect(problems).toEqual([])
  })
})

test.describe("scroll timeline with reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("shows the settled cube and the quote without animating", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#quote")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 10000,
    })
    await expect(page.locator("#quote blockquote p")).toHaveCSS(
      "clip-path",
      "inset(0%)"
    )

    expect(problems).toEqual([])
  })

  test("draws no shape between two scenes", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await page.evaluate(function scrollBetweenHeroAndQuote() {
      const quote = document.querySelector<HTMLElement>("#quote")

      if (quote !== null) {
        window.scrollTo({ top: quote.offsetTop * 0.6, behavior: "instant" })
      }
    })

    await expect(stage).toHaveAttribute("data-scene", "moving", {
      timeout: 5000,
    })

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

    await waitForRunningStage(page)

    const canvas = page.locator("canvas")
    const pointCount = Number(await canvas.getAttribute("data-point-count"))

    expect(pointCount).toBeGreaterThan(500)
  })

  test("re-forms the cube on a narrow touch viewport", async ({ page }) => {
    await page.goto("/")

    const stage = await waitForRunningStage(page)

    await scrollSceneToPinStart(page, "#quote")

    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: 5000,
    })
  })

  test("reaches the projects scene on a narrow touch viewport", async ({
    page,
  }) => {
    await page.goto("/#project")

    const stage = await waitForRunningStage(page)

    await expect(stage).toHaveAttribute("data-scene", "project", {
      timeout: 10000,
    })
  })

  test("leaves touch scrolling native with no smooth scroller", async ({
    page,
  }) => {
    await page.goto("/")
    await waitForRunningStage(page)
    await page.waitForTimeout(1000)

    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/)
  })
})
