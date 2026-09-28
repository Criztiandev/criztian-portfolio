import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FINE_POINTER_QUERY, SMOOTH_SCROLL_LERP } from "@/data/motion.data"
import { SmoothScroll } from "@/features/portfolio/components/smooth-scroll.component"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

type LenisOptions = {
  lerp: number
  anchors: { onStart: () => void }
}

type LenisDouble = {
  options: LenisOptions
  isScrolling: boolean | "native" | "smooth"
  time: number
  velocity: number
  listeners: Map<string, () => void>
  raf: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>
  start: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
}

const lenisInstances: LenisDouble[] = []

vi.mock("lenis", function mockLenis() {
  return {
    default: vi.fn().mockImplementation(function createLenis(
      options: LenisOptions
    ) {
      const instance: LenisDouble = {
        options,
        isScrolling: false,
        time: 1234,
        velocity: 4,
        listeners: new Map(),
        raf: vi.fn().mockImplementation(function advanceClock(time: number) {
          instance.time = time
        }),
        stop: vi.fn(),
        start: vi.fn(),
        destroy: vi.fn(),
      }

      Object.assign(instance, {
        on: function on(event: string, callback: () => void) {
          instance.listeners.set(event, callback)
        },
      })
      lenisInstances.push(instance)

      return instance
    }),
  }
})

let pendingFrames: FrameRequestCallback[] = []

let mediaMatches: Record<string, boolean> = {}

let motionChangeListeners: Array<() => void> = []

function stubMediaQueries(matches: Record<string, boolean>): void {
  mediaMatches = matches

  vi.spyOn(window, "matchMedia").mockImplementation(function matchMedia(
    query: string
  ) {
    return {
      matches: mediaMatches[query] ?? false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: function addEventListener(
        _type: string,
        listener: () => void
      ) {
        if (query === REDUCED_MOTION_QUERY) {
          motionChangeListeners.push(listener)
        }
      },
      removeEventListener: function removeEventListener(
        _type: string,
        listener: () => void
      ) {
        const remaining: Array<() => void> = []

        for (const candidate of motionChangeListeners) {
          if (candidate !== listener) {
            remaining.push(candidate)
          }
        }

        motionChangeListeners = remaining
      },
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })
}

function switchReducedMotion(reduce: boolean): void {
  mediaMatches = { ...mediaMatches, [REDUCED_MOTION_QUERY]: reduce }

  for (const listener of motionChangeListeners) {
    listener()
  }
}

function runFrame(): void {
  act(function runPendingFrames() {
    const frames = pendingFrames

    pendingFrames = []

    for (const frame of frames) {
      frame(16)
    }
  })
}

function latestLenis(): LenisDouble {
  const instance = lenisInstances.at(-1)

  if (instance === undefined) {
    throw new Error("Lenis was never constructed")
  }

  return instance
}

describe("SmoothScroll", () => {
  beforeEach(() => {
    lenisInstances.length = 0
    pendingFrames = []
    motionChangeListeners = []
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      function queueFrame(callback) {
        pendingFrames.push(callback)

        return pendingFrames.length
      }
    )
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
      function dropFrames() {
        pendingFrames = []
      }
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("constructs Lenis once with the tuned lerp and requests no frame on mount", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })

    render(<SmoothScroll />)

    expect(lenisInstances).toHaveLength(1)
    expect(latestLenis().options.lerp).toBe(SMOOTH_SCROLL_LERP)
    expect(pendingFrames).toHaveLength(0)
  })

  it("constructs nothing for a coarse pointer", () => {
    stubMediaQueries({})

    render(<SmoothScroll />)

    expect(lenisInstances).toHaveLength(0)
  })

  it("constructs nothing under reduced motion", () => {
    stubMediaQueries({
      [FINE_POINTER_QUERY]: true,
      [REDUCED_MOTION_QUERY]: true,
    })

    render(<SmoothScroll />)

    expect(lenisInstances).toHaveLength(0)
  })

  it("destroys Lenis when reduced motion turns on and rebuilds it when it turns off", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    const first = latestLenis()

    act(function reduceMotion() {
      switchReducedMotion(true)
    })

    expect(first.destroy).toHaveBeenCalledOnce()

    act(function restoreMotion() {
      switchReducedMotion(false)
    })

    expect(lenisInstances).toHaveLength(2)
  })

  it("wakes one frame per virtual scroll and keeps ticking only while smoothing", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    const lenis = latestLenis()
    const onVirtualScroll = lenis.listeners.get("virtual-scroll")

    expect(onVirtualScroll).toBeDefined()

    act(function wheel() {
      onVirtualScroll?.()
      onVirtualScroll?.()
    })

    expect(pendingFrames).toHaveLength(1)
    expect(lenis.time).toBe(0)

    lenis.isScrolling = "smooth"
    runFrame()

    expect(lenis.raf).toHaveBeenCalledOnce()
    expect(pendingFrames).toHaveLength(1)

    lenis.isScrolling = false
    runFrame()

    expect(lenis.raf).toHaveBeenCalledTimes(2)
    expect(pendingFrames).toHaveLength(0)
  })

  it("settles a flight that has stalled short of a half-pixel target", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    const lenis = latestLenis()

    act(function wheel() {
      lenis.listeners.get("virtual-scroll")?.()
    })
    lenis.isScrolling = "smooth"
    lenis.velocity = 0
    runFrame()

    expect(lenis.stop).not.toHaveBeenCalled()
    expect(pendingFrames).toHaveLength(1)

    runFrame()

    expect(lenis.stop).toHaveBeenCalledOnce()
    expect(lenis.start).toHaveBeenCalledOnce()
    expect(pendingFrames).toHaveLength(0)
  })

  it("wakes the loop when an anchor scroll starts", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    act(function startAnchorScroll() {
      latestLenis().options.anchors.onStart()
    })

    expect(pendingFrames).toHaveLength(1)
  })

  it("hands a key press back to native scrolling only while smoothing", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    const lenis = latestLenis()

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }))

    expect(lenis.stop).not.toHaveBeenCalled()

    lenis.isScrolling = "smooth"
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }))

    expect(lenis.stop).toHaveBeenCalledOnce()
    expect(lenis.start).toHaveBeenCalledOnce()
  })

  it("holds back a stale Lenis scrollend while a new flight is smoothing", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })
    render(<SmoothScroll />)

    const lenis = latestLenis()
    const received: string[] = []

    function recordScrollEnd() {
      received.push(String(lenis.isScrolling))
    }

    window.addEventListener("scrollend", recordScrollEnd)

    lenis.isScrolling = "smooth"
    window.dispatchEvent(
      new CustomEvent("scrollend", { detail: { lenisScrollEnd: true } })
    )
    lenis.isScrolling = false
    window.dispatchEvent(
      new CustomEvent("scrollend", { detail: { lenisScrollEnd: true } })
    )

    window.removeEventListener("scrollend", recordScrollEnd)

    expect(received).toEqual(["false"])
  })

  it("cancels the pending frame and destroys Lenis on unmount", () => {
    stubMediaQueries({ [FINE_POINTER_QUERY]: true })

    const { unmount } = render(<SmoothScroll />)
    const lenis = latestLenis()

    act(function wheel() {
      lenis.listeners.get("virtual-scroll")?.()
    })
    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(lenis.destroy).toHaveBeenCalledOnce()
  })
})
