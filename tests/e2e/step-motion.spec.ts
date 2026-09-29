import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { DOT_FIELD_MORPH_TUNING, DOT_SCENE_MOTION } from "@/data/hero.data"
import {
  PROCESS_SCENE_SHAPES,
  SERVICES_SCENE_SHAPES,
} from "@/data/page-sections.data"

const STAGED_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 664 },
  { width: 375, height: 548 },
]

const SCENE_TIMEOUT_MS = 5000

const LAST_STEP_INSET = 0.05

const ORBIT_TOLERANCE_PX = 3

const NUMERAL_INK_OFFSET_EM = 0.078

const RING_INSET_PX = 6

const SERVICES_SHARE =
  DOT_SCENE_MOTION.services?.share ?? DOT_FIELD_MORPH_TUNING.stepMorphShare

const FIRST_THREAD_START = 0.5 - SERVICES_SHARE / 2

const NUDGE_SHARE = DOT_FIELD_MORPH_TUNING.threadTrigger / 2

const PAST_TRIGGER_SHARE = DOT_FIELD_MORPH_TUNING.threadTrigger * 2

const FLING_FRAMES = 70

const FLING_DELTA = 70

const SCENES = [
  { id: "services", shapes: SERVICES_SCENE_SHAPES.split(" ") },
  { id: "process", shapes: PROCESS_SCENE_SHAPES.split(" ") },
]

function collectPageProblems(page: Page): string[] {
  const problems: string[] = []

  page.on("pageerror", function onPageError(error) {
    problems.push(error.message)
  })

  page.on("console", function onConsole(message) {
    if (message.type() === "error") {
      problems.push(message.text())
    }
  })

  return problems
}

async function openRunningPage(page: Page) {
  await page.goto("/")
  await expect(page.locator("[data-status]")).toHaveAttribute(
    "data-status",
    "running",
    { timeout: 15000 }
  )
  await page.evaluate(function waitForDocumentFonts() {
    return document.fonts.ready.then(function settle() {
      return true
    })
  })
}

async function scrollToStep(page: Page, sceneId: string, position: number) {
  await page.evaluate(
    function scrollToPitch(input) {
      const container = document.getElementById(input.sceneId)
      const frame = container?.firstElementChild

      if (container === null || frame === null || frame === undefined) {
        throw new Error("missing scene " + input.sceneId)
      }

      const steps = container.dataset.dotShapes?.split(" ").length ?? 1
      const containerRect = container.getBoundingClientRect()
      const pitch =
        (containerRect.height - frame.getBoundingClientRect().height) /
        Math.max(1, steps - 1)
      const pinStart = containerRect.top + window.scrollY - 72

      window.scrollTo({
        top: pinStart + input.position * pitch,
        behavior: "instant",
      })

      return new Promise<void>(function waitTwoFrames(resolve) {
        window.requestAnimationFrame(function firstFrame() {
          window.requestAnimationFrame(function secondFrame() {
            resolve()
          })
        })
      })
    },
    { sceneId, position }
  )
}

async function readCaptions(page: Page, stepIndex: number) {
  return page.evaluate(function hitTestCaptions(activeIndex) {
    const problems: string[] = []
    const titles = document.querySelectorAll<HTMLElement>(
      "#services [data-fit-box] > li h3"
    )

    for (let titleIndex = 0; titleIndex < titles.length; titleIndex += 1) {
      const title = titles[titleIndex]

      if (title === undefined) {
        continue
      }

      const rect = title.getBoundingClientRect()

      for (const fraction of [0.2, 0.5, 0.8]) {
        const hit = document.elementFromPoint(
          rect.left + rect.width * fraction,
          rect.top + rect.height / 2
        )
        const isHit = hit !== null && title.contains(hit)

        if (titleIndex === activeIndex && !isHit) {
          problems.push("active title hidden at " + fraction)
        }

        if (titleIndex !== activeIndex && isHit) {
          problems.push("showing " + (title.textContent ?? ""))
        }
      }
    }

    return problems
  }, stepIndex)
}

async function readOrbit(page: Page, stepIndex: number) {
  return page.evaluate(
    function measureOrbit(input) {
      const problems: string[] = []
      const container = document.getElementById("process")
      const slot = container?.querySelector<HTMLElement>("[data-dot-slot]")
      const ring = container?.querySelector("svg")
      const heading = container?.querySelector("h2")
      const steps =
        container?.querySelectorAll<HTMLElement>("[data-orbit-step]")
      const active = steps?.[input.activeIndex]
      const numeral = active?.firstElementChild
      const title = active?.querySelector("h3")
      const body = active?.querySelector("p")

      if (
        container === null ||
        container === undefined ||
        slot === null ||
        slot === undefined ||
        ring === null ||
        ring === undefined ||
        heading === null ||
        heading === undefined ||
        numeral === null ||
        numeral === undefined ||
        title === null ||
        title === undefined ||
        body === null ||
        body === undefined
      ) {
        return ["missing orbit parts"]
      }

      const containerRect = container.getBoundingClientRect()
      const centre = (containerRect.left + containerRect.right) / 2
      const titleRect = title.getBoundingClientRect()
      const numeralRect = numeral.getBoundingClientRect()
      const fontSize = parseFloat(getComputedStyle(numeral).fontSize)
      const inkOffset = input.inkOffsetEm * fontSize
      const inkRect = new DOMRect(
        numeralRect.left,
        numeralRect.top + inkOffset,
        numeralRect.width,
        numeralRect.height
      )
      const ringY = ring.getBoundingClientRect().top + input.ringInsetPx
      const slotRect = slot.getBoundingClientRect()
      const headingText = document.createRange()

      headingText.selectNodeContents(heading)

      const headingRect = headingText.getBoundingClientRect()

      if (
        Math.abs((titleRect.left + titleRect.right) / 2 - centre) >
        input.tolerance
      ) {
        problems.push("active title off centre")
      }

      if (Math.abs(titleRect.height - title.offsetHeight) > 1) {
        problems.push("active title rotated")
      }

      if (
        Math.abs(inkRect.top + inkRect.height / 2 - ringY) > input.tolerance
      ) {
        problems.push("numeral off the ring")
      }

      const next = steps?.[input.activeIndex + 1]?.querySelector("h3")

      if (next !== null && next !== undefined) {
        const nextRect = next.getBoundingClientRect()

        if ((nextRect.left + nextRect.right) / 2 <= centre) {
          problems.push("next step not right of centre")
        }

        if (nextRect.height <= next.offsetHeight + 2) {
          problems.push("next step not turned on the rim")
        }
      }

      const guarded = [
        { name: "numeral", rect: inkRect },
        { name: "title", rect: titleRect },
        { name: "body", rect: body.getBoundingClientRect() },
        { name: "heading", rect: headingRect },
      ]

      for (const item of guarded) {
        const isOverlapping =
          item.rect.left < slotRect.right &&
          item.rect.right > slotRect.left &&
          item.rect.top < slotRect.bottom &&
          item.rect.bottom > slotRect.top

        if (isOverlapping) {
          problems.push("slot overlaps the " + item.name)
        }
      }

      const slotHit = document.elementFromPoint(
        slotRect.left + slotRect.width / 2,
        slotRect.top + slotRect.height / 2
      )

      if (slotHit !== slot) {
        problems.push("slot not on top of hit testing")
      }

      const revealed = [
        { name: "title", element: title },
        { name: "body", element: body },
      ]

      for (const item of revealed) {
        const text = document.createRange()

        text.selectNodeContents(item.element)

        const firstLine = text.getClientRects()[0]

        if (firstLine === undefined) {
          problems.push("no " + item.name + " line")
          continue
        }

        const hit = document.elementFromPoint(
          firstLine.left + firstLine.width / 2,
          firstLine.top + firstLine.height / 2
        )

        if (hit === null || !item.element.contains(hit)) {
          problems.push("active " + item.name + " not revealed")
        }
      }

      const headingHit = document.elementFromPoint(
        headingRect.left + Math.min(headingRect.width / 2, 12),
        headingRect.top + headingRect.height / 2
      )

      if (headingHit === null || !heading.contains(headingHit)) {
        problems.push("heading not on top of hit testing")
      }

      return problems
    },
    {
      activeIndex: stepIndex,
      tolerance: ORBIT_TOLERANCE_PX,
      inkOffsetEm: NUMERAL_INK_OFFSET_EM,
      ringInsetPx: RING_INSET_PX,
    }
  )
}

async function readProcessBoxes(page: Page) {
  return page.evaluate(function compareStagedWithUnstaged() {
    const stage = document.querySelector<HTMLElement>("[data-status]")
    const container = document.getElementById("process")

    if (stage === null || container === null) {
      return null
    }

    const section: HTMLElement = container
    const status = stage.dataset.status ?? ""

    function snapshot() {
      const slot = section.querySelector("[data-dot-slot]")
      const slotRect = slot?.getBoundingClientRect()
      const heights: number[] = []

      for (const step of section.querySelectorAll<HTMLElement>(
        "[data-orbit-step]"
      )) {
        heights.push(step.clientHeight, step.scrollHeight)
      }

      return {
        slot:
          slotRect === undefined
            ? []
            : [slotRect.left, slotRect.top, slotRect.width, slotRect.height],
        height: section.getBoundingClientRect().height,
        heights,
      }
    }

    const staged = snapshot()

    stage.dataset.status = "idle"

    const unstaged = snapshot()

    stage.dataset.status = status

    return { staged, unstaged }
  })
}

async function readCurtainClearance(page: Page) {
  return page.evaluate(function measureCurtains(tolerance) {
    const problems: string[] = []
    const slot = document.querySelector("#process [data-dot-slot]")
    const heading = document.querySelector("#process h2")

    if (slot === null || heading === null) {
      return ["missing slot or heading"]
    }

    const headingText = document.createRange()

    headingText.selectNodeContents(heading)

    const topBand = Math.max(
      slot.getBoundingClientRect().bottom,
      headingText.getBoundingClientRect().bottom
    )

    for (const step of document.querySelectorAll<HTMLElement>(
      "#process [data-orbit-step]"
    )) {
      const rect = step.getBoundingClientRect()
      const isOnScreen = rect.bottom > 0 && rect.top < window.innerHeight

      if (isOnScreen && rect.top < topBand - tolerance) {
        problems.push("curtain enters the top band: " + step.dataset.orbitStep)
      }
    }

    return problems
  }, ORBIT_TOLERANCE_PX)
}

async function readRingOffset(page: Page) {
  return page.evaluate(function readDashOffset() {
    const circle = document.querySelector("#process svg circle")

    return circle === null ? "" : getComputedStyle(circle).strokeDashoffset
  })
}

async function readOverflowX(page: Page) {
  return page.evaluate(function readOverflow() {
    return document.documentElement.scrollWidth - window.innerWidth
  })
}

async function checkCurtainClearance(page: Page) {
  const stepCount = SCENES[1]?.shapes.length ?? 0

  for (let position = 0; position < stepCount - 0.5; position += 0.25) {
    await scrollToStep(page, "process", position)

    expect(await readCurtainClearance(page), `at ${position}`).toEqual([])
    expect(await readOverflowX(page)).toBeLessThanOrEqual(0)
  }
}

async function checkOrbitTurns(page: Page) {
  const problems = collectPageProblems(page)
  const shapes = SCENES[1]?.shapes ?? []
  const section = page.locator("#process")
  const ringOffsets = new Set<string>()

  await openRunningPage(page)
  expect(await readBoardPosition(page, "process")).toBe("sticky")

  for (let stepIndex = 0; stepIndex < shapes.length; stepIndex += 1) {
    await scrollToStep(
      page,
      "process",
      resolveFormedPosition(stepIndex, shapes.length)
    )

    await expect(page.locator("[data-status]")).toHaveAttribute(
      "data-scene",
      shapes[stepIndex] ?? "",
      { timeout: SCENE_TIMEOUT_MS }
    )
    await expect(section).not.toHaveAttribute("data-fit")
    expect(await readOrbit(page, stepIndex), `step ${stepIndex}`).toEqual([])
    ringOffsets.add(await readRingOffset(page))
  }

  expect(ringOffsets.size, "the ring's ticks stream").toBe(shapes.length)
  expect(problems).toEqual([])
}

function resolveFormedPosition(stepIndex: number, stepCount: number): number {
  if (stepIndex === stepCount - 1) {
    return stepIndex - LAST_STEP_INSET
  }

  return stepIndex
}

async function readBoardPosition(page: Page, sceneId: string) {
  return page.evaluate(function readPosition(id) {
    const board = document.getElementById(id)?.children[1]

    return board === undefined ? "" : getComputedStyle(board).position
  }, sceneId)
}

async function readFrameCentre(page: Page, sceneId: string) {
  return page.evaluate(function readCentre(id) {
    const frame = document.getElementById(id)?.firstElementChild
    const rect = frame?.getBoundingClientRect()

    if (rect === undefined) {
      return Number.NaN
    }

    return (rect.left + rect.right) / 2 / window.innerWidth
  }, sceneId)
}

for (const viewport of STAGED_VIEWPORTS) {
  test.describe(`staged step scenes at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport })

    test("draws each service by itself and wipes its caption in as it lands", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)
      const shapes = SCENES[0]?.shapes ?? []

      await openRunningPage(page)
      expect(await readBoardPosition(page, "services")).toBe("sticky")

      for (let stepIndex = 0; stepIndex < shapes.length; stepIndex += 1) {
        await scrollToStep(
          page,
          "services",
          resolveFormedPosition(stepIndex, shapes.length)
        )

        await expect(page.locator("[data-status]")).toHaveAttribute(
          "data-scene",
          shapes[stepIndex] ?? "",
          { timeout: SCENE_TIMEOUT_MS }
        )
        await expect
          .poll(
            function readActiveCaption() {
              return readCaptions(page, stepIndex)
            },
            { message: `step ${stepIndex}`, timeout: SCENE_TIMEOUT_MS }
          )
          .toEqual([])
      }

      expect(problems).toEqual([])
    })

    test("finishes a service drawing by itself when the scroll stops", async ({
      page,
    }) => {
      const stage = page.locator("[data-status]")

      await openRunningPage(page)
      await scrollToStep(page, "services", 0)
      await expect(stage).toHaveAttribute("data-scene", "branding", {
        timeout: SCENE_TIMEOUT_MS,
      })

      await scrollToStep(
        page,
        "services",
        FIRST_THREAD_START + SERVICES_SHARE * NUDGE_SHARE
      )
      await page.waitForTimeout(DOT_FIELD_MORPH_TUNING.threadDrawSeconds * 1000)
      await expect(stage).toHaveAttribute("data-scene", "branding")

      await scrollToStep(
        page,
        "services",
        FIRST_THREAD_START + SERVICES_SHARE * PAST_TRIGGER_SHARE
      )
      await expect(stage).toHaveAttribute("data-thread", "web-design")
      await expect(stage).toHaveAttribute("data-scene", "web-design", {
        timeout: SCENE_TIMEOUT_MS,
      })
      await expect
        .poll(
          function readActiveCaption() {
            return readCaptions(page, 1)
          },
          { timeout: SCENE_TIMEOUT_MS }
        )
        .toEqual([])
    })

    test("turns the orbit one step per shape", async ({ page }) => {
      await checkOrbitTurns(page)
    })

    test("keeps the orbit's boxes identical staged and unstaged", async ({
      page,
    }) => {
      await openRunningPage(page)

      const boxes = await readProcessBoxes(page)

      expect(boxes).not.toBeNull()
      expect(boxes?.unstaged).toEqual(boxes?.staged)
    })

    test("never scrolls sideways mid-transit", async ({ page }) => {
      await openRunningPage(page)

      for (const scene of SCENES) {
        for (
          let stepIndex = 0;
          stepIndex < scene.shapes.length - 1;
          stepIndex += 1
        ) {
          await scrollToStep(page, scene.id, stepIndex + 0.5)

          const overflow = await readOverflowX(page)

          expect(overflow, `${scene.id} ${stepIndex}`).toBeLessThanOrEqual(0)
        }
      }
    })
  })
}

async function readServicesRest(page: Page, stepIndex: number) {
  return page.evaluate(function measureRest(index) {
    const container = document.getElementById("services")
    const frame = container?.firstElementChild

    if (container === null || frame === null || frame === undefined) {
      return Number.NaN
    }

    const rect = container.getBoundingClientRect()
    const pitch = (rect.height - frame.getBoundingClientRect().height) / 2

    return rect.top + window.scrollY - 72 + index * pitch
  }, stepIndex)
}

async function readScrollTop(page: Page) {
  return page.evaluate(function readScroll() {
    return window.scrollY
  })
}

test.describe("service glides with a wheel", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("locks the wheel and glides to the next service until it lands", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const stage = page.locator("[data-status]")

    await openRunningPage(page)
    await scrollToStep(page, "services", 0)
    await expect(stage).toHaveAttribute("data-scene", "branding", {
      timeout: SCENE_TIMEOUT_MS,
    })

    const restTop = await readServicesRest(page, 1)

    await page.mouse.move(720, 450)
    await page.mouse.wheel(0, 400)
    await expect(page.locator("html")).toHaveClass(/lenis-locked/, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await page.mouse.wheel(0, 3000)

    await expect(stage).toHaveAttribute("data-scene", "web-design", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(page.locator("html")).not.toHaveClass(/lenis-locked/)
    expect(Math.abs((await readScrollTop(page)) - restTop)).toBeLessThanOrEqual(
      2
    )
    expect(problems).toEqual([])
  })
})

test.describe("arriving at the services with a wheel", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("a fling from the quote stops on branding, not beyond it", async ({
    page,
  }) => {
    const stage = page.locator("[data-status]")

    await openRunningPage(page)
    await page.evaluate(function scrollToQuote() {
      const quote = document.getElementById("quote")

      if (quote === null) {
        return
      }

      window.scrollTo({
        top: quote.getBoundingClientRect().top + window.scrollY - 72,
        behavior: "instant",
      })
    })
    await expect(stage).toHaveAttribute("data-scene", "cube", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await page.mouse.move(720, 450)

    for (let frame = 0; frame < FLING_FRAMES; frame += 1) {
      await page.mouse.wheel(0, FLING_DELTA * (1 - frame / FLING_FRAMES) + 2)
      await page.waitForTimeout(16)
    }

    await expect(stage).toHaveAttribute("data-scene", "branding", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await page.waitForTimeout(DOT_FIELD_MORPH_TUNING.threadDrawSeconds * 1000)
    await expect(stage).toHaveAttribute("data-scene", "branding")
    await expect(stage).toHaveAttribute("data-thread", "branding")
  })
})

test.describe("service glides on a phone", () => {
  test.use({
    viewport: { width: 390, height: 664 },
    isMobile: true,
    hasTouch: true,
  })

  test("pauses touch scrolling while it glides to the next service", async ({
    page,
  }) => {
    const stage = page.locator("[data-status]")

    await openRunningPage(page)
    await scrollToStep(page, "services", 0)
    await expect(stage).toHaveAttribute("data-scene", "branding", {
      timeout: SCENE_TIMEOUT_MS,
    })

    const restTop = await readServicesRest(page, 1)

    await scrollToStep(
      page,
      "services",
      FIRST_THREAD_START + SERVICES_SHARE * PAST_TRIGGER_SHARE
    )
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden")
    await expect(stage).toHaveAttribute("data-scene", "web-design", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden")
    expect(Math.abs((await readScrollTop(page)) - restTop)).toBeLessThanOrEqual(
      2
    )
  })
})

test.describe("step scenes under reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })

  test("docks the captions and the process curtains without motion", async ({
    page,
  }) => {
    await openRunningPage(page)

    expect(await readBoardPosition(page, "services")).not.toBe("sticky")
    expect(await readBoardPosition(page, "process")).not.toBe("sticky")
    expect(await readFrameCentre(page, "services")).toBeCloseTo(0.5, 2)
    await expect(page.locator("#process svg")).toBeHidden()

    await checkCurtainClearance(page)
  })
})

test.describe("step scenes under reduced motion on a phone", () => {
  test.use({ viewport: { width: 390, height: 664 }, reducedMotion: "reduce" })

  test("docks the process curtains below the band", async ({ page }) => {
    await openRunningPage(page)

    expect(await readBoardPosition(page, "process")).not.toBe("sticky")
    await checkCurtainClearance(page)
  })
})

test.describe("step scenes on a short landscape phone", () => {
  test.use({ viewport: { width: 740, height: 280 } })

  test("flows How I work to a reading list over dust", async ({ page }) => {
    const section = page.locator("#process")

    await openRunningPage(page)

    await expect(section).toHaveAttribute("data-fit", "flow", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(section).toHaveAttribute("data-dot-shapes", "dust")
    await expect(section.locator("[data-dot-slot]")).toHaveCount(0)
    expect(await readBoardPosition(page, "process")).not.toBe("sticky")
    expect(await readOverflowX(page)).toBeLessThanOrEqual(0)
  })
})

test.describe("the orbit at 1920x1080", () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  test("turns the orbit one step per shape", async ({ page }) => {
    await checkOrbitTurns(page)
  })
})

test.describe("the orbit in forced colours", () => {
  test.use({ viewport: { width: 1440, height: 900 }, forcedColors: "active" })

  test("keeps every step title readable and drops the decoration", async ({
    page,
  }) => {
    await openRunningPage(page)

    await expect(page.locator("#process svg")).toBeHidden()

    for (const title of await page.locator("#process h3").all()) {
      await expect(title).toBeVisible()
    }

    for (const step of await page.locator("#process [data-orbit-step]").all()) {
      await expect(step.locator("> span")).toBeHidden()
    }
  })
})

test.describe("step scenes without WebGL2", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("lists every step as plain copy", async ({ page }) => {
    await page.addInitScript(function stubWebgl2() {
      const original = HTMLCanvasElement.prototype.getContext

      HTMLCanvasElement.prototype.getContext = function getContext(
        this: HTMLCanvasElement,
        kind: string,
        ...rest: unknown[]
      ) {
        if (kind === "webgl2") {
          return null
        }

        return Reflect.apply(original, this, [kind, ...rest])
      } as typeof HTMLCanvasElement.prototype.getContext
    })

    await page.goto("/")
    await expect(page.locator("[data-status]")).toHaveAttribute(
      "data-status",
      "unsupported",
      { timeout: 15000 }
    )

    for (const scene of SCENES) {
      expect(await readBoardPosition(page, scene.id)).not.toBe("sticky")

      for (const title of await page.locator(`#${scene.id} h3`).all()) {
        await title.scrollIntoViewIfNeeded()
        await expect(title).toBeVisible()
      }
    }
  })
})
