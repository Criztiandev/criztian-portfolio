import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { CURSOR_TUNING } from "@/data/motion.data"
import {
  NAV_DOT_CLASS,
  PORTFOLIO_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
  SCROLL_SPY_TOLERANCE_PX,
} from "@/data/navigation.data"
import { DEFAULT_PORTFOLIO_SECTION } from "@/data/portfolio.data"

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const PHONE_VIEWPORT = { width: 390, height: 844 }

const PRIMARY_NAV = 'nav[aria-label="Primary"]'

const MENU_PANEL_ID = "portfolio-mobile-nav"

const MENU_PANEL = `#${MENU_PANEL_ID}`

const MENU_BUTTON = `button[aria-controls="${MENU_PANEL_ID}"]`

const HAIRLINE = '[class~="scroll-progress"]'

const ABOUT_SECTION = "about"

const REDUCED_MOTION_START = "project"

const REDUCED_MOTION_TARGET = "process"

const PANEL_SCROLL_STOPS = ["services", "testimonials"]

const HALF_SCROLL = 0.5

const HAIRLINE_SHARES = [0, HALF_SCROLL, 1]

const SHORT_OF_LANDING_PX = 2

const CENTRE_TOLERANCE_PX = 0.5

const BOX_TOLERANCE_PX = 0.01

const WIDTH_TOLERANCE_PX = 1

const DOT_LANDING_FRAME = 2

const RECORDED_FRAMES = 12

const HAIRLINE_ALPHA = 0.4

const HAIRLINE_HEIGHT_PX = 1

const SCALE_TOLERANCE = 0.01

const FULL_CHANNEL = 255

const CHANNEL_TOLERANCE = 2

const COLOUR_CHANNELS = 3

const WIPE_SAMPLE_MS = 500

const MARKS_TIMEOUT_MS = 5000

const FLIGHT_TIMEOUT_MS = 10000

const SPY_VISIBLE_FRAMES = 2

type NavMarks = {
  sectionId: string
  primary: string | null
  panel: string
}

type DotTrailEntry = {
  holder: string
  current: string
  dotCount: number
  scrollY: number
}

type SectionLanding = {
  id: string
  landing: number
}

type NavFlight = {
  trail: DotTrailEntry[]
  positions: number[]
  landings: SectionLanding[]
}

type SectionRange = {
  label: string
  start: number
  end: number
}

type PaintedDot = {
  holder: string
  centre: number
}

type DotJumpRecord = {
  from: number
  to: number
  painted: PaintedDot[]
}

type Insets = {
  top: number
  right: number
  bottom: number
  left: number
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

function resolveMarks(sectionId: string): NavMarks {
  let primary: string | null = null
  let panel = ""

  for (const item of PORTFOLIO_PRIMARY_NAVIGATION) {
    if (item.id === sectionId) {
      primary = item.label
    }
  }

  for (const item of PORTFOLIO_NAVIGATION) {
    if (item.id === sectionId) {
      panel = item.label
    }
  }

  return { sectionId, primary, panel }
}

function listSectionStops(): NavMarks[] {
  const stops: NavMarks[] = []

  for (const item of PORTFOLIO_NAVIGATION) {
    if (item.id !== DEFAULT_PORTFOLIO_SECTION) {
      stops.push(resolveMarks(item.id))
    }
  }

  return stops
}

function listSectionIds(): string[] {
  const ids: string[] = []

  for (const item of PORTFOLIO_NAVIGATION) {
    ids.push(item.id)
  }

  return ids
}

async function landOnSection(page: Page, sectionId: string) {
  await page.evaluate(
    function scrollToLanding(input) {
      const section = document.getElementById(input.sectionId)

      if (section === null) {
        throw new Error("missing section " + input.sectionId)
      }

      section.scrollIntoView({ block: "start", behavior: "instant" })
    },
    { sectionId }
  )
}

async function scrollByPixels(page: Page, distance: number) {
  await page.evaluate(
    function scrollByDistance(input) {
      window.scrollBy({ top: input.distance, behavior: "instant" })
    },
    { distance }
  )
}

async function scrollToShare(page: Page, share: number) {
  await page.evaluate(
    function scrollToScrollShare(input) {
      const range = document.documentElement.scrollHeight - window.innerHeight

      window.scrollTo({ top: range * input.share, behavior: "instant" })
    },
    { share }
  )
}

async function readNavMarks(page: Page) {
  return page.evaluate(
    function readMarks(input) {
      const dotClasses = input.dotClass.split(" ")
      const primaryCurrent: string[] = []
      const panelCurrent: string[] = []
      const dots: {
        holder: string
        width: number
        height: number
        offset: number
        gap: number
      }[] = []

      for (const link of document.querySelectorAll(
        `${input.primaryNav} a[aria-current="true"]`
      )) {
        primaryCurrent.push(link.textContent ?? "")
      }

      for (const link of document.querySelectorAll(
        `${input.menuPanel} a[aria-current="true"]`
      )) {
        panelCurrent.push(link.textContent ?? "")
      }

      for (const span of document.querySelectorAll(
        'span[aria-hidden="true"]'
      )) {
        let isDot = true

        for (const dotClass of dotClasses) {
          if (!span.classList.contains(dotClass)) {
            isDot = false
          }
        }

        if (!isDot) {
          continue
        }

        const link = span.parentElement
        const dotRect = span.getBoundingClientRect()
        let holder = "an element outside the primary links"
        let linkRect = dotRect

        if (
          link !== null &&
          link.tagName === "A" &&
          link.parentElement?.matches(input.primaryNav) === true
        ) {
          holder = link.textContent ?? ""
          linkRect = link.getBoundingClientRect()
        }

        dots.push({
          holder,
          width: dotRect.width,
          height: dotRect.height,
          offset:
            dotRect.left +
            dotRect.width / 2 -
            (linkRect.left + linkRect.width / 2),
          gap: dotRect.top - linkRect.bottom,
        })
      }

      return { primaryCurrent, panelCurrent, dots }
    },
    { primaryNav: PRIMARY_NAV, menuPanel: MENU_PANEL, dotClass: NAV_DOT_CLASS }
  )
}

async function checkNavMarks(page: Page, expected: NavMarks) {
  const marks = await readNavMarks(page)
  const problems: string[] = []
  const expectedPrimary: string[] = []

  if (expected.primary !== null) {
    expectedPrimary.push(expected.primary)
  }

  if (marks.primaryCurrent.join("|") !== expectedPrimary.join("|")) {
    problems.push(
      `primary aria-current on [${marks.primaryCurrent.join(", ")}]`
    )
  }

  if (marks.panelCurrent.join("|") !== expected.panel) {
    problems.push(`panel aria-current on [${marks.panelCurrent.join(", ")}]`)
  }

  if (marks.dots.length !== expectedPrimary.length) {
    problems.push(`${marks.dots.length} nav dots`)
  }

  for (const dot of marks.dots) {
    const isDotSize =
      Math.abs(dot.width - CURSOR_TUNING.dotSize) <= BOX_TOLERANCE_PX &&
      Math.abs(dot.height - CURSOR_TUNING.dotSize) <= BOX_TOLERANCE_PX

    if (dot.holder !== expected.primary) {
      problems.push(`the dot is in ${dot.holder}`)
    }

    if (!isDotSize) {
      problems.push(`the dot is ${dot.width}x${dot.height}`)
    }

    if (Math.abs(dot.offset) > CENTRE_TOLERANCE_PX) {
      problems.push(`the dot is ${dot.offset}px off its link's centre`)
    }

    if (dot.gap < 0) {
      problems.push(`the dot overlaps its link by ${-dot.gap}px`)
    }
  }

  return problems
}

async function watchNavFlight(page: Page) {
  await page.evaluate(
    function installFlightWatch(input) {
      const nav = document.querySelector(input.primaryNav)
      const flight: NavFlight = { trail: [], positions: [], landings: [] }
      const trail = flight.trail

      if (nav === null) {
        throw new Error("missing the primary nav")
      }

      const observedNav = nav

      for (const id of input.sectionIds) {
        const section = document.getElementById(id)

        if (section === null) {
          throw new Error("missing section " + id)
        }

        flight.landings.push({
          id,
          landing:
            section.getBoundingClientRect().top +
            window.scrollY -
            parseFloat(getComputedStyle(section).scrollMarginTop),
        })
      }

      Object.assign(window, { navFlight: flight })

      window.addEventListener(
        "scroll",
        function notePaintedPosition() {
          flight.positions.push(window.scrollY)
        },
        { passive: true }
      )

      function noteDot() {
        const dots = observedNav.querySelectorAll(
          'a > span[aria-hidden="true"]'
        )
        const last = trail[trail.length - 1]
        let holder = ""
        let current = ""

        for (const dot of dots) {
          holder = dot.parentElement?.textContent ?? ""
        }

        for (const link of observedNav.querySelectorAll(
          'a[aria-current="true"]'
        )) {
          current = link.textContent ?? ""
        }

        const isUnchanged =
          last !== undefined &&
          last.holder === holder &&
          last.current === current &&
          last.dotCount === dots.length

        if (!isUnchanged) {
          trail.push({
            holder,
            current,
            dotCount: dots.length,
            scrollY: window.scrollY,
          })
        }
      }

      noteDot()
      new MutationObserver(noteDot).observe(observedNav, {
        attributes: true,
        attributeFilter: ["aria-current"],
        childList: true,
        subtree: true,
      })
    },
    { primaryNav: PRIMARY_NAV, sectionIds: listSectionIds() }
  )
}

async function readNavFlight(page: Page): Promise<NavFlight> {
  return page.evaluate(function readFlight() {
    return Reflect.get(window, "navFlight")
  })
}

function buildPrimaryRanges(
  landings: SectionLanding[],
  targetId: string
): SectionRange[] {
  const ranges: SectionRange[] = []

  for (let index = 0; index < landings.length; index += 1) {
    const section = landings[index]
    const next = landings[index + 1]
    const marks = resolveMarks(section.id)

    if (marks.primary !== null) {
      ranges.push({
        label: marks.primary,
        start: section.landing - SCROLL_SPY_TOLERANCE_PX,
        end:
          (next?.landing ?? Number.POSITIVE_INFINITY) - SCROLL_SPY_TOLERANCE_PX,
      })
    }

    if (section.id === targetId) {
      break
    }
  }

  return ranges
}

function countLongestRun(positions: number[], range: SectionRange) {
  let longest = 0
  let run = 0

  for (const position of positions) {
    if (position >= range.start && position < range.end) {
      run += 1
    } else {
      run = 0
    }

    longest = Math.max(longest, run)
  }

  return longest
}

function checkNavFlight(flight: NavFlight, target: NavMarks) {
  const problems: string[] = []
  const ranges = buildPrimaryRanges(flight.landings, target.sectionId)
  const visited: string[] = []
  let lastRank = -1

  for (const entry of flight.trail) {
    let rank = -1

    if (entry.holder !== entry.current || entry.dotCount > 1) {
      problems.push(
        `${entry.dotCount} dots in "${entry.holder}" while "${entry.current}" is current at ${entry.scrollY}`
      )
    }

    if (entry.holder === "") {
      if (visited.length > 0) {
        problems.push(`the dot left the nav at ${entry.scrollY}`)
      }

      continue
    }

    for (let index = 0; index < ranges.length; index += 1) {
      if (ranges[index].label === entry.holder) {
        rank = index
      }
    }

    const range = ranges[rank]

    if (range === undefined) {
      problems.push(`the dot moved to ${entry.holder}, beyond the flight`)
      continue
    }

    if (rank < lastRank) {
      problems.push(`the dot went back to ${entry.holder} at ${entry.scrollY}`)
    }

    if (entry.scrollY < range.start || entry.scrollY >= range.end) {
      problems.push(
        `the dot moved to ${entry.holder} at ${entry.scrollY}, outside its section's ${range.start} to ${range.end}`
      )
    }

    if (rank !== lastRank) {
      visited.push(entry.holder)
    }

    lastRank = rank
  }

  if (visited[visited.length - 1] !== target.primary) {
    problems.push(`the flight ended with the dot in [${visited.join(", ")}]`)
  }

  for (const range of ranges) {
    const frames = countLongestRun(flight.positions, range)

    if (frames >= SPY_VISIBLE_FRAMES && !visited.includes(range.label)) {
      problems.push(
        `the page painted ${frames} frames in a row in the ${range.label} section, but the dot skipped it`
      )
    }
  }

  return problems
}

async function recordDotAcrossLanding(
  page: Page,
  target: NavMarks
): Promise<DotJumpRecord> {
  return page.evaluate(
    function recordPaintedDots(input) {
      const section = document.getElementById(input.sectionId)
      const painted: PaintedDot[] = []
      let targetLink: Element | null = null

      if (section === null) {
        throw new Error("missing section " + input.sectionId)
      }

      const landingSection = section

      function readCentre(element: Element | null) {
        if (element === null) {
          return Number.NaN
        }

        const rect = element.getBoundingClientRect()

        return rect.left + rect.width / 2
      }

      function readDot(): PaintedDot {
        const dot = document.querySelector(
          `${input.primaryNav} a > span[aria-hidden="true"]`
        )

        return {
          holder: dot?.parentElement?.textContent ?? "",
          centre: readCentre(dot),
        }
      }

      for (const link of document.querySelectorAll(`${input.primaryNav} a`)) {
        if (link.textContent === input.label) {
          targetLink = link
        }
      }

      const from = readDot().centre
      const to = readCentre(targetLink)

      return new Promise<DotJumpRecord>(function recordFrames(resolve) {
        let frameIndex = 0

        function onFrame() {
          if (frameIndex === 0) {
            landingSection.scrollIntoView({
              block: "start",
              behavior: "instant",
            })
          }

          frameIndex += 1

          window.setTimeout(function readPaintedFrame() {
            painted.push(readDot())

            if (painted.length === input.frames) {
              resolve({ from, to, painted })
            }
          }, 0)

          if (frameIndex < input.frames) {
            window.requestAnimationFrame(onFrame)
          }
        }

        window.requestAnimationFrame(onFrame)
      })
    },
    {
      primaryNav: PRIMARY_NAV,
      sectionId: target.sectionId,
      label: target.primary,
      frames: RECORDED_FRAMES,
    }
  )
}

function checkDotJump(record: DotJumpRecord, target: NavMarks) {
  const problems: string[] = []

  if (Math.abs(record.from - record.to) <= CENTRE_TOLERANCE_PX) {
    problems.push("the dot starts under the target link")
  }

  for (
    let frameIndex = 0;
    frameIndex < record.painted.length;
    frameIndex += 1
  ) {
    const frame = record.painted[frameIndex]
    const isAtStart =
      Math.abs(frame.centre - record.from) <= CENTRE_TOLERANCE_PX
    const isAtTarget =
      frame.holder === target.primary &&
      Math.abs(frame.centre - record.to) <= CENTRE_TOLERANCE_PX

    if (!isAtStart && !isAtTarget) {
      problems.push(
        `frame ${frameIndex}: the dot is painted at x ${frame.centre} in "${frame.holder}", between its links`
      )
    }

    if (frameIndex >= DOT_LANDING_FRAME && !isAtTarget) {
      problems.push(
        `frame ${frameIndex}: the dot is not painted under ${target.primary}`
      )
    }
  }

  return problems
}

async function readDotColours(page: Page) {
  return page.evaluate(
    function readForcedColours(input) {
      const dot = document.querySelector(
        `${input.primaryNav} a > span[aria-hidden="true"]`
      )
      const bodyStyle = getComputedStyle(document.body)

      return {
        dot: dot === null ? "" : getComputedStyle(dot).backgroundColor,
        canvasText: bodyStyle.color,
        canvas: bodyStyle.backgroundColor,
      }
    },
    { primaryNav: PRIMARY_NAV }
  )
}

function parseScale(value: string) {
  if (value === "none") {
    return { horizontal: 1, vertical: 1 }
  }

  const parts = value.split(" ")
  const horizontal = parseFloat(parts[0] ?? "")
  let vertical = horizontal

  if (parts.length > 1) {
    vertical = parseFloat(parts[1] ?? "")
  }

  return { horizontal, vertical }
}

async function readHairline(page: Page) {
  return page.evaluate(
    function readProgressHairline(input) {
      function readRgba(colour: string) {
        const canvas = document.createElement("canvas")

        canvas.width = 1
        canvas.height = 1

        const context = canvas.getContext("2d", { willReadFrequently: true })

        if (context === null) {
          return []
        }

        context.fillStyle = colour
        context.fillRect(0, 0, 1, 1)

        return Array.from(context.getImageData(0, 0, 1, 1).data)
      }

      const hairlines = document.querySelectorAll(input.hairline)
      const hairline = hairlines[0]
      const headers = document.querySelectorAll("header")
      const bar = headers[0]?.firstElementChild
      const stage = document.querySelector("[data-status]")

      if (
        hairline === undefined ||
        bar === null ||
        bar === undefined ||
        stage === null
      ) {
        return null
      }

      const rect = hairline.getBoundingClientRect()
      const barRect = bar.getBoundingClientRect()
      const style = getComputedStyle(hairline)

      return {
        count: hairlines.length,
        headerCount: headers.length,
        ariaHidden: hairline.getAttribute("aria-hidden"),
        isInBar: hairline.parentElement === bar,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        barLeft: barRect.left,
        barBottom: barRect.bottom,
        barWidth: barRect.width,
        scale: style.scale,
        colour: readRgba(style.backgroundColor),
        foreground: readRgba(getComputedStyle(stage).color),
      }
    },
    { hairline: HAIRLINE }
  )
}

async function checkHairline(page: Page, share: number) {
  const hairline = await readHairline(page)

  if (hairline === null) {
    return ["no scroll-progress hairline in a header bar"]
  }

  const problems: string[] = []
  const scale = parseScale(hairline.scale)
  const alpha = Math.round(HAIRLINE_ALPHA * FULL_CHANNEL)

  if (hairline.count !== 1 || hairline.headerCount !== 1) {
    problems.push(
      `${hairline.count} hairlines in ${hairline.headerCount} headers`
    )
  }

  if (hairline.ariaHidden !== "true") {
    problems.push(`aria-hidden is ${hairline.ariaHidden}`)
  }

  if (!hairline.isInBar) {
    problems.push("the hairline is not a child of the header bar")
  }

  if (
    Math.abs(scale.horizontal - share) > SCALE_TOLERANCE ||
    scale.vertical !== 1
  ) {
    problems.push(`scale ${hairline.scale} at ${share} of the scroll`)
  }

  if (Math.abs(hairline.height - HAIRLINE_HEIGHT_PX) > BOX_TOLERANCE_PX) {
    problems.push(`${hairline.height}px tall`)
  }

  if (Math.abs(hairline.top - hairline.barBottom) > BOX_TOLERANCE_PX) {
    problems.push(`top ${hairline.top}, the bar ends at ${hairline.barBottom}`)
  }

  if (Math.abs(hairline.left - hairline.barLeft) > BOX_TOLERANCE_PX) {
    problems.push(
      `left ${hairline.left}, the bar starts at ${hairline.barLeft}`
    )
  }

  if (
    Math.abs(hairline.width - hairline.barWidth * share) > WIDTH_TOLERANCE_PX
  ) {
    problems.push(`${hairline.width}px wide on a ${hairline.barWidth}px bar`)
  }

  for (let channel = 0; channel < COLOUR_CHANNELS; channel += 1) {
    const difference = Math.abs(
      (hairline.colour[channel] ?? Number.NaN) -
        (hairline.foreground[channel] ?? Number.NaN)
    )

    if (!(difference <= 1)) {
      problems.push(
        `colour ${hairline.colour.join(",")} is not the foreground ${hairline.foreground.join(",")}`
      )
    }
  }

  if (!(Math.abs((hairline.colour[3] ?? Number.NaN) - alpha) <= 1)) {
    problems.push(`alpha ${hairline.colour[3]} instead of ${alpha}`)
  }

  return problems
}

async function readHairlineRow(page: Page) {
  const box = await page.locator(HAIRLINE).boundingBox()
  const viewport = page.viewportSize()

  if (box === null || viewport === null) {
    return null
  }

  const image = await page.screenshot({
    clip: { x: 0, y: box.y, width: viewport.width, height: HAIRLINE_HEIGHT_PX },
  })

  return page.evaluate(
    async function readRow(input) {
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

      function readPixel(position: number) {
        return Array.from(
          context?.getImageData(Math.round(position), 0, 1, 1).data ?? []
        )
      }

      return {
        inside: readPixel(input.insideX),
        outside: readPixel(input.outsideX),
      }
    },
    {
      source: "data:image/png;base64," + image.toString("base64"),
      insideX: box.x + box.width / 2,
      outsideX: (box.x + box.width + viewport.width) / 2,
    }
  )
}

async function checkHairlineOverPanel(page: Page) {
  const hairline = await readHairline(page)
  const row = await readHairlineRow(page)

  if (hairline === null || row === null) {
    return ["could not read the hairline's row"]
  }

  const problems: string[] = []

  for (let channel = 0; channel < COLOUR_CHANNELS; channel += 1) {
    const inside = row.inside[channel] ?? Number.NaN
    const outside = row.outside[channel] ?? Number.NaN
    const expected =
      HAIRLINE_ALPHA * (hairline.foreground[channel] ?? Number.NaN) +
      (1 - HAIRLINE_ALPHA) * outside

    if (!(Math.abs(inside - expected) <= CHANNEL_TOLERANCE)) {
      problems.push(
        `channel ${channel} reads ${inside} under the hairline, ${expected} expected over the panel's ${outside}`
      )
    }
  }

  return problems
}

function parseInsets(clipPath: string): Insets | null {
  const match = /^inset\((.+)\)$/.exec(clipPath)

  if (match === null) {
    return null
  }

  const values: number[] = []

  for (const token of (match[1] ?? "").split(" ")) {
    values.push(parseFloat(token))
  }

  const top = values[0] ?? Number.NaN
  const right = values[1] ?? top
  const bottom = values[2] ?? top
  const left = values[3] ?? right

  return { top, right, bottom, left }
}

function isFullyOpen(insets: Insets | null) {
  return (
    insets !== null &&
    insets.top === 0 &&
    insets.right === 0 &&
    insets.bottom === 0 &&
    insets.left === 0
  )
}

async function watchPanelClip(page: Page) {
  await page.evaluate(
    function installClipWatch(input) {
      const panel = document.querySelector<HTMLElement>(input.menuPanel)
      const record = { done: false, samples: [] as string[] }

      if (panel === null) {
        throw new Error("missing the menu panel")
      }

      const observedPanel = panel

      Object.assign(window, { panelClipRecord: record })

      const observer = new MutationObserver(function onPanelShown() {
        if (observedPanel.hidden) {
          return
        }

        observer.disconnect()

        const shownAt = window.performance.now()

        function sampleClip() {
          record.samples.push(getComputedStyle(observedPanel).clipPath)

          if (window.performance.now() - shownAt < input.sampleMs) {
            window.requestAnimationFrame(sampleClip)
            return
          }

          record.done = true
        }

        sampleClip()
      })

      observer.observe(observedPanel, {
        attributes: true,
        attributeFilter: ["hidden"],
      })
    },
    { menuPanel: MENU_PANEL, sampleMs: WIPE_SAMPLE_MS }
  )
}

async function readPanelClip(
  page: Page
): Promise<{ done: boolean; samples: string[] }> {
  return page.evaluate(function readClipRecord() {
    return (
      Reflect.get(window, "panelClipRecord") ?? { done: false, samples: [] }
    )
  })
}

function checkWipe(samples: string[]) {
  const problems: string[] = []
  const first = parseInsets(samples[0] ?? "")
  let previousBottom = Number.POSITIVE_INFINITY
  let midWaySamples = 0

  if (
    first === null ||
    first.top !== 0 ||
    first.right !== 0 ||
    first.bottom !== 100 ||
    first.left !== 0
  ) {
    problems.push(`the wipe starts at ${samples[0]}`)
  }

  for (const sample of samples) {
    const insets = parseInsets(sample)

    if (insets === null) {
      problems.push(`${sample} is not an inset`)
      continue
    }

    if (insets.top !== 0 || insets.right !== 0 || insets.left !== 0) {
      problems.push(`${sample} clips a side other than the bottom`)
    }

    if (insets.bottom > previousBottom) {
      problems.push(`${sample} closes again`)
    }

    if (insets.bottom > 0 && insets.bottom < 100) {
      midWaySamples += 1
    }

    previousBottom = insets.bottom
  }

  if (midWaySamples === 0) {
    problems.push("no sample caught the wipe mid-way")
  }

  if (!isFullyOpen(parseInsets(samples[samples.length - 1] ?? ""))) {
    problems.push(`the wipe ends at ${samples[samples.length - 1]}`)
  }

  return problems
}

function checkNoWipe(samples: string[]) {
  const problems: string[] = []

  if (samples.length === 0) {
    problems.push("no clip-path samples")
  }

  for (const sample of samples) {
    if (!isFullyOpen(parseInsets(sample))) {
      problems.push(`the panel is clipped to ${sample}`)
    }
  }

  return problems
}

async function checkPanelMarks(page: Page, label: string) {
  const state = await page.evaluate(
    function readPanel(input) {
      const panel = document.querySelector<HTMLElement>(input.menuPanel)
      const button = document.querySelector(input.menuButton)
      const current: string[] = []

      for (const link of document.querySelectorAll(
        `${input.menuPanel} a[aria-current="true"]`
      )) {
        current.push(link.textContent ?? "")
      }

      return {
        isHidden: panel === null || panel.hidden,
        expanded: button?.getAttribute("aria-expanded") ?? null,
        current,
      }
    },
    { menuPanel: MENU_PANEL, menuButton: MENU_BUTTON }
  )
  const problems: string[] = []

  if (state.isHidden) {
    problems.push("the menu panel is closed")
  }

  if (state.expanded !== "true") {
    problems.push(`the menu button has aria-expanded ${state.expanded}`)
  }

  if (state.current.join("|") !== label) {
    problems.push(`panel aria-current on [${state.current.join(", ")}]`)
  }

  return problems
}

test.describe(`the scroll-spy at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("marks the primary link of each section it lands on and puts the one nav dot inside it", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const top = resolveMarks(DEFAULT_PORTFOLIO_SECTION)

    await openRunningPage(page, "/")
    await expect
      .poll(
        function readTopMarks() {
          return checkNavMarks(page, top)
        },
        { message: "at the top", timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    for (const stop of listSectionStops()) {
      await landOnSection(page, stop.sectionId)
      await expect
        .poll(
          function readLandedMarks() {
            return checkNavMarks(page, stop)
          },
          { message: `landed on #${stop.sectionId}`, timeout: MARKS_TIMEOUT_MS }
        )
        .toEqual([])
    }

    await scrollToShare(page, 0)
    await expect
      .poll(
        function readTopMarksAgain() {
          return checkNavMarks(page, top)
        },
        { message: "back at the top", timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    expect(problems).toEqual([])
  })

  test("keeps the section above current until the next one reaches its landing", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    let above = resolveMarks(DEFAULT_PORTFOLIO_SECTION)

    await openRunningPage(page, "/")

    for (const stop of listSectionStops()) {
      const expectedAbove = above

      await landOnSection(page, stop.sectionId)
      await expect
        .poll(
          function readLandedMarks() {
            return checkNavMarks(page, stop)
          },
          { message: `landed on #${stop.sectionId}`, timeout: MARKS_TIMEOUT_MS }
        )
        .toEqual([])

      await scrollByPixels(page, -SHORT_OF_LANDING_PX)
      await expect
        .poll(
          function readShortMarks() {
            return checkNavMarks(page, expectedAbove)
          },
          {
            message: `${SHORT_OF_LANDING_PX}px short of #${stop.sectionId}`,
            timeout: MARKS_TIMEOUT_MS,
          }
        )
        .toEqual([])

      above = stop
    }

    expect(problems).toEqual([])
  })

  test("marks About when the page opens at its anchor", async ({ page }) => {
    const problems = collectPageProblems(page)
    const section = resolveMarks(ABOUT_SECTION)

    await openRunningPage(page, `/#${section.sectionId}`)
    await expect
      .poll(
        function readDeepLinkMarks() {
          return checkNavMarks(page, section)
        },
        {
          message: `opened at #${section.sectionId}`,
          timeout: MARKS_TIMEOUT_MS,
        }
      )
      .toEqual([])

    expect(problems).toEqual([])
  })

  test("steps the dot along the primary links a nav flight passes, in order and never back", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const target = resolveMarks(ABOUT_SECTION)

    await openRunningPage(page, "/")
    await expect(page.locator("html")).toHaveClass(/\blenis\b/)
    await watchNavFlight(page)
    await page
      .locator(PRIMARY_NAV)
      .getByRole("link", { name: String(target.primary), exact: true })
      .click()
    await expect
      .poll(
        function readArrivalMarks() {
          return checkNavMarks(page, target)
        },
        { message: "after the flight", timeout: FLIGHT_TIMEOUT_MS }
      )
      .toEqual([])

    const flight = await readNavFlight(page)

    expect(checkNavFlight(flight, target), JSON.stringify(flight)).toEqual([])
    expect(problems).toEqual([])
  })
})

test.describe(`the scroll-spy under reduced motion at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT, reducedMotion: "reduce" })

  test("paints the dot under the new link the frame after the spy moves it, with no slide", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const start = resolveMarks(REDUCED_MOTION_START)
    const target = resolveMarks(REDUCED_MOTION_TARGET)

    await openRunningPage(page, "/")
    await landOnSection(page, start.sectionId)
    await expect
      .poll(
        function readStartMarks() {
          return checkNavMarks(page, start)
        },
        { message: `landed on #${start.sectionId}`, timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    const record = await recordDotAcrossLanding(page, target)

    expect(checkDotJump(record, target), JSON.stringify(record)).toEqual([])
    await expect
      .poll(
        function readTargetMarks() {
          return checkNavMarks(page, target)
        },
        { message: `landed on #${target.sectionId}`, timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    expect(problems).toEqual([])
  })
})

test.describe(`the nav dot in forced colours at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT, forcedColors: "active" })

  test("paints the dot in CanvasText, so it never vanishes into the forced Canvas", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const section = resolveMarks(ABOUT_SECTION)

    await openRunningPage(page, "/")
    await landOnSection(page, section.sectionId)
    await expect
      .poll(
        function readForcedMarks() {
          return checkNavMarks(page, section)
        },
        {
          message: `landed on #${section.sectionId}`,
          timeout: MARKS_TIMEOUT_MS,
        }
      )
      .toEqual([])

    const colours = await readDotColours(page)

    expect(colours.dot).toBe(colours.canvasText)
    expect(colours.dot).not.toBe(colours.canvas)
    expect(problems).toEqual([])
  })
})

test.describe(`the scroll-progress hairline at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("fills a 1px foreground hairline along the header bar's bottom edge with the scroll progress", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/")

    for (const share of HAIRLINE_SHARES) {
      await scrollToShare(page, share)
      await expect
        .poll(
          function readHairlineAtShare() {
            return checkHairline(page, share)
          },
          { message: `at ${share} of the scroll`, timeout: MARKS_TIMEOUT_MS }
        )
        .toEqual([])
    }

    expect(problems).toEqual([])
  })
})

test.describe(`the mobile menu at ${PHONE_VIEWPORT.width}x${PHONE_VIEWPORT.height}`, () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("wipes the panel open from its top edge down", async ({ page }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/")
    await watchPanelClip(page)
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect
      .poll(
        function readWipeRecord() {
          return readPanelClip(page)
        },
        { message: "the wipe samples", timeout: MARKS_TIMEOUT_MS }
      )
      .toMatchObject({ done: true })

    const record = await readPanelClip(page)

    expect(checkWipe(record.samples), record.samples.join(" | ")).toEqual([])
    expect(problems).toEqual([])
  })

  test("keeps the hairline on the bar's bottom edge, painted over the open panel", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/")
    await scrollToShare(page, HALF_SCROLL)
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect(page.locator(MENU_PANEL)).toHaveCSS("clip-path", "inset(0px)")
    await expect
      .poll(
        function readHairlineOverPanel() {
          return checkHairline(page, HALF_SCROLL)
        },
        { message: "with the menu open", timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    const panelBox = await page.locator(MENU_PANEL).boundingBox()
    const hairlineBox = await page.locator(HAIRLINE).boundingBox()

    expect(hairlineBox?.y).toBeCloseTo(panelBox?.y ?? Number.NaN, 2)
    expect(await checkHairlineOverPanel(page)).toEqual([])
    expect(problems).toEqual([])
  })

  test("keeps the menu open while the page scrolls under it and moves the panel's aria-current", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const top = resolveMarks(DEFAULT_PORTFOLIO_SECTION)

    await openRunningPage(page, "/")
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect
      .poll(
        function readOpenedPanel() {
          return checkPanelMarks(page, top.panel)
        },
        { message: "the menu opened at the top", timeout: MARKS_TIMEOUT_MS }
      )
      .toEqual([])

    for (const sectionId of PANEL_SCROLL_STOPS) {
      const stop = resolveMarks(sectionId)

      await landOnSection(page, stop.sectionId)
      await expect
        .poll(
          function readScrolledPanel() {
            return checkPanelMarks(page, stop.panel)
          },
          {
            message: `scrolled to #${stop.sectionId} with the menu open`,
            timeout: MARKS_TIMEOUT_MS,
          }
        )
        .toEqual([])
    }

    expect(problems).toEqual([])
  })
})

test.describe(`the mobile menu under reduced motion at ${PHONE_VIEWPORT.width}x${PHONE_VIEWPORT.height}`, () => {
  test.use({ viewport: PHONE_VIEWPORT, reducedMotion: "reduce" })

  test("opens the panel whole, with no wipe", async ({ page }) => {
    const problems = collectPageProblems(page)

    await openRunningPage(page, "/")
    await watchPanelClip(page)
    await page.getByRole("button", { name: "Open menu" }).click()
    await expect
      .poll(
        function readOpeningRecord() {
          return readPanelClip(page)
        },
        { message: "the opening samples", timeout: MARKS_TIMEOUT_MS }
      )
      .toMatchObject({ done: true })

    const record = await readPanelClip(page)

    expect(checkNoWipe(record.samples)).toEqual([])
    expect(problems).toEqual([])
  })
})
