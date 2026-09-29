import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import {
  PROCESS_SCENE_SHAPES,
  SERVICES_SCENE_SHAPES,
} from "@/data/page-sections.data"

const GL_PROBLEM_PATTERN = /INVALID_|GL_INVALID|WebGL: /

const TEXT_SPACING_CSS = `
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

p {
  margin-bottom: 2em !important;
}
`

const SCAN_STEP_PX = 4

const FIT_TOLERANCE_PX = 1

const GATE_SETTLE_MS = 500

const HEADER_LINE_PX = 72

const DEEP_LINK_TOLERANCE_PX = 2

const SCROLL_REST_FRAMES = 20

const STEP_SCENES = [
  { id: "services", shapes: SERVICES_SCENE_SHAPES },
  { id: "process", shapes: PROCESS_SCENE_SHAPES },
]

const SINGLE_FRAME_SCENES = ["#about", "#testimonials"]

const SINGLE_FRAME_VIEWPORTS = [
  { width: 375, height: 548, hasTextSpacing: false },
  { width: 360, height: 560, hasTextSpacing: false },
  { width: 390, height: 664, hasTextSpacing: false },
  { width: 740, height: 304, hasTextSpacing: false },
  { width: 740, height: 280, hasTextSpacing: false },
  { width: 667, height: 320, hasTextSpacing: false },
  { width: 320, height: 256, hasTextSpacing: false },
  { width: 360, height: 640, hasTextSpacing: true },
  { width: 740, height: 360, hasTextSpacing: true },
  { width: 1440, height: 900, hasTextSpacing: true },
]

const STATEMENT_SELECTORS = [
  "#quote blockquote p",
  "#project h3",
  "#services h3",
  "#about p[class*='cqi']",
  "#testimonials blockquote p",
  "#faq p[class*='cqi']",
  "#contact p[class*='cqi']",
]

const STATEMENT_VIEWPORTS = [
  { width: 375, height: 548 },
  { width: 360, height: 560 },
  { width: 390, height: 664 },
  { width: 360, height: 640 },
  { width: 320, height: 256 },
  { width: 740, height: 360 },
  { width: 740, height: 304 },
  { width: 740, height: 280 },
  { width: 667, height: 320 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]

const CONTACT_VIEWPORTS = [
  { width: 1440, height: 900, isPinned: true, hasTextSpacing: false },
  { width: 1024, height: 768, isPinned: true, hasTextSpacing: false },
  { width: 390, height: 844, isPinned: true, hasTextSpacing: false },
  { width: 375, height: 548, isPinned: false, hasTextSpacing: false },
  { width: 740, height: 360, isPinned: false, hasTextSpacing: false },
  { width: 320, height: 256, isPinned: false, hasTextSpacing: false },
  { width: 1440, height: 900, isPinned: null, hasTextSpacing: true },
]

const CONTACT_SELECTOR = "#contact"

const PIN_SCROLL_PX = 250

const FOCUS_SHIFT_TOLERANCE_PX = 24

const FIXED_FORM = {
  name: "Suite Reader",
  email: "suite.reader@example.com",
  service: "branding",
  message: "Checking the form pins again once it fits.",
}

const DEEP_LINK_HASHES = [
  "#project",
  "#process",
  "#about",
  "#testimonials",
  "#contact",
]

const DEEP_LINK_VIEWPORTS = [
  { width: 320, height: 256, isServicesFlowing: true },
  { width: 375, height: 548, isServicesFlowing: false },
  { width: 1440, height: 900, isServicesFlowing: false },
]

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

async function waitForFonts(page: Page) {
  await page.evaluate(function waitForDocumentFonts() {
    return document.fonts.ready.then(function settle() {
      return true
    })
  })
}

async function waitForScrollRest(page: Page) {
  await page.evaluate(function waitForRestingScroll(restFrames) {
    return new Promise<void>(function watchScroll(resolve) {
      let lastScrollY = window.scrollY
      let stillFrames = 0

      function sampleScroll() {
        if (window.scrollY === lastScrollY) {
          stillFrames += 1
        } else {
          stillFrames = 0
          lastScrollY = window.scrollY
        }

        if (stillFrames >= restFrames) {
          resolve()
          return
        }

        window.requestAnimationFrame(sampleScroll)
      }

      window.requestAnimationFrame(sampleScroll)
    })
  }, SCROLL_REST_FRAMES)
}

async function readOverflowingSteps(page: Page, selector: string) {
  return page.evaluate(
    function findOverflowingSteps(input) {
      const overflowing: string[] = []
      const boxes = document.querySelectorAll<HTMLElement>(
        input.selector + " [data-fit-box]"
      )

      for (const box of boxes) {
        if (box.scrollHeight > box.clientHeight + input.tolerance) {
          overflowing.push(box.querySelector("h3")?.textContent ?? "")
        }
      }

      return overflowing
    },
    { selector, tolerance: FIT_TOLERANCE_PX }
  )
}

async function findNeverVisibleLines(page: Page, selector: string) {
  return page.evaluate(
    function scanTextLines(input) {
      const section = document.querySelector<HTMLElement>(input.selector)

      if (section === null) {
        return ["missing " + input.selector]
      }

      const textNodes: Node[] = []
      const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT)
      let current = walker.nextNode()

      function isVisuallyHidden(node: Node): boolean {
        let element = node.parentElement

        while (element !== null) {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          const isClippedBox =
            style.display !== "contents" &&
            style.overflow === "hidden" &&
            rect.width <= 1 &&
            rect.height <= 1

          if (isClippedBox) {
            return true
          }

          element = element.parentElement
        }

        return false
      }

      while (current !== null) {
        if (
          (current.textContent ?? "").trim() !== "" &&
          !isVisuallyHidden(current)
        ) {
          textNodes.push(current)
        }

        current = walker.nextNode()
      }

      if (textNodes.length === 0) {
        return ["no text scanned in " + input.selector]
      }

      const seen = new Map<string, boolean>()
      const sectionRect = section.getBoundingClientRect()
      const firstPosition = Math.max(
        0,
        sectionRect.top + window.scrollY - window.innerHeight
      )
      const lastPosition = sectionRect.bottom + window.scrollY

      for (
        let position = firstPosition;
        position <= lastPosition;
        position += input.step
      ) {
        window.scrollTo({ top: position, behavior: "instant" })

        for (const textNode of textNodes) {
          const parent = textNode.parentElement
          const range = document.createRange()
          let lineIndex = 0

          range.selectNodeContents(textNode)

          for (const lineRect of range.getClientRects()) {
            const key = (textNode.textContent ?? "").trim() + " #" + lineIndex
            const probeX = lineRect.left + Math.min(lineRect.width / 2, 6)
            const probeY = lineRect.top + lineRect.height / 2
            const isInViewport =
              probeX >= 0 &&
              probeX < window.innerWidth &&
              probeY >= 0 &&
              probeY < window.innerHeight

            lineIndex += 1

            if (!seen.has(key)) {
              seen.set(key, false)
            }

            if (seen.get(key) === true || !isInViewport || parent === null) {
              continue
            }

            const hit = document.elementFromPoint(probeX, probeY)

            if (hit !== null && parent.contains(hit)) {
              seen.set(key, true)
            }
          }
        }
      }

      const neverVisible: string[] = []

      for (const [key, isSeen] of seen) {
        if (!isSeen) {
          neverVisible.push(key)
        }
      }

      return neverVisible
    },
    { selector, step: SCAN_STEP_PX }
  )
}

async function readFrameClipping(page: Page, selector: string) {
  return page.evaluate(function measureFrame(sceneSelector) {
    const frame = document.querySelector(sceneSelector)?.firstElementChild

    if (frame === null || frame === undefined) {
      return Number.NaN
    }

    return frame.scrollHeight - frame.clientHeight
  }, selector)
}

async function findStatementOverflows(page: Page) {
  return page.evaluate(function measureWidestWords(selectors) {
    const overflows: string[] = []
    const probe = document.createElement("span")

    probe.style.position = "absolute"
    probe.style.visibility = "hidden"
    probe.style.whiteSpace = "nowrap"
    document.body.appendChild(probe)

    for (const selector of selectors) {
      for (const statement of document.querySelectorAll<HTMLElement>(
        selector
      )) {
        const style = getComputedStyle(statement)

        probe.style.font = style.font
        probe.style.letterSpacing = style.letterSpacing
        probe.style.textTransform = style.textTransform

        const text = (statement.textContent ?? "").trim()

        for (const word of text.split(/\s+/)) {
          probe.textContent = word

          const overflow =
            probe.getBoundingClientRect().width - statement.clientWidth

          if (overflow > 0) {
            overflows.push(selector + " " + word + " +" + Math.ceil(overflow))
          }
        }
      }
    }

    probe.remove()

    return overflows
  }, STATEMENT_SELECTORS)
}

async function readTargetTop(page: Page, hash: string) {
  return page.evaluate(function measureTargetTop(targetHash) {
    const target = document.querySelector(targetHash)

    if (target === null) {
      return Number.NaN
    }

    return target.getBoundingClientRect().top
  }, hash)
}

async function findOverlappingLines(page: Page, selector: string) {
  return page.evaluate(function compareTextLines(sectionSelector) {
    const section = document.querySelector<HTMLElement>(sectionSelector)

    if (section === null) {
      return ["missing " + sectionSelector]
    }

    const lineNodes: Node[] = []
    const lineRects: DOMRect[] = []
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT)
    let current = walker.nextNode()

    function isVisuallyHidden(node: Node): boolean {
      let element = node.parentElement

      while (element !== null) {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        const isClippedBox =
          style.display !== "contents" &&
          style.overflow === "hidden" &&
          rect.width <= 1 &&
          rect.height <= 1

        if (isClippedBox) {
          return true
        }

        element = element.parentElement
      }

      return false
    }

    while (current !== null) {
      if (
        (current.textContent ?? "").trim() !== "" &&
        !isVisuallyHidden(current)
      ) {
        const range = document.createRange()

        range.selectNodeContents(current)

        for (const rect of range.getClientRects()) {
          lineNodes.push(current)
          lineRects.push(rect)
        }
      }

      current = walker.nextNode()
    }

    if (lineRects.length === 0) {
      return ["no text lines in " + sectionSelector]
    }

    const overlaps: string[] = []

    for (let first = 0; first < lineRects.length; first += 1) {
      for (let second = first + 1; second < lineRects.length; second += 1) {
        const leftNode = lineNodes[first]
        const rightNode = lineNodes[second]
        const leftRect = lineRects[first]
        const rightRect = lineRects[second]

        if (leftRect === undefined || rightRect === undefined) {
          continue
        }

        if (leftNode === rightNode) {
          continue
        }

        const overlapWidth =
          Math.min(leftRect.right, rightRect.right) -
          Math.max(leftRect.left, rightRect.left)
        const overlapHeight =
          Math.min(leftRect.bottom, rightRect.bottom) -
          Math.max(leftRect.top, rightRect.top)

        if (overlapWidth > 1 && overlapHeight > 1) {
          overlaps.push(
            (leftNode?.textContent ?? "") +
              " / " +
              (rightNode?.textContent ?? "")
          )
        }
      }
    }

    return overlaps
  }, selector)
}

for (const scene of STEP_SCENES) {
  const selector = `#${scene.id}`

  test.describe(`${scene.id} on a small phone`, () => {
    test.use({ viewport: { width: 375, height: 548 } })

    test("keeps the scene pinned with every step inside its box", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await page.goto("/")
      await waitForRunningStage(page)
      await waitForFonts(page)
      await page.waitForTimeout(GATE_SETTLE_MS)

      const section = page.locator(selector)

      await expect(section).not.toHaveAttribute("data-fit")
      await expect(section).toHaveAttribute("data-dot-shapes", scene.shapes)
      await expect(section.locator("[data-dot-slot]")).toHaveCount(1)

      expect(await readOverflowingSteps(page, selector)).toEqual([])

      expect(problems).toEqual([])
    })
  })

  test.describe(`${scene.id} under WCAG text spacing`, () => {
    test.use({ viewport: { width: 360, height: 640 }, reducedMotion: "reduce" })

    test("fits or flows the scene so every line can be read", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await page.goto("/")
      await waitForRunningStage(page)
      await waitForFonts(page)
      await page.addStyleTag({ content: TEXT_SPACING_CSS })
      await page.waitForTimeout(GATE_SETTLE_MS)

      const section = page.locator(selector)
      const fit = await section.getAttribute("data-fit")

      if (fit === null) {
        expect(await readOverflowingSteps(page, selector)).toEqual([])
      } else {
        expect(fit).toBe("flow")
        await expect(section).toHaveAttribute("data-dot-shapes", "dust")
        await expect(section.locator("[data-dot-slot]")).toHaveCount(0)
      }

      expect(await findNeverVisibleLines(page, selector)).toEqual([])

      expect(problems).toEqual([])
    })
  })

  test.describe(`${scene.id} at 400% zoom`, () => {
    test.use({ viewport: { width: 320, height: 256 }, reducedMotion: "reduce" })

    test("flows the scene without overlapping any text", async ({ page }) => {
      const problems = collectPageProblems(page)

      await page.goto("/")
      await waitForFonts(page)

      const section = page.locator(selector)

      await expect(section).toHaveAttribute("data-fit", "flow", {
        timeout: 10000,
      })
      await expect(section).toHaveAttribute("data-dot-shapes", "dust")
      await expect(section.locator("[data-dot-slot]")).toHaveCount(0)

      expect(await findOverlappingLines(page, selector)).toEqual([])
      expect(await findNeverVisibleLines(page, selector)).toEqual([])

      expect(problems).toEqual([])
    })
  })
}

for (const viewport of STATEMENT_VIEWPORTS) {
  test.describe(`statements at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test("fit the widest word of every statement in its column", async ({
      page,
    }) => {
      await page.goto("/")
      await waitForRunningStage(page)
      await waitForFonts(page)

      expect(await findStatementOverflows(page)).toEqual([])
    })
  })
}

for (const selector of SINGLE_FRAME_SCENES) {
  for (const viewport of SINGLE_FRAME_VIEWPORTS) {
    const spacing = viewport.hasTextSpacing ? " with text spacing" : ""

    test.describe(`${selector} at ${viewport.width}x${viewport.height}${spacing}`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
      })

      test("grows its pinned frame so every line can be read", async ({
        page,
      }) => {
        const problems = collectPageProblems(page)

        await page.goto("/")
        await waitForRunningStage(page)
        await waitForFonts(page)

        if (viewport.hasTextSpacing) {
          await page.addStyleTag({ content: TEXT_SPACING_CSS })
          await page.waitForTimeout(GATE_SETTLE_MS)
        }

        const section = page.locator(selector)

        await expect(section.locator("[data-dot-slot]")).toHaveCount(1)
        expect(await readFrameClipping(page, selector)).toBeLessThanOrEqual(
          FIT_TOLERANCE_PX
        )
        expect(await findOverlappingLines(page, selector)).toEqual([])
        expect(await findNeverVisibleLines(page, selector)).toEqual([])

        expect(problems).toEqual([])
      })
    })
  }
}

async function expectContactFit(page: Page, isPinned: boolean | null) {
  const section = page.locator(CONTACT_SELECTOR)

  if (isPinned === true) {
    await expect(section).not.toHaveAttribute("data-fit")
  }

  if (isPinned === false) {
    await expect(section).toHaveAttribute("data-fit", "flow", {
      timeout: 10000,
    })
  }

  const fit = await section.getAttribute("data-fit")

  if (fit === null) {
    await expect(section).toHaveAttribute("data-dot-shapes", "gather")
    await expect(section.locator("[data-dot-slot]")).toHaveCount(1)
    expect(await readFrameClipping(page, CONTACT_SELECTOR)).toBeLessThanOrEqual(
      FIT_TOLERANCE_PX
    )
  } else {
    expect(fit).toBe("flow")
    await expect(section).toHaveAttribute("data-dot-shapes", "dust")
    await expect(section.locator("[data-dot-slot]")).toHaveCount(0)
  }

  expect(await findOverlappingLines(page, CONTACT_SELECTOR)).toEqual([])
  expect(await findNeverVisibleLines(page, CONTACT_SELECTOR)).toEqual([])
}

for (const viewport of CONTACT_VIEWPORTS) {
  const spacing = viewport.hasTextSpacing ? " with text spacing" : ""

  test.describe(`#contact at ${viewport.width}x${viewport.height}${spacing}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
    })

    test("pins the gather where the form fits and flows it where it cannot", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await page.goto("/")
      await waitForRunningStage(page)
      await waitForFonts(page)

      if (viewport.hasTextSpacing) {
        await page.addStyleTag({ content: TEXT_SPACING_CSS })
      }

      await page.waitForTimeout(GATE_SETTLE_MS)
      await expectContactFit(page, viewport.isPinned)

      expect(problems).toEqual([])
    })
  })
}

test.describe("#contact when its form box outgrows the frame", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })

  test("flows the scene as soon as the form box grows past the frame", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#contact")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.waitForTimeout(GATE_SETTLE_MS)

    const section = page.locator(CONTACT_SELECTOR)

    await expect(section).not.toHaveAttribute("data-fit")

    await page.evaluate(function growFormBox(selector) {
      const form = document.querySelector(selector + " form")
      const filler = document.createElement("div")

      filler.style.height = "40rem"
      form?.appendChild(filler)
    }, CONTACT_SELECTOR)

    await expect(section).toHaveAttribute("data-fit", "flow", {
      timeout: 5000,
    })
    await expect(section.locator("[data-dot-slot]")).toHaveCount(0)

    expect(problems).toEqual([])
  })
})

test.describe("#contact when errors flow it on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" })

  test("keeps the focused field where it was when the form flows", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#contact")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.waitForTimeout(GATE_SETTLE_MS)
    await page.evaluate(function scrollIntoPin(offset) {
      window.scrollBy({ top: offset, behavior: "instant" })
    }, PIN_SCROLL_PX)
    await page.waitForTimeout(GATE_SETTLE_MS)

    const section = page.locator(CONTACT_SELECTOR)
    const nameField = page.locator("#contact-name")
    const pinnedTop = (await nameField.boundingBox())?.y ?? Number.NaN

    await expect(section).not.toHaveAttribute("data-fit")
    await page.locator(`${CONTACT_SELECTOR} button[type=submit]`).click()
    await expect(section).toHaveAttribute("data-fit", "flow", {
      timeout: 5000,
    })
    await expect(nameField).toBeFocused()
    await page.waitForTimeout(GATE_SETTLE_MS)

    const flowedBox = await nameField.boundingBox()
    const flowedTop = flowedBox?.y ?? Number.NaN
    const flowedBottom = flowedTop + (flowedBox?.height ?? 0)

    expect(Math.abs(flowedTop - pinnedTop)).toBeLessThanOrEqual(
      FOCUS_SHIFT_TOLERANCE_PX
    )
    expect(flowedTop).toBeGreaterThanOrEqual(HEADER_LINE_PX)
    expect(flowedBottom).toBeLessThanOrEqual(page.viewportSize()?.height ?? 0)

    expect(problems).toEqual([])
  })
})

test.describe("#contact when fixed errors pin it again on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" })

  test("keeps the field being typed in on screen as the form pins again", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#contact")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.waitForTimeout(GATE_SETTLE_MS)
    await page.evaluate(function scrollIntoPin(offset) {
      window.scrollBy({ top: offset, behavior: "instant" })
    }, PIN_SCROLL_PX)
    await page.waitForTimeout(GATE_SETTLE_MS)

    const section = page.locator(CONTACT_SELECTOR)

    await page.locator(`${CONTACT_SELECTOR} button[type=submit]`).click()
    await expect(section).toHaveAttribute("data-fit", "flow", {
      timeout: 5000,
    })

    await page.locator("#contact-name").fill(FIXED_FORM.name)
    await page.locator("#contact-email").fill(FIXED_FORM.email)
    await page.locator("#contact-service").selectOption(FIXED_FORM.service)
    await page.locator("#contact-message").fill(FIXED_FORM.message)
    await expect(section).not.toHaveAttribute("data-fit", { timeout: 5000 })
    await page.waitForTimeout(GATE_SETTLE_MS)

    const message = page.locator("#contact-message")
    const box = await message.boundingBox()
    const viewportHeight = page.viewportSize()?.height ?? 0

    await expect(message).toBeFocused()
    expect(box?.y ?? Number.NaN).toBeGreaterThanOrEqual(HEADER_LINE_PX)
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
      viewportHeight
    )

    expect(problems).toEqual([])
  })
})

test.describe("Work on a phone in forced colours", () => {
  test.use({ viewport: { width: 390, height: 844 }, forcedColors: "active" })

  test("keeps each project screen opaque so the frame never crosses copy", async ({
    page,
  }) => {
    await page.goto("/#project")
    await waitForRunningStage(page)

    const backgrounds = await page.evaluate(function readScreenBackgrounds() {
      const found: string[] = []

      for (const article of document.querySelectorAll("#project article")) {
        found.push(getComputedStyle(article).backgroundColor)
      }

      return found
    })

    expect(backgrounds.length).toBeGreaterThan(0)

    for (const background of backgrounds) {
      expect(background).not.toMatch(/rgba(.*, 0)$|transparent/)
    }
  })
})

test.describe("#contact with every error showing at 1024x768", () => {
  test.use({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" })

  test("keeps every line readable, pinned or flowed", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/#contact")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.locator(`${CONTACT_SELECTOR} button[type=submit]`).click()
    await expect(
      page.locator(`${CONTACT_SELECTOR} [role=alert]`)
    ).not.toHaveCount(0)
    await page.waitForTimeout(GATE_SETTLE_MS)
    await expectContactFit(page, null)

    expect(problems).toEqual([])
  })
})

for (const viewport of DEEP_LINK_VIEWPORTS) {
  test.describe(`deep links at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const hash of DEEP_LINK_HASHES) {
      test(`lands ${hash} at the header line once the gate settles`, async ({
        page,
      }) => {
        const problems = collectPageProblems(page)

        await page.goto(`/${hash}`)
        await waitForRunningStage(page)
        await waitForFonts(page)

        const services = page.locator("#services")

        if (viewport.isServicesFlowing) {
          await expect(services).toHaveAttribute("data-fit", "flow", {
            timeout: 10000,
          })
        } else {
          await expect(services).not.toHaveAttribute("data-fit")
        }

        await page.waitForTimeout(GATE_SETTLE_MS)
        await waitForScrollRest(page)

        const top = await readTargetTop(page, hash)

        expect(
          Math.abs(top - HEADER_LINE_PX),
          `${hash} top ${top}`
        ).toBeLessThanOrEqual(DEEP_LINK_TOLERANCE_PX)

        expect(problems).toEqual([])
      })
    }
  })
}
