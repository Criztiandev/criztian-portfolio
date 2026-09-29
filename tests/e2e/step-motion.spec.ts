import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import {
  DOT_FIELD_MORPH_TUNING,
  DOT_SCENE_MOTION,
  THREAD_TURN_PROPERTY,
} from "@/data/hero.data"
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

const PROCESS_SHARE =
  DOT_SCENE_MOTION.process?.share ?? DOT_FIELD_MORPH_TUNING.stepMorphShare

const FIRST_PROCESS_START = 0.5 - PROCESS_SHARE / 2

const NUDGE_SHARE = DOT_FIELD_MORPH_TUNING.threadTrigger / 2

const PAST_TRIGGER_SHARE = DOT_FIELD_MORPH_TUNING.threadTrigger * 2

const FAST_WHEEL_PITCHES = 1.5

const FAST_WHEEL_NOTCHES = 15

const WHEEL_LANDING_TOLERANCE_PX = 2

const MIN_DRAW_SHARE = 0.5

const CAPTION_LEAD_MS = 300

const CAPTION_LAND_SLACK_MS = 50

const GATE_SETTLE_MS = 800

const SCROLL_REST_FRAMES = 20

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
    const groups = [
      { name: "title", selector: "#services [data-fit-box] > li h3" },
      { name: "position", selector: "#services h2 [data-position]" },
    ]

    for (const group of groups) {
      const elements = document.querySelectorAll<HTMLElement>(group.selector)

      if (elements.length === 0) {
        problems.push("no " + group.name)
      }

      for (
        let elementIndex = 0;
        elementIndex < elements.length;
        elementIndex += 1
      ) {
        const element = elements[elementIndex]

        if (element === undefined) {
          continue
        }

        const rect = element.getBoundingClientRect()

        for (const fraction of [0.2, 0.5, 0.8]) {
          const hit = document.elementFromPoint(
            rect.left + rect.width * fraction,
            rect.top + rect.height / 2
          )
          const isHit = hit !== null && element.contains(hit)

          if (elementIndex === activeIndex && !isHit) {
            problems.push("active " + group.name + " hidden at " + fraction)
          }

          if (elementIndex !== activeIndex && isHit) {
            problems.push("showing " + (element.textContent ?? ""))
          }
        }
      }
    }

    return problems
  }, stepIndex)
}

async function watchCaptionSync(page: Page) {
  await page.evaluate(function installCaptionWatch() {
    const stage = document.querySelector<HTMLElement>("[data-status]")
    const samples: {
      time: number
      scene: string
      started: string[]
      full: string[]
    }[] = []

    Object.assign(window, { captionSamples: samples })

    if (stage === null) {
      return
    }

    const observedStage: HTMLElement = stage

    function isHitAt(element: HTMLElement, fraction: number): boolean {
      const rect = element.getBoundingClientRect()
      const hit = document.elementFromPoint(
        rect.left + rect.width * fraction,
        rect.top + rect.height / 2
      )

      return hit !== null && element.contains(hit)
    }

    function sampleCaptions() {
      const started: string[] = []
      const full: string[] = []

      for (const caption of document.querySelectorAll<HTMLElement>(
        "#services [data-caption]"
      )) {
        const statement = caption.querySelector<HTMLElement>("h3")
        const shape = caption.dataset.caption ?? ""

        if (statement === null) {
          continue
        }

        if (isHitAt(statement, 0.1)) {
          started.push(shape)
        }

        if (isHitAt(statement, 0.9)) {
          full.push(shape)
        }
      }

      samples.push({
        time: window.performance.now(),
        scene: observedStage.dataset.scene ?? "",
        started,
        full,
      })

      window.requestAnimationFrame(sampleCaptions)
    }

    window.requestAnimationFrame(sampleCaptions)
  })
}

async function readCaptionSync(page: Page) {
  return page.evaluate(function readSamples() {
    const holder = window as unknown as {
      captionSamples?: {
        time: number
        scene: string
        started: string[]
        full: string[]
      }[]
    }

    return new Promise<NonNullable<typeof holder.captionSamples>>(
      function waitOneFrame(resolve) {
        window.requestAnimationFrame(function returnSamples() {
          resolve(holder.captionSamples ?? [])
        })
      }
    )
  })
}

async function readOrbit(page: Page, stepIndex: number) {
  return page.evaluate(
    function measureOrbit(input) {
      const problems: string[] = []
      const container = document.getElementById("process")
      const slot = container?.querySelector<HTMLElement>("[data-dot-slot]")
      const ring = container?.querySelector("svg")
      const circle = ring?.querySelector("circle")
      const list = container?.querySelector("ol")
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
        circle === null ||
        circle === undefined ||
        list === null ||
        list === undefined ||
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

      function isHitAt(element: Element, x: number, y: number): boolean {
        const hit = document.elementFromPoint(x, y)

        return hit !== null && element.contains(hit)
      }

      function readAlpha(element: Element): number {
        const match = /\/\s*([\d.]+)\s*\)/.exec(getComputedStyle(element).color)

        return match === null ? 1 : Number(match[1])
      }

      const listRect = list.getBoundingClientRect()
      const centre = (listRect.left + listRect.right) / 2
      const ringRect = ring.getBoundingClientRect()
      const ringBox = circle.getBBox()
      const ringCentre = ringRect.left + ringBox.x + ringBox.width / 2
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
      const ringY = ringRect.top + input.ringInsetPx
      const slotRect = slot.getBoundingClientRect()
      const headingText = document.createRange()

      headingText.selectNodeContents(heading)

      const headingRect = headingText.getBoundingClientRect()

      if (Math.abs(ringCentre - centre) > input.tolerance) {
        problems.push("ring not centred on the steps")
      }

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

      const next = steps?.[input.activeIndex + 1]
      const nextTitle = next?.querySelector("h3")

      if (next !== undefined && nextTitle !== null && nextTitle !== undefined) {
        const nextRect = nextTitle.getBoundingClientRect()

        if ((nextRect.left + nextRect.right) / 2 <= centre) {
          problems.push("next step not right of centre")
        }

        if (nextRect.height <= nextTitle.offsetHeight + 2) {
          problems.push("next step not turned on the rim")
        }

        if (readAlpha(nextTitle) >= readAlpha(title)) {
          problems.push("next title not dimmed")
        }

        for (const digit of next.firstElementChild?.children ?? []) {
          if (getComputedStyle(digit).opacity !== "1") {
            problems.push("next numeral not waiting on the rim")
          }
        }
      }

      const later = steps?.[input.activeIndex + 2]

      for (const digit of later?.firstElementChild?.children ?? []) {
        if (getComputedStyle(digit).opacity !== "0") {
          problems.push("a step two ahead is showing")
        }
      }

      const previousTitle = steps?.[input.activeIndex - 1]?.querySelector("h3")

      if (previousTitle !== null && previousTitle !== undefined) {
        const previousRect = previousTitle.getBoundingClientRect()

        if ((previousRect.left + previousRect.right) / 2 >= centre) {
          problems.push("previous step not left of centre")
        }

        if (previousRect.height <= previousTitle.offsetHeight + 2) {
          problems.push("previous step not turned on the rim")
        }

        if (readAlpha(previousTitle) >= readAlpha(title)) {
          problems.push("previous title not dimmed")
        }

        const clip = /inset\(\S+\s+(\S+)/.exec(
          getComputedStyle(previousTitle).clipPath
        )

        if (clip === null || parseFloat(clip[1] ?? "") > 0) {
          problems.push("previous title swept out")
        }

        const previousNumeral = previousTitle.previousElementSibling

        for (const digit of previousNumeral?.children ?? []) {
          if (getComputedStyle(digit).opacity !== "1") {
            problems.push("previous numeral not waiting on the rim")
          }
        }
      }

      const guarded = [
        {
          name: "numeral box",
          rect: new DOMRect(
            numeralRect.left,
            numeralRect.top + 1,
            numeralRect.width,
            numeralRect.height - 1
          ),
        },
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

      if (
        !isHitAt(
          slot,
          slotRect.left + slotRect.width / 2,
          slotRect.top + slotRect.height / 2
        )
      ) {
        problems.push("slot not on top of hit testing")
      }

      const revealed = [
        { name: "title", element: title },
        { name: "body", element: body },
      ]

      for (const item of revealed) {
        const text = document.createRange()

        text.selectNodeContents(item.element)

        for (const line of text.getClientRects()) {
          for (const fraction of [0.1, 0.5, 0.9]) {
            if (
              !isHitAt(
                item.element,
                line.left + line.width * fraction,
                line.top + line.height / 2
              )
            ) {
              problems.push("active " + item.name + " not whole at " + fraction)
            }
          }
        }
      }

      if (
        !isHitAt(
          heading,
          headingRect.left + Math.min(headingRect.width / 2, 12),
          headingRect.top + headingRect.height / 2
        )
      ) {
        problems.push("heading not on top of hit testing")
      }

      const positions = heading.querySelectorAll<HTMLElement>("[data-position]")

      for (
        let positionIndex = 0;
        positionIndex < positions.length;
        positionIndex += 1
      ) {
        const position = positions[positionIndex]

        if (position === undefined) {
          continue
        }

        const rect = position.getBoundingClientRect()
        const isShown = isHitAt(
          position,
          rect.left + rect.width * 0.8,
          rect.top + rect.height / 2
        )

        if (positionIndex === input.activeIndex && !isShown) {
          problems.push("active position hidden")
        }

        if (positionIndex !== input.activeIndex && isShown) {
          problems.push("showing position " + (position.textContent ?? ""))
        }
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

async function readOrbitTurn(page: Page) {
  return page.evaluate(function readTurn(property) {
    const container = document.getElementById("process")

    return Number(container?.style.getPropertyValue(property) ?? Number.NaN)
  }, THREAD_TURN_PROPERTY)
}

async function watchOrbitTurn(page: Page) {
  await page.evaluate(function installTurnWatch(property) {
    const stage = document.querySelector<HTMLElement>("[data-status]")
    const container = document.getElementById("process")
    const samples: {
      time: number
      scene: string
      thread: string
      turn: number
    }[] = []

    Object.assign(window, { turnSamples: samples })

    if (stage === null || container === null) {
      return
    }

    const observedStage: HTMLElement = stage
    const observedContainer: HTMLElement = container

    function sampleTurn() {
      samples.push({
        time: window.performance.now(),
        scene: observedStage.dataset.scene ?? "",
        thread: observedStage.dataset.thread ?? "",
        turn: Number(observedContainer.style.getPropertyValue(property)),
      })

      window.requestAnimationFrame(sampleTurn)
    }

    window.requestAnimationFrame(sampleTurn)
  }, THREAD_TURN_PROPERTY)
}

async function readTurnSamples(page: Page) {
  return page.evaluate(function readSamples() {
    const holder = window as unknown as {
      turnSamples?: {
        time: number
        scene: string
        thread: string
        turn: number
      }[]
    }

    return new Promise<NonNullable<typeof holder.turnSamples>>(
      function waitOneFrame(resolve) {
        window.requestAnimationFrame(function returnSamples() {
          resolve(holder.turnSamples ?? [])
        })
      }
    )
  })
}

async function readShownTitles(page: Page) {
  return page.evaluate(function findShownTitles() {
    const shown: string[] = []

    for (const step of document.querySelectorAll<HTMLElement>(
      "#process [data-orbit-step]"
    )) {
      const title = step.querySelector("h3")

      if (title === null) {
        continue
      }

      const rect = title.getBoundingClientRect()
      const probeX = rect.left + rect.width / 2
      const probeY = rect.top + rect.height / 2
      const isInView =
        probeX >= 0 &&
        probeX < window.innerWidth &&
        probeY >= 0 &&
        probeY < window.innerHeight
      const hit = isInView ? document.elementFromPoint(probeX, probeY) : null

      if (hit !== null && title.contains(hit)) {
        shown.push(step.dataset.orbitStep ?? "")
      }
    }

    return shown
  })
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

    const guarded = [
      { name: "slot", rect: slot.getBoundingClientRect() },
      { name: "label", rect: headingText.getBoundingClientRect() },
    ]

    for (const step of document.querySelectorAll<HTMLElement>(
      "#process [data-orbit-step]"
    )) {
      const rect = step.getBoundingClientRect()
      const isOnScreen = rect.bottom > 0 && rect.top < window.innerHeight

      if (!isOnScreen) {
        continue
      }

      for (const item of guarded) {
        const isOverlapping =
          rect.left < item.rect.right - tolerance &&
          rect.right > item.rect.left + tolerance &&
          rect.top < item.rect.bottom - tolerance &&
          rect.bottom > item.rect.top + tolerance

        if (isOverlapping) {
          problems.push(
            (step.dataset.orbitStep ?? "") + " covers the " + item.name
          )
        }
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
  const shapes = SCENES[1]?.shapes ?? []

  for (let position = 0; position < shapes.length - 0.5; position += 0.25) {
    await scrollToStep(page, "process", position)

    expect(await readCurtainClearance(page), `at ${position}`).toEqual([])
    expect(await readOverflowX(page)).toBeLessThanOrEqual(0)

    if (Number.isInteger(position)) {
      expect(await readShownTitles(page), `docked at ${position}`).toEqual([
        shapes[position],
      ])
    }
  }
}

async function readServicesCurtains(page: Page) {
  return page.evaluate(function measureServicesCurtains(tolerance) {
    const problems: string[] = []
    const slot = document.querySelector("#services [data-dot-slot]")
    const heading = document.querySelector("#services h2")

    if (slot === null || heading === null) {
      return ["missing slot or heading"]
    }

    const headingText = document.createRange()

    headingText.selectNodeContents(heading)

    const guarded = [
      { name: "slot", rect: slot.getBoundingClientRect() },
      { name: "label", rect: headingText.getBoundingClientRect() },
    ]

    for (const caption of document.querySelectorAll<HTMLElement>(
      "#services [data-caption]"
    )) {
      const rect = caption.getBoundingClientRect()
      const isOnScreen = rect.bottom > 0 && rect.top < window.innerHeight

      if (!isOnScreen) {
        continue
      }

      for (const item of guarded) {
        const isOverlapping =
          rect.left < item.rect.right - tolerance &&
          rect.right > item.rect.left + tolerance &&
          rect.top < item.rect.bottom - tolerance &&
          rect.bottom > item.rect.top + tolerance

        if (isOverlapping) {
          problems.push(
            (caption.dataset.caption ?? "") + " covers the " + item.name
          )
        }
      }
    }

    return problems
  }, ORBIT_TOLERANCE_PX)
}

async function readShownPositions(page: Page) {
  return page.evaluate(function findShownPositions() {
    const shown: string[] = []

    for (const position of document.querySelectorAll<HTMLElement>(
      "#services [data-position]"
    )) {
      if (position.checkVisibility({ visibilityProperty: true })) {
        shown.push(position.dataset.position ?? "")
      }
    }

    return shown
  })
}

async function checkServicesCurtains(page: Page) {
  const stepCount = SCENES[0]?.shapes.length ?? 0

  for (let position = 0; position <= stepCount - 1; position += 0.25) {
    await scrollToStep(page, "services", position)

    expect(await readServicesCurtains(page), `at ${position}`).toEqual([])
    expect(await readShownPositions(page), `count at ${position}`).toEqual([])
    expect(await readOverflowX(page)).toBeLessThanOrEqual(0)
  }
}

async function readServicesBoxes(page: Page) {
  return page.evaluate(function compareServicesModes() {
    const stage = document.querySelector<HTMLElement>("[data-status]")
    const container = document.getElementById("services")

    if (stage === null || container === null) {
      return null
    }

    const section: HTMLElement = container
    const status = stage.dataset.status ?? ""

    function snapshot() {
      const slot = section.querySelector("[data-dot-slot]")
      const slotRect = slot?.getBoundingClientRect()
      const captions: number[] = []

      for (const copy of section.querySelectorAll<HTMLElement>(
        "[data-caption] > div"
      )) {
        const rect = copy.getBoundingClientRect()

        captions.push(rect.width, rect.height)
      }

      return {
        slot:
          slotRect === undefined
            ? []
            : [slotRect.left, slotRect.top, slotRect.width, slotRect.height],
        height: section.getBoundingClientRect().height,
        captions,
      }
    }

    const staged = snapshot()

    stage.dataset.status = "idle"

    const unstaged = snapshot()

    stage.dataset.status = status

    return { staged, unstaged }
  })
}

async function readCaptionBoard(page: Page) {
  return page.evaluate(function measureBoard(tolerance) {
    const problems: string[] = []
    const container = document.getElementById("services")
    const frame = container?.firstElementChild
    const board = container?.children[1]
    const heading = container?.querySelector("h2")

    if (
      frame === null ||
      frame === undefined ||
      board === undefined ||
      heading === null ||
      heading === undefined
    ) {
      return ["missing services parts"]
    }

    const frameRect = frame.getBoundingClientRect()
    const boardRect = board.getBoundingClientRect()
    const headingRect = heading.getBoundingClientRect()
    const frameStyle = getComputedStyle(frame)

    if (Math.abs(boardRect.bottom - frameRect.bottom) > tolerance) {
      problems.push("board does not end with the frame")
    }

    if (Math.abs(boardRect.left - headingRect.left) > tolerance) {
      problems.push("board not aligned with the label")
    }

    if (boardRect.top < headingRect.bottom - tolerance) {
      problems.push("board covers the label")
    }

    if (frameStyle.display === "grid") {
      const rowGap = parseFloat(frameStyle.rowGap)

      if (Math.abs(boardRect.top - headingRect.bottom - rowGap) > tolerance) {
        problems.push("board not one row gap under the label")
      }
    }

    return problems
  }, ORBIT_TOLERANCE_PX)
}

async function checkOrbitTurns(page: Page) {
  const problems = collectPageProblems(page)
  const shapes = SCENES[1]?.shapes ?? []
  const section = page.locator("#process")
  const stage = page.locator("[data-status]")
  const ringOffsets = new Set<string>()

  await openRunningPage(page)
  expect(await readBoardPosition(page, "process")).toBe("sticky")

  for (let stepIndex = 0; stepIndex < shapes.length; stepIndex += 1) {
    await scrollToStep(
      page,
      "process",
      resolveFormedPosition(stepIndex, shapes.length)
    )

    await expect(stage).toHaveAttribute("data-scene", shapes[stepIndex] ?? "", {
      timeout: SCENE_TIMEOUT_MS,
    })
    await expect(stage).toHaveAttribute("data-thread", shapes[stepIndex] ?? "")
    await expect(section).not.toHaveAttribute("data-fit")
    expect(await readOrbitTurn(page)).toBe(stepIndex)
    await expect
      .poll(
        function readFormedOrbit() {
          return readOrbit(page, stepIndex)
        },
        { message: `step ${stepIndex}`, timeout: SCENE_TIMEOUT_MS }
      )
      .toEqual([])
    ringOffsets.add(await readRingOffset(page))
  }

  expect(ringOffsets.size, "the ring's dots drift").toBe(shapes.length)
  expect(problems).toEqual([])
}

async function checkTriggeredTurn(page: Page) {
  const stage = page.locator("[data-status]")

  await openRunningPage(page)
  await scrollToStep(page, "process", 0)
  await expect(stage).toHaveAttribute("data-scene", "listening", {
    timeout: SCENE_TIMEOUT_MS,
  })

  await scrollToStep(
    page,
    "process",
    FIRST_PROCESS_START + PROCESS_SHARE * NUDGE_SHARE
  )
  await page.waitForTimeout(DOT_FIELD_MORPH_TUNING.threadDrawSeconds * 1000)
  await expect(stage).toHaveAttribute("data-scene", "listening")
  expect(await readOrbitTurn(page)).toBe(0)

  await watchOrbitTurn(page)
  await scrollToStep(
    page,
    "process",
    FIRST_PROCESS_START + PROCESS_SHARE * PAST_TRIGGER_SHARE
  )
  await expect(stage).toHaveAttribute("data-thread", "planning")
  await expect(stage).toHaveAttribute("data-scene", "planning", {
    timeout: SCENE_TIMEOUT_MS,
  })

  const samples = await readTurnSamples(page)
  let previousTurn = 0
  let startedAt = Number.NaN
  let landedAt = Number.NaN
  let formedTurn = Number.NaN

  for (const sample of samples) {
    expect(sample.turn, "the turn never runs back").toBeGreaterThanOrEqual(
      previousTurn
    )
    previousTurn = sample.turn

    if (sample.thread === "listening") {
      expect(sample.turn, "no turn before the trigger").toBe(0)
    }

    if (Number.isNaN(startedAt) && sample.turn > 0) {
      startedAt = sample.time
    }

    if (Number.isNaN(landedAt) && sample.turn === 1) {
      landedAt = sample.time
    }

    if (Number.isNaN(formedTurn) && sample.scene === "planning") {
      formedTurn = sample.turn
    }
  }

  expect(formedTurn, "the step lands with its drawing").toBe(1)
  expect(landedAt - startedAt).toBeGreaterThanOrEqual(
    DOT_FIELD_MORPH_TUNING.threadDrawSeconds * 1000 * MIN_DRAW_SHARE
  )
  await expect
    .poll(
      function readPlanningOrbit() {
        return readOrbit(page, 1)
      },
      { timeout: SCENE_TIMEOUT_MS }
    )
    .toEqual([])
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
      await scrollToStep(page, "services", 0)
      expect(await readCaptionBoard(page)).toEqual([])

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

    test("keeps the services' boxes identical staged and unstaged", async ({
      page,
    }) => {
      await openRunningPage(page)
      await scrollToStep(page, "services", 0)

      const boxes = await readServicesBoxes(page)

      expect(boxes).not.toBeNull()
      expect(boxes?.unstaged).toEqual(boxes?.staged)
    })

    test("sweeps each caption out and in with its drawing", async ({
      page,
    }) => {
      const stage = page.locator("[data-status]")

      await openRunningPage(page)
      await scrollToStep(page, "services", 0)
      await expect(stage).toHaveAttribute("data-scene", "branding", {
        timeout: SCENE_TIMEOUT_MS,
      })
      await expect
        .poll(
          function readBrandingCaption() {
            return readCaptions(page, 0)
          },
          { timeout: SCENE_TIMEOUT_MS }
        )
        .toEqual([])

      await watchCaptionSync(page)
      await scrollToStep(
        page,
        "services",
        FIRST_THREAD_START + SERVICES_SHARE * PAST_TRIGGER_SHARE
      )
      await expect(stage).toHaveAttribute("data-scene", "web-design", {
        timeout: SCENE_TIMEOUT_MS,
      })

      const samples = await readCaptionSync(page)
      let startedAt = Number.NaN
      let fullAt = Number.NaN
      let formedAt = Number.NaN

      for (const sample of samples) {
        expect(sample.started, "two captions at once").not.toEqual(
          expect.arrayContaining(["branding", "web-design"])
        )

        if (sample.scene === "branding") {
          expect(sample.full, "branding left before its drawing").toEqual([
            "branding",
          ])
        }

        if (Number.isNaN(startedAt) && sample.started.includes("web-design")) {
          startedAt = sample.time
        }

        if (Number.isNaN(fullAt) && sample.full.includes("web-design")) {
          fullAt = sample.time
        }

        if (Number.isNaN(formedAt) && sample.scene === "web-design") {
          formedAt = sample.time
        }
      }

      expect(formedAt - startedAt).toBeGreaterThanOrEqual(CAPTION_LEAD_MS)
      expect(fullAt - formedAt).toBeLessThanOrEqual(CAPTION_LAND_SLACK_MS)
    })

    test("turns the orbit one step per shape", async ({ page }) => {
      await checkOrbitTurns(page)
    })

    test("turns the orbit by itself once the scroll passes the trigger", async ({
      page,
    }) => {
      await checkTriggeredTurn(page)
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

async function readScrollTop(page: Page) {
  return page.evaluate(function readScroll() {
    return window.scrollY
  })
}

async function readServicesPitch(page: Page) {
  return page.evaluate(function measurePitch(stepCount) {
    const container = document.getElementById("services")
    const frame = container?.firstElementChild

    if (container === null || frame === null || frame === undefined) {
      return Number.NaN
    }

    const height =
      container.getBoundingClientRect().height -
      frame.getBoundingClientRect().height

    return height / Math.max(1, stepCount - 1)
  }, SCENES[0]?.shapes.length ?? 1)
}

async function watchScrollHold(page: Page) {
  await page.evaluate(function installHoldWatch() {
    const root = document.documentElement
    const record = { held: false }

    Object.assign(window, { scrollHoldRecord: record })

    function sampleHold() {
      const isHeld =
        root.classList.contains("lenis-locked") ||
        root.classList.contains("lenis-stopped") ||
        getComputedStyle(root).overflowY === "hidden"

      if (isHeld) {
        record.held = true
      }

      window.requestAnimationFrame(sampleHold)
    }

    window.requestAnimationFrame(sampleHold)
  })
}

async function readScrollHeld(page: Page) {
  return page.evaluate(function readHold() {
    const holder = window as unknown as {
      scrollHoldRecord?: { held: boolean }
    }

    return holder.scrollHoldRecord?.held ?? true
  })
}

async function watchDevelopmentDraw(page: Page) {
  await page.evaluate(function installDrawWatch() {
    const stage = document.querySelector<HTMLElement>("[data-status]")
    const record = { committedAt: 0, formedAt: 0 }

    Object.assign(window, { developmentDraw: record })

    if (stage === null) {
      return
    }

    const observedStage: HTMLElement = stage

    function noteStage() {
      const now = window.performance.now()

      if (
        record.committedAt === 0 &&
        observedStage.dataset.thread === "development"
      ) {
        record.committedAt = now
      }

      if (
        record.formedAt === 0 &&
        observedStage.dataset.scene === "development"
      ) {
        record.formedAt = now
      }
    }

    new MutationObserver(noteStage).observe(observedStage, {
      attributes: true,
      attributeFilter: ["data-thread", "data-scene"],
    })
  })
}

async function readDevelopmentDrawMs(page: Page) {
  return page.evaluate(function readDraw() {
    const holder = window as unknown as {
      developmentDraw?: { committedAt: number; formedAt: number }
    }
    const record = holder.developmentDraw

    if (record === undefined || record.committedAt === 0) {
      return Number.NaN
    }

    return record.formedAt - record.committedAt
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

test.describe("a fast wheel through the services", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("is never held, and draws every shape it passes instead of skipping", async ({
    page,
  }) => {
    const problems = collectPageProblems(page)
    const stage = page.locator("[data-status]")

    await openRunningPage(page)
    await scrollToStep(page, "services", 0)
    await expect(stage).toHaveAttribute("data-scene", "branding", {
      timeout: SCENE_TIMEOUT_MS,
    })

    const startTop = await readScrollTop(page)
    const distance = (await readServicesPitch(page)) * FAST_WHEEL_PITCHES
    const notch = distance / FAST_WHEEL_NOTCHES

    await watchScrollHold(page)
    await watchDevelopmentDraw(page)
    await page.mouse.move(720, 450)

    for (let notchIndex = 0; notchIndex < FAST_WHEEL_NOTCHES; notchIndex += 1) {
      await page.mouse.wheel(0, notch)
    }

    await waitForScrollRest(page)

    expect(await readScrollHeld(page)).toBe(false)
    expect(
      Math.abs((await readScrollTop(page)) - (startTop + distance))
    ).toBeLessThanOrEqual(WHEEL_LANDING_TOLERANCE_PX)
    await expect(stage).toHaveAttribute("data-thread", "development")
    await expect(stage).toHaveAttribute("data-scene", "development", {
      timeout: SCENE_TIMEOUT_MS,
    })
    expect(await readDevelopmentDrawMs(page)).toBeGreaterThanOrEqual(
      DOT_FIELD_MORPH_TUNING.threadDrawSeconds * 1000 * MIN_DRAW_SHARE
    )
    expect(problems).toEqual([])
  })
})

test.describe("a touch scroll through the services", () => {
  test.use({
    viewport: { width: 390, height: 664 },
    isMobile: true,
    hasTouch: true,
  })

  test("is never held while the next drawing plays by itself", async ({
    page,
  }) => {
    const stage = page.locator("[data-status]")

    await openRunningPage(page)
    await scrollToStep(page, "services", 0)
    await expect(stage).toHaveAttribute("data-scene", "branding", {
      timeout: SCENE_TIMEOUT_MS,
    })

    await watchScrollHold(page)
    await scrollToStep(
      page,
      "services",
      FIRST_THREAD_START + SERVICES_SHARE * PAST_TRIGGER_SHARE
    )

    const stoppedTop = await readScrollTop(page)

    await expect(stage).toHaveAttribute("data-scene", "web-design", {
      timeout: SCENE_TIMEOUT_MS,
    })
    expect(await readScrollTop(page)).toBe(stoppedTop)
    expect(await readScrollHeld(page)).toBe(false)
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

    await checkServicesCurtains(page)
    await checkCurtainClearance(page)
  })
})

test.describe("step scenes under reduced motion on a phone", () => {
  test.use({ viewport: { width: 390, height: 664 }, reducedMotion: "reduce" })

  test("docks the service and process curtains below the band", async ({
    page,
  }) => {
    await openRunningPage(page)

    expect(await readBoardPosition(page, "services")).not.toBe("sticky")
    expect(await readBoardPosition(page, "process")).not.toBe("sticky")
    await checkServicesCurtains(page)
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

test.describe("the orbit on a wide screen", () => {
  test.use({ viewport: { width: 1474, height: 880 } })

  test("stays pinned while staged when the window resizes, its numerals contained", async ({
    page,
  }) => {
    const section = page.locator("#process")

    await openRunningPage(page)

    for (const numeral of await section
      .locator("[data-orbit-step] > span")
      .all()) {
      expect(
        await numeral.evaluate(function readContain(element) {
          return getComputedStyle(element).contain
        })
      ).toContain("layout")
    }

    for (const size of [
      { width: 1474, height: 900 },
      { width: 1680, height: 950 },
      { width: 1920, height: 975 },
    ]) {
      await page.setViewportSize(size)
      await page.waitForTimeout(GATE_SETTLE_MS)
      await expect(section, `${size.width}x${size.height}`).not.toHaveAttribute(
        "data-fit"
      )
    }
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
    const shapes = SCENES[1]?.shapes ?? []

    await openRunningPage(page)

    await expect(page.locator("#process svg")).toBeHidden()

    for (const step of await page.locator("#process [data-orbit-step]").all()) {
      await expect(step.locator("> span")).toBeHidden()
    }

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
      await expect
        .poll(
          function readTitles() {
            return readShownTitles(page)
          },
          { message: `step ${stepIndex}`, timeout: SCENE_TIMEOUT_MS }
        )
        .toContain(shapes[stepIndex])
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
