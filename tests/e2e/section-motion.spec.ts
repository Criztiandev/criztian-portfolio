import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { MORPH_LANDING_TOLERANCE_PX } from "@/data/hero.data"
import { PORTFOLIO_PRIMARY_NAVIGATION } from "@/data/navigation.data"
import {
  ABOUT_SECTION,
  COPY_DRIFT_CLASS,
  OWNER_EMAIL_HREF,
} from "@/data/page-sections.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"
import { parseStatCount } from "@/features/portfolio/stat-count.rules"

const LINE_SELECTOR = '[class*="swept:caption-line"]'

const STAGE_SELECTOR = "[data-status]"

const COPY_DRIFT_CHILD_SELECTOR = `.${COPY_DRIFT_CLASS} > *`

const FAQ_SUMMARY_SELECTOR = "#faq summary"

const CONTACT_EMAIL_SELECTOR = `#contact a[href="${OWNER_EMAIL_HREF}"]`

const CONTACT_SUBMIT_SELECTOR = "#contact button[type=submit]"

const FOOTER_LINK_SELECTOR = '[data-dot-scene="footer"] a[href]'

const TABBABLE_SELECTOR =
  "a[href], button, summary, input, select, textarea, [tabindex]"

const LANDING_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]

const GUARD_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 664 },
  { width: 375, height: 548 },
  { width: 740, height: 304 },
]

const REDUCED_MOTION_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 664 },
]

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const SINGLE_FRAME_SCENES = [
  "cube",
  "about",
  "testimonials",
  "dust",
  "contact",
  "footer",
]

const STEP_SCENES = [PROJECTS_SCENE_ID, "services", "process"]

const RUNNING_TIMEOUT_MS = 15000

const SCENE_TIMEOUT_MS = 10000

const LINE_TIMEOUT_MS = 5000

const LANDING_TEST_TIMEOUT_MS = 120000

const WALK_TEST_TIMEOUT_MS = 300000

const DOTS_REST_FRAMES = 30

const DOTS_REST_MAX_FRAMES = 600

const SCROLL_REST_FRAMES = 20

const HEADER_LINE_PX = 72

const STOP_VIEWPORT_SHARE = 0.5

const LAST_STEP_INSET = 0.05

const TRANSLATE_TOLERANCE_PX = 0.01

const SWEEP_TOLERANCE = 0.01

const CAPTION_CLIP_SPAN_PERCENT = 104

const CAPTION_SLIDE_PX = 24

const DEFAULT_CAPTION_LAST = 2

const TITLE_WORD_CLASS = "section-title-word"

const TITLE_GATE_RATE = 3

const HIDDEN_RIGHT_INSET_PERCENT = 100

const TRANSIT_SHARES = [0.1, 0.25, 0.5, 0.75, 0.9]

const REVEAL_REPLAY_TOLERANCE = 0.002

const STAT_ARRIVAL_SHARE = 0.9

const STAT_COUNTER_PATTERN = /^stat-count (-?\d+)$/

const LINE_TEXT_LENGTH = 32

const STAT_WIDTH_TOLERANCE_PX = 0.5

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

const GROWN_VIEWPORTS = [
  { width: 740, height: 304, hasTextSpacing: false },
  { width: 640, height: 304, hasTextSpacing: false },
  { width: 320, height: 256, hasTextSpacing: false },
  { width: 1440, height: 900, hasTextSpacing: true },
]

const GROWN_SCENES = ["cube", "about", "testimonials"]

const GATE_SETTLE_MS = 500

const SCAN_STEP_PX = 8

const SCAN_SETTLE_FRAMES = 2

const GROWN_REST_FRAMES = 10

const FULL_VIEW_TOLERANCE_PX = 0.5

type LineState = "whole" | "hidden" | "partial" | "shown"

type SweptLine = {
  scene: string
  text: string
  clipPath: string
  translate: string
  isInView: boolean
}

type SceneLayout = {
  scene: string
  shapes: string[]
  hasSlot: boolean
  fit: string | null
  keyframeIds: string[]
}

type PageState = {
  formedId: string
  lines: SweptLine[]
  layout: SceneLayout[]
}

type TransitReveal = {
  share: number
  leaving: number
  arriving: number
}

type AccessibilityNode = {
  nodeId: string
  ignored: boolean
  role?: { value?: unknown }
  name?: { value?: unknown }
  childIds?: string[]
  backendDOMNodeId?: number
}

type LineSighting = {
  text: string
  isRendered: boolean
  top: number
  bottom: number
  clipPath: string
  translate: string
  counts: string[]
}

type SceneSightings = {
  scrollY: number
  viewportHeight: number
  reveal: string
  lines: LineSighting[]
}

type ScanRange = {
  pinEnd: number
  leave: number
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

async function openRunningPage(page: Page) {
  await page.goto("/")
  await expect(page.locator(STAGE_SELECTOR)).toHaveAttribute(
    "data-status",
    "running",
    { timeout: RUNNING_TIMEOUT_MS }
  )
  await page.evaluate(function waitForDocumentFonts() {
    return document.fonts.ready.then(function settle() {
      return true
    })
  })
}

async function waitForDotsRest(page: Page, restFrames = DOTS_REST_FRAMES) {
  await page.evaluate(
    function waitForRestingDots(input) {
      const stage = document.querySelector<HTMLElement>("[data-status]")
      const containers =
        document.querySelectorAll<HTMLElement>("[data-dot-scene]")

      function readSnapshot(): string {
        let snapshot =
          String(window.scrollY) +
          "|" +
          (stage?.dataset.scene ?? "") +
          "|" +
          (stage?.dataset.thread ?? "")

        for (const container of containers) {
          snapshot += "|" + (container.getAttribute("style") ?? "")
        }

        return snapshot
      }

      return new Promise<void>(function watchDots(resolve) {
        let lastSnapshot = readSnapshot()
        let stableFrames = 0
        let frames = 0

        function sampleDots() {
          const snapshot = readSnapshot()

          frames += 1

          if (snapshot === lastSnapshot) {
            stableFrames += 1
          } else {
            stableFrames = 0
            lastSnapshot = snapshot
          }

          if (stableFrames >= input.restFrames || frames >= input.maxFrames) {
            resolve()
            return
          }

          window.requestAnimationFrame(sampleDots)
        }

        window.requestAnimationFrame(sampleDots)
      })
    },
    { restFrames, maxFrames: DOTS_REST_MAX_FRAMES }
  )
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

function resolveKeyframeIds(sceneId: string, shapes: string[]): string[] {
  if (shapes.length <= 1) {
    return [sceneId]
  }

  const ids: string[] = []

  for (let stepIndex = 0; stepIndex < shapes.length; stepIndex += 1) {
    const shape = shapes[stepIndex] ?? ""
    const isRepeated = shapes.indexOf(shape) !== shapes.lastIndexOf(shape)

    ids.push(isRepeated ? formatSceneStepId(sceneId, stepIndex) : shape)
  }

  return ids
}

function resolveFormedPosition(stepIndex: number, stepCount: number): number {
  if (stepCount > 1 && stepIndex === stepCount - 1) {
    return stepIndex - LAST_STEP_INSET
  }

  return stepIndex
}

async function readPageState(page: Page): Promise<PageState> {
  const raw = await page.evaluate(
    function readSweptLines(input) {
      const stage = document.querySelector<HTMLElement>("[data-status]")
      const scenes: {
        scene: string
        shapes: string[]
        hasSlot: boolean
        fit: string | null
      }[] = []
      const lines: {
        scene: string
        text: string
        clipPath: string
        translate: string
        isInView: boolean
      }[] = []

      for (const container of document.querySelectorAll<HTMLElement>(
        "[data-dot-scene]"
      )) {
        const scene = container.dataset.dotScene ?? ""

        scenes.push({
          scene,
          shapes: (container.dataset.dotShapes ?? "").split(" "),
          hasSlot: container.querySelector("[data-dot-slot]") !== null,
          fit: container.dataset.fit ?? null,
        })

        for (const line of container.querySelectorAll<HTMLElement>(
          input.lineSelector
        )) {
          if (line.getClientRects().length === 0) {
            continue
          }

          const style = getComputedStyle(line)
          const rect = line.getBoundingClientRect()

          lines.push({
            scene,
            text: (line.textContent ?? "").trim().slice(0, input.textLength),
            clipPath: style.clipPath,
            translate: style.translate,
            isInView:
              rect.bottom > input.headerLine &&
              rect.top < window.innerHeight &&
              rect.right > 0 &&
              rect.left < window.innerWidth,
          })
        }
      }

      return { formedId: stage?.dataset.scene ?? "", scenes, lines }
    },
    {
      lineSelector: LINE_SELECTOR,
      textLength: LINE_TEXT_LENGTH,
      headerLine: HEADER_LINE_PX,
    }
  )
  const layout: SceneLayout[] = []

  for (const scene of raw.scenes) {
    layout.push({
      ...scene,
      keyframeIds: resolveKeyframeIds(scene.scene, scene.shapes),
    })
  }

  return { formedId: raw.formedId, lines: raw.lines, layout }
}

async function readKeyframeIds(page: Page, sceneId: string) {
  const state = await readPageState(page)

  for (const scene of state.layout) {
    if (scene.scene === sceneId) {
      return scene.keyframeIds
    }
  }

  throw new Error("missing scene " + sceneId)
}

async function scrollToScene(page: Page, sceneId: string, position: number) {
  await page.evaluate(
    function scrollToPin(input) {
      const container = document.querySelector<HTMLElement>(
        `[data-dot-scene="${input.sceneId}"]`
      )
      const frame = container?.firstElementChild

      if (container === null || frame === null || frame === undefined) {
        throw new Error("missing scene " + input.sceneId)
      }

      const stickyTop = parseFloat(getComputedStyle(container).scrollMarginTop)
      const containerRect = container.getBoundingClientRect()
      const steps = container.dataset.dotShapes?.split(" ").length ?? 1
      const pitch =
        (containerRect.height - frame.getBoundingClientRect().height) /
        Math.max(1, steps - 1)
      const pinStart = containerRect.top + window.scrollY - stickyTop

      window.scrollTo({
        top: Math.floor(pinStart + input.position * pitch),
        behavior: "instant",
      })
    },
    { sceneId, position }
  )
}

async function landOnKeyframe(page: Page, sceneId: string, stepIndex: number) {
  const keyframeIds = await readKeyframeIds(page, sceneId)
  const keyframeId = keyframeIds[stepIndex] ?? ""

  await scrollToScene(
    page,
    sceneId,
    resolveFormedPosition(stepIndex, keyframeIds.length)
  )
  await expect(page.locator(STAGE_SELECTOR)).toHaveAttribute(
    "data-scene",
    keyframeId,
    { timeout: SCENE_TIMEOUT_MS }
  )
  await waitForDotsRest(page)

  return keyframeId
}

async function scrollIntoTransit(
  page: Page,
  request: { from: string; to: string; share: number }
) {
  await page.evaluate(
    function scrollBetweenPins(input) {
      function readPin(sceneId: string) {
        const container = document.querySelector<HTMLElement>(
          `[data-dot-scene="${sceneId}"]`
        )
        const frame = container?.firstElementChild

        if (container === null || frame === null || frame === undefined) {
          throw new Error("missing scene " + sceneId)
        }

        const stickyTop = parseFloat(
          getComputedStyle(container).scrollMarginTop
        )
        const rect = container.getBoundingClientRect()

        return {
          start: rect.top + window.scrollY - stickyTop,
          end:
            rect.bottom +
            window.scrollY -
            frame.getBoundingClientRect().height -
            stickyTop,
        }
      }

      const from = readPin(input.from)
      const arrival = readPin(input.to).start - input.landingTolerance

      window.scrollTo({
        top: Math.round(from.end + input.share * (arrival - from.end)),
        behavior: "instant",
      })
    },
    { ...request, landingTolerance: MORPH_LANDING_TOLERANCE_PX }
  )
}

async function scrollToPosition(page: Page, top: number) {
  await page.evaluate(function scrollInstantly(position) {
    window.scrollTo({ top: position, behavior: "instant" })
  }, top)
}

async function readScrollStops(page: Page) {
  const range = await page.evaluate(function readScrollRange() {
    return {
      limit: document.documentElement.scrollHeight - window.innerHeight,
      viewportHeight: window.innerHeight,
    }
  })
  const pitch = Math.floor(range.viewportHeight * STOP_VIEWPORT_SHARE)
  const stops: number[] = []

  for (let top = 0; top < range.limit; top += pitch) {
    stops.push(top)
  }

  stops.push(range.limit)

  return stops
}

function readInsetTokens(clipPath: string): string[] {
  const match = /^inset\((.+)\)$/.exec(clipPath)

  if (match === null) {
    return []
  }

  return (match[1] ?? "").split(" ")
}

function isClipWhole(clipPath: string): boolean {
  if (clipPath === "none") {
    return true
  }

  const tokens = readInsetTokens(clipPath)

  if (tokens.length === 0) {
    return false
  }

  for (const token of tokens) {
    if (parseFloat(token) > 0) {
      return false
    }
  }

  return true
}

function readRightInset(clipPath: string): number {
  const tokens = readInsetTokens(clipPath)

  return parseFloat(tokens[1] ?? tokens[0] ?? "")
}

function isTranslateRested(translate: string): boolean {
  if (translate === "none") {
    return true
  }

  for (const token of translate.split(" ")) {
    if (Math.abs(parseFloat(token)) > TRANSLATE_TOLERANCE_PX) {
      return false
    }
  }

  return true
}

function classifyLine(line: SweptLine): LineState {
  if (line.clipPath === "none" && line.translate === "none") {
    return "shown"
  }

  if (isClipWhole(line.clipPath) && isTranslateRested(line.translate)) {
    return "whole"
  }

  if (readRightInset(line.clipPath) >= HIDDEN_RIGHT_INSET_PERCENT) {
    return "hidden"
  }

  return "partial"
}

function isStateMet(actual: LineState, expected: LineState): boolean {
  if (expected === "whole" && actual === "shown") {
    return true
  }

  return actual === expected
}

function describeLine(line: SweptLine, actual: LineState): string {
  return `${line.scene} "${line.text}" is ${actual}: ${line.clipPath} / ${line.translate}`
}

function findSceneIndex(layout: SceneLayout[], sceneId: string): number {
  for (let sceneIndex = 0; sceneIndex < layout.length; sceneIndex += 1) {
    if (layout[sceneIndex]?.scene === sceneId) {
      return sceneIndex
    }
  }

  return -1
}

function findFormedScene(layout: SceneLayout[], formedId: string) {
  for (const scene of layout) {
    if (scene.keyframeIds.includes(formedId)) {
      return scene.scene
    }
  }

  return null
}

function resolveExpectedState(
  layout: SceneLayout[],
  sceneId: string,
  formedId: string
): LineState {
  const sceneIndex = findSceneIndex(layout, sceneId)
  const scene = layout[sceneIndex]
  const nextScene = layout[sceneIndex + 1]

  if (scene === undefined) {
    return "partial"
  }

  if (scene.fit !== null) {
    return "shown"
  }

  if (scene.keyframeIds.includes(formedId)) {
    return "whole"
  }

  if (!scene.hasSlot && nextScene?.keyframeIds[0] === formedId) {
    return "whole"
  }

  return "hidden"
}

function findLandingProblems(state: PageState, keyframeId: string): string[] {
  if (state.formedId !== keyframeId) {
    return [`the stage shows ${state.formedId}, not ${keyframeId}`]
  }

  const problems: string[] = []
  const formedScene = findFormedScene(state.layout, keyframeId)
  let formedLines = 0

  for (const line of state.lines) {
    const expected = resolveExpectedState(state.layout, line.scene, keyframeId)
    const actual = classifyLine(line)

    if (line.scene === formedScene) {
      formedLines += 1
    }

    if (!isStateMet(actual, expected)) {
      problems.push(`${describeLine(line, actual)}, expected ${expected}`)
    }
  }

  if (formedLines === 0) {
    problems.push(`no swept line in ${formedScene ?? keyframeId}`)
  }

  return problems
}

async function readLandingProblems(page: Page, keyframeId: string) {
  return findLandingProblems(await readPageState(page), keyframeId)
}

function findGuardedLines(state: PageState): SweptLine[] {
  const formedScene = findFormedScene(state.layout, state.formedId)
  const guarded: SweptLine[] = []

  for (const line of state.lines) {
    if (line.scene === formedScene && line.isInView) {
      guarded.push(line)
    }
  }

  return guarded
}

function findGuardProblems(state: PageState, top: number): string[] {
  const problems: string[] = []

  for (const line of findGuardedLines(state)) {
    const actual = classifyLine(line)

    if (!isStateMet(actual, "whole")) {
      problems.push(
        `at ${top}px with ${state.formedId} formed, ${describeLine(line, actual)}`
      )
    }
  }

  return problems
}

async function readSweepMismatches(page: Page, sceneIds: string[]) {
  return page.evaluate(
    function compareSweepWithReveal(input) {
      const problems: string[] = []

      for (const sceneId of input.sceneIds) {
        const container = document.querySelector<HTMLElement>(
          `[data-dot-scene="${sceneId}"]`
        )

        if (container === null) {
          problems.push("missing scene " + sceneId)
          continue
        }

        const reveal = Number(
          container.style.getPropertyValue("--scene-reveal")
        )
        const stagger = Number(
          container.style.getPropertyValue("--caption-stagger")
        )
        const lastValue = container.style.getPropertyValue("--caption-last")
        const last = lastValue === "" ? input.defaultLast : Number(lastValue)

        for (const line of container.querySelectorAll<HTMLElement>(
          input.lineSelector
        )) {
          if (line.getClientRects().length === 0) {
            continue
          }

          const lineIndex = Number(line.style.getPropertyValue("--line"))
          const style = getComputedStyle(line)
          const grow = Number(style.getPropertyValue("--title-grow"))
          const gate = Math.min(
            1,
            Math.max(0, 1 - (Number.isNaN(grow) ? 0 : grow) * input.gateRate)
          )
          let captionReveal = Math.min(reveal, gate)

          if (line.classList.contains(input.titleWordClass)) {
            const hold = Number(style.getPropertyValue("--title-hold"))

            captionReveal = Math.max(
              captionReveal,
              Number.isNaN(hold) ? 0 : hold
            )
          }

          const lineReveal = Math.min(
            1,
            Math.max(
              0,
              captionReveal * (1 + last * stagger) - lineIndex * stagger
            )
          )
          const expectedRight = 100 - lineReveal * input.clipSpan
          const expectedShift = (lineReveal - 1) * input.slide
          const match = /^inset\(\S+ (\S+)/.exec(style.clipPath)
          const right = match === null ? Number.NaN : parseFloat(match[1] ?? "")
          const shift =
            style.translate === "none" ? 0 : parseFloat(style.translate)
          const isRightMet = Math.abs(right - expectedRight) <= input.tolerance
          const isShiftMet = Math.abs(shift - expectedShift) <= input.tolerance

          if (!isRightMet || !isShiftMet) {
            problems.push(
              `${sceneId} line ${lineIndex} at reveal ${reveal}: ` +
                `${style.clipPath} / ${style.translate}, expected ` +
                `${expectedRight.toFixed(2)}% / ${expectedShift.toFixed(2)}px`
            )
          }
        }
      }

      return problems
    },
    {
      sceneIds,
      lineSelector: LINE_SELECTOR,
      clipSpan: CAPTION_CLIP_SPAN_PERCENT,
      slide: CAPTION_SLIDE_PX,
      tolerance: SWEEP_TOLERANCE,
      defaultLast: DEFAULT_CAPTION_LAST,
      titleWordClass: TITLE_WORD_CLASS,
      gateRate: TITLE_GATE_RATE,
    }
  )
}

async function readSceneReveal(page: Page, sceneId: string) {
  return page.evaluate(function readReveal(id) {
    const container = document.querySelector<HTMLElement>(
      `[data-dot-scene="${id}"]`
    )

    return Number(container?.style.getPropertyValue("--scene-reveal") ?? "")
  }, sceneId)
}

async function followTransit(page: Page, shares: number[]) {
  const reveals: TransitReveal[] = []

  for (const share of shares) {
    await scrollIntoTransit(page, {
      from: "about",
      to: "testimonials",
      share,
    })
    await waitForDotsRest(page)

    expect(
      await readSweepMismatches(page, ["about", "testimonials"]),
      `at ${share} of the transit`
    ).toEqual([])

    reveals.push({
      share,
      leaving: await readSceneReveal(page, "about"),
      arriving: await readSceneReveal(page, "testimonials"),
    })
  }

  return reveals
}

async function expectLanding(page: Page, sceneId: string, stepIndex: number) {
  const keyframeId = await landOnKeyframe(page, sceneId, stepIndex)

  await expect
    .poll(
      function readLanding() {
        return readLandingProblems(page, keyframeId)
      },
      { message: keyframeId, timeout: LINE_TIMEOUT_MS }
    )
    .toEqual([])
}

async function focusPreviousTabbable(page: Page, selector: string) {
  return page.evaluate(
    function focusBefore(input) {
      const target = document.querySelector(input.selector)
      let previous: HTMLElement | null = null

      for (const candidate of document.querySelectorAll<HTMLElement>(
        input.tabbable
      )) {
        if (candidate === target) {
          break
        }

        const isTabbable =
          candidate.tabIndex >= 0 &&
          candidate.checkVisibility({ visibilityProperty: true })

        if (isTabbable) {
          previous = candidate
        }
      }

      previous?.focus({ preventScroll: true })

      return previous !== null && document.activeElement === previous
    },
    { selector, tabbable: TABBABLE_SELECTOR }
  )
}

async function readFocusProblems(page: Page, isSceneDark: boolean) {
  return page.evaluate(
    function inspectFocusedLine(input) {
      const problems: string[] = []
      const active = document.activeElement

      if (!(active instanceof HTMLElement) || active === document.body) {
        return ["nothing is focused"]
      }

      const label =
        active.tagName.toLowerCase() +
        ' "' +
        (active.textContent ?? "").trim().slice(0, input.textLength) +
        '"'
      const scene = active.closest<HTMLElement>("[data-dot-scene]")
      const line = active.closest<HTMLElement>(input.lineSelector)

      function readAlpha(color: string): number {
        if (color === "transparent") {
          return 0
        }

        const slashed = /\/\s*([\d.]+)(%?)\s*\)$/.exec(color)

        if (slashed !== null) {
          const alpha = parseFloat(slashed[1] ?? "")

          return slashed[2] === "%" ? alpha / 100 : alpha
        }

        const commaed = /^rgba\((?:[^,]+,){3}\s*([\d.]+)\)$/.exec(color)

        if (commaed !== null) {
          return parseFloat(commaed[1] ?? "")
        }

        return 1
      }

      function readRingSpread(boxShadow: string): number {
        const shadows: string[] = []
        let depth = 0
        let current = ""
        let spread = 0

        for (const character of boxShadow) {
          if (character === "(") {
            depth += 1
          }

          if (character === ")") {
            depth -= 1
          }

          if (character === "," && depth === 0) {
            shadows.push(current)
            current = ""
            continue
          }

          current += character
        }

        shadows.push(current)

        for (const shadow of shadows) {
          const colorEnd = shadow.lastIndexOf(")") + 1
          const lengths = shadow.slice(colorEnd).trim().split(/\s+/)
          const shadowSpread = parseFloat(lengths[3] ?? "")

          if (
            readAlpha(shadow.slice(0, colorEnd).trim()) > 0 &&
            shadowSpread > spread
          ) {
            spread = shadowSpread
          }
        }

        return spread
      }

      function isLineWhole(style: CSSStyleDeclaration): boolean {
        const match = /^inset\((.+)\)$/.exec(style.clipPath)

        if (style.clipPath !== "none" && match === null) {
          return false
        }

        for (const token of (match?.[1] ?? "").split(" ")) {
          if (parseFloat(token) > 0) {
            return false
          }
        }

        if (style.translate === "none") {
          return true
        }

        return Math.abs(parseFloat(style.translate)) <= input.translateTolerance
      }

      if (!active.matches(":focus-visible")) {
        problems.push(label + " has no visible focus")
      }

      if (scene === null || line === null || !scene.contains(line)) {
        problems.push(label + " is not in a swept line")

        return problems
      }

      const reveal = scene.style.getPropertyValue("--scene-reveal")
      const sceneLit = Number(
        getComputedStyle(scene).getPropertyValue("--scene-lit")
      )

      if (input.isSceneDark && reveal !== "0.000") {
        problems.push(
          (scene.dataset.dotScene ?? "") + " is lit by its dots at " + reveal
        )
      }

      if (sceneLit !== 1) {
        problems.push(
          (scene.dataset.dotScene ?? "") + " --scene-lit is " + sceneLit
        )
      }

      const lineStyle = getComputedStyle(line)

      if (lineStyle.clipPath !== "none" || lineStyle.translate !== "none") {
        problems.push(
          label +
            " sits in a clipped line: " +
            lineStyle.clipPath +
            " / " +
            lineStyle.translate
        )
      }

      for (const other of scene.querySelectorAll<HTMLElement>(
        input.lineSelector
      )) {
        if (other === line || other.getClientRects().length === 0) {
          continue
        }

        const style = getComputedStyle(other)

        if (!isLineWhole(style)) {
          problems.push(
            '"' +
              (other.textContent ?? "").trim().slice(0, input.textLength) +
              '" is not lit: ' +
              style.clipPath +
              " / " +
              style.translate
          )
        }
      }

      const spread = readRingSpread(getComputedStyle(active).boxShadow)
      const rect = active.getBoundingClientRect()
      const ring = {
        left: rect.left - spread,
        top: rect.top - spread,
        right: rect.right + spread,
        bottom: rect.bottom + spread,
      }

      if (spread <= 0) {
        problems.push(label + " has no focus ring")
      }

      let ancestor: HTMLElement | null = active

      while (ancestor !== null) {
        const style = getComputedStyle(ancestor)
        const name = ancestor.tagName.toLowerCase()
        const clipsOverflow =
          ancestor !== active &&
          (style.overflowX !== "visible" ||
            style.overflowY !== "visible" ||
            /paint|strict|content/.test(style.contain))

        if (style.clipPath !== "none") {
          problems.push("the ring is clipped by " + name + " " + style.clipPath)
        }

        if (clipsOverflow) {
          const box = ancestor.getBoundingClientRect()
          const isInside =
            ring.left >= box.left &&
            ring.top >= box.top &&
            ring.right <= box.right &&
            ring.bottom <= box.bottom

          if (!isInside) {
            problems.push("the ring overflows " + name)
          }
        }

        ancestor = ancestor.parentElement
      }

      return problems
    },
    {
      isSceneDark,
      lineSelector: LINE_SELECTOR,
      textLength: LINE_TEXT_LENGTH,
      translateTolerance: TRANSLATE_TOLERANCE_PX,
    }
  )
}

async function expectFocusLit(page: Page, isSceneDark: boolean) {
  await expect
    .poll(
      function readFocusedScene() {
        return readFocusProblems(page, isSceneDark)
      },
      {
        message: isSceneDark ? "with the scene's dots away" : "after Tab",
        timeout: LINE_TIMEOUT_MS,
      }
    )
    .toEqual([])
}

function readStatTargets(): number[] {
  const targets: number[] = []

  for (const stat of ABOUT_SECTION.stats) {
    const count = parseStatCount(stat.value)

    if (count !== null) {
      targets.push(count.target)
    }
  }

  return targets
}

function readCounterValue(counterReset: string): number {
  const match = STAT_COUNTER_PATTERN.exec(counterReset)

  return match === null ? Number.NaN : Number(match[1])
}

function buildStatsSnapshot(): string {
  let snapshot = "- /children: equal\n"

  for (const stat of ABOUT_SECTION.stats) {
    snapshot += `- term: ${JSON.stringify(stat.label)}\n`
    snapshot += `- definition: ${JSON.stringify(stat.value)}\n`
  }

  return snapshot
}

async function readStats(page: Page) {
  return page.evaluate(function readStatCounts() {
    const about = document.querySelector<HTMLElement>(
      '[data-dot-scene="about"]'
    )
    const stats: {
      value: string
      counterReset: string
      overlayDisplay: string
      overlayWidth: number
      valueWidth: number
      valueAlpha: number
      valueVisibility: string
      isValueHit: boolean
    }[] = []

    function readAlpha(color: string): number {
      if (color === "transparent") {
        return 0
      }

      const slashed = /\/\s*([\d.]+)(%?)\s*\)$/.exec(color)

      if (slashed !== null) {
        const alpha = parseFloat(slashed[1] ?? "")

        return slashed[2] === "%" ? alpha / 100 : alpha
      }

      const commaed = /^rgba\((?:[^,]+,){3}\s*([\d.]+)\)$/.exec(color)

      if (commaed !== null) {
        return parseFloat(commaed[1] ?? "")
      }

      return 1
    }

    for (const definition of about?.querySelectorAll("dd") ?? []) {
      const value = definition.querySelector(":scope > :not([data-suffix])")
      const overlay = definition.querySelector(":scope > [data-suffix]")

      if (value === null || overlay === null) {
        continue
      }

      const valueStyle = getComputedStyle(value)
      const rect = value.getBoundingClientRect()
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )

      stats.push({
        value: value.textContent ?? "",
        counterReset: getComputedStyle(overlay).counterReset,
        overlayDisplay: getComputedStyle(overlay).display,
        overlayWidth: overlay.getBoundingClientRect().width,
        valueWidth: rect.width,
        valueAlpha: readAlpha(valueStyle.color),
        valueVisibility: valueStyle.visibility,
        isValueHit: hit !== null && definition.contains(hit),
      })
    }

    return {
      reveal: Number(about?.style.getPropertyValue("--scene-reveal") ?? ""),
      stats,
    }
  })
}

async function readFormedStatProblems(page: Page, targets: number[]) {
  const reading = await readStats(page)
  const problems: string[] = []

  if (reading.stats.length !== targets.length) {
    problems.push(`${reading.stats.length} counters for ${targets.length}`)
  }

  for (let statIndex = 0; statIndex < reading.stats.length; statIndex += 1) {
    const stat = reading.stats[statIndex]
    const target = targets[statIndex]

    if (stat === undefined) {
      continue
    }

    if (stat.counterReset !== `stat-count ${target}`) {
      problems.push(`${stat.value} counts ${stat.counterReset}`)
    }

    if (stat.overlayDisplay === "none") {
      problems.push(`${stat.value} has no counter`)
    }

    if (stat.valueAlpha !== 0) {
      problems.push(`${stat.value} shows under its counter`)
    }

    if (
      Math.abs(stat.overlayWidth - stat.valueWidth) > STAT_WIDTH_TOLERANCE_PX
    ) {
      problems.push(
        `${stat.value} counter is ${stat.overlayWidth}px wide over ${stat.valueWidth}px`
      )
    }
  }

  return problems
}

async function readStatDefinitions(page: Page) {
  const session = await page.context().newCDPSession(page)

  try {
    await session.send("DOM.enable")
    await session.send("Accessibility.enable")

    const documentNode = await session.send("DOM.getDocument", { depth: 0 })
    const query = await session.send("DOM.querySelector", {
      nodeId: documentNode.root.nodeId,
      selector: "#about dl",
    })
    const description = await session.send("DOM.describeNode", {
      nodeId: query.nodeId,
    })
    const tree = await session.send("Accessibility.getFullAXTree", {})
    const nodesById = new Map<string, AccessibilityNode>()
    const definitions: string[] = []
    let listNode: AccessibilityNode | null = null

    for (const node of tree.nodes) {
      nodesById.set(node.nodeId, node)

      if (node.backendDOMNodeId === description.node.backendNodeId) {
        listNode = node
      }
    }

    function collectText(node: AccessibilityNode): string {
      let text = ""

      if (!node.ignored && node.role?.value === "StaticText") {
        text += String(node.name?.value ?? "")
      }

      for (const childId of node.childIds ?? []) {
        const child = nodesById.get(childId)

        if (child !== undefined) {
          text += collectText(child)
        }
      }

      return text
    }

    function collectDefinitions(node: AccessibilityNode) {
      if (node.role?.value === "definition") {
        definitions.push(collectText(node))
        return
      }

      for (const childId of node.childIds ?? []) {
        const child = nodesById.get(childId)

        if (child !== undefined) {
          collectDefinitions(child)
        }
      }
    }

    if (listNode !== null) {
      collectDefinitions(listNode)
    }

    return definitions
  } finally {
    await session.detach()
  }
}

async function readUnsweptProblems(page: Page) {
  return page.evaluate(
    function findSweptOrDrifting(input) {
      const problems: string[] = []

      for (const line of document.querySelectorAll<HTMLElement>(
        input.lineSelector
      )) {
        const style = getComputedStyle(line)

        if (style.clipPath !== "none" || style.translate !== "none") {
          problems.push(
            '"' +
              (line.textContent ?? "").trim().slice(0, input.textLength) +
              '" is swept: ' +
              style.clipPath +
              " / " +
              style.translate
          )
        }
      }

      for (const child of document.querySelectorAll<HTMLElement>(
        input.driftSelector
      )) {
        const transform = getComputedStyle(child).transform

        if (transform !== "none") {
          problems.push(
            '"' +
              (child.textContent ?? "").trim().slice(0, input.textLength) +
              '" drifts: ' +
              transform
          )
        }
      }

      return problems
    },
    {
      lineSelector: LINE_SELECTOR,
      driftSelector: COPY_DRIFT_CHILD_SELECTOR,
      textLength: LINE_TEXT_LENGTH,
    }
  )
}

async function readSightings(
  page: Page,
  sceneId: string,
  top: number | null
): Promise<SceneSightings> {
  return page.evaluate(
    function scrollAndSightLines(input) {
      if (input.top !== null) {
        window.scrollTo({ top: input.top, behavior: "instant" })
      }

      return new Promise<SceneSightings>(function sightAfterFrames(resolve) {
        let frames = 0

        function sightLines() {
          frames += 1

          if (frames < input.settleFrames) {
            window.requestAnimationFrame(sightLines)
            return
          }

          const container = document.querySelector<HTMLElement>(
            `[data-dot-scene="${input.sceneId}"]`
          )
          const lines: LineSighting[] = []

          for (const line of container?.querySelectorAll<HTMLElement>(
            input.lineSelector
          ) ?? []) {
            const rect = line.getBoundingClientRect()
            const style = getComputedStyle(line)
            const counts: string[] = []

            for (const overlay of line.querySelectorAll("[data-suffix]")) {
              counts.push(getComputedStyle(overlay).counterReset)
            }

            lines.push({
              text: (line.textContent ?? "").trim().slice(0, input.textLength),
              isRendered: line.getClientRects().length > 0,
              top: rect.top,
              bottom: rect.bottom,
              clipPath: style.clipPath,
              translate: style.translate,
              counts,
            })
          }

          resolve({
            scrollY: window.scrollY,
            viewportHeight: window.innerHeight,
            reveal: container?.style.getPropertyValue("--scene-reveal") ?? "",
            lines,
          })
        }

        window.requestAnimationFrame(sightLines)
      })
    },
    {
      sceneId,
      top,
      settleFrames: SCAN_SETTLE_FRAMES,
      lineSelector: LINE_SELECTOR,
      textLength: LINE_TEXT_LENGTH,
    }
  )
}

async function readScanRange(page: Page, sceneId: string): Promise<ScanRange> {
  return page.evaluate(function measureScanRange(id) {
    const container = document.querySelector<HTMLElement>(
      `[data-dot-scene="${id}"]`
    )
    const frame = container?.firstElementChild

    if (container === null || frame === null || frame === undefined) {
      throw new Error("missing scene " + id)
    }

    const stickyTop = parseFloat(getComputedStyle(container).scrollMarginTop)
    const bottom = container.getBoundingClientRect().bottom + window.scrollY

    return {
      pinEnd: Math.floor(
        bottom - frame.getBoundingClientRect().height - stickyTop
      ),
      leave: Math.ceil(bottom - stickyTop),
    }
  }, sceneId)
}

function isInFullView(line: LineSighting, viewportHeight: number): boolean {
  const band = viewportHeight - HEADER_LINE_PX
  const isBottomInView = line.bottom <= viewportHeight + FULL_VIEW_TOLERANCE_PX

  if (line.bottom - line.top > band) {
    return isBottomInView && line.bottom > HEADER_LINE_PX
  }

  return isBottomInView && line.top >= HEADER_LINE_PX - FULL_VIEW_TOLERANCE_PX
}

function isAnyPendingInFullView(
  sightings: SceneSightings,
  pending: Map<number, string>
): boolean {
  for (const lineIndex of pending.keys()) {
    const line = sightings.lines[lineIndex]

    if (line !== undefined && isInFullView(line, sightings.viewportHeight)) {
      return true
    }
  }

  return false
}

function findReadingProblem(line: LineSighting, targets: number[]): string {
  const counts: number[] = []
  let isCounted =
    line.counts.length === 0 || line.counts.length === targets.length

  for (let statIndex = 0; statIndex < line.counts.length; statIndex += 1) {
    const count = readCounterValue(line.counts[statIndex] ?? "")

    counts.push(count)

    if (count !== targets[statIndex]) {
      isCounted = false
    }
  }

  if (
    isClipWhole(line.clipPath) &&
    isTranslateRested(line.translate) &&
    isCounted
  ) {
    return ""
  }

  let problem = `${line.clipPath} / ${line.translate}`

  if (counts.length > 0) {
    problem += `, counting ${counts.join(" ")}`
  }

  return problem
}

async function findUnreadableLines(
  page: Page,
  sceneId: string,
  targets: number[]
): Promise<string[]> {
  await landOnKeyframe(page, sceneId, 0)

  const range = await readScanRange(page, sceneId)
  const pending = new Map<number, string>()
  const firstViews = new Map<number, string>()
  const problems: string[] = []
  let sightings = await readSightings(page, sceneId, null)
  let nextTop = range.pinEnd

  for (let lineIndex = 0; lineIndex < sightings.lines.length; lineIndex += 1) {
    const line = sightings.lines[lineIndex]

    if (line?.isRendered === true) {
      pending.set(lineIndex, line.text)
    }
  }

  if (pending.size === 0) {
    return [`${sceneId} has no swept line`]
  }

  while (pending.size > 0) {
    if (isAnyPendingInFullView(sightings, pending)) {
      await waitForDotsRest(page, GROWN_REST_FRAMES)
      sightings = await readSightings(page, sceneId, null)

      for (const lineIndex of [...pending.keys()]) {
        const line = sightings.lines[lineIndex]

        if (
          line === undefined ||
          !isInFullView(line, sightings.viewportHeight)
        ) {
          continue
        }

        const problem = findReadingProblem(line, targets)

        if (problem === "") {
          pending.delete(lineIndex)
        } else if (!firstViews.has(lineIndex)) {
          firstViews.set(
            lineIndex,
            `at ${sightings.scrollY}px (--scene-reveal ${sightings.reveal}): ${problem}`
          )
        }
      }
    }

    if (nextTop > range.leave) {
      break
    }

    sightings = await readSightings(page, sceneId, nextTop)
    nextTop += SCAN_STEP_PX
  }

  for (const [lineIndex, text] of pending) {
    const firstView = firstViews.get(lineIndex)

    if (firstView === undefined) {
      problems.push(`${sceneId} "${text}" never comes into full view`)
    } else {
      problems.push(
        `${sceneId} "${text}" never reads whole in full view, first ${firstView}`
      )
    }
  }

  return problems
}

for (const viewport of LANDING_VIEWPORTS) {
  test.describe(`section text at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport })

    test("shows a formed scene's text whole and sweeps every other scene's out", async ({
      page,
    }) => {
      test.setTimeout(LANDING_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)

      await openRunningPage(page)

      for (const sceneId of SINGLE_FRAME_SCENES) {
        await expectLanding(page, sceneId, 0)
      }

      expect(problems).toEqual([])
    })

    test("keeps each step scene's label word whole at every formed step", async ({
      page,
    }) => {
      test.setTimeout(LANDING_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)

      await openRunningPage(page)

      for (const sceneId of STEP_SCENES) {
        const keyframeIds = await readKeyframeIds(page, sceneId)

        for (
          let stepIndex = 0;
          stepIndex < keyframeIds.length;
          stepIndex += 1
        ) {
          await expectLanding(page, sceneId, stepIndex)
        }
      }

      expect(problems).toEqual([])
    })
  })
}

test.describe("section text between About and Testimonials", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("sweeps About out and Testimonials in with the dots, and back again", async ({
    page,
  }) => {
    test.setTimeout(LANDING_TEST_TIMEOUT_MS)

    const problems = collectPageProblems(page)
    const upShares: number[] = []

    for (const share of TRANSIT_SHARES) {
      upShares.unshift(share)
    }

    await openRunningPage(page)
    await expectLanding(page, "about", 0)

    const downReveals = await followTransit(page, TRANSIT_SHARES)

    await expectLanding(page, "testimonials", 0)

    const upReveals = await followTransit(page, upShares)

    await expectLanding(page, "about", 0)

    const firstDown = downReveals[0]
    const lastDown = downReveals[downReveals.length - 1]

    expect(firstDown?.leaving, "About mid-sweep as it leaves").toBeGreaterThan(
      0
    )
    expect(firstDown?.leaving).toBeLessThan(1)
    expect(
      lastDown?.arriving,
      "Testimonials mid-sweep as it arrives"
    ).toBeGreaterThan(0)
    expect(lastDown?.arriving).toBeLessThan(1)

    for (
      let revealIndex = 1;
      revealIndex < downReveals.length;
      revealIndex += 1
    ) {
      const previous = downReveals[revealIndex - 1]
      const current = downReveals[revealIndex]

      expect(current?.leaving, "About only sweeps out").toBeLessThanOrEqual(
        previous?.leaving ?? Number.NaN
      )
      expect(
        current?.arriving,
        "Testimonials only sweeps in"
      ).toBeGreaterThanOrEqual(previous?.arriving ?? Number.NaN)
    }

    for (const down of downReveals) {
      for (const up of upReveals) {
        if (up.share !== down.share) {
          continue
        }

        expect(
          Math.abs(up.leaving - down.leaving),
          `About replays at ${up.share}`
        ).toBeLessThanOrEqual(REVEAL_REPLAY_TOLERANCE)
        expect(
          Math.abs(up.arriving - down.arriving),
          `Testimonials replays at ${up.share}`
        ).toBeLessThanOrEqual(REVEAL_REPLAY_TOLERANCE)
      }
    }

    expect(problems).toEqual([])
  })
})

for (const viewport of GUARD_VIEWPORTS) {
  test.describe(`a stepped scroll at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport })

    test("leaves no text clipped in a formed scene at any stop", async ({
      page,
    }) => {
      test.setTimeout(WALK_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []
      let guardedLines = 0

      await openRunningPage(page)

      for (const top of await readScrollStops(page)) {
        await scrollToPosition(page, top)
        await waitForDotsRest(page)

        const state = await readPageState(page)

        if (state.formedId === "moving") {
          continue
        }

        guardedLines += findGuardedLines(state).length

        for (const failure of findGuardProblems(state, top)) {
          failures.push(failure)
        }
      }

      expect(guardedLines, "lines checked at formed stops").toBeGreaterThan(0)
      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })
  })
}

for (const viewport of GROWN_VIEWPORTS) {
  const spacing = viewport.hasTextSpacing ? " with text spacing" : ""

  test.describe(`grown frames at ${viewport.width}x${viewport.height}${spacing}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test("shows every quote, About and Testimonials line whole at a stop where it is fully in view", async ({
      page,
    }) => {
      test.setTimeout(WALK_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const targets = readStatTargets()
      const unreadable: string[] = []

      await openRunningPage(page)

      if (viewport.hasTextSpacing) {
        await page.addStyleTag({ content: TEXT_SPACING_CSS })
        await page.waitForTimeout(GATE_SETTLE_MS)
      }

      for (const sceneId of GROWN_SCENES) {
        for (const problem of await findUnreadableLines(
          page,
          sceneId,
          targets
        )) {
          unreadable.push(problem)
        }
      }

      expect(unreadable).toEqual([])
      expect(problems).toEqual([])
    })
  })
}

test.describe("section text from the keyboard", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("lights the FAQ for a summary tabbed to from before it", async ({
    page,
  }) => {
    test.setTimeout(LANDING_TEST_TIMEOUT_MS)

    await openRunningPage(page)
    await landOnKeyframe(page, "testimonials", 0)

    expect(await focusPreviousTabbable(page, FAQ_SUMMARY_SELECTOR)).toBe(true)

    await page.keyboard.press("Tab")
    await expect(page.locator(FAQ_SUMMARY_SELECTOR).first()).toBeFocused()
    await waitForScrollRest(page)
    await expectFocusLit(page, false)

    await landOnKeyframe(page, "testimonials", 0)
    await expectFocusLit(page, true)
  })

  test("lights Contact for its email link tabbed to from the last FAQ row", async ({
    page,
  }) => {
    test.setTimeout(LANDING_TEST_TIMEOUT_MS)

    await openRunningPage(page)
    await landOnKeyframe(page, "dust", 0)
    await page.locator(FAQ_SUMMARY_SELECTOR).last().focus()

    await page.keyboard.press("Tab")
    await expect(page.locator(CONTACT_EMAIL_SELECTOR)).toBeFocused()
    await waitForScrollRest(page)
    await expectFocusLit(page, false)

    await landOnKeyframe(page, "dust", 0)
    await expectFocusLit(page, true)
  })

  test("lights the footer for each link tabbed to from the contact form", async ({
    page,
  }) => {
    test.setTimeout(LANDING_TEST_TIMEOUT_MS)

    const links = page.locator(FOOTER_LINK_SELECTOR)
    const linkCount = PORTFOLIO_PRIMARY_NAVIGATION.length + 2

    await openRunningPage(page)
    await expect(links).toHaveCount(linkCount)
    await landOnKeyframe(page, "contact", 0)
    await page.locator(CONTACT_SUBMIT_SELECTOR).focus()

    for (let linkIndex = 0; linkIndex < linkCount; linkIndex += 1) {
      await page.keyboard.press("Tab")
      await expect(links.nth(linkIndex)).toBeFocused()
      await waitForScrollRest(page)
      await expectFocusLit(page, false)

      await landOnKeyframe(page, "contact", 0)
      await expectFocusLit(page, true)
    }
  })
})

test.describe("the About stats", () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("count up with About's dots to their real values", async ({ page }) => {
    test.setTimeout(LANDING_TEST_TIMEOUT_MS)

    const targets = readStatTargets()

    expect(targets.length).toBe(ABOUT_SECTION.stats.length)

    await openRunningPage(page)
    await scrollIntoTransit(page, {
      from: "process",
      to: "about",
      share: STAT_ARRIVAL_SHARE,
    })
    await waitForDotsRest(page)

    const arriving = await readStats(page)
    let countingStats = 0

    expect(arriving.reveal, "About mid-arrival").toBeGreaterThan(0)
    expect(arriving.reveal).toBeLessThan(1)
    expect(arriving.stats.length).toBe(targets.length)

    for (let statIndex = 0; statIndex < targets.length; statIndex += 1) {
      const target = targets[statIndex] ?? Number.NaN
      const count = readCounterValue(
        arriving.stats[statIndex]?.counterReset ?? ""
      )

      expect(count, `count ${statIndex}`).toBeGreaterThanOrEqual(0)
      expect(count, `count ${statIndex}`).toBeLessThanOrEqual(target)

      if (count > 0 && count < target) {
        countingStats += 1
      }
    }

    expect(countingStats, "a stat mid-count").toBeGreaterThan(0)

    await landOnKeyframe(page, "about", 0)
    await expect
      .poll(
        function readFormedStats() {
          return readFormedStatProblems(page, targets)
        },
        { timeout: LINE_TIMEOUT_MS }
      )
      .toEqual([])
  })

  test("read each real value once and never the count", async ({ page }) => {
    await openRunningPage(page)

    const idle = await readStats(page)
    const realValues: string[] = []

    for (const stat of ABOUT_SECTION.stats) {
      realValues.push(stat.value)
    }

    await expect(page.locator(STAGE_SELECTOR)).not.toHaveAttribute(
      "data-scene",
      "about"
    )
    expect(idle.reveal).toBe(0)
    expect(idle.stats.length).toBe(realValues.length)

    for (const stat of idle.stats) {
      expect(stat.counterReset, `${stat.value} counter at 0`).toBe(
        "stat-count 0"
      )
      expect(stat.overlayDisplay, `${stat.value} counter shown`).not.toBe(
        "none"
      )
    }

    await expect(page.locator("#about dl")).toMatchAriaSnapshot(
      buildStatsSnapshot()
    )
    expect(await readStatDefinitions(page)).toEqual(realValues)
  })
})

test.describe("the About stats in forced colours", () => {
  test.use({ viewport: DESKTOP_VIEWPORT, forcedColors: "active" })

  test("drop the counter and show the real values", async ({ page }) => {
    await openRunningPage(page)
    await landOnKeyframe(page, "about", 0)

    const formed = await readStats(page)

    expect(formed.stats.length).toBe(ABOUT_SECTION.stats.length)

    for (const stat of formed.stats) {
      expect(stat.overlayDisplay, `${stat.value} counter`).toBe("none")
      expect(stat.valueAlpha, `${stat.value} colour`).toBeGreaterThan(0)
      expect(stat.valueVisibility, `${stat.value} visibility`).toBe("visible")
      expect(stat.isValueHit, `${stat.value} on top`).toBe(true)
    }
  })
})

for (const viewport of REDUCED_MOTION_VIEWPORTS) {
  test.describe(`section text under reduced motion at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport, reducedMotion: "reduce" })

    test("never clips, slides or drifts any section text on a stepped scroll", async ({
      page,
    }) => {
      test.setTimeout(WALK_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)

      await openRunningPage(page)

      expect(
        await page.locator(COPY_DRIFT_CHILD_SELECTOR).count()
      ).toBeGreaterThan(0)
      expect(await page.locator(LINE_SELECTOR).count()).toBeGreaterThan(0)

      for (const top of await readScrollStops(page)) {
        await scrollToPosition(page, top)
        await waitForDotsRest(page)

        expect(await readUnsweptProblems(page), `at ${top}px`).toEqual([])
      }

      expect(problems).toEqual([])
    })
  })
}
