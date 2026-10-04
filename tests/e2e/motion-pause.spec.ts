import { expect, test } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

import { DOT_STAGE_SELECTOR } from "@/data/hero.data"
import {
  COPY_DRIFT_PX,
  MOTION_PAUSED_STORAGE_KEY,
  MOTION_PAUSED_VALUE,
} from "@/data/motion.data"
import {
  OPEN_MENU_LABEL,
  PAUSE_MOTION_LABEL,
  PLAY_MOTION_LABEL,
  PORTFOLIO_ACTION_NAVIGATION,
  PORTFOLIO_BRAND_LABEL,
  SECONDARY_NAVIGATION_LABEL,
} from "@/data/navigation.data"
import {
  ABOUT_SECTION,
  COPY_DRIFT_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"

const DESKTOP_VIEWPORT = { width: 1440, height: 900 }

const PHONE_VIEWPORT = { width: 390, height: 844 }

const TOGGLE_NAME = /^(Pause|Play) motion$/

const TOGGLE_SELECTOR = `button[aria-label="${PAUSE_MOTION_LABEL}"], button[aria-label="${PLAY_MOTION_LABEL}"]`

const HEADER_BAR_SELECTOR = "header > :first-child"

const HEADER_REVEAL_SELECTOR = "header, header [data-reveal]"

const ACTION_LINK_SELECTOR = `nav[aria-label="${SECONDARY_NAVIGATION_LABEL}"] a[href="${PORTFOLIO_ACTION_NAVIGATION.href}"]`

const MENU_BUTTON_SELECTOR = `button[aria-label="${OPEN_MENU_LABEL}"]`

const SERVICES_CAPTION_SELECTOR = "#services [data-caption]"

const SWEPT_LINE_SELECTOR = `[class*="${SWEPT_LINE_CLASS}"]`

const DRIFT_PATTERN = /^matrix\(1, 0, 0, 1, 0, (\S+)\)$/

const RING_SPREAD_PATTERN = /0px 0px 0px ([\d.]+)px/

const LENIS_CLASS = "lenis"

const QUOTE_LANDING = { path: "/#quote", scene: "cube" }

const SERVICES_LANDING = { path: "/#services", scene: "branding" }

const ABOUT_LANDING = {
  path: `/#${ABOUT_SECTION.id}`,
  scene: ABOUT_SECTION.sceneId,
}

const DESKTOP_PLACEMENT = { size: 40, gap: 12, neighbour: ACTION_LINK_SELECTOR }

const PHONE_PLACEMENT = { size: 32, gap: 8, neighbour: MENU_BUTTON_SELECTOR }

const HEADER_BAR_PX = 72

const STICKY_TOP_PX = 72

const SIZE_TOLERANCE_PX = 1

const CENTRE_TOLERANCE_PX = 2

const RING_SPREAD_PX = 3

const FRAME_WINDOW_MS = 1500

const MIN_RUNNING_FRAMES = 20

const MAX_PAUSED_FRAMES = 2

const TAB_LIMIT = 12

const STAGE_TIMEOUT_MS = 15000

const SCENE_TIMEOUT_MS = 10000

const SETTLE_TIMEOUT_MS = 5000

const REST_TIMEOUT_MS = 10000

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

async function waitForRunningStage(page: Page) {
  const stage = page.locator(DOT_STAGE_SELECTOR)

  await expect(stage).toHaveAttribute("data-status", "running", {
    timeout: STAGE_TIMEOUT_MS,
  })

  return stage
}

async function openRunningPage(page: Page, path: string) {
  await page.goto(path)

  const stage = await waitForRunningStage(page)

  await page.evaluate(function waitForDocumentFonts() {
    return document.fonts.ready.then(function settle() {
      return true
    })
  })

  return stage
}

function findToggle(page: Page) {
  return page.getByRole("button", { name: TOGGLE_NAME })
}

async function readPlacementProblems(
  page: Page,
  placement: typeof DESKTOP_PLACEMENT
) {
  const boxes = await page.evaluate(
    function readHeaderBoxes(input) {
      function readBox(element: Element | null) {
        if (element === null) {
          return null
        }

        const rect = element.getBoundingClientRect()

        return {
          left: rect.left,
          right: rect.right,
          middle: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        }
      }

      const toggle = document.querySelector(input.toggle)
      let radius = ""

      if (toggle !== null) {
        radius = getComputedStyle(toggle).borderRadius
      }

      return {
        toggle: readBox(toggle),
        radius,
        bar: readBox(document.querySelector(input.bar)),
        neighbour: readBox(document.querySelector(input.neighbour)),
      }
    },
    {
      toggle: TOGGLE_SELECTOR,
      bar: HEADER_BAR_SELECTOR,
      neighbour: placement.neighbour,
    }
  )
  const { toggle, bar, neighbour } = boxes

  if (toggle === null || bar === null || neighbour === null) {
    return ["missing the toggle, the header bar or " + placement.neighbour]
  }

  const problems: string[] = []
  const gap = neighbour.left - toggle.right

  if (
    Math.abs(toggle.width - placement.size) > SIZE_TOLERANCE_PX ||
    Math.abs(toggle.height - placement.size) > SIZE_TOLERANCE_PX
  ) {
    problems.push(`the toggle is ${toggle.width}x${toggle.height}`)
  }

  if (boxes.radius !== "0px") {
    problems.push(`the toggle's border-radius is ${boxes.radius}`)
  }

  if (Math.abs(bar.height - HEADER_BAR_PX) > SIZE_TOLERANCE_PX) {
    problems.push(`the header bar is ${bar.height}px tall`)
  }

  if (Math.abs(toggle.middle - bar.middle) > CENTRE_TOLERANCE_PX) {
    problems.push(
      `the toggle's middle is at ${toggle.middle}, the bar's at ${bar.middle}`
    )
  }

  if (gap < 0 || gap > placement.gap + SIZE_TOLERANCE_PX) {
    problems.push(`the toggle ends ${gap}px before ${placement.neighbour}`)
  }

  return problems
}

async function readStoredPause(page: Page) {
  return page.evaluate(function readStoredValue(key) {
    return window.localStorage.getItem(key)
  }, MOTION_PAUSED_STORAGE_KEY)
}

async function rememberPause(page: Page) {
  await page.addInitScript(
    function storePause(input) {
      window.localStorage.setItem(input.key, input.value)
    },
    { key: MOTION_PAUSED_STORAGE_KEY, value: MOTION_PAUSED_VALUE }
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

async function countUnsettledHeader(page: Page) {
  return page.evaluate(function readHeaderReveal(selector) {
    let unsettled = 0

    for (const element of document.querySelectorAll(selector)) {
      const style = getComputedStyle(element)

      if (style.opacity !== "1" || style.transform !== "none") {
        unsettled += 1
      }
    }

    return unsettled
  }, HEADER_REVEAL_SELECTOR)
}

async function readCaptionProblems(page: Page, position: string) {
  const positions = await page.evaluate(function readPositions(selector) {
    const found: string[] = []

    for (const caption of document.querySelectorAll(selector)) {
      found.push(getComputedStyle(caption).position)
    }

    return found
  }, SERVICES_CAPTION_SELECTOR)
  const problems: string[] = []

  if (positions.length === 0) {
    problems.push("no Services captions")
  }

  for (let index = 0; index < positions.length; index += 1) {
    if (positions[index] !== position) {
      problems.push(`caption ${index + 1} is ${positions[index]}`)
    }
  }

  return problems
}

async function readUnsweptProblems(page: Page) {
  return page.evaluate(function inspectSweptLines(selector) {
    const problems: string[] = []
    const lines = document.querySelectorAll(selector)

    if (lines.length === 0) {
      problems.push("no swept lines")
    }

    for (const line of lines) {
      const style = getComputedStyle(line)
      const name = (line.textContent ?? "").trim().slice(0, 32)

      if (style.clipPath !== "none") {
        problems.push(`${name} clipped ${style.clipPath}`)
      }

      if (style.translate !== "none") {
        problems.push(`${name} translated ${style.translate}`)
      }
    }

    return problems
  }, SWEPT_LINE_SELECTOR)
}

async function scrollToArrival(page: Page, id: string) {
  await page.evaluate(
    function scrollSectionHalfIn(input) {
      const section = document.getElementById(input.id)

      if (section === null) {
        throw new Error("missing screen " + input.id)
      }

      const top = section.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: top - (window.innerHeight + input.stickyTop) / 2,
        behavior: "instant",
      })
    },
    { id, stickyTop: STICKY_TOP_PX }
  )
}

async function readCopyProblems(page: Page, isPaused: boolean) {
  const transforms = await page.evaluate(
    function readCopyTransforms(input) {
      const found: string[] = []

      for (const child of document.querySelectorAll(
        `#${input.id} .${input.driftClass} > *`
      )) {
        const style = getComputedStyle(child)

        if (style.display !== "none") {
          found.push(style.transform)
        }
      }

      return found
    },
    { id: ABOUT_SECTION.id, driftClass: COPY_DRIFT_CLASS }
  )
  const problems: string[] = []

  if (transforms.length === 0) {
    problems.push("no copy column in " + ABOUT_SECTION.id)
  }

  for (const transform of transforms) {
    if (isPaused) {
      if (transform !== "none") {
        problems.push("paused copy moved by " + transform)
      }

      continue
    }

    const offset = Number(DRIFT_PATTERN.exec(transform)?.[1])

    if (!(offset > 0 && offset < COPY_DRIFT_PX)) {
      problems.push("arriving copy at " + transform)
    }
  }

  return problems
}

async function focusBrandLink(page: Page) {
  await page
    .locator("header")
    .getByRole("link", { name: PORTFOLIO_BRAND_LABEL, exact: true })
    .focus()
}

async function readFocusedName(page: Page) {
  return page.evaluate(function readActiveName() {
    const active = document.activeElement

    if (active === null) {
      return ""
    }

    return (
      active.getAttribute("aria-label") ?? (active.textContent ?? "").trim()
    )
  })
}

async function tabUntil(page: Page, name: string) {
  const visited: string[] = []

  for (let step = 0; step < TAB_LIMIT; step += 1) {
    await page.keyboard.press("Tab")

    const focused = await readFocusedName(page)

    visited.push(focused)

    if (focused === name) {
      break
    }
  }

  return visited
}

async function readRingSpread(toggle: Locator) {
  return toggle.evaluate(function readWidestShadow(element, pattern) {
    let widest = 0

    for (const layer of getComputedStyle(element).boxShadow.matchAll(
      new RegExp(pattern, "g")
    )) {
      widest = Math.max(widest, Number(layer[1]))
    }

    return widest
  }, RING_SPREAD_PATTERN.source)
}

test.describe(`the motion toggle at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT })

  test("shows one 40px square toggle, centred in the header bar just left of Let's talk", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const toggle = findToggle(page)

    await openRunningPage(page, "/")
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toBeVisible()
    await expect
      .poll(
        function readDesktopPlacement() {
          return readPlacementProblems(page, DESKTOP_PLACEMENT)
        },
        { message: "the toggle's placement", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])

    expect(problems).toEqual([])
  })

  test("pauses on Enter, keeps the pause through a reload and plays on Enter again", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const root = page.locator("html")
    const toggle = findToggle(page)

    await openRunningPage(page, "/")
    await expect(root).not.toHaveAttribute("data-motion")
    await expect(toggle).toHaveAccessibleName(PAUSE_MOTION_LABEL)
    expect(await readStoredPause(page)).toBeNull()

    await toggle.press("Enter")

    await expect(root).toHaveAttribute("data-motion", MOTION_PAUSED_VALUE)
    await expect(toggle).toHaveAccessibleName(PLAY_MOTION_LABEL)
    expect(await readStoredPause(page)).toBe(MOTION_PAUSED_VALUE)

    await page.reload()
    await waitForRunningStage(page)

    expect(
      await root.getAttribute("data-motion"),
      "data-motion once the stage runs"
    ).toBe(MOTION_PAUSED_VALUE)
    await expect(toggle).toHaveAccessibleName(PLAY_MOTION_LABEL)

    await toggle.press("Enter")

    await expect(root).not.toHaveAttribute("data-motion")
    await expect(toggle).toHaveAccessibleName(PAUSE_MOTION_LABEL)
    expect(await readStoredPause(page)).toBeNull()
    expect(problems).toEqual([])
  })

  test("stops the dot loop over the spinning cube while paused and restarts it on play", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const root = page.locator("html")
    const toggle = findToggle(page)

    await installFrameCounter(page)

    const stage = await openRunningPage(page, QUOTE_LANDING.path)

    await expect(stage).toHaveAttribute("data-scene", QUOTE_LANDING.scene, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect
      .poll(
        function readHeaderIntro() {
          return countUnsettledHeader(page)
        },
        { message: "the header's intro", timeout: SETTLE_TIMEOUT_MS }
      )
      .toBe(0)
    expect(
      await countFramesOver(page, FRAME_WINDOW_MS),
      "frames while running"
    ).toBeGreaterThanOrEqual(MIN_RUNNING_FRAMES)

    await toggle.press("Enter")

    await expect(root).toHaveAttribute("data-motion", MOTION_PAUSED_VALUE)
    await expect
      .poll(
        function countPausedFrames() {
          return countFramesOver(page, FRAME_WINDOW_MS)
        },
        { message: "frames while paused", timeout: REST_TIMEOUT_MS }
      )
      .toBeLessThanOrEqual(MAX_PAUSED_FRAMES)
    await expect(stage).toHaveAttribute("data-scene", QUOTE_LANDING.scene)

    await toggle.press("Enter")

    await expect(root).not.toHaveAttribute("data-motion")
    expect(
      await countFramesOver(page, FRAME_WINDOW_MS),
      "frames after play"
    ).toBeGreaterThanOrEqual(MIN_RUNNING_FRAMES)
    expect(problems).toEqual([])
  })

  test("unstages the Services captions, unsweeps every line and stops Lenis while paused", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const root = page.locator("html")
    const toggle = findToggle(page)
    const stage = await openRunningPage(page, SERVICES_LANDING.path)

    await expect(stage).toHaveAttribute("data-scene", SERVICES_LANDING.scene, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(root).toContainClass(LENIS_CLASS)
    expect(await readCaptionProblems(page, "static"), "staged").toEqual([])
    expect(
      await readUnsweptProblems(page),
      "lines swept while running"
    ).not.toEqual([])

    await toggle.press("Enter")

    await expect(root).toHaveAttribute("data-motion", MOTION_PAUSED_VALUE)
    await expect
      .poll(
        function readPausedCaptions() {
          return readCaptionProblems(page, "sticky")
        },
        { message: "curtains while paused", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])
    await expect
      .poll(
        function readPausedLines() {
          return readUnsweptProblems(page)
        },
        { message: "lines while paused", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])
    await expect(root).not.toContainClass(LENIS_CLASS)

    await toggle.press("Enter")

    await expect(root).not.toHaveAttribute("data-motion")
    await expect(root).toContainClass(LENIS_CLASS)
    await expect
      .poll(
        function readPlayedCaptions() {
          return readCaptionProblems(page, "static")
        },
        { message: "captions after play", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])
    expect(problems).toEqual([])
  })

  test("holds About's arriving copy still while paused", async ({ page }) => {
    const problems = collectPageProblems(page)
    const toggle = findToggle(page)
    const stage = await openRunningPage(page, ABOUT_LANDING.path)

    await expect(stage).toHaveAttribute("data-scene", ABOUT_LANDING.scene, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await scrollToArrival(page, ABOUT_SECTION.id)
    await expect
      .poll(
        function readArrivingCopy() {
          return readCopyProblems(page, false)
        },
        { message: "arriving copy while running", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])

    await toggle.press("Enter")

    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      MOTION_PAUSED_VALUE
    )
    await expect
      .poll(
        function readPausedCopy() {
          return readCopyProblems(page, true)
        },
        { message: "arriving copy while paused", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])
    expect(problems).toEqual([])
  })

  test("never starts the dot loop when the page opens with the pause remembered", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)

    await rememberPause(page)
    await installFrameCounter(page)

    const stage = await openRunningPage(page, QUOTE_LANDING.path)

    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      MOTION_PAUSED_VALUE
    )
    await expect(stage).toHaveAttribute("data-scene", QUOTE_LANDING.scene, {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect
      .poll(
        function countRememberedFrames() {
          return countFramesOver(page, FRAME_WINDOW_MS)
        },
        {
          message: "frames with the pause remembered",
          timeout: REST_TIMEOUT_MS,
        }
      )
      .toBeLessThanOrEqual(MAX_PAUSED_FRAMES)
    await expect(findToggle(page)).toHaveAccessibleName(PLAY_MOTION_LABEL)
    expect(problems).toEqual([])
  })

  test("comes right before Let's talk in the tab order, toggles on Space and rings its focus 3px wide", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const toggle = findToggle(page)

    await openRunningPage(page, "/")
    await focusBrandLink(page)

    const visited = await tabUntil(page, PORTFOLIO_ACTION_NAVIGATION.label)

    expect(visited.slice(-2), visited.join(" > ")).toEqual([
      PAUSE_MOTION_LABEL,
      PORTFOLIO_ACTION_NAVIGATION.label,
    ])

    await page.keyboard.press("Shift+Tab")
    await expect(toggle).toBeFocused()
    await expect
      .poll(
        function readFocusRing() {
          return readRingSpread(toggle)
        },
        { message: "the focus ring's spread", timeout: SETTLE_TIMEOUT_MS }
      )
      .toBeCloseTo(RING_SPREAD_PX, 2)

    await page.keyboard.press("Space")

    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      MOTION_PAUSED_VALUE
    )
    await expect(toggle).toHaveAccessibleName(PLAY_MOTION_LABEL)
    await expect(toggle).toBeFocused()
    expect(problems).toEqual([])
  })
})

test.describe(`the motion toggle at ${PHONE_VIEWPORT.width}x${PHONE_VIEWPORT.height}`, () => {
  test.use({ viewport: PHONE_VIEWPORT })

  test("shows one 32px square toggle, centred in the header bar right before the menu button", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const toggle = findToggle(page)

    await openRunningPage(page, "/")
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toBeVisible()
    await expect
      .poll(
        function readPhonePlacement() {
          return readPlacementProblems(page, PHONE_PLACEMENT)
        },
        { message: "the toggle's placement", timeout: SETTLE_TIMEOUT_MS }
      )
      .toEqual([])

    expect(problems).toEqual([])
  })
})

test.describe(`the motion toggle under reduced motion at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT, reducedMotion: "reduce" })

  test("hides the toggle, since the page already holds still", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const toggle = page.locator(TOGGLE_SELECTOR)

    await openRunningPage(page, "/")
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toHaveCSS("display", "none")

    expect(problems).toEqual([])
  })
})

test.describe(`the motion toggle without JavaScript at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT, javaScriptEnabled: false })

  test("hides the toggle, since nothing could pause the page", async ({
    page,
  }) => {
    const toggle = page.locator(TOGGLE_SELECTOR)

    await page.goto("/")

    await expect(page.locator("header")).toBeVisible()
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toHaveCSS("display", "none")
  })
})

test.describe(`the motion toggle in forced colours at ${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT, forcedColors: "active" })

  test("outlines the toggle's keyboard focus, since forced colours drop the ring", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const toggle = findToggle(page)

    await openRunningPage(page, "/")
    await focusBrandLink(page)

    const visited = await tabUntil(page, PAUSE_MOTION_LABEL)

    await expect(toggle, visited.join(" > ")).toBeFocused()
    await expect(toggle).not.toHaveCSS("outline-style", "none")

    expect(problems).toEqual([])
  })
})
