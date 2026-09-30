import { describe, expect, it } from "vitest"

import { CURSOR_TUNING } from "@/data/motion.data"
import {
  parsePushRadius,
  resolveCursorState,
  resolveRingDiameter,
} from "@/features/portfolio/cursor.rules"
import type { CursorState } from "@/types/portfolio.type"

const PUSH_RADIUS = 150

function buildTree(markup: string): HTMLElement {
  const host = document.createElement("div")

  host.innerHTML = markup

  return host
}

function findElement(host: HTMLElement, selector: string): Element {
  const element = host.querySelector(selector)

  if (element === null) {
    throw new Error(`${selector} not found`)
  }

  return element
}

function resolveUnderMouse(
  element: Element | null,
  pushRadius: number | null
): CursorState {
  return resolveCursorState({
    element,
    pointerType: "mouse",
    isPointerInside: true,
    pushRadius,
  })
}

describe("resolveCursorState", () => {
  it("hides for a pen or touch pointer, a pointer outside the page or no element, whatever lies beneath", () => {
    const host = buildTree(
      '<div data-dot-slot=""><a href="#contact">Talk</a><input /></div>'
    )
    const link = findElement(host, "a")
    const field = findElement(host, "input")

    for (const pointerType of ["touch", "pen"]) {
      expect(
        resolveCursorState({
          element: link,
          pointerType,
          isPointerInside: true,
          pushRadius: PUSH_RADIUS,
        })
      ).toBe("hidden")
    }

    expect(
      resolveCursorState({
        element: field,
        pointerType: "mouse",
        isPointerInside: false,
        pushRadius: PUSH_RADIUS,
      })
    ).toBe("hidden")
    expect(resolveUnderMouse(null, PUSH_RADIUS)).toBe("hidden")
  })

  it("gives action on a link with an href, a button, a summary and a span inside a summary", () => {
    const host = buildTree(
      '<a href="#faq">FAQ</a><button type="button">Menu</button><details><summary><span>Question</span></summary></details>'
    )

    for (const selector of ["a", "button", "summary", "summary span"]) {
      expect(resolveUnderMouse(findElement(host, selector), null)).toBe(
        "action"
      )
    }
  })

  it("stays idle on a link without an href, a disabled button and plain text", () => {
    const host = buildTree(
      '<a>Anchor</a><button type="button" disabled>Send</button><p>Copy</p>'
    )

    for (const selector of ["a", "button", "p"]) {
      expect(resolveUnderMouse(findElement(host, selector), null)).toBe("idle")
    }
  })

  it("gives field on an input, a textarea and a select, even inside a link", () => {
    const host = buildTree(
      '<input id="name" /><textarea></textarea><select><option>One</option></select><a href="#contact"><input id="nested" /></a>'
    )

    for (const selector of [
      "#name",
      "textarea",
      "select",
      "option",
      "#nested",
    ]) {
      expect(resolveUnderMouse(findElement(host, selector), PUSH_RADIUS)).toBe(
        "field"
      )
    }
  })

  it("pushes inside a slot only while the stage publishes a radius", () => {
    const host = buildTree('<div data-dot-slot=""><span>Name</span></div>')
    const inside = findElement(host, "span")

    expect(resolveUnderMouse(inside, PUSH_RADIUS)).toBe("push")
    expect(resolveUnderMouse(inside, null)).toBe("idle")
  })

  it("prefers a link over the push crater when both hold", () => {
    const host = buildTree(
      '<div data-dot-slot=""><a href="#project">Project</a></div>'
    )

    expect(resolveUnderMouse(findElement(host, "a"), PUSH_RADIUS)).toBe(
      "action"
    )
  })
})

describe("resolveRingDiameter", () => {
  it("keeps the 36px ring while idle, hidden or over a field", () => {
    for (const state of ["idle", "hidden", "field"] as const) {
      expect(resolveRingDiameter(state, PUSH_RADIUS, CURSOR_TUNING)).toBe(36)
    }
  })

  it("grows to the 56px disc over an action", () => {
    expect(resolveRingDiameter("action", PUSH_RADIUS, CURSOR_TUNING)).toBe(56)
  })

  it("outlines the crater at twice the push radius", () => {
    expect(resolveRingDiameter("push", PUSH_RADIUS, CURSOR_TUNING)).toBe(
      PUSH_RADIUS * 2
    )
    expect(resolveRingDiameter("push", null, CURSOR_TUNING)).toBe(36)
  })
})

describe("parsePushRadius", () => {
  it("reads the stage's whole-pixel radius", () => {
    expect(parsePushRadius("150")).toBe(150)
  })

  it("gives null for a missing, empty, zero or malformed radius", () => {
    for (const value of [undefined, "", "0", "-4", "wide"]) {
      expect(parsePushRadius(value)).toBeNull()
    }
  })
})
