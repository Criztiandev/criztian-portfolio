import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SERVICES_SCENE } from "@/data/page-sections.data"
import { ServicesSection } from "@/features/portfolio/components/services-section.component"

const BOX_CLIENT_HEIGHT = 400

const ROOMY_SLOT_HEIGHT = 300

const CRAMPED_SLOT_HEIGHT = 40

const OVERFLOWING_SCROLL_HEIGHT = 500

const HEADER_LINE_PX = 72

const SCENE_WIDTH = 320

const PINNED_SCENE_HEIGHT = 1000

const FLOW_SCENE_HEIGHT = 1840

const SCENE_GROWTH = FLOW_SCENE_HEIGHT - PINNED_SCENE_HEIGHT

const ABOVE_VIEWPORT_TOP = -1500

const ANCHORED_PLACEMENTS = [
  { where: "lies above the viewport", top: ABOVE_VIEWPORT_TOP },
  {
    where: "ends at the header line",
    top: HEADER_LINE_PX - PINNED_SCENE_HEIGHT,
  },
]

const UNANCHORED_PLACEMENTS = [
  { where: "straddles the header line", top: -500 },
  { where: "sits below the viewport top", top: 300 },
]

let pendingFrames: FrameRequestCallback[] = []

let resizeCallbacks: ResizeObserverCallback[] = []

class RecordingResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback)
  }

  observe(): void {
    return
  }

  unobserve(): void {
    return
  }

  disconnect(): void {
    return
  }
}

function setSlotHeight(section: HTMLElement, height: number): void {
  const slot = section.querySelector("[data-dot-slot]")

  if (slot === null) {
    throw new Error("The services scene has no slot")
  }

  Object.defineProperty(slot, "clientHeight", {
    configurable: true,
    value: height,
  })
}

function renderServices(): HTMLElement {
  const { container } = render(<ServicesSection />)
  const section = container.querySelector<HTMLElement>("#services")

  if (section === null) {
    throw new Error("The services scene did not render")
  }

  setSlotHeight(section, ROOMY_SLOT_HEIGHT)

  return section
}

function setBoxScrollHeight(section: HTMLElement, scrollHeight: number): void {
  for (const box of section.querySelectorAll("[data-fit-box]")) {
    Object.defineProperty(box, "clientHeight", {
      configurable: true,
      value: BOX_CLIENT_HEIGHT,
    })
    Object.defineProperty(box, "scrollHeight", {
      configurable: true,
      value: scrollHeight,
    })
  }
}

function placeScene(section: HTMLElement, top: number): void {
  section.style.scrollMarginTop = `${HEADER_LINE_PX}px`

  vi.spyOn(section, "getBoundingClientRect").mockImplementation(
    function readSceneRect() {
      let height = PINNED_SCENE_HEIGHT

      if (section.dataset.fit === "flow") {
        height = FLOW_SCENE_HEIGHT
      }

      return DOMRect.fromRect({ y: top, width: SCENE_WIDTH, height })
    }
  )
}

function spyOnScrollBy() {
  return vi.spyOn(window, "scrollBy").mockImplementation(function skipScroll() {
    return
  })
}

function flushFrames(): void {
  act(function runPendingFrames() {
    const frames = pendingFrames

    pendingFrames = []

    for (const frame of frames) {
      frame(0)
    }
  })
}

function notifyResize(): void {
  for (const callback of resizeCallbacks) {
    callback([], {} as ResizeObserver)
  }
}

describe("SceneFitGate", () => {
  beforeEach(() => {
    pendingFrames = []
    resizeCallbacks = []
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver)
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      function queueFrame(callback) {
        pendingFrames.push(callback)

        return pendingFrames.length
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("keeps the frame first and renders nothing into the layout", () => {
    const section = renderServices()

    expect(
      section.firstElementChild?.querySelector("[data-dot-slot]")
    ).not.toBeNull()
    expect(section.lastElementChild).toHaveAttribute("hidden")
  })

  it("flows the scene as dust when a step outgrows its box", () => {
    const section = renderServices()

    setBoxScrollHeight(section, OVERFLOWING_SCROLL_HEIGHT)
    flushFrames()

    expect(section).toHaveAttribute("data-fit", "flow")
    expect(section).toHaveAttribute("data-dot-shapes", "dust")
    expect(section.querySelector("[data-dot-slot]")).toBeNull()
  })

  it("pins the scene again once every step fits", () => {
    const section = renderServices()

    setBoxScrollHeight(section, OVERFLOWING_SCROLL_HEIGHT)
    flushFrames()
    setBoxScrollHeight(section, BOX_CLIENT_HEIGHT)
    notifyResize()
    flushFrames()

    expect(section).not.toHaveAttribute("data-fit")
    expect(section).toHaveAttribute("data-dot-shapes", SERVICES_SCENE.shapes)
    expect(section.querySelectorAll("[data-dot-slot]")).toHaveLength(1)
  })

  it("flows the scene when its slot has no room for the shape", () => {
    const section = renderServices()

    setBoxScrollHeight(section, BOX_CLIENT_HEIGHT)
    setSlotHeight(section, CRAMPED_SLOT_HEIGHT)
    notifyResize()
    flushFrames()

    expect(section).toHaveAttribute("data-fit", "flow")
    expect(section).toHaveAttribute("data-dot-shapes", "dust")
  })

  for (const placement of ANCHORED_PLACEMENTS) {
    it(`scrolls by the growth when a flowing scene ${placement.where}`, () => {
      const scrollBy = spyOnScrollBy()
      const section = renderServices()

      placeScene(section, placement.top)
      setBoxScrollHeight(section, OVERFLOWING_SCROLL_HEIGHT)
      flushFrames()

      expect(section).toHaveAttribute("data-fit", "flow")
      expect(scrollBy).toHaveBeenCalledOnce()
      expect(scrollBy).toHaveBeenCalledWith({
        top: SCENE_GROWTH,
        behavior: "instant",
      })
    })
  }

  for (const placement of UNANCHORED_PLACEMENTS) {
    it(`leaves the scroll alone when a flowing scene ${placement.where}`, () => {
      const scrollBy = spyOnScrollBy()
      const section = renderServices()

      placeScene(section, placement.top)
      setBoxScrollHeight(section, OVERFLOWING_SCROLL_HEIGHT)
      flushFrames()

      expect(section).toHaveAttribute("data-fit", "flow")
      expect(scrollBy).not.toHaveBeenCalled()
    })
  }

  it("does not scroll when a scene above the viewport keeps its mode", () => {
    const scrollBy = spyOnScrollBy()
    const section = renderServices()

    placeScene(section, ABOVE_VIEWPORT_TOP)
    setBoxScrollHeight(section, OVERFLOWING_SCROLL_HEIGHT)
    flushFrames()
    scrollBy.mockClear()
    notifyResize()
    flushFrames()

    expect(section).toHaveAttribute("data-fit", "flow")
    expect(scrollBy).not.toHaveBeenCalled()
  })
})
