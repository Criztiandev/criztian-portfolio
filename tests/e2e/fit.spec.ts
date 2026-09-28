import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

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

const DEEP_LINK_HASHES = ["#about", "#project", "#process", "#contact"]

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

      while (current !== null) {
        if ((current.textContent ?? "").trim() !== "") {
          textNodes.push(current)
        }

        current = walker.nextNode()
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

    while (current !== null) {
      if ((current.textContent ?? "").trim() !== "") {
        const range = document.createRange()

        range.selectNodeContents(current)

        for (const rect of range.getClientRects()) {
          lineNodes.push(current)
          lineRects.push(rect)
        }
      }

      current = walker.nextNode()
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

test.describe("pinned scenes on a small phone", () => {
  test.use({ viewport: { width: 375, height: 548 } })

  test("keeps the services pinned with every step inside its box", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.waitForTimeout(GATE_SETTLE_MS)

    const services = page.locator("#services")

    await expect(services).not.toHaveAttribute("data-fit")
    await expect(services).toHaveAttribute(
      "data-dot-shapes",
      "branding web-design development"
    )
    await expect(services.locator("[data-dot-slot]")).toHaveCount(1)

    expect(await readOverflowingSteps(page, "#services")).toEqual([])

    expect(problems).toEqual([])
  })
})

test.describe("pinned scenes under WCAG text spacing", () => {
  test.use({ viewport: { width: 360, height: 640 } })

  test("fits or flows the services so every line can be read", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")
    await waitForRunningStage(page)
    await waitForFonts(page)
    await page.addStyleTag({ content: TEXT_SPACING_CSS })
    await page.waitForTimeout(GATE_SETTLE_MS)

    const services = page.locator("#services")
    const fit = await services.getAttribute("data-fit")

    if (fit === null) {
      expect(await readOverflowingSteps(page, "#services")).toEqual([])
    } else {
      expect(fit).toBe("flow")
      await expect(services).toHaveAttribute("data-dot-shapes", "dust")
      await expect(services.locator("[data-dot-slot]")).toHaveCount(0)
    }

    expect(await findNeverVisibleLines(page, "#services")).toEqual([])

    expect(problems).toEqual([])
  })
})

test.describe("pinned scenes at 400% zoom", () => {
  test.use({ viewport: { width: 320, height: 256 } })

  test("flows the services without overlapping any text", async ({ page }) => {
    const problems = collectPageProblems(page)

    await page.goto("/")
    await waitForFonts(page)

    const services = page.locator("#services")

    await expect(services).toHaveAttribute("data-fit", "flow", {
      timeout: 10000,
    })
    await expect(services).toHaveAttribute("data-dot-shapes", "dust")
    await expect(services.locator("[data-dot-slot]")).toHaveCount(0)

    expect(await findOverlappingLines(page, "#services")).toEqual([])
    expect(await findNeverVisibleLines(page, "#services")).toEqual([])

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
