import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import {
  CONTACT_SERVICE_LABELS,
  CONTACT_SERVICE_PROMPT,
} from "@/data/contact.data"
import { DOT_STAGE_SELECTOR, FOOTER_SIGN_TEXT } from "@/data/hero.data"
import {
  CONNECT_SECTION,
  CONTACT_SECTION,
  COPY_DRIFT_CLASS,
  FAQ_SECTION,
  MAILTO_PREFIX,
} from "@/data/page-sections.data"

type Viewport = { width: number; height: number }

type DisclosureMethod = "click" | "Enter"

type AccessibilityProperty = {
  name: string
  value?: { value?: unknown }
}

type AccessibilityNode = {
  ignored: boolean
  role?: { value?: unknown }
  name?: { value?: unknown }
  description?: { value?: unknown }
  properties?: AccessibilityProperty[]
}

type SignLight = {
  width: number
  lit: number
  leftLit: number
  rightLit: number
  firstColumn: number
  lastColumn: number
}

type HoldCase = {
  viewport: Viewport
  isTrimmed: boolean
}

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const PHONE_VIEWPORT = { width: 390, height: 844 }

const WIDE_VIEWPORT = { width: 2560, height: 1600 }

const SHORT_PHONE_VIEWPORT = { width: 375, height: 548 }

const LANDSCAPE_TABLET_VIEWPORT = { width: 1024, height: 768 }

const LANDSCAPE_PHONE_VIEWPORT = { width: 720, height: 450 }

const ENDING_VIEWPORTS = [DESKTOP_VIEWPORT, PHONE_VIEWPORT]

const CHIP_FOCUS_VIEWPORTS = [DESKTOP_VIEWPORT, SHORT_PHONE_VIEWPORT]

const UPWARD_FOCUS_VIEWPORTS = [
  LANDSCAPE_TABLET_VIEWPORT,
  LANDSCAPE_PHONE_VIEWPORT,
]

const HOLD_CASES: HoldCase[] = [
  { viewport: WIDE_VIEWPORT, isTrimmed: false },
  { viewport: DESKTOP_VIEWPORT, isTrimmed: false },
  { viewport: DESKTOP_VIEWPORT, isTrimmed: true },
  { viewport: PHONE_VIEWPORT, isTrimmed: false },
]

const DISCLOSURE_METHODS: DisclosureMethod[] = ["click", "Enter"]

const FAQ_LANDING_SCENE = FAQ_SECTION.sceneId

const FOOTER_SCENE_ID = "footer"

const FOOTER_SELECTOR = `[data-dot-scene="${FOOTER_SCENE_ID}"]`

const FOOTER_SLOT_SELECTOR = `${FOOTER_SELECTOR} [data-dot-slot]`

const FAQ_ROW_SELECTOR = `#${FAQ_SECTION.id} details`

const FAQ_SUMMARY_SELECTOR = `#${FAQ_SECTION.id} summary`

const FAQ_SWEPT_ROW_SELECTOR = `#${FAQ_SECTION.id} li`

const FAQ_SLOT_SELECTOR = `#${FAQ_SECTION.id} [data-dot-slot]`

const FAQ_COPY_COLUMN_SELECTOR = `#${FAQ_SECTION.id} .${COPY_DRIFT_CLASS}`

const FAQ_TRIM_STYLE = `${FAQ_SWEPT_ROW_SELECTOR}:nth-child(n + 4) { display: none; }`

const CONNECT_EMAIL_SELECTOR = `#${CONNECT_SECTION.id} a[href^="${MAILTO_PREFIX}"]`

const CONTACT_FORM_SELECTOR = `#${CONTACT_SECTION.id} form`

const CONTACT_RADIO_SELECTOR = `#${CONTACT_SECTION.id} input[type="radio"]`

const CONTACT_NAME_SELECTOR = "#contact-name"

const CONTACT_MESSAGE_SELECTOR = "#contact-message"

const CONTACT_MESSAGE_TEXT = "Checking the focus clearance of the chips."

const UPWARD_FOCUS_ORDER = [
  "submit",
  "contact-message",
  "something_else",
  "contact-email",
  "contact-name",
]

const TRANSPARENT_COLOURS = ["transparent", "rgba(0, 0, 0, 0)"]

const STICKY_TOP_PX = 72

const HEADER_BAR_PX = 72

const OPENED_ROW_INDEX = 2

const TOP_TOLERANCE_PX = 0.5

const DISCLOSURE_WINDOW_MS = 800

const TRANSIT_STEPS = 40

const TRANSIT_STEP_MS = 60

const MIN_MOVING_FRAMES = 10

const MAX_REPORTED_PROBLEMS = 8

const TRANSLATE_TOLERANCE_PX = 0.5

const PIN_STOPS = 12

const OVERLAP_TOLERANCE_PX = 0.5

const HOLD_VIEWPORT_SHARE = 0.25

const HOLD_TOLERANCE_PX = 1

const TRIMMED_ROW_COUNT = 3

const LIT_CHANNEL_THRESHOLD = 128

const MIN_SIGN_LIT_PIXELS = 1000

const SIGN_EDGE_SHARE = 0.15

const SIGN_HALF_SHARE = 0.1

const FRAME_WINDOW_MS = 1000

const PHONE_SIGN_OFFSET_PX = 165.5

const PHONE_SIGN_TOLERANCE_PX = 2

const PHONE_FOOTER_BAR_PX = 213

const CHIP_TARGET_TOP_PX = 20

const CHIP_PLACEMENT_TOLERANCE_PX = 1

const CHIP_CLEARANCE_PX = 70

const SHIFT_TAB_LIMIT = 8

const STEADY_FRAMES = 10

const STAGE_TIMEOUT_MS = 15000

const SCENE_TIMEOUT_MS = 10000

const SETTLE_TIMEOUT_MS = 5000

const REST_TIMEOUT_MS = 12000

const TRANSIT_TEST_TIMEOUT_MS = 60000

function describeViewport(viewport: Viewport) {
  return `${viewport.width}x${viewport.height}`
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

  const stage = page.locator(DOT_STAGE_SELECTOR)

  await expect(stage).toHaveAttribute("data-status", "running", {
    timeout: STAGE_TIMEOUT_MS,
  })
  await page.evaluate(function waitForDocumentFonts() {
    return document.fonts.ready.then(function settle() {
      return true
    })
  })

  return stage
}

async function openFaqLanding(page: Page) {
  const stage = await openRunningPage(page, `/#${FAQ_SECTION.id}`)

  await expect(stage).toHaveAttribute("data-scene", FAQ_LANDING_SCENE, {
    timeout: SCENE_TIMEOUT_MS,
  })

  return stage
}

async function scrollToPageEnd(page: Page) {
  await page.evaluate(function scrollToEnd() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    })
  })
}

async function openFooter(page: Page) {
  const stage = await openRunningPage(page, "/")

  await scrollToPageEnd(page)
  await expect(stage).toHaveAttribute("data-scene", FOOTER_SCENE_ID, {
    timeout: SCENE_TIMEOUT_MS,
  })

  return stage
}

async function startTopRecording(page: Page, rowIndex: number) {
  await page.evaluate(
    function recordRowTops(input) {
      const rows = document.querySelectorAll(input.rowSelector)
      const summaries = document.querySelectorAll(input.summarySelector)
      const tracked: {
        label: string
        element: Element
        top: number
        worst: number
      }[] = []

      function track(label: string, element: Element | undefined) {
        if (element === undefined) {
          return
        }

        tracked.push({
          label,
          element,
          top: element.getBoundingClientRect().top,
          worst: 0,
        })
      }

      for (let index = 0; index <= input.rowIndex; index += 1) {
        track(`row ${index + 1}`, rows[index])
      }

      track(`summary ${input.rowIndex + 1}`, summaries[input.rowIndex])

      const recording = { tracked, frames: 0, isActive: true }

      Object.assign(window, { topRecording: recording })

      function sampleTops() {
        recording.frames += 1

        for (const entry of recording.tracked) {
          const shift = Math.abs(
            entry.element.getBoundingClientRect().top - entry.top
          )

          entry.worst = Math.max(entry.worst, shift)
        }

        if (recording.isActive) {
          window.requestAnimationFrame(sampleTops)
        }
      }

      window.requestAnimationFrame(sampleTops)
    },
    {
      rowSelector: FAQ_ROW_SELECTOR,
      summarySelector: FAQ_SUMMARY_SELECTOR,
      rowIndex,
    }
  )
}

async function stopTopRecording(page: Page) {
  return page.evaluate(function finishTopRecording(tolerance) {
    const recording = Reflect.get(window, "topRecording")
    const problems: string[] = []

    recording.isActive = false

    for (const entry of recording.tracked) {
      if (entry.worst > tolerance) {
        problems.push(`${entry.label} moved ${entry.worst}px from ${entry.top}`)
      }
    }

    return {
      tracked: recording.tracked.length,
      frames: recording.frames,
      problems,
    }
  }, TOP_TOLERANCE_PX)
}

async function toggleRow(
  page: Page,
  rowIndex: number,
  method: DisclosureMethod
) {
  const summary = page.locator(FAQ_SUMMARY_SELECTOR).nth(rowIndex)

  if (method === "click") {
    const box = await summary.boundingBox()

    if (box === null) {
      throw new Error("the summary has no box")
    }

    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)

    return
  }

  await summary.evaluate(function focusInPlace(element) {
    if (element instanceof HTMLElement) {
      element.focus({ preventScroll: true })
    }
  })
  await expect(summary).toBeFocused()
  await page.keyboard.press("Enter")
}

async function startRevealRecording(page: Page) {
  await page.evaluate(
    function recordRowReveals(input) {
      const stage = document.querySelector<HTMLElement>(input.stageSelector)
      const rows = document.querySelectorAll(input.rowSelector)
      const recording = {
        rows: rows.length,
        frames: 0,
        movingFrames: 0,
        problems: [] as string[],
        isActive: true,
      }

      Object.assign(window, { revealRecording: recording })

      function isClipWhole(clipPath: string): boolean {
        if (clipPath === "none") {
          return true
        }

        const match = /^inset\((.+)\)$/.exec(clipPath)

        if (match === null) {
          return false
        }

        for (const token of (match[1] ?? "").split(" ")) {
          if (parseFloat(token) > 0) {
            return false
          }
        }

        return true
      }

      function isTranslateRested(translate: string): boolean {
        if (translate === "none") {
          return true
        }

        for (const token of translate.split(" ")) {
          if (Math.abs(parseFloat(token)) > input.translateTolerance) {
            return false
          }
        }

        return true
      }

      function sampleReveals() {
        const scene = stage?.dataset.scene ?? ""

        recording.frames += 1

        if (scene === "moving") {
          recording.movingFrames += 1
        }

        if (scene !== input.connectScene) {
          for (let index = 0; index < rows.length; index += 1) {
            const row = rows[index]

            if (row === undefined) {
              continue
            }

            const style = getComputedStyle(row)
            const isWhole =
              isClipWhole(style.clipPath) && isTranslateRested(style.translate)

            if (!isWhole && recording.problems.length < input.maxProblems) {
              recording.problems.push(
                `${scene} at ${window.scrollY}: row ${index + 1} is ${style.clipPath} / ${style.translate}`
              )
            }
          }
        }

        if (recording.isActive) {
          window.requestAnimationFrame(sampleReveals)
        }
      }

      window.requestAnimationFrame(sampleReveals)
    },
    {
      stageSelector: DOT_STAGE_SELECTOR,
      rowSelector: FAQ_SWEPT_ROW_SELECTOR,
      connectScene: CONNECT_SECTION.sceneId,
      translateTolerance: TRANSLATE_TOLERANCE_PX,
      maxProblems: MAX_REPORTED_PROBLEMS,
    }
  )
}

async function stopRevealRecording(page: Page) {
  return page.evaluate(function finishRevealRecording() {
    const recording = Reflect.get(window, "revealRecording")

    recording.isActive = false

    return {
      rows: recording.rows as number,
      frames: recording.frames as number,
      movingFrames: recording.movingFrames as number,
      problems: recording.problems as string[],
    }
  })
}

async function readConnectLanding(page: Page) {
  return page.evaluate(
    function measureConnectLanding(input) {
      const connect = document.getElementById(input.id)

      if (connect === null) {
        return Number.NaN
      }

      return (
        connect.getBoundingClientRect().top + window.scrollY - input.stickyTop
      )
    },
    { id: CONNECT_SECTION.id, stickyTop: STICKY_TOP_PX }
  )
}

async function scrollInSteps(page: Page, target: number) {
  const start = await page.evaluate(function readScrollY() {
    return window.scrollY
  })

  for (let step = 1; step <= TRANSIT_STEPS; step += 1) {
    const top = start + ((target - start) * step) / TRANSIT_STEPS

    await page.evaluate(function scrollToStep(position) {
      window.scrollTo({ top: position, behavior: "instant" })
    }, top)
    await page.waitForTimeout(TRANSIT_STEP_MS)
  }
}

async function readFaqPinOverlaps(page: Page) {
  return page.evaluate(
    function walkFaqPin(input) {
      const section = document.getElementById(input.id)
      const frame = section?.firstElementChild
      const slot = document.querySelector(input.slotSelector)

      if (
        section === null ||
        frame === null ||
        frame === undefined ||
        slot === null
      ) {
        return { hold: 0, summariesInView: 0, problems: ["no FAQ frame"] }
      }

      const sectionBox = section.getBoundingClientRect()
      const start = sectionBox.top + window.scrollY - input.stickyTop
      const hold = sectionBox.height - frame.getBoundingClientRect().height
      const summaries = section.querySelectorAll("summary")
      const problems: string[] = []
      let summariesInView = 0

      for (let stop = 0; stop <= input.stops; stop += 1) {
        const top = Math.round(start + (hold * stop) / input.stops)

        window.scrollTo({ top, behavior: "instant" })

        const slotBox = slot.getBoundingClientRect()

        if (slotBox.width < 1 || slotBox.height < 1) {
          problems.push(`the slot is ${slotBox.width}x${slotBox.height}`)
        }

        for (let index = 0; index < summaries.length; index += 1) {
          const summary = summaries[index]

          if (summary === undefined) {
            continue
          }

          const box = summary.getBoundingClientRect()
          const overlapWidth =
            Math.min(box.right, slotBox.right) -
            Math.max(box.left, slotBox.left)
          const overlapHeight =
            Math.min(box.bottom, slotBox.bottom) -
            Math.max(box.top, slotBox.top)

          if (box.bottom > input.stickyTop && box.top < window.innerHeight) {
            summariesInView += 1
          }

          if (
            overlapWidth > input.tolerance &&
            overlapHeight > input.tolerance
          ) {
            problems.push(
              `at ${top}px question ${index + 1} meets the slot by ${overlapWidth}x${overlapHeight}`
            )
          }
        }
      }

      return { hold, summariesInView, problems }
    },
    {
      id: FAQ_SECTION.id,
      slotSelector: FAQ_SLOT_SELECTOR,
      stickyTop: STICKY_TOP_PX,
      stops: PIN_STOPS,
      tolerance: OVERLAP_TOLERANCE_PX,
    }
  )
}

async function readFaqHold(page: Page) {
  return page.evaluate(
    function measureFaqHold(input) {
      const section = document.getElementById(input.id)
      const frame = section?.firstElementChild
      let visibleRows = 0

      for (const row of document.querySelectorAll(input.rowSelector)) {
        if (getComputedStyle(row).display !== "none") {
          visibleRows += 1
        }
      }

      if (section === null || frame === null || frame === undefined) {
        return { hold: Number.NaN, viewportHeight: 0, visibleRows }
      }

      return {
        hold:
          section.getBoundingClientRect().height -
          frame.getBoundingClientRect().height,
        viewportHeight: window.innerHeight,
        visibleRows,
      }
    },
    { id: FAQ_SECTION.id, rowSelector: FAQ_SWEPT_ROW_SELECTOR }
  )
}

async function readSignLight(page: Page): Promise<SignLight | null> {
  const box = await page.locator(FOOTER_SLOT_SELECTOR).boundingBox()

  if (box === null) {
    return null
  }

  const image = await page.screenshot({ clip: box })

  return page.evaluate(
    async function measureSignLight(input) {
      const picture = new Image()

      await new Promise(function waitForImage(resolve) {
        picture.onload = resolve
        picture.src = input.source
      })

      const canvas = document.createElement("canvas")

      canvas.width = picture.width
      canvas.height = picture.height

      const context = canvas.getContext("2d", { willReadFrequently: true })

      if (context === null) {
        return null
      }

      context.drawImage(picture, 0, 0)

      const pixels = context.getImageData(0, 0, picture.width, picture.height)
      const pixelCount = picture.width * picture.height
      const light = {
        width: picture.width,
        lit: 0,
        leftLit: 0,
        rightLit: 0,
        firstColumn: picture.width,
        lastColumn: -1,
      }

      for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
        if ((pixels.data[pixelIndex * 4] ?? 0) <= input.threshold) {
          continue
        }

        const column = pixelIndex % picture.width

        light.lit += 1
        light.firstColumn = Math.min(light.firstColumn, column)
        light.lastColumn = Math.max(light.lastColumn, column)

        if (column < picture.width / 2) {
          light.leftLit += 1
        } else {
          light.rightLit += 1
        }
      }

      return light
    },
    {
      source: "data:image/png;base64," + image.toString("base64"),
      threshold: LIT_CHANNEL_THRESHOLD,
    }
  )
}

function findSignProblems(light: SignLight | null): string[] {
  if (light === null) {
    return ["the footer slot has no picture"]
  }

  const problems: string[] = []

  if (light.lit < MIN_SIGN_LIT_PIXELS) {
    problems.push(`only ${light.lit} lit pixels`)
  }

  if (light.firstColumn > light.width * SIGN_EDGE_SHARE) {
    problems.push(`the light starts at ${light.firstColumn} of ${light.width}`)
  }

  if (light.lastColumn < light.width * (1 - SIGN_EDGE_SHARE)) {
    problems.push(`the light ends at ${light.lastColumn} of ${light.width}`)
  }

  if (light.leftLit < light.lit * SIGN_HALF_SHARE) {
    problems.push(`only ${light.leftLit} of ${light.lit} lit on the left`)
  }

  if (light.rightLit < light.lit * SIGN_HALF_SHARE) {
    problems.push(`only ${light.rightLit} of ${light.lit} lit on the right`)
  }

  return problems
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

async function readAccessibilityNodes(
  page: Page
): Promise<AccessibilityNode[]> {
  const session = await page.context().newCDPSession(page)

  try {
    await session.send("Accessibility.enable")

    const tree = await session.send("Accessibility.getFullAXTree", {})

    return tree.nodes
  } finally {
    await session.detach()
  }
}

function readProperty(node: AccessibilityNode, name: string): unknown {
  for (const property of node.properties ?? []) {
    if (property.name === name) {
      return property.value?.value
    }
  }

  return undefined
}

function isMarkedInvalid(node: AccessibilityNode): boolean {
  const invalid = readProperty(node, "invalid")

  return invalid !== undefined && invalid !== "false"
}

async function countSignTexts(page: Page) {
  const nodes = await readAccessibilityNodes(page)
  const signText = FOOTER_SIGN_TEXT.toLowerCase()
  let count = 0

  for (const node of nodes) {
    const name = String(node.name?.value ?? "").toLowerCase()

    if (
      !node.ignored &&
      node.role?.value === "StaticText" &&
      name === signText
    ) {
      count += 1
    }
  }

  return count
}

async function readServiceAccessibility(page: Page) {
  const nodes = await readAccessibilityNodes(page)
  const radios: { name: string; isInvalid: boolean }[] = []
  const groups: {
    isRequired: boolean
    isInvalid: boolean
    description: string
  }[] = []

  for (const node of nodes) {
    if (node.ignored) {
      continue
    }

    if (node.role?.value === "radio") {
      radios.push({
        name: String(node.name?.value ?? ""),
        isInvalid: isMarkedInvalid(node),
      })
    }

    if (node.role?.value === "radiogroup") {
      groups.push({
        isRequired: readProperty(node, "required") === true,
        isInvalid: isMarkedInvalid(node),
        description: String(node.description?.value ?? ""),
      })
    }
  }

  return { radios, groups }
}

function findInvalidRadios(radios: { name: string; isInvalid: boolean }[]) {
  const invalid: string[] = []

  for (const radio of radios) {
    if (radio.isInvalid) {
      invalid.push(radio.name)
    }
  }

  return invalid
}

async function readFooterGeometry(page: Page) {
  return page.evaluate(function measureFooter(selector) {
    const footer = document.querySelector(selector)
    const frame = footer?.firstElementChild
    const slot = footer?.querySelector("[data-dot-slot]")
    const bar = frame?.lastElementChild

    if (
      frame === null ||
      frame === undefined ||
      slot === null ||
      slot === undefined ||
      bar === null ||
      bar === undefined
    ) {
      return null
    }

    return {
      slotOffset:
        slot.getBoundingClientRect().top - frame.getBoundingClientRect().top,
      barHeight: bar.getBoundingClientRect().height,
    }
  }, FOOTER_SELECTOR)
}

async function placeLastChip(page: Page) {
  return page.evaluate(
    function placeChipNearTop(input) {
      const radios = document.querySelectorAll(input.radioSelector)
      const chip = radios[radios.length - 1]?.closest("label")
      const message = document.querySelector(input.messageSelector)

      if (chip === null || chip === undefined || message === null) {
        return null
      }

      let low = Math.round(window.scrollY)
      let high = document.documentElement.scrollHeight - window.innerHeight

      while (high - low > 1) {
        const middle = Math.floor((low + high) / 2)

        window.scrollTo({ top: middle, behavior: "instant" })

        if (chip.getBoundingClientRect().top > input.targetTop) {
          low = middle
        } else {
          high = middle
        }
      }

      window.scrollTo({ top: high, behavior: "instant" })

      const messageBox = message.getBoundingClientRect()

      return {
        chipTop: chip.getBoundingClientRect().top,
        messageTop: messageBox.top,
        messageBottom: messageBox.bottom,
        viewportHeight: window.innerHeight,
      }
    },
    {
      radioSelector: CONTACT_RADIO_SELECTOR,
      messageSelector: CONTACT_MESSAGE_SELECTOR,
      targetTop: CHIP_TARGET_TOP_PX,
    }
  )
}

async function waitForSteadyFocus(page: Page) {
  await page.evaluate(
    function waitForSteadyLayout(input) {
      return new Promise<void>(function watchLayout(resolve) {
        const startedAt = performance.now()
        let steadyFrames = 0
        let lastTop = Number.NaN
        let lastScroll = Number.NaN

        function checkLayout() {
          const active = document.activeElement
          let top = Number.NaN

          if (active !== null) {
            top = active.getBoundingClientRect().top
          }

          if (top === lastTop && window.scrollY === lastScroll) {
            steadyFrames += 1
          } else {
            steadyFrames = 0
          }

          lastTop = top
          lastScroll = window.scrollY

          const isSteady = steadyFrames >= input.steadyFrames
          const isLate = performance.now() - startedAt > input.timeoutMs

          if (isSteady || isLate) {
            resolve()
            return
          }

          window.requestAnimationFrame(checkLayout)
        }

        window.requestAnimationFrame(checkLayout)
      })
    },
    { steadyFrames: STEADY_FRAMES, timeoutMs: SETTLE_TIMEOUT_MS }
  )
}

async function readFocusedChipTop(page: Page) {
  return page.evaluate(function measureFocusedChip() {
    const chip = document.activeElement?.closest("label")

    if (chip === null || chip === undefined) {
      return Number.NaN
    }

    return chip.getBoundingClientRect().top
  })
}

async function readFocusClearance(page: Page) {
  return page.evaluate(
    function inspectFocusedControl(input) {
      const active = document.activeElement
      const form = document.querySelector(input.formSelector)

      if (
        !(active instanceof HTMLElement) ||
        form === null ||
        !form.contains(active)
      ) {
        return { isInForm: false, control: "", problems: [] as string[] }
      }

      let control = active.id
      let target: HTMLElement = active

      if (control === "" && active instanceof HTMLInputElement) {
        control = active.value
      }

      if (control === "") {
        control = active.getAttribute("type") ?? active.tagName.toLowerCase()
      }

      if (active instanceof HTMLInputElement && active.type === "radio") {
        const chip = active.closest("label")

        if (chip !== null) {
          target = chip
        }
      }

      const controlBox = active.getBoundingClientRect()
      const targetBox = target.getBoundingClientRect()
      const centreX = targetBox.left + targetBox.width / 2
      const centreY = targetBox.top + targetBox.height / 2
      const hit = document.elementFromPoint(centreX, centreY)
      const problems: string[] = []

      if (controlBox.bottom <= input.headerBar) {
        problems.push(`${control} ends at ${controlBox.bottom}`)
      }

      if (hit === null || !target.contains(hit)) {
        problems.push(
          `${control}'s centre at ${centreX},${centreY} shows ${hit?.tagName ?? "nothing"}`
        )
      }

      return { isInForm: true, control, problems }
    },
    { formSelector: CONTACT_FORM_SELECTOR, headerBar: HEADER_BAR_PX }
  )
}

for (const viewport of ENDING_VIEWPORTS) {
  test.describe(`the ending at ${describeViewport(viewport)}`, () => {
    test.use({ viewport })

    for (const method of DISCLOSURE_METHODS) {
      test(`opens an FAQ answer downward and closes it in place on ${method}`, async ({
        page,
      }) => {
        const problems = collectPageProblems(page)
        const row = page.locator(FAQ_ROW_SELECTOR).nth(OPENED_ROW_INDEX)

        await openFaqLanding(page)
        await expect(row).toBeInViewport({ ratio: 1 })

        await startTopRecording(page, OPENED_ROW_INDEX)
        await toggleRow(page, OPENED_ROW_INDEX, method)
        await expect(row).toHaveAttribute("open", "")
        await page.waitForTimeout(DISCLOSURE_WINDOW_MS)

        const opening = await stopTopRecording(page)

        expect(opening.tracked).toBe(OPENED_ROW_INDEX + 2)
        expect(opening.frames).toBeGreaterThan(0)
        expect(opening.problems, "as the answer opens").toEqual([])

        await startTopRecording(page, OPENED_ROW_INDEX)
        await toggleRow(page, OPENED_ROW_INDEX, method)
        await expect(row).not.toHaveAttribute("open")
        await page.waitForTimeout(DISCLOSURE_WINDOW_MS)

        const closing = await stopTopRecording(page)

        expect(closing.frames).toBeGreaterThan(0)
        expect(closing.problems, "as the answer closes").toEqual([])
        expect(problems).toEqual([])
      })
    }

    test("keeps every FAQ row lit until the handshake forms", async ({
      page,
    }) => {
      test.setTimeout(TRANSIT_TEST_TIMEOUT_MS)

      const problems = collectPageProblems(page)
      const stage = await openFaqLanding(page)
      const landing = await readConnectLanding(page)

      await startRevealRecording(page)
      await scrollInSteps(page, landing)
      await expect(stage).toHaveAttribute(
        "data-scene",
        CONNECT_SECTION.sceneId,
        { timeout: SCENE_TIMEOUT_MS }
      )

      const recording = await stopRevealRecording(page)

      expect(recording.rows).toBeGreaterThan(0)
      expect(recording.movingFrames).toBeGreaterThanOrEqual(MIN_MOVING_FRAMES)
      expect(recording.problems).toEqual([])
      expect(problems).toEqual([])
    })

    test("lights LET'S BUILD across the footer's slot once the footer forms", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await openFooter(page)
      await expect
        .poll(
          async function readSign() {
            return findSignProblems(await readSignLight(page))
          },
          { message: "the sign's light", timeout: SETTLE_TIMEOUT_MS }
        )
        .toEqual([])

      expect(problems).toEqual([])
    })

    test("requests no animation frame once the footer's sign has settled", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await installFrameCounter(page)

      const stage = await openFooter(page)

      await expect
        .poll(
          function countRestingFrames() {
            return countFramesOver(page, FRAME_WINDOW_MS)
          },
          { message: "frames at the footer", timeout: REST_TIMEOUT_MS }
        )
        .toBe(0)
      await expect(stage).toHaveAttribute("data-scene", FOOTER_SCENE_ID)

      expect(problems).toEqual([])
    })

    test("exposes Let's build to assistive technology once", async ({
      page,
    }) => {
      await openFooter(page)

      expect(await countSignTexts(page)).toBe(1)
    })

    test("tabs from the Let's connect email link to the name field", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)
      const email = page.locator(CONNECT_EMAIL_SELECTOR)

      await openRunningPage(page, `/#${CONNECT_SECTION.id}`)
      await email.focus()
      await expect(email).toBeFocused()
      await page.keyboard.press("Tab")
      await expect(page.locator(CONTACT_NAME_SELECTOR)).toBeFocused()

      expect(problems).toEqual([])
    })

    test("exposes a required radiogroup and marks only the group invalid", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)

      await openRunningPage(page, `/#${CONTACT_SECTION.id}`)

      const pristine = await readServiceAccessibility(page)

      expect(pristine.radios).toHaveLength(4)
      expect(findInvalidRadios(pristine.radios), "invalid radios").toEqual([])
      expect(pristine.groups).toEqual([
        { isRequired: true, isInvalid: false, description: "" },
      ])

      await page
        .getByRole("radio", { name: CONTACT_SERVICE_LABELS.branding })
        .focus()
      await page.locator(CONTACT_MESSAGE_SELECTOR).focus()
      await expect(
        page.getByText(CONTACT_SERVICE_PROMPT, { exact: true })
      ).toBeVisible()

      await expect
        .poll(
          function readSkippedService() {
            return readServiceAccessibility(page)
          },
          { message: "the skipped service", timeout: SETTLE_TIMEOUT_MS }
        )
        .toEqual({
          radios: pristine.radios,
          groups: [
            {
              isRequired: true,
              isInvalid: true,
              description: CONTACT_SERVICE_PROMPT,
            },
          ],
        })

      expect(problems).toEqual([])
    })
  })
}

test.describe(`the FAQ pin at ${describeViewport(DESKTOP_VIEWPORT)}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("keeps the FAQ slot clear of every question through the pin", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openFaqLanding(page)

    const walk = await readFaqPinOverlaps(page)

    expect(walk.hold).toBeGreaterThan(0)
    expect(walk.summariesInView).toBeGreaterThan(0)
    expect(walk.problems).toEqual([])
    expect(problems).toEqual([])
  })
})

test.describe(`the FAQ list at ${describeViewport(PHONE_VIEWPORT)}`, () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("grounds the list on the page background", async ({ page }) => {
    await openFaqLanding(page)

    const grounds = await page.evaluate(
      function readGrounds(input) {
        const column = document.querySelector(input.columnSelector)
        const stage = document.querySelector(input.stageSelector)

        if (column === null || stage === null) {
          return null
        }

        return {
          column: getComputedStyle(column).backgroundColor,
          page: getComputedStyle(stage).backgroundColor,
        }
      },
      {
        columnSelector: FAQ_COPY_COLUMN_SELECTOR,
        stageSelector: DOT_STAGE_SELECTOR,
      }
    )

    expect(grounds).not.toBeNull()
    expect(TRANSPARENT_COLOURS).not.toContain(grounds?.column)
    expect(grounds?.column).toBe(grounds?.page)
  })
})

for (const holdCase of HOLD_CASES) {
  const rows = holdCase.isTrimmed ? "three questions" : "every question"

  test.describe(`FAQ's hold at ${describeViewport(holdCase.viewport)} with ${rows}`, () => {
    test.use({ viewport: holdCase.viewport })

    test("holds the drawing for at least a quarter of a screen", async ({
      page,
    }) => {
      await openFaqLanding(page)

      if (holdCase.isTrimmed) {
        await page.addStyleTag({ content: FAQ_TRIM_STYLE })
      }

      const hold = await readFaqHold(page)

      if (holdCase.isTrimmed) {
        expect(hold.visibleRows).toBe(TRIMMED_ROW_COUNT)
      }

      expect(hold.hold).toBeGreaterThanOrEqual(
        hold.viewportHeight * HOLD_VIEWPORT_SHARE - HOLD_TOLERANCE_PX
      )
    })
  })
}

test.describe(`the footer at ${describeViewport(PHONE_VIEWPORT)}`, () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("centres the sign above a 213px footer bar at the page's end", async ({
    page,
  }) => {
    await openFooter(page)

    const geometry = await readFooterGeometry(page)

    expect(geometry).not.toBeNull()
    expect(
      Math.abs((geometry?.slotOffset ?? 0) - PHONE_SIGN_OFFSET_PX),
      `the slot sits ${geometry?.slotOffset}px under the frame's top`
    ).toBeLessThanOrEqual(PHONE_SIGN_TOLERANCE_PX)
    expect(geometry?.barHeight).toBeCloseTo(PHONE_FOOTER_BAR_PX, 0)
  })
})

for (const viewport of CHIP_FOCUS_VIEWPORTS) {
  test.describe(`Shift+Tab into the chips at ${describeViewport(viewport)}`, () => {
    test.use({ viewport })

    test("clears the header when the last chip takes focus from the message", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)
      const message = page.locator(CONTACT_MESSAGE_SELECTOR)
      const lastChip = page.getByRole("radio", {
        name: CONTACT_SERVICE_LABELS.something_else,
      })

      await openRunningPage(page, `/#${CONTACT_SECTION.id}`)
      await message.fill(CONTACT_MESSAGE_TEXT)

      const placement = await placeLastChip(page)

      expect(placement).not.toBeNull()
      expect(
        Math.abs((placement?.chipTop ?? 0) - CHIP_TARGET_TOP_PX),
        `the last chip at ${placement?.chipTop}`
      ).toBeLessThanOrEqual(CHIP_PLACEMENT_TOLERANCE_PX)
      expect(placement?.messageTop).toBeGreaterThanOrEqual(0)
      expect(placement?.messageBottom).toBeLessThanOrEqual(
        placement?.viewportHeight ?? 0
      )

      await message.evaluate(function focusInPlace(element) {
        if (element instanceof HTMLElement) {
          element.focus({ preventScroll: true })
        }
      })
      await expect(message).toBeFocused()
      await page.keyboard.press("Shift+Tab")
      await expect(lastChip).toBeFocused()
      await waitForSteadyFocus(page)

      expect(await readFocusedChipTop(page)).toBeGreaterThanOrEqual(
        CHIP_CLEARANCE_PX
      )
      expect(problems).toEqual([])
    })
  })
}

for (const viewport of UPWARD_FOCUS_VIEWPORTS) {
  test.describe(`Shift+Tab up the empty form at ${describeViewport(viewport)}`, () => {
    test.use({ viewport })

    test("keeps every control clear of the header from the footer's first link up", async ({
      page,
    }) => {
      const problems = collectPageProblems(page)
      const footerLink = page.locator(FOOTER_SELECTOR).getByRole("link").first()
      const visited: string[] = []
      const clearance: string[] = []

      await openRunningPage(page, `/#${CONTACT_SECTION.id}`)
      await footerLink.focus()
      await expect(footerLink).toBeFocused()
      await waitForSteadyFocus(page)

      for (let step = 0; step < SHIFT_TAB_LIMIT; step += 1) {
        await page.keyboard.press("Shift+Tab")
        await waitForSteadyFocus(page)

        const report = await readFocusClearance(page)

        if (!report.isInForm) {
          break
        }

        visited.push(report.control)

        for (const problem of report.problems) {
          clearance.push(problem)
        }
      }

      expect(visited).toEqual(UPWARD_FOCUS_ORDER)
      expect(clearance).toEqual([])
      expect(problems).toEqual([])
    })
  })
}
