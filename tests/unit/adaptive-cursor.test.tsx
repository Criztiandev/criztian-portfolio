import { fireEvent, render, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CUSTOM_CURSOR_QUERY } from "@/data/motion.data"
import { AdaptiveCursor } from "@/features/portfolio/components/adaptive-cursor.component"

let pointTarget: Element | null = null

function stubMediaQueries(matches: Record<string, boolean>): void {
  vi.spyOn(window, "matchMedia").mockImplementation(function matchMedia(
    query: string
  ) {
    return {
      matches: matches[query] ?? false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })
}

function renderPage() {
  return render(
    <>
      <div data-status="running">
        <p>Copy</p>
        <a href="#contact">Talk</a>
        <input aria-label="Email" />
        <div data-dot-slot="" />
      </div>
      <AdaptiveCursor />
    </>
  )
}

function findElement(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector)

  if (element === null) {
    throw new Error(`${selector} not found`)
  }

  return element
}

function readCursorState(): string | null {
  return findElement("[data-cursor-state]").getAttribute("data-cursor-state")
}

function readDocumentMark(): string | undefined {
  return document.documentElement.dataset.cursor
}

function moveMouseOver(target: Element): void {
  pointTarget = target
  fireEvent(
    window,
    new PointerEvent("pointermove", {
      pointerType: "mouse",
      clientX: 40,
      clientY: 60,
    })
  )
}

function readListenedPointerTypes(calls: unknown[][]): string[] {
  const types: string[] = []

  for (const [type] of calls) {
    if (typeof type === "string" && type.startsWith("pointer")) {
      types.push(type)
    }
  }

  return types
}

describe("AdaptiveCursor", () => {
  beforeEach(() => {
    pointTarget = null
    Object.defineProperty(document, "elementFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn(function elementFromPoint() {
        return pointTarget
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(document, "elementFromPoint")
    Reflect.deleteProperty(document, "scrollingElement")
    document.documentElement.scrollTop = 0
    delete document.documentElement.dataset.cursor
  })

  it("stays hidden and attaches no pointer listener without a fine pointer", () => {
    const windowListen = vi.spyOn(window, "addEventListener")
    const rootListen = vi.spyOn(document.documentElement, "addEventListener")

    renderPage()
    moveMouseOver(findElement("p"))

    expect(readCursorState()).toBe("hidden")
    expect(readDocumentMark()).toBeUndefined()
    expect(readListenedPointerTypes(windowListen.mock.calls)).toEqual([])
    expect(readListenedPointerTypes(rootListen.mock.calls)).toEqual([])
    expect(document.elementFromPoint).not.toHaveBeenCalled()
  })

  it("renders hidden with no document mark before the first mouse move", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()

    expect(readCursorState()).toBe("hidden")
    expect(readDocumentMark()).toBeUndefined()
  })

  it("marks the document and leaves hidden on the first mouse move", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("p"))

    expect(readCursorState()).toBe("idle")
    expect(readDocumentMark()).toBe("on")
    expect(document.elementFromPoint).toHaveBeenCalledWith(40, 60)
  })

  it("fills over a link and gives way to the native caret over a field", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()

    moveMouseOver(findElement("a"))
    expect(readCursorState()).toBe("action")

    moveMouseOver(findElement("input"))
    expect(readCursorState()).toBe("field")
  })

  it("hides for a touch pointer and removes the document mark until the mouse returns", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("p"))

    fireEvent(
      window,
      new PointerEvent("pointerdown", { pointerType: "touch", clientX: 5 })
    )

    expect(readCursorState()).toBe("hidden")
    expect(readDocumentMark()).toBeUndefined()

    moveMouseOver(findElement("p"))

    expect(readCursorState()).toBe("idle")
    expect(readDocumentMark()).toBe("on")
  })

  it("hides once the pointer leaves the page", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("p"))

    fireEvent(
      document.documentElement,
      new PointerEvent("pointerleave", { pointerType: "mouse" })
    )

    expect(readCursorState()).toBe("hidden")
  })

  it("stays the idle ring over the dots", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("[data-dot-slot]"))

    expect(readCursorState()).toBe("idle")
  })

  it("follows a link revealed under a still pointer", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("p"))

    pointTarget = findElement("a")
    fireEvent(
      findElement("a"),
      new PointerEvent("pointerover", {
        pointerType: "mouse",
        clientX: 40,
        clientY: 60,
        bubbles: true,
      })
    )

    expect(readCursorState()).toBe("action")
  })

  it("re-resolves under a still pointer as the page scrolls", async () => {
    Object.defineProperty(document, "scrollingElement", {
      configurable: true,
      value: document.documentElement,
    })
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })
    renderPage()
    moveMouseOver(findElement("p"))

    pointTarget = findElement("a")
    document.documentElement.scrollTop = 240
    fireEvent.scroll(window)

    await waitFor(function expectLinkUnderPointer() {
      expect(readCursorState()).toBe("action")
    })
  })

  it("stops listening and marking the document on unmount", () => {
    stubMediaQueries({ [CUSTOM_CURSOR_QUERY]: true })

    const windowUnlisten = vi.spyOn(window, "removeEventListener")
    const { unmount } = renderPage()

    moveMouseOver(findElement("p"))
    unmount()

    expect(readDocumentMark()).toBeUndefined()
    expect(readListenedPointerTypes(windowUnlisten.mock.calls)).toEqual([
      "pointermove",
      "pointerover",
      "pointerdown",
    ])

    moveMouseOver(document.body)

    expect(readDocumentMark()).toBeUndefined()
    expect(document.elementFromPoint).toHaveBeenCalledOnce()
  })
})
