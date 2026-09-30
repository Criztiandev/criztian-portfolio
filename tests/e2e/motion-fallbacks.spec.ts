import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { COPY_DRIFT_PX } from "@/data/motion.data"
import {
  ABOUT_SECTION,
  CONTACT_SCENE_SHAPES,
  CONTACT_SECTION,
  COPY_DRIFT_CLASS,
  FAQ_SECTION,
  SCENE_FIT_BOX_SELECTOR,
  TESTIMONIALS_SECTION,
} from "@/data/page-sections.data"

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const PHONE_VIEWPORT = { width: 390, height: 844 }

const NO_SCRIPT_VIEWPORTS = [DESKTOP_VIEWPORT, PHONE_VIEWPORT]

const ZOOMED_VIEWPORT = { width: 320, height: 256 }

const STICKY_TOP_PX = 72

const SCENE_TIMEOUT_MS = 5000

const GATE_SETTLE_MS = 800

const RESIZE_NUDGE_PX = 6

const NUDGED_VIEWPORT = {
  width: DESKTOP_VIEWPORT.width - RESIZE_NUDGE_PX,
  height: DESKTOP_VIEWPORT.height - RESIZE_NUDGE_PX,
}

const RAISED_DRIFT_PX = 2000

const LAYOUT_CONTAINMENT_VALUES = ["layout", "content", "strict"]

const PUSH_RADIUS_PATTERN = /^\d+$/

const PIN_SHARES = [0.25, 0.5, 0.75]

const DRIFT_SCREENS = [
  { id: "quote", scene: "cube", isPinned: true },
  { id: ABOUT_SECTION.id, scene: ABOUT_SECTION.sceneId, isPinned: true },
  {
    id: TESTIMONIALS_SECTION.id,
    scene: TESTIMONIALS_SECTION.sceneId,
    isPinned: true,
  },
  { id: FAQ_SECTION.id, scene: "dust", isPinned: false },
  { id: CONTACT_SECTION.id, scene: CONTACT_SECTION.sceneId, isPinned: true },
]

const STEP_SCENE_IDS = ["project", "services", "process"]

const UNSWEPT_WITHOUT_SCRIPT = [
  "[data-reveal]",
  "h2",
  "[class*='caption-line']",
]

const UNSWEPT_WITHOUT_WEBGL = ["[class*='swept:caption-line']", "footer a"]

const FAQ_TRANSITION_LIMIT_MS = 400

const FAQ_SAMPLE_MS = 800

const FAQ_TURN_DEGREES = 45

const FAQ_SETTLE_MS = 600

const MEASURE_TOLERANCE_PX = 0.5

const WHEEL_STEP_PX = 600

const WHEEL_PAUSE_MS = 100

const MAX_SCROLL_STEPS = 200

const SCROLL_REST_FRAMES = 20

type DriftExpectation = "arriving" | "pinned" | "leaving" | "off"

type DriftPhase = { name: DriftExpectation; share: number }

type DisclosureRecord = {
  heightMs: number
  rotateMs: number
  answerHeight: number
  samples: { time: number; answer: number; degrees: number }[]
}

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

async function openRunningPage(page: Page, path: string) {
  await page.goto(path)
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

async function openPageWithoutWebgl2(page: Page) {
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
}

async function waitForTwoFrames(page: Page) {
  await page.evaluate(function waitTwoFrames() {
    return new Promise<void>(function onFirstFrame(resolve) {
      window.requestAnimationFrame(function firstFrame() {
        window.requestAnimationFrame(function secondFrame() {
          resolve()
        })
      })
    })
  })
}

function buildDriftPhases(isPinned: boolean): DriftPhase[] {
  const phases: DriftPhase[] = [{ name: "arriving", share: 0 }]

  if (isPinned) {
    for (const share of PIN_SHARES) {
      phases.push({ name: "pinned", share })
    }
  }

  phases.push({ name: "leaving", share: 0 })

  return phases
}

async function scrollToScreen(
  page: Page,
  request: { id: string; phase: DriftExpectation; share: number }
) {
  await page.evaluate(
    function scrollToPhase(input) {
      const section = document.getElementById(input.id)

      if (section === null) {
        throw new Error("missing screen " + input.id)
      }

      const rect = section.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const halfway = (window.innerHeight + input.stickyTop) / 2
      let target = top - halfway

      if (input.phase === "pinned") {
        const pinStart = top - input.stickyTop
        const pinEnd = top + rect.height - window.innerHeight

        target = pinStart + (pinEnd - pinStart) * input.share
      }

      if (input.phase === "leaving") {
        target = top + rect.height - halfway
      }

      window.scrollTo({ top: target, behavior: "instant" })
    },
    { ...request, stickyTop: STICKY_TOP_PX }
  )
}

async function readCopyDrift(page: Page, id: string) {
  return page.evaluate(
    function readDriftingChildren(input) {
      const children: { transform: string; animationName: string }[] = []

      for (const child of document.querySelectorAll(
        `#${input.id} .${input.driftClass} > *`
      )) {
        const style = getComputedStyle(child)

        if (style.display !== "none") {
          children.push({
            transform: style.transform,
            animationName: style.animationName,
          })
        }
      }

      return children
    },
    { id, driftClass: COPY_DRIFT_CLASS }
  )
}

function readTranslateY(transform: string): number {
  if (transform === "none") {
    return 0
  }

  const match = /^matrix\(1, 0, 0, 1, 0, (\S+)\)$/.exec(transform)

  if (match === null) {
    return Number.NaN
  }

  return Number(match[1])
}

async function readDriftProblems(
  page: Page,
  id: string,
  expectation: DriftExpectation
) {
  const children = await readCopyDrift(page, id)
  const problems: string[] = []

  if (children.length === 0) {
    problems.push("no copy column in " + id)
  }

  const isStill = expectation === "pinned" || expectation === "off"

  for (const child of children) {
    const offset = readTranslateY(child.transform)
    const isInRange = Math.abs(offset) > 0 && Math.abs(offset) < COPY_DRIFT_PX

    if (expectation === "arriving" && !(offset > 0 && isInRange)) {
      problems.push("arriving copy at " + child.transform)
    }

    if (expectation === "leaving" && !(offset < 0 && isInRange)) {
      problems.push("leaving copy at " + child.transform)
    }

    if (isStill && child.transform !== "none") {
      problems.push("still copy at " + child.transform)
    }

    if (expectation === "off" && child.animationName !== "none") {
      problems.push("copy animated by " + child.animationName)
    }
  }

  return problems
}

async function expectNoDrift(page: Page) {
  const problems = collectPageProblems(page)

  await openRunningPage(page, "/")

  for (const screen of DRIFT_SCREENS) {
    for (const phase of buildDriftPhases(screen.isPinned)) {
      await scrollToScreen(page, {
        id: screen.id,
        phase: phase.name,
        share: phase.share,
      })
      await waitForTwoFrames(page)

      expect(
        await readDriftProblems(page, screen.id, "off"),
        `${screen.id} ${phase.name} ${phase.share}`
      ).toEqual([])
    }
  }

  expect(problems).toEqual([])
}

async function readUncontainedColumns(page: Page) {
  return page.evaluate(
    function inspectColumnContainment(input) {
      const problems: string[] = []
      const columns = document.querySelectorAll(`.${input.driftClass}`)

      if (columns.length < input.screenCount) {
        problems.push("only " + columns.length + " copy columns")
      }

      for (const column of columns) {
        const contain = getComputedStyle(column).contain
        let hasLayout = false

        for (const value of contain.split(" ")) {
          if (input.layoutValues.includes(value)) {
            hasLayout = true
          }
        }

        if (!hasLayout) {
          problems.push(
            column.closest("[id]")?.id + " column contain " + contain
          )
        }
      }

      return problems
    },
    {
      screenCount: DRIFT_SCREENS.length,
      driftClass: COPY_DRIFT_CLASS,
      layoutValues: LAYOUT_CONTAINMENT_VALUES,
    }
  )
}

async function raiseCopyDrift(page: Page, id: string) {
  await page.evaluate(
    function setCopyDrift(input) {
      const section = document.getElementById(input.id)

      if (section === null) {
        throw new Error("missing screen " + input.id)
      }

      section.style.setProperty("--copy-drift", input.drift)
    },
    { id, drift: `${RAISED_DRIFT_PX}px` }
  )
  await waitForTwoFrames(page)
}

async function readFitBoxOverflow(page: Page, id: string) {
  return page.evaluate(
    function inspectFitBox(input) {
      const problems: string[] = []
      const section = document.getElementById(input.id)
      const box = section?.querySelector<HTMLElement>(input.boxSelector)
      const column = section?.querySelector(`.${input.driftClass}`)

      if (
        section === null ||
        box === null ||
        box === undefined ||
        column === null ||
        column === undefined
      ) {
        throw new Error("missing the fit box or copy column in " + input.id)
      }

      let copyBottom = Number.NEGATIVE_INFINITY

      for (const child of column.children) {
        copyBottom = Math.max(copyBottom, child.getBoundingClientRect().bottom)
      }

      if (copyBottom <= box.getBoundingClientRect().bottom) {
        problems.push("the drifted copy ends inside the frame")
      }

      if (section.dataset.fit !== undefined) {
        problems.push(input.id + " flowed")
      }

      if (box.scrollHeight > box.clientHeight) {
        problems.push(
          "scrollHeight " +
            box.scrollHeight +
            " over clientHeight " +
            box.clientHeight
        )
      }

      return problems
    },
    { id, boxSelector: SCENE_FIT_BOX_SELECTOR, driftClass: COPY_DRIFT_CLASS }
  )
}

async function readUnsweptProblems(page: Page, selectors: string[]) {
  return page.evaluate(
    function inspectUnswept(input) {
      const problems: string[] = []
      const seen = new Set<Element>()

      function isDrift(transform: string): boolean {
        const match = /^matrix\(1, 0, 0, 1, 0, (\S+)\)$/.exec(transform)

        return match !== null && Math.abs(Number(match[1])) <= input.driftPx
      }

      for (const selector of input.selectors) {
        const elements = document.querySelectorAll<HTMLElement>(selector)

        if (elements.length === 0) {
          problems.push("nothing matches " + selector)
        }

        for (const element of elements) {
          if (seen.has(element)) {
            continue
          }

          seen.add(element)

          const style = getComputedStyle(element)
          const name =
            element.tagName.toLowerCase() +
            " " +
            (element.textContent ?? "").trim().slice(0, 32)
          const isDriftChild =
            element.parentElement?.classList.contains(input.driftClass) === true

          if (style.opacity !== "1") {
            problems.push(name + " opacity " + style.opacity)
          }

          if (style.clipPath !== "none") {
            problems.push(name + " clipped " + style.clipPath)
          }

          if (style.maskImage !== "none") {
            problems.push(name + " masked " + style.maskImage)
          }

          if (style.translate !== "none") {
            problems.push(name + " translated " + style.translate)
          }

          if (
            style.transform !== "none" &&
            !(isDriftChild && isDrift(style.transform))
          ) {
            problems.push(name + " transformed " + style.transform)
          }
        }
      }

      return problems
    },
    { selectors, driftClass: COPY_DRIFT_CLASS, driftPx: COPY_DRIFT_PX }
  )
}

async function readStatProblems(page: Page) {
  return page.evaluate(
    function inspectStats(input) {
      const problems: string[] = []
      const values = document.querySelectorAll<HTMLElement>(`#${input.id} dd`)

      if (values.length !== input.stats.length) {
        problems.push(values.length + " stats shown")
      }

      for (let statIndex = 0; statIndex < values.length; statIndex += 1) {
        const value = values[statIndex]
        const expected = input.stats[statIndex]?.value ?? ""

        if (value === undefined) {
          continue
        }

        if (value.innerText.trim() !== expected) {
          problems.push(expected + " reads " + value.innerText.trim())
        }

        for (const part of value.children) {
          const style = getComputedStyle(part)

          if (part.getAttribute("aria-hidden") === "true") {
            if (style.display !== "none") {
              problems.push(expected + " overlay shown")
            }

            continue
          }

          if (style.color === "rgba(0, 0, 0, 0)") {
            problems.push(expected + " value transparent")
          }
        }
      }

      return problems
    },
    { id: ABOUT_SECTION.id, stats: ABOUT_SECTION.stats }
  )
}

async function readFlowedScenes(page: Page) {
  return page.evaluate(function readFits(ids) {
    const fits: string[] = []

    for (const id of ids) {
      fits.push(document.getElementById(id)?.dataset.fit ?? "")
    }

    return fits
  }, STEP_SCENE_IDS)
}

async function expectFallbackShown(page: Page) {
  expect(
    await readUnsweptProblems(page, UNSWEPT_WITHOUT_WEBGL),
    "swept lines"
  ).toEqual([])
  expect(await readStatProblems(page), "stats").toEqual([])
}

async function toggleFaqAnswer(page: Page): Promise<DisclosureRecord> {
  return page.evaluate(
    function toggleAndSample(input) {
      const row = document.querySelector(`#${input.id} details`)
      const toggle = row?.querySelector("summary")
      const plus = toggle?.querySelector("svg")
      const answer = row?.querySelector("p")

      if (
        row === null ||
        toggle === null ||
        toggle === undefined ||
        plus === null ||
        plus === undefined ||
        answer === null ||
        answer === undefined
      ) {
        throw new Error("missing the first FAQ row")
      }

      const details: Element = row
      const summary: HTMLElement = toggle
      const icon: Element = plus
      const body: Element = answer
      const samples: DisclosureRecord["samples"] = []
      const startedAt = window.performance.now()

      function readLongestMs(style: CSSStyleDeclaration): number {
        const durations = style.transitionDuration.split(",")
        const delays = style.transitionDelay.split(",")
        let longest = 0

        for (let index = 0; index < durations.length; index += 1) {
          const seconds =
            parseFloat(durations[index] ?? "0") +
            parseFloat(delays[index % delays.length] ?? "0")

          longest = Math.max(longest, seconds * 1000)
        }

        return longest
      }

      function readSample() {
        const rotate = getComputedStyle(icon).rotate
        const border = parseFloat(getComputedStyle(details).borderBottomWidth)

        samples.push({
          time: window.performance.now() - startedAt,
          answer:
            details.getBoundingClientRect().bottom -
            border -
            summary.getBoundingClientRect().bottom,
          degrees: rotate === "none" ? 0 : parseFloat(rotate),
        })
      }

      summary.click()
      readSample()

      const heightMs = readLongestMs(
        getComputedStyle(details, "::details-content")
      )
      const rotateMs = readLongestMs(getComputedStyle(icon))

      return new Promise<DisclosureRecord>(function sampleFrames(resolve) {
        function onFrame() {
          readSample()

          if (window.performance.now() - startedAt < input.sampleMs) {
            window.requestAnimationFrame(onFrame)
            return
          }

          resolve({
            heightMs,
            rotateMs,
            answerHeight: body.getBoundingClientRect().height,
            samples,
          })
        }

        window.requestAnimationFrame(onFrame)
      })
    },
    { id: FAQ_SECTION.id, sampleMs: FAQ_SAMPLE_MS }
  )
}

function expectAtRest(
  sample: { answer: number; degrees: number } | undefined,
  target: { answer: number; degrees: number },
  message: string
) {
  expect(
    Math.abs((sample?.answer ?? Number.NaN) - target.answer),
    message + " answer"
  ).toBeLessThanOrEqual(MEASURE_TOLERANCE_PX)
  expect(sample?.degrees, message + " plus").toBe(target.degrees)
}

function expectSmoothToggle(
  record: DisclosureRecord,
  target: { answer: number; degrees: number },
  openAnswer: number
) {
  const first = record.samples[0]
  let firstMovingTime = Number.NaN
  let hasMidAnswer = false
  let hasMidTurn = false

  expect(record.heightMs, "answer transition").toBeGreaterThan(0)
  expect(record.heightMs, "answer transition").toBeLessThanOrEqual(
    FAQ_TRANSITION_LIMIT_MS
  )
  expect(record.rotateMs, "plus transition").toBe(record.heightMs)

  for (const sample of record.samples) {
    const isMidAnswer =
      sample.answer > MEASURE_TOLERANCE_PX &&
      sample.answer < openAnswer - MEASURE_TOLERANCE_PX
    const isMidTurn =
      sample.degrees > MEASURE_TOLERANCE_PX &&
      sample.degrees < FAQ_TURN_DEGREES - MEASURE_TOLERANCE_PX
    const hasMoved =
      Math.abs(sample.answer - (first?.answer ?? 0)) > MEASURE_TOLERANCE_PX

    if (isMidAnswer) {
      hasMidAnswer = true
    }

    if (isMidTurn) {
      hasMidTurn = true
    }

    if (Number.isNaN(firstMovingTime) && hasMoved) {
      firstMovingTime = sample.time
    }
  }

  expect(hasMidAnswer, "answer sampled mid-transition").toBe(true)
  expect(hasMidTurn, "plus sampled mid-turn").toBe(true)

  for (const sample of record.samples) {
    if (sample.time >= firstMovingTime + FAQ_TRANSITION_LIMIT_MS) {
      expectAtRest(sample, target, `at ${Math.round(sample.time)}ms`)
    }
  }

  expectAtRest(record.samples.at(-1), target, "last frame")
}

function expectSnappedToggle(
  record: DisclosureRecord,
  target: { answer: number; degrees: number }
) {
  expect(record.heightMs, "answer transition").toBe(0)
  expect(record.rotateMs, "plus transition").toBe(0)

  for (const sample of record.samples) {
    expectAtRest(sample, target, `at ${Math.round(sample.time)}ms`)
  }
}

async function installShiftRecorder(page: Page) {
  await page.addInitScript(function recordLayoutShifts() {
    const shifts: {
      value: number
      hadRecentInput: boolean
      time: number
      scrollY: number
      sources: string[]
    }[] = []

    Object.assign(window, { layoutShifts: shifts })

    new PerformanceObserver(function onLayoutShifts(list) {
      for (const entry of list.getEntries()) {
        const sources: string[] = []

        for (const source of Reflect.get(entry, "sources") ?? []) {
          const node = source.node
          let name = "a node-less box"

          if (node instanceof Element) {
            name =
              node.tagName.toLowerCase() +
              " " +
              String(node.className).slice(0, 48)
          }

          sources.push(
            name +
              " from " +
              Math.round(source.previousRect.y) +
              " to " +
              Math.round(source.currentRect.y)
          )
        }

        shifts.push({
          value: Reflect.get(entry, "value"),
          hadRecentInput: Reflect.get(entry, "hadRecentInput"),
          time: entry.startTime,
          scrollY: Math.round(window.scrollY),
          sources,
        })
      }
    }).observe({ type: "layout-shift", buffered: true })
  })
}

async function openSettledPage(page: Page) {
  await openRunningPage(page, "/")
  await waitForTwoFrames(page)

  return page.evaluate(function readSettledTime() {
    return window.performance.now()
  })
}

async function readUnexpectedShifts(page: Page, settledAt: number) {
  return page.evaluate(function describeShifts(since) {
    const unexpected: string[] = []

    for (const shift of Reflect.get(window, "layoutShifts") ?? []) {
      if (shift.hadRecentInput || shift.time < since) {
        continue
      }

      let sources = shift.sources.join(", ")

      if (sources === "") {
        sources = "no attributed source"
      }

      unexpected.push(
        shift.value.toFixed(5) +
          " at " +
          Math.round(shift.time) +
          "ms, scrollY " +
          shift.scrollY +
          ": " +
          sources
      )
    }

    return unexpected
  }, settledAt)
}

async function isAtScrollEdge(page: Page, direction: number) {
  return page.evaluate(function readEdge(scrollDirection) {
    const bottom = document.documentElement.scrollHeight - window.innerHeight

    if (scrollDirection > 0) {
      return window.scrollY >= bottom - 1
    }

    return window.scrollY <= 0
  }, direction)
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

async function wheelToEdge(page: Page, direction: number) {
  const viewport = page.viewportSize()

  if (viewport === null) {
    throw new Error("the page has no viewport")
  }

  await page.mouse.move(viewport.width / 2, viewport.height / 2)

  for (let step = 0; step < MAX_SCROLL_STEPS; step += 1) {
    await page.mouse.wheel(0, direction * WHEEL_STEP_PX)
    await page.waitForTimeout(WHEEL_PAUSE_MS)

    if (await isAtScrollEdge(page, direction)) {
      break
    }
  }

  await waitForScrollRest(page)
  expect(await isAtScrollEdge(page, direction), "reached the edge").toBe(true)
}

async function stepScrollToEdge(page: Page, direction: number) {
  for (let step = 0; step < MAX_SCROLL_STEPS; step += 1) {
    await page.evaluate(function scrollHalfAViewport(scrollDirection) {
      window.scrollBy({
        top: (scrollDirection * window.innerHeight) / 2,
        behavior: "instant",
      })
    }, direction)
    await waitForTwoFrames(page)

    if (await isAtScrollEdge(page, direction)) {
      break
    }
  }

  expect(await isAtScrollEdge(page, direction), "reached the edge").toBe(true)
}

async function openAndCloseFaqRow(page: Page, isTouch: boolean) {
  const summary = page.locator(`#${FAQ_SECTION.id} summary`).first()
  const row = page.locator(`#${FAQ_SECTION.id} details`).first()

  await page.evaluate(function bringFaqIntoView(id) {
    document
      .getElementById(id)
      ?.scrollIntoView({ block: "start", behavior: "instant" })
  }, FAQ_SECTION.id)

  for (const isOpen of [true, false]) {
    if (isTouch) {
      await summary.tap()
    } else {
      await summary.click()
    }

    await expect(row).toHaveJSProperty("open", isOpen)
    await page.waitForTimeout(FAQ_SETTLE_MS)
  }
}

for (const viewport of NO_SCRIPT_VIEWPORTS) {
  test.describe(`the page without JavaScript at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport, javaScriptEnabled: false })

    test("shows every reveal, heading and line whole, and the stats' real values", async ({
      page,
    }) => {
      await page.goto("/")

      await expect(page.locator("header")).toBeVisible()
      expect(
        await readUnsweptProblems(page, UNSWEPT_WITHOUT_SCRIPT),
        "reveals, headings and lines"
      ).toEqual([])
      expect(await readStatProblems(page), "stats").toEqual([])

      for (const screen of DRIFT_SCREENS) {
        if (!screen.isPinned) {
          continue
        }

        await scrollToScreen(page, {
          id: screen.id,
          phase: "pinned",
          share: 0.5,
        })
        await expect
          .poll(
            function readPinnedCopy() {
              return readDriftProblems(page, screen.id, "pinned")
            },
            { message: `${screen.id} pinned`, timeout: SCENE_TIMEOUT_MS }
          )
          .toEqual([])
      }
    })
  })
}

test.describe("the page without WebGL2 at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("shows every swept line, stat and footer link whole", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openPageWithoutWebgl2(page)
    await expectFallbackShown(page)

    expect(problems).toEqual([])
  })

  test("shows every swept line, stat and footer link whole and drops the push radius once the context is lost", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const stage = page.locator("[data-status]")

    await openRunningPage(page, `/#${ABOUT_SECTION.id}`)
    await expect(stage).toHaveAttribute("data-scene", ABOUT_SECTION.sceneId, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(stage, "push radius while running").toHaveAttribute(
      "data-push-radius",
      PUSH_RADIUS_PATTERN
    )
    expect(
      await readUnsweptProblems(page, UNSWEPT_WITHOUT_WEBGL),
      "lines swept out while running"
    ).not.toEqual([])

    await page.evaluate(function loseContext() {
      document
        .querySelector("canvas")
        ?.getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext()
    })

    await expect(stage).toHaveAttribute("data-status", "unsupported", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expectFallbackShown(page)
    await waitForTwoFrames(page)
    expect(
      await stage.getAttribute("data-push-radius"),
      "push radius once the context is lost"
    ).toBeNull()

    expect(problems).toEqual([])
  })
})

test.describe("the page without WebGL2 at 320x256", () => {
  test.use({ viewport: ZOOMED_VIEWPORT })

  test("flows the step scenes and shows every swept line, stat and footer link whole", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openPageWithoutWebgl2(page)
    await expect
      .poll(function readFits() {
        return readFlowedScenes(page)
      })
      .toEqual(["flow", "flow", "flow"])
    await expectFallbackShown(page)

    expect(problems).toEqual([])
  })
})

test.describe("the copy drift at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("drifts each screen's copy in as it arrives, holds it while pinned and lifts it as it leaves", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const stage = page.locator("[data-status]")

    await openRunningPage(page, "/")

    for (const screen of DRIFT_SCREENS) {
      for (const phase of buildDriftPhases(screen.isPinned)) {
        await scrollToScreen(page, {
          id: screen.id,
          phase: phase.name,
          share: phase.share,
        })
        await waitForTwoFrames(page)

        if (phase.name === "pinned") {
          await expect(stage).toHaveAttribute("data-scene", screen.scene, {
            timeout: SCENE_TIMEOUT_MS,
          })
        }

        await expect
          .poll(
            function readScreenDrift() {
              return readDriftProblems(page, screen.id, phase.name)
            },
            {
              message: `${screen.id} ${phase.name} ${phase.share}`,
              timeout: SCENE_TIMEOUT_MS,
            }
          )
          .toEqual([])
      }
    }

    expect(problems).toEqual([])
  })

  test("keeps Contact pinned when the gate re-checks mid-arrival", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const section = page.locator(`#${CONTACT_SECTION.id}`)

    await openRunningPage(page, "/")
    await expect(section).not.toHaveAttribute("data-fit")

    for (const size of [
      {
        width: DESKTOP_VIEWPORT.width - RESIZE_NUDGE_PX,
        height: DESKTOP_VIEWPORT.height - RESIZE_NUDGE_PX,
      },
      DESKTOP_VIEWPORT,
    ]) {
      await scrollToScreen(page, {
        id: CONTACT_SECTION.id,
        phase: "arriving",
        share: 0,
      })
      await waitForTwoFrames(page)
      await expect
        .poll(
          function readArrivingContact() {
            return readDriftProblems(page, CONTACT_SECTION.id, "arriving")
          },
          { message: "contact mid-arrival", timeout: SCENE_TIMEOUT_MS }
        )
        .toEqual([])

      await page.setViewportSize(size)
      await page.waitForTimeout(GATE_SETTLE_MS)

      await expect(section, `${size.width}x${size.height}`).not.toHaveAttribute(
        "data-fit"
      )
      await expect(section).toHaveAttribute(
        "data-dot-shapes",
        CONTACT_SCENE_SHAPES
      )
      expect(
        await readDriftProblems(page, CONTACT_SECTION.id, "arriving"),
        `drifting at ${size.width}x${size.height}`
      ).toEqual([])
    }

    expect(problems).toEqual([])
  })

  test("gives every copy column layout containment", async ({ page }) => {
    await page.goto("/")

    expect(
      await readUncontainedColumns(page),
      "copy columns without layout containment"
    ).toEqual([])
  })

  test("keeps a raised drift out of Contact's frame when the gate re-checks mid-arrival", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const section = page.locator(`#${CONTACT_SECTION.id}`)

    await openRunningPage(page, "/")
    await scrollToScreen(page, {
      id: CONTACT_SECTION.id,
      phase: "arriving",
      share: 0,
    })
    await waitForTwoFrames(page)
    await expect
      .poll(
        function readArrivingContact() {
          return readDriftProblems(page, CONTACT_SECTION.id, "arriving")
        },
        { message: "contact mid-arrival", timeout: SCENE_TIMEOUT_MS }
      )
      .toEqual([])

    await raiseCopyDrift(page, CONTACT_SECTION.id)
    expect(
      await readFitBoxOverflow(page, CONTACT_SECTION.id),
      `contact with a ${RAISED_DRIFT_PX}px drift`
    ).toEqual([])

    await page.setViewportSize(NUDGED_VIEWPORT)
    await page.waitForTimeout(GATE_SETTLE_MS)

    await expect(section).toHaveAttribute(
      "data-dot-shapes",
      CONTACT_SCENE_SHAPES
    )
    expect(
      await readFitBoxOverflow(page, CONTACT_SECTION.id),
      `contact after the gate re-check at ${NUDGED_VIEWPORT.width}x${NUDGED_VIEWPORT.height}`
    ).toEqual([])

    expect(problems).toEqual([])
  })
})

test.describe("the copy drift on a phone at 390x844", () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("never drifts the copy", async ({ page }) => {
    await expectNoDrift(page)
  })
})

test.describe("the copy drift under reduced motion at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT, reducedMotion: "reduce" })

  test("never drifts the copy", async ({ page }) => {
    await expectNoDrift(page)
  })
})

test.describe("the FAQ disclosure at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("opens and closes an answer over one short transition", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, `/#${FAQ_SECTION.id}`)
    await expect(page.locator("[data-status]")).toHaveAttribute(
      "data-scene",
      "dust",
      { timeout: SCENE_TIMEOUT_MS }
    )

    const opening = await toggleFaqAnswer(page)
    const openAnswer = opening.answerHeight

    expect(openAnswer, "open answer height").toBeGreaterThan(0)
    expectSmoothToggle(
      opening,
      { answer: openAnswer, degrees: FAQ_TURN_DEGREES },
      openAnswer
    )

    const closing = await toggleFaqAnswer(page)

    expectSmoothToggle(closing, { answer: 0, degrees: 0 }, openAnswer)

    expect(problems).toEqual([])
  })
})

test.describe("the FAQ disclosure under reduced motion at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT, reducedMotion: "reduce" })

  test("snaps an answer open and shut", async ({ page }) => {
    await openRunningPage(page, `/#${FAQ_SECTION.id}`)

    const opening = await toggleFaqAnswer(page)
    const openAnswer = opening.answerHeight

    expect(openAnswer, "open answer height").toBeGreaterThan(0)
    expectSnappedToggle(opening, {
      answer: openAnswer,
      degrees: FAQ_TURN_DEGREES,
    })
    expectSnappedToggle(await toggleFaqAnswer(page), {
      answer: 0,
      degrees: 0,
    })
  })
})

test.describe("layout stability at 1440x900", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("shifts nothing once the fonts and the stage are ready, over the intro, a wheel to the bottom, a FAQ answer and back to the top", async ({
    page,
  }) => {
    await installShiftRecorder(page)

    const settledAt = await openSettledPage(page)

    await wheelToEdge(page, 1)
    await openAndCloseFaqRow(page, false)
    await wheelToEdge(page, -1)

    expect(
      await readUnexpectedShifts(page, settledAt),
      "shifts without input"
    ).toEqual([])
  })
})

test.describe("layout stability at 390x844", () => {
  test.use({ viewport: PHONE_VIEWPORT, isMobile: true, hasTouch: true })

  test("shifts nothing once the fonts and the stage are ready, over the intro, a stepped scroll to the bottom, a FAQ answer and back to the top", async ({
    page,
  }) => {
    await installShiftRecorder(page)

    const settledAt = await openSettledPage(page)

    await stepScrollToEdge(page, 1)
    await openAndCloseFaqRow(page, true)
    await stepScrollToEdge(page, -1)

    expect(
      await readUnexpectedShifts(page, settledAt),
      "shifts without input"
    ).toEqual([])
  })
})
