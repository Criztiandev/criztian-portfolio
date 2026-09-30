import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import {
  MOTION_PAUSED_VALUE,
  MOTION_PREFERENCE_EVENT,
} from "@/data/motion.data"
import {
  ABOUT_SECTION,
  CONTACT_SECTION,
  FAQ_SECTION,
  PROCESS_SCENE,
  SCENE_SLOT_ATTRIBUTE,
  SECTION_TITLE_COUNT_CLASS,
  SERVICES_SCENE,
  TESTIMONIALS_SECTION,
} from "@/data/page-sections.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"

const STAGE_SELECTOR = "[data-status]"

const WORD_SELECTOR = "h2 > :first-child"

const COUNT_SELECTOR = `.${SECTION_TITLE_COUNT_CLASS}`

const SLOT_SELECTOR = `[${SCENE_SLOT_ATTRIBUTE}]`

const STATEMENT_SELECTOR = ".font-display"

const TITLE_VIEWPORTS = [
  { width: 1440, height: 900, labelFontPx: 20 },
  { width: 390, height: 844, labelFontPx: 18 },
]

const TITLED_SECTIONS = [
  { id: PROJECTS_SCENE_ID, hasCount: true },
  { id: SERVICES_SCENE.id, hasCount: true },
  { id: PROCESS_SCENE.id, hasCount: true },
  { id: ABOUT_SECTION.id, hasCount: false },
  { id: TESTIMONIALS_SECTION.id, hasCount: false },
  { id: CONTACT_SECTION.id, hasCount: false },
]

const STILL_SECTION_IDS = [SERVICES_SCENE.id, ABOUT_SECTION.id]

const LABEL_FONT_FAMILY = "Antonio"

const LABEL_FONT_WEIGHT = "700"

const LABEL_BOX_PX = 16

const BIG_SCALE_MIN = 2

const SCALE_TOLERANCE = 0.001

const MEASURE_TOLERANCE_PX = 0.5

const OVERLAP_TOLERANCE_PX = 2

const HIDDEN_RIGHT_INSET_PERCENT = 100

const BEFORE_ENTRY_SHARE = -0.1

const HIDDEN_SHARES = [0.2, 0.32]

const ARRIVAL_SHARES = [0.46, 0.56, 0.66]

const RETURN_SHARE = 0.56

const COVER_SHARES = [0.44, 0.55, 0.66, 0.8]

const COPY_HELD_SHARES = [0.55, 0.76]

const DOCKED_SHARES = [0.92, 0.94, 0.96, 0.98, 1]

const SCROLL_STEPS = 10

const RUNNING_TIMEOUT_MS = 15000

const SCENE_TIMEOUT_MS = 10000

const DOCK_TIMEOUT_MS = 5000

const TITLE_TEST_TIMEOUT_MS = 300000

const DOTS_REST_FRAMES = 30

const DOTS_REST_MAX_FRAMES = 600

type TitledSection = {
  id: string
  hasCount: boolean
}

type Box = {
  name: string
  left: number
  top: number
  right: number
  bottom: number
}

type Statement = {
  clipPath: string
  inks: number[]
}

type TitleReading = {
  scale: string
  fontFamily: string
  fontWeight: string
  fontSize: string
  labelHeight: number
  clipPath: string
  word: Box
  countOpacity: number | null
  frame: Box[]
  statement: Statement | null
  viewportWidth: number
  scrollWidth: number
}

type EntryRange = {
  start: number
  end: number
}

type EntrySample = {
  share: number
  reading: TitleReading
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

async function waitForDotsRest(page: Page) {
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
    { restFrames: DOTS_REST_FRAMES, maxFrames: DOTS_REST_MAX_FRAMES }
  )
}

async function scrollToPosition(page: Page, top: number) {
  await page.evaluate(function scrollInstantly(position) {
    window.scrollTo({ top: position, behavior: "instant" })
  }, top)
}

async function stepScroll(page: Page, target: number) {
  await page.evaluate(
    function scrollInSteps(input) {
      const from = window.scrollY

      return new Promise<void>(function stepThroughFrames(resolve) {
        let step = 0

        function scrollOneStep() {
          step += 1
          window.scrollTo({
            top: from + ((input.target - from) * step) / input.steps,
            behavior: "instant",
          })

          if (step >= input.steps) {
            resolve()
            return
          }

          window.requestAnimationFrame(scrollOneStep)
        }

        window.requestAnimationFrame(scrollOneStep)
      })
    },
    { target, steps: SCROLL_STEPS }
  )
}

async function landOnAnchor(page: Page, id: string) {
  await page.evaluate(function scrollToAnchor(sectionId) {
    const section = document.getElementById(sectionId)

    if (section === null) {
      throw new Error("missing section " + sectionId)
    }

    section.scrollIntoView({ block: "start", behavior: "instant" })
  }, id)
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

async function readFirstKeyframeId(page: Page, id: string) {
  const scene = await page.evaluate(function readScene(sectionId) {
    const section = document.getElementById(sectionId)

    return {
      sceneId: section?.dataset.dotScene ?? "",
      shapes: (section?.dataset.dotShapes ?? "").split(" "),
    }
  }, id)

  return resolveKeyframeIds(scene.sceneId, scene.shapes)[0] ?? ""
}

async function readEntryRange(page: Page, id: string): Promise<EntryRange> {
  return page.evaluate(function measureEntry(sectionId) {
    const section = document.getElementById(sectionId)

    if (section === null) {
      throw new Error("missing section " + sectionId)
    }

    const stickyTop = parseFloat(getComputedStyle(section).scrollMarginTop)
    const top = section.getBoundingClientRect().top + window.scrollY

    return { start: top - window.innerHeight, end: top - stickyTop }
  }, id)
}

function resolveEntryTop(range: EntryRange, share: number): number {
  return range.start + share * (range.end - range.start)
}

async function readTitle(page: Page, id: string): Promise<TitleReading> {
  return page.evaluate(
    function readSectionTitle(input) {
      const section = document.getElementById(input.id)
      const word = section?.querySelector(input.wordSelector)
      const label = word?.parentElement

      if (
        section === null ||
        word === null ||
        word === undefined ||
        label === null ||
        label === undefined
      ) {
        throw new Error("missing the label of " + input.id)
      }

      const style = getComputedStyle(word)
      const count = label.querySelector(input.countSelector)
      const slot = section.querySelector(input.slotSelector)
      const frame: Box[] = []
      let countOpacity: number | null = null
      let statement: Statement | null = null

      function readBox(name: string, element: Element): Box {
        const rect = element.getBoundingClientRect()

        return {
          name,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        }
      }

      function hasOwnText(element: Element): boolean {
        for (const node of element.childNodes) {
          const isText = node.nodeType === Node.TEXT_NODE

          if (isText && (node.textContent ?? "").trim() !== "") {
            return true
          }
        }

        return false
      }

      function readInks(root: Element): number[] {
        const holders: Element[] = [root]
        const inks: number[] = []

        for (const descendant of root.querySelectorAll("*")) {
          holders.push(descendant)
        }

        for (const holder of holders) {
          if (!hasOwnText(holder)) {
            continue
          }

          let ink = 1
          let current: Element | null = holder

          while (current !== null) {
            ink *= Number(getComputedStyle(current).opacity)

            if (current === root) {
              break
            }

            current = current.parentElement
          }

          inks.push(ink)
        }

        return inks
      }

      if (slot !== null) {
        frame.push(readBox("slot", slot))

        if (
          getComputedStyle(slot).position === "absolute" &&
          slot.parentElement !== null
        ) {
          frame.push(readBox("plate", slot.parentElement))
        }
      }

      for (const candidate of section.querySelectorAll(
        input.statementSelector
      )) {
        if (
          candidate.closest("h2") !== null ||
          candidate.getClientRects().length === 0
        ) {
          continue
        }

        frame.push(readBox("statement", candidate))
        statement = {
          clipPath: getComputedStyle(candidate).clipPath,
          inks: readInks(candidate),
        }
        break
      }

      if (count !== null) {
        countOpacity = Number(getComputedStyle(count).opacity)
      }

      return {
        scale: style.scale,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
        labelHeight: label.getBoundingClientRect().height,
        clipPath: style.clipPath,
        word: readBox("word", word),
        countOpacity,
        frame,
        statement,
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }
    },
    {
      id,
      wordSelector: WORD_SELECTOR,
      countSelector: COUNT_SELECTOR,
      slotSelector: SLOT_SELECTOR,
      statementSelector: STATEMENT_SELECTOR,
    }
  )
}

async function walkEntry(page: Page, id: string): Promise<EntrySample[]> {
  const range = await readEntryRange(page, id)
  const samples: EntrySample[] = []

  await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
  await waitForDotsRest(page)

  for (let step = 0; step <= SCROLL_STEPS; step += 1) {
    const share = step / SCROLL_STEPS

    await scrollToPosition(page, resolveEntryTop(range, share))
    await waitForTwoFrames(page)

    samples.push({ share, reading: await readTitle(page, id) })
  }

  return samples
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

function isClipHidden(clipPath: string): boolean {
  return readRightInset(clipPath) >= HIDDEN_RIGHT_INSET_PERCENT
}

function isStatementHidden(statement: Statement): boolean {
  if (isClipHidden(statement.clipPath)) {
    return true
  }

  if (statement.inks.length === 0) {
    return false
  }

  for (const ink of statement.inks) {
    if (ink > 0) {
      return false
    }
  }

  return true
}

function isStatementWhole(statement: Statement): boolean {
  if (!isClipWhole(statement.clipPath) || statement.inks.length === 0) {
    return false
  }

  for (const ink of statement.inks) {
    if (ink < 1) {
      return false
    }
  }

  return true
}

function describeStatement(statement: Statement): string {
  return `${statement.clipPath}, ink ${statement.inks.join(" ")}`
}

function readScale(scale: string): number {
  if (scale === "none") {
    return 1
  }

  return parseFloat(scale)
}

function isDocked(reading: TitleReading): boolean {
  return Math.abs(readScale(reading.scale) - 1) <= SCALE_TOLERANCE
}

function describeBox(box: Box): string {
  return (
    `${Math.round(box.left)},${Math.round(box.top)} to ` +
    `${Math.round(box.right)},${Math.round(box.bottom)}`
  )
}

function isOverlapping(word: Box, box: Box): boolean {
  return (
    word.left < box.right - OVERLAP_TOLERANCE_PX &&
    word.right > box.left + OVERLAP_TOLERANCE_PX &&
    word.top < box.bottom - OVERLAP_TOLERANCE_PX &&
    word.bottom > box.top + OVERLAP_TOLERANCE_PX
  )
}

function findDockedProblems(
  section: TitledSection,
  reading: TitleReading,
  labelFontPx: number
): string[] {
  const problems: string[] = []

  if (!isDocked(reading)) {
    problems.push(`scale ${reading.scale}`)
  }

  if (!reading.fontFamily.startsWith(LABEL_FONT_FAMILY)) {
    problems.push(`font-family ${reading.fontFamily}`)
  }

  if (reading.fontWeight !== LABEL_FONT_WEIGHT) {
    problems.push(`font-weight ${reading.fontWeight}`)
  }

  if (reading.fontSize !== `${labelFontPx}px`) {
    problems.push(`font-size ${reading.fontSize}`)
  }

  if (Math.abs(reading.labelHeight - LABEL_BOX_PX) > MEASURE_TOLERANCE_PX) {
    problems.push(`a ${reading.labelHeight}px label box`)
  }

  if (!isClipWhole(reading.clipPath)) {
    problems.push(`clipped ${reading.clipPath}`)
  }

  if (section.hasCount && reading.countOpacity !== 1) {
    problems.push(`count opacity ${reading.countOpacity}`)
  }

  return problems
}

async function readDockedProblems(
  page: Page,
  section: TitledSection,
  labelFontPx: number
) {
  return findDockedProblems(
    section,
    await readTitle(page, section.id),
    labelFontPx
  )
}

function findArrivalProblems(
  section: TitledSection,
  share: number,
  reading: TitleReading
): string[] {
  const problems: string[] = []
  const place = `${section.id} at ${share} of its entry`

  if (readScale(reading.scale) <= BIG_SCALE_MIN) {
    problems.push(`${place}: scale ${reading.scale}`)
  }

  if (reading.word.left < 0 || reading.word.right > reading.viewportWidth) {
    problems.push(
      `${place}: the word spans ${describeBox(reading.word)} ` +
        `in a ${reading.viewportWidth}px viewport`
    )
  }

  if (reading.scrollWidth > reading.viewportWidth) {
    problems.push(`${place}: the page is ${reading.scrollWidth}px wide`)
  }

  if (!isClipWhole(reading.clipPath)) {
    problems.push(`${place}: the word is clipped ${reading.clipPath}`)
  }

  if (section.hasCount && reading.countOpacity !== 0) {
    problems.push(`${place}: count opacity ${reading.countOpacity}`)
  }

  return problems
}

function findCoverProblems(
  id: string,
  share: number,
  reading: TitleReading
): string[] {
  const problems: string[] = []
  const names: string[] = []

  for (const box of reading.frame) {
    names.push(box.name)

    if (isOverlapping(reading.word, box)) {
      problems.push(
        `${id} at ${share} of its entry: the word at ` +
          `${describeBox(reading.word)} covers the ${box.name} at ` +
          describeBox(box)
      )
    }
  }

  if (!names.includes("slot")) {
    problems.push(`${id} has no slot`)
  }

  if (!names.includes("statement")) {
    problems.push(`${id} has no statement`)
  }

  return problems
}

function findHeldCopyProblems(
  id: string,
  share: number,
  reading: TitleReading
): string[] {
  const problems: string[] = []
  const place = `${id} at ${share} of its entry`

  if (readScale(reading.scale) <= BIG_SCALE_MIN) {
    problems.push(`${place}: scale ${reading.scale}`)
  }

  if (reading.statement === null) {
    problems.push(`${place}: no statement`)
  } else if (!isStatementHidden(reading.statement)) {
    problems.push(
      `${place}: the statement shows ${describeStatement(reading.statement)}`
    )
  }

  return problems
}

function findPinnedStatementProblems(
  id: string,
  reading: TitleReading
): string[] {
  if (reading.statement === null) {
    return [`${id} has no statement`]
  }

  if (isStatementWhole(reading.statement)) {
    return []
  }

  return [
    `${id} at its pin: the statement is ${describeStatement(reading.statement)}`,
  ]
}

async function readPinnedStatementProblems(page: Page, id: string) {
  return findPinnedStatementProblems(id, await readTitle(page, id))
}

function findGrownSamples(id: string, samples: EntrySample[]): string[] {
  const problems: string[] = []

  for (const sample of samples) {
    if (!isDocked(sample.reading)) {
      problems.push(
        `${id} at ${sample.share} of its entry: scale ${sample.reading.scale}`
      )
    }
  }

  return problems
}

function findStillProblems(id: string, samples: EntrySample[]): string[] {
  const problems = findGrownSamples(id, samples)

  for (const sample of samples) {
    if (!isClipWhole(sample.reading.clipPath)) {
      problems.push(
        `${id} at ${sample.share} of its entry: clipped ` +
          sample.reading.clipPath
      )
    }
  }

  return problems
}

async function pauseMotion(page: Page) {
  await page.evaluate(
    function markMotionPaused(input) {
      document.documentElement.dataset.motion = input.pausedValue
      window.dispatchEvent(new Event(input.eventName))
    },
    { pausedValue: MOTION_PAUSED_VALUE, eventName: MOTION_PREFERENCE_EVENT }
  )
  await waitForTwoFrames(page)
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
  await openRunningPage(page)
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

for (const viewport of TITLE_VIEWPORTS) {
  test.describe(`section titles at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test("docks every label as bold Antonio in its 16px box at the scene its anchor forms", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const stage = page.locator(STAGE_SELECTOR)

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const keyframeId = await readFirstKeyframeId(page, section.id)

        await landOnAnchor(page, section.id)
        await expect(stage).toHaveAttribute("data-scene", keyframeId, {
          timeout: SCENE_TIMEOUT_MS,
        })
        await expect
          .poll(
            function readDockedLabel() {
              return readDockedProblems(page, section, viewport.labelFontPx)
            },
            { message: section.id, timeout: DOCK_TIMEOUT_MS }
          )
          .toEqual([])
      }

      expect(problems).toEqual([])
    })

    test("hides every label while the outgoing section's text wipes out", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForDotsRest(page)

        for (const share of HIDDEN_SHARES) {
          await stepScroll(page, resolveEntryTop(range, share))
          await waitForDotsRest(page)

          const reading = await readTitle(page, section.id)

          if (!isClipHidden(reading.clipPath)) {
            failures.push(
              `${section.id} at ${share} of its entry: the word shows ` +
                reading.clipPath
            )
          }
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("shows every label big, whole and inside the viewport while its section arrives", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForDotsRest(page)

        for (const share of ARRIVAL_SHARES) {
          await stepScroll(page, resolveEntryTop(range, share))
          await waitForDotsRest(page)

          for (const failure of findArrivalProblems(
            section,
            share,
            await readTitle(page, section.id)
          )) {
            failures.push(failure)
          }
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("never lays a big label over its own frame's slot, plate or statement", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForDotsRest(page)

        for (const share of COVER_SHARES) {
          await stepScroll(page, resolveEntryTop(range, share))
          await waitForDotsRest(page)

          for (const failure of findCoverProblems(
            section.id,
            share,
            await readTitle(page, section.id)
          )) {
            failures.push(failure)
          }
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("holds each section's copy back until its title has nearly docked", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []
      const stage = page.locator(STAGE_SELECTOR)

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)
        const keyframeId = await readFirstKeyframeId(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForDotsRest(page)

        for (const share of COPY_HELD_SHARES) {
          await stepScroll(page, resolveEntryTop(range, share))
          await waitForDotsRest(page)

          for (const failure of findHeldCopyProblems(
            section.id,
            share,
            await readTitle(page, section.id)
          )) {
            failures.push(failure)
          }
        }

        await landOnAnchor(page, section.id)
        await expect(stage).toHaveAttribute("data-scene", keyframeId, {
          timeout: SCENE_TIMEOUT_MS,
        })
        await expect
          .poll(
            function readPinnedStatement() {
              return readPinnedStatementProblems(page, section.id)
            },
            { message: section.id, timeout: DOCK_TIMEOUT_MS }
          )
          .toEqual([])
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("docks every label from 92% of its entry to the pin and grows it again on the way back", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await openRunningPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForDotsRest(page)
        await stepScroll(page, resolveEntryTop(range, DOCKED_SHARES[0] ?? 1))

        for (const share of DOCKED_SHARES) {
          await scrollToPosition(page, resolveEntryTop(range, share))
          await waitForTwoFrames(page)

          const reading = await readTitle(page, section.id)

          if (!isDocked(reading)) {
            failures.push(
              `${section.id} at ${share} of its entry: scale ${reading.scale}`
            )
          }
        }

        await stepScroll(page, resolveEntryTop(range, RETURN_SHARE))
        await waitForTwoFrames(page)

        const returned = await readTitle(page, section.id)

        if (readScale(returned.scale) <= BIG_SCALE_MIN) {
          failures.push(
            `${section.id} back at ${RETURN_SHARE} of its entry: scale ${returned.scale}`
          )
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("never grows the FAQ label through its entry", async ({ page }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)

      await openRunningPage(page)

      const samples = await walkEntry(page, FAQ_SECTION.id)

      expect(samples.length).toBe(SCROLL_STEPS + 1)
      expect(findGrownSamples(FAQ_SECTION.id, samples)).toEqual([])
      expect(problems).toEqual([])
    })

    test("never grows a label under reduced motion", async ({ page }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await page.emulateMedia({ reducedMotion: "reduce" })
      await openRunningPage(page)

      for (const id of STILL_SECTION_IDS) {
        for (const failure of findStillProblems(
          id,
          await walkEntry(page, id)
        )) {
          failures.push(failure)
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("never grows a label while motion is paused", async ({ page }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const failures: string[] = []

      await openRunningPage(page)
      await pauseMotion(page)

      for (const id of STILL_SECTION_IDS) {
        for (const failure of findStillProblems(
          id,
          await walkEntry(page, id)
        )) {
          failures.push(failure)
        }
      }

      expect(failures).toEqual([])
      expect(problems).toEqual([])
    })

    test("shifts no layout while every titled section arrives", async ({
      page,
    }) => {
      test.setTimeout(TITLE_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)

      await installShiftRecorder(page)

      const settledAt = await openSettledPage(page)

      for (const section of TITLED_SECTIONS) {
        const range = await readEntryRange(page, section.id)

        await scrollToPosition(page, resolveEntryTop(range, BEFORE_ENTRY_SHARE))
        await waitForTwoFrames(page)
        await stepScroll(page, resolveEntryTop(range, 1))
        await waitForTwoFrames(page)
      }

      expect(
        await readUnexpectedShifts(page, settledAt),
        "shifts without input"
      ).toEqual([])
      expect(problems).toEqual([])
    })
  })
}
