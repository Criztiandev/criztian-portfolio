import { expect, test } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

import { DOT_SLOT_SELECTOR, DOT_STAGE_SELECTOR } from "@/data/hero.data"
import { CURSOR_TUNING } from "@/data/motion.data"
import { FAQ_SECTION } from "@/data/page-sections.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const CURSOR_SELECTOR = "[data-cursor-state]"

const RING_SELECTOR = `${CURSOR_SELECTOR} > :first-child`

const DOT_SELECTOR = `${CURSOR_SELECTOR} > :last-child`

const RESOLVED_STATE_PATTERN = /^(idle|action|field)$/

const STAGE_TIMEOUT_MS = 15000

const SCENE_TIMEOUT_MS = 10000

const STATE_TIMEOUT_MS = 2000

const RING_SETTLE_MS = 500

const RING_TOLERANCE_PX = 1

const POINTER_TOLERANCE_PX = 0.5

const OPEN_POINT = { x: 720, y: 450 }

const FAR_POINT = { x: 1100, y: 760 }

const FAQ_OPEN_POINT = { x: 1100, y: 150 }

const EDGE_POINT = { x: 720, y: 2 }

const OUTSIDE_POINT = { x: 720, y: -20 }

const FAQ_LANDING = { path: `/#${FAQ_SECTION.id}`, scene: FAQ_SECTION.sceneId }

const FIRST_QUESTION_SELECTOR = `#${FAQ_SECTION.id} li:first-child summary`

const FIRST_CHIP_SELECTOR = "#contact [role='radiogroup'] label:first-of-type"

const LINK_SCROLL_PX = 120

const LEAVE_SCROLL_PX = 300

const WHEEL_DELTA = 400

const SETTLE_FRAMES = 10

const REST_WINDOW_MS = 2000

const REST_TIMEOUT_MS = 15000

const ACTION_TARGETS = [
  {
    name: "a primary link",
    path: "/",
    scene: "name",
    selector: "nav[aria-label='Primary'] a[href='#project']",
  },
  {
    name: "Let's talk",
    path: "/",
    scene: "name",
    selector: "nav[aria-label='Secondary'] a[href='#contact']",
  },
  {
    name: "a question",
    path: FAQ_LANDING.path,
    scene: FAQ_LANDING.scene,
    selector: FIRST_QUESTION_SELECTOR,
  },
  {
    name: "a service chip",
    path: "/#contact",
    scene: "contact",
    selector: FIRST_CHIP_SELECTOR,
  },
  {
    name: "the submit button",
    path: "/#contact",
    scene: "contact",
    selector: "#contact button[type='submit']",
  },
]

const CONTACT_FIELDS = ["#contact-name", "#contact-email", "#contact-message"]

const DRAWING_LANDINGS = [
  { path: "/", scene: "name", section: "#home" },
  { path: "/#quote", scene: "cube", section: "#quote" },
  { path: "/#services", scene: "branding", section: "#services" },
  { path: "/#process", scene: "listening", section: "#process" },
]

const FRAME_LANDINGS = [
  {
    path: `/#${PROJECTS_SCENE_ID}`,
    scene: formatSceneStepId(PROJECTS_SCENE_ID, 0),
    section: `#${PROJECTS_SCENE_ID}`,
  },
  { path: "/#about", scene: "about", section: "#about" },
  { path: "/#testimonials", scene: "testimonials", section: "#testimonials" },
  { path: "/#contact", scene: "contact", section: "#contact" },
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

async function openRunningPage(page: Page, path: string, scene: string) {
  const stage = page.locator(DOT_STAGE_SELECTOR)

  await page.goto(path)
  await expect(stage).toHaveAttribute("data-status", "running", {
    timeout: STAGE_TIMEOUT_MS,
  })
  await expect(stage).toHaveAttribute("data-scene", scene, {
    timeout: SCENE_TIMEOUT_MS,
  })

  return stage
}

async function expectStrictCounts(page: Page) {
  await expect(page.locator("canvas")).toHaveCount(1)
  await expect(page.locator(DOT_STAGE_SELECTOR)).toHaveCount(1)
  await expect(page.locator("h1")).toHaveCount(1)
}

async function readCursor(page: Page) {
  return page.evaluate(
    function readCursorBoxes(input) {
      const wrapper = document.querySelector<HTMLElement>(input.cursor)
      const ring = document.querySelector(input.ring)
      const dot = document.querySelector(input.dot)

      if (wrapper === null || ring === null || dot === null) {
        throw new Error("the cursor is missing")
      }

      const ringBox = ring.getBoundingClientRect()
      const dotBox = dot.getBoundingClientRect()

      return {
        state: wrapper.dataset.cursorState ?? "",
        opacity: getComputedStyle(wrapper).opacity,
        ring: {
          x: ringBox.left + ringBox.width / 2,
          y: ringBox.top + ringBox.height / 2,
          width: ringBox.width,
        },
        dot: {
          x: dotBox.left + dotBox.width / 2,
          y: dotBox.top + dotBox.height / 2,
          width: dotBox.width,
          height: dotBox.height,
        },
      }
    },
    { cursor: CURSOR_SELECTOR, ring: RING_SELECTOR, dot: DOT_SELECTOR }
  )
}

async function readCursorState(page: Page) {
  return page
    .locator(CURSOR_SELECTOR)
    .getAttribute("data-cursor-state", { timeout: STATE_TIMEOUT_MS })
}

async function expectCursorState(page: Page, state: string, message: string) {
  await expect
    .poll(
      function readState() {
        return readCursorState(page)
      },
      { message, timeout: STATE_TIMEOUT_MS }
    )
    .toBe(state)
}

async function moveToCentre(page: Page, target: Locator) {
  const box = await target.boundingBox()

  if (box === null) {
    throw new Error("the target has no box")
  }

  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 }

  await page.mouse.move(point.x, point.y)

  return point
}

async function hoverCentre(target: Locator) {
  await target.hover()

  const box = await target.boundingBox()

  if (box === null) {
    throw new Error("the target has no box")
  }

  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

async function checkActionAt(page: Page, point: { x: number; y: number }) {
  const cursor = await readCursor(page)
  const problems: string[] = []
  const dotOffset = Math.max(
    Math.abs(cursor.dot.x - point.x),
    Math.abs(cursor.dot.y - point.y)
  )

  if (cursor.state !== "action") {
    problems.push(`state ${cursor.state}`)
  }

  if (cursor.opacity !== "1") {
    problems.push(`cursor opacity ${cursor.opacity}`)
  }

  if (
    Math.abs(cursor.ring.width - CURSOR_TUNING.actionSize) > RING_TOLERANCE_PX
  ) {
    problems.push(`disc ${cursor.ring.width}px wide`)
  }

  if (
    cursor.dot.width !== CURSOR_TUNING.dotSize ||
    cursor.dot.height !== CURSOR_TUNING.dotSize
  ) {
    problems.push(`dot ${cursor.dot.width}x${cursor.dot.height}`)
  }

  if (dotOffset > POINTER_TOLERANCE_PX) {
    problems.push(`dot ${dotOffset}px off the pointer`)
  }

  return problems
}

async function checkFieldCursor(page: Page, selector: string) {
  const cursor = await readCursor(page)
  const native = await page.evaluate(
    function readNativeCursors(input) {
      const field = document.querySelector(input.selector)

      if (field === null) {
        throw new Error("missing field " + input.selector)
      }

      return {
        body: getComputedStyle(document.body).cursor,
        field: getComputedStyle(field).cursor,
      }
    },
    { selector }
  )
  const problems: string[] = []

  if (cursor.state !== "field") {
    problems.push(`state ${cursor.state}`)
  }

  if (cursor.opacity !== "0") {
    problems.push(`cursor opacity ${cursor.opacity}`)
  }

  if (native.body !== "none") {
    problems.push(`body cursor ${native.body}`)
  }

  if (native.field !== "auto") {
    problems.push(`field cursor ${native.field}`)
  }

  return problems
}

async function isSlotUnder(page: Page, point: { x: number; y: number }) {
  return page.evaluate(
    function readHit(input) {
      const hit = document.elementFromPoint(input.x, input.y)

      return hit !== null && hit.closest(input.slot) !== null
    },
    { ...point, slot: DOT_SLOT_SELECTOR }
  )
}

async function waitFrames(page: Page, count: number) {
  await page.evaluate(
    function waitForFrames(input) {
      return new Promise<void>(function countFrames(resolve) {
        let remaining = input.count

        function onFrame() {
          remaining -= 1

          if (remaining <= 0) {
            resolve()
            return
          }

          window.requestAnimationFrame(onFrame)
        }

        window.requestAnimationFrame(onFrame)
      })
    },
    { count }
  )
}

async function scrollByInstantly(page: Page, distance: number) {
  await page.evaluate(
    function scrollInstantly(input) {
      window.scrollTo({
        top: window.scrollY + input.distance,
        behavior: "instant",
      })
    },
    { distance }
  )
}

async function scrollAboveFaq(page: Page, distance: number) {
  await page.evaluate(
    function scrollAboveLanding(input) {
      const container = document.getElementById(input.sectionId)

      if (container === null) {
        throw new Error("missing the FAQ scene")
      }

      const landing =
        container.getBoundingClientRect().top +
        window.scrollY -
        parseFloat(getComputedStyle(container).scrollMarginTop)

      window.scrollTo({ top: landing - input.distance, behavior: "instant" })
    },
    { distance, sectionId: FAQ_SECTION.id }
  )
}

async function scrollUnderStillPointer(
  page: Page,
  point: { x: number; y: number },
  distance: number
) {
  return page.evaluate(
    function scrollWithHoverHeld(input) {
      const wrapper = document.querySelector<HTMLElement>(input.cursor)

      function holdHoverEvent(event: Event) {
        event.stopImmediatePropagation()
      }

      window.addEventListener("pointerover", holdHoverEvent, { capture: true })
      window.addEventListener("pointermove", holdHoverEvent, { capture: true })
      window.scrollTo({
        top: window.scrollY + input.distance,
        behavior: "instant",
      })

      return new Promise<{ isQuestionUnder: boolean; state: string }>(
        function readTwoFramesLater(resolve) {
          window.requestAnimationFrame(function firstFrame() {
            window.requestAnimationFrame(function secondFrame() {
              const hit = document.elementFromPoint(input.x, input.y)

              window.removeEventListener("pointerover", holdHoverEvent, {
                capture: true,
              })
              window.removeEventListener("pointermove", holdHoverEvent, {
                capture: true,
              })
              resolve({
                isQuestionUnder:
                  hit !== null && hit.closest("summary") !== null,
                state: wrapper?.dataset.cursorState ?? "",
              })
            })
          })
        }
      )
    },
    { ...point, distance, cursor: CURSOR_SELECTOR }
  )
}

async function installFrameCounter(page: Page) {
  await page.addInitScript(function countEveryFrame() {
    const original = window.requestAnimationFrame
    const counter = { calls: 0 }

    Object.assign(window, { frameCounter: counter })

    window.requestAnimationFrame = function countedFrame(callback) {
      counter.calls += 1

      return original.call(window, callback)
    }
  })
}

async function readFrameCalls(page: Page) {
  return page.evaluate(function readCalls() {
    const holder = window as unknown as { frameCounter?: { calls: number } }

    return holder.frameCounter?.calls ?? Number.NaN
  })
}

async function countFramesOver(page: Page, windowMs: number) {
  return page.evaluate(
    function countOverWindow(input) {
      const holder = window as unknown as { frameCounter?: { calls: number } }
      const counter = holder.frameCounter

      if (counter === undefined) {
        return Number.NaN
      }

      const before = counter.calls

      return new Promise<number>(function measure(resolve) {
        window.setTimeout(function finish() {
          resolve(counter.calls - before)
        }, input.windowMs)
      })
    },
    { windowMs }
  )
}

async function watchRingAfterMoves(page: Page) {
  await page.evaluate(
    function installRingWatch(input) {
      const record = { offsets: [] as number[] }

      Object.assign(window, { ringWatch: record })

      window.addEventListener("pointermove", function onMove(event) {
        const pointerX = event.clientX
        const pointerY = event.clientY

        window.requestAnimationFrame(function readNextFrame() {
          const ring = document.querySelector(input.ring)

          if (ring === null) {
            return
          }

          const box = ring.getBoundingClientRect()

          record.offsets.push(
            Math.max(
              Math.abs(box.left + box.width / 2 - pointerX),
              Math.abs(box.top + box.height / 2 - pointerY)
            )
          )
        })
      })
    },
    { ring: RING_SELECTOR }
  )
}

async function readRingOffsets(page: Page) {
  return page.evaluate(function readOffsets() {
    const holder = window as unknown as { ringWatch?: { offsets: number[] } }

    return holder.ringWatch?.offsets ?? []
  })
}

test.describe("the adaptive cursor", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("keeps the native cursor and stays hidden until the first mouse move", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const root = page.locator("html")
    const cursor = page.locator(CURSOR_SELECTOR)
    await openRunningPage(page, "/", "name")

    await expect(root).not.toHaveAttribute("data-cursor")
    await expect(cursor).toHaveCount(1)
    await expect(cursor).toHaveAttribute("data-cursor-state", "hidden")
    await expect(cursor).toHaveCSS("opacity", "0")
    await expect(page.locator("body")).toHaveCSS("cursor", "auto")
    await expectStrictCounts(page)

    await page.mouse.move(OPEN_POINT.x, OPEN_POINT.y)

    await expect(root).toHaveAttribute("data-cursor", "on")
    await expect(cursor).not.toHaveAttribute("data-cursor-state", "hidden")
    await expect(page.locator("body")).toHaveCSS("cursor", "none")
    await expectStrictCounts(page)
    expect(problems).toEqual([])
  })

  for (const target of ACTION_TARGETS) {
    test(`fills the disc over ${target.name} with the dot on the pointer`, async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await openRunningPage(page, target.path, target.scene)

      const point = await hoverCentre(page.locator(target.selector))

      await expect
        .poll(
          function readAction() {
            return checkActionAt(page, point)
          },
          { message: target.name, timeout: STATE_TIMEOUT_MS }
        )
        .toEqual([])
      expect(problems).toEqual([])
    })
  }

  test("steps aside for the native cursor over every contact field", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/#contact", "contact")

    for (const selector of CONTACT_FIELDS) {
      await page.locator(selector).hover()
      await expect
        .poll(
          function readField() {
            return checkFieldCursor(page, selector)
          },
          { message: selector, timeout: STATE_TIMEOUT_MS }
        )
        .toEqual([])
    }

    expect(problems).toEqual([])
  })

  for (const landing of DRAWING_LANDINGS) {
    test(`keeps the small idle ring over the ${landing.scene} once it has formed`, async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await openRunningPage(page, landing.path, landing.scene)

      const point = await moveToCentre(
        page,
        page.locator(`${landing.section} ${DOT_SLOT_SELECTOR}`)
      )

      await expectCursorState(page, "idle", landing.scene)
      await page.waitForTimeout(RING_SETTLE_MS)

      const cursor = await readCursor(page)

      expect(
        Math.abs(cursor.ring.width - CURSOR_TUNING.ringSize),
        `ring ${cursor.ring.width}px over the ${landing.scene}`
      ).toBeLessThanOrEqual(RING_TOLERANCE_PX)
      expect(await isSlotUnder(page, point)).toBe(true)
      expect(problems).toEqual([])
    })
  }

  for (const landing of FRAME_LANDINGS) {
    test(`never pushes over the ${landing.scene} frame`, async ({ page }) => {
      const problems = collectPageProblems(page)

      await openRunningPage(page, landing.path, landing.scene)

      const point = await moveToCentre(
        page,
        page.locator(`${landing.section} ${DOT_SLOT_SELECTOR}`)
      )

      await expect
        .poll(
          function readState() {
            return readCursorState(page)
          },
          { message: landing.scene, timeout: STATE_TIMEOUT_MS }
        )
        .toMatch(RESOLVED_STATE_PATTERN)
      expect(await isSlotUnder(page, point)).toBe(false)
      expect(problems).toEqual([])
    })
  }

  test("keeps the small ring over the cube, with and without reduced motion", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/#quote", "cube")
    await moveToCentre(page, page.locator(`#quote ${DOT_SLOT_SELECTOR}`))

    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      await page.emulateMedia({ reducedMotion })
      await expectCursorState(page, "idle", reducedMotion)
      await page.waitForTimeout(RING_SETTLE_MS)

      const cursor = await readCursor(page)

      expect(
        Math.abs(cursor.ring.width - CURSOR_TUNING.ringSize),
        `ring ${cursor.ring.width}px over the cube (${reducedMotion})`
      ).toBeLessThanOrEqual(RING_TOLERANCE_PX)
    }

    expect(problems).toEqual([])
  })

  test("re-resolves a still pointer within two frames of an instant scroll, without the browser's hover events", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, FAQ_LANDING.path, FAQ_LANDING.scene)

    const question = await page.locator(FIRST_QUESTION_SELECTOR).boundingBox()

    if (question === null) {
      throw new Error("the first question has no box")
    }

    const point = {
      x: question.x + question.width / 2,
      y: question.y + question.height / 2 - LINK_SCROLL_PX,
    }

    await page.mouse.move(point.x, point.y)
    await expectCursorState(page, "idle", "above the questions")

    expect(await scrollUnderStillPointer(page, point, LINK_SCROLL_PX)).toEqual({
      isQuestionUnder: true,
      state: "action",
    })
    expect(problems).toEqual([])
  })

  test("stays hidden through a scroll after the pointer leaves the page", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, FAQ_LANDING.path, FAQ_LANDING.scene)
    await page.mouse.move(OPEN_POINT.x, OPEN_POINT.y)
    await page.mouse.move(EDGE_POINT.x, EDGE_POINT.y)
    await expectCursorState(page, "idle", "at the top edge")

    await page.mouse.move(OUTSIDE_POINT.x, OUTSIDE_POINT.y)
    await expectCursorState(page, "hidden", "outside the page")

    await scrollByInstantly(page, LEAVE_SCROLL_PX)
    await waitFrames(page, SETTLE_FRAMES)

    expect(await readCursorState(page)).toBe("hidden")
    expect(problems).toEqual([])
  })

  test("hides and gives the native cursor back on a touch after a mouse move", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const root = page.locator("html")

    await openRunningPage(page, FAQ_LANDING.path, FAQ_LANDING.scene)
    await page.mouse.move(FAQ_OPEN_POINT.x, FAQ_OPEN_POINT.y)
    await expectCursorState(page, "idle", "after the mouse move")
    await expect(root).toHaveAttribute("data-cursor", "on")

    const session = await page.context().newCDPSession(page)

    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: FAR_POINT.x, y: FAR_POINT.y }],
    })
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    })

    await expectCursorState(page, "hidden", "after the touch")
    await expect(root).not.toHaveAttribute("data-cursor")
    await expect(page.locator("body")).toHaveCSS("cursor", "auto")
    expect(problems).toEqual([])
  })

  test("requests no animation frame at rest in the FAQ after moving the mouse and scrolling", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await installFrameCounter(page)

    const stage = await openRunningPage(page, "/", "name")

    await page.mouse.move(OPEN_POINT.x, OPEN_POINT.y)
    await expect(page.locator("html")).toHaveAttribute("data-cursor", "on")
    await scrollAboveFaq(page, WHEEL_DELTA)

    const callsBeforeWheel = await readFrameCalls(page)

    await page.mouse.wheel(0, WHEEL_DELTA)
    await expect(stage).toHaveAttribute("data-scene", FAQ_LANDING.scene, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await page.mouse.move(FAR_POINT.x, FAR_POINT.y)

    expect(await readFrameCalls(page)).toBeGreaterThan(callsBeforeWheel)
    await expect
      .poll(
        function countRestingFrames() {
          return countFramesOver(page, REST_WINDOW_MS)
        },
        { message: "frames at rest in the FAQ", timeout: REST_TIMEOUT_MS }
      )
      .toBe(0)
    await expect(stage).toHaveAttribute("data-scene", FAQ_LANDING.scene)
    expect(problems).toEqual([])
  })

  test("gives the native cursor back and hides itself when forced colours turn on", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const body = page.locator("body")

    await openRunningPage(page, FAQ_LANDING.path, FAQ_LANDING.scene)
    await page.mouse.move(OPEN_POINT.x, OPEN_POINT.y)
    await expect(page.locator("html")).toHaveAttribute("data-cursor", "on")
    await expect(body).toHaveCSS("cursor", "none")

    await page.emulateMedia({ forcedColors: "active" })

    await expect(body).toHaveCSS("cursor", "auto")
    await expect(page.locator(CURSOR_SELECTOR)).toHaveCSS("display", "none")
    expect(problems).toEqual([])
  })
})

test.describe("the adaptive cursor under reduced motion", () => {
  test.use({ viewport: DESKTOP_VIEWPORT, reducedMotion: "reduce" })

  test("keeps the ring on the pointer on the frame after a move", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, FAQ_LANDING.path, FAQ_LANDING.scene)
    await page.mouse.move(FAQ_OPEN_POINT.x, FAQ_OPEN_POINT.y)
    await expectCursorState(page, "idle", "after the first move")
    await watchRingAfterMoves(page)

    await page.mouse.move(FAR_POINT.x, FAR_POINT.y)
    await expect
      .poll(
        function readOffsets() {
          return readRingOffsets(page)
        },
        { message: "the frame after the move", timeout: STATE_TIMEOUT_MS }
      )
      .toHaveLength(1)

    for (const offset of await readRingOffsets(page)) {
      expect(offset).toBeLessThanOrEqual(POINTER_TOLERANCE_PX)
    }

    expect(problems).toEqual([])
  })
})
