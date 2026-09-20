import "@testing-library/jest-dom/vitest"

import { vi } from "vitest"

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(function matchMedia(
    query: string
  ) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}

class ObserverStub {
  readonly root: Element | null = null

  readonly rootMargin: string = "0px"

  readonly thresholds: ReadonlyArray<number> = []

  observe(): void {
    return
  }

  unobserve(): void {
    return
  }

  disconnect(): void {
    return
  }

  takeRecords(): [] {
    return []
  }
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  window.IntersectionObserver =
    ObserverStub as unknown as typeof IntersectionObserver
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver
}

if (typeof document !== "undefined" && !("fonts" in document)) {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: {
      ready: Promise.resolve(),
      load: vi.fn().mockResolvedValue([]),
      check: vi.fn().mockReturnValue(false),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  })
}

if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = function getContext(): null {
    return null
  } as unknown as HTMLCanvasElement["getContext"]
}
