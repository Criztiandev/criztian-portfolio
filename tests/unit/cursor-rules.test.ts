import { describe, expect, it } from "vitest"

import { CURSOR_TUNING } from "@/data/motion.data"
import {
  resolveCursorState,
  resolveRingDiameter,
} from "@/features/portfolio/cursor.rules"
import type { CursorState } from "@/types/portfolio.type"

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

function resolveUnderMouse(element: Element | null): CursorState {
  return resolveCursorState({
    element,
    pointerType: "mouse",
    isPointerInside: true,
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
        })
      ).toBe("hidden")
    }

    expect(
      resolveCursorState({
        element: field,
        pointerType: "mouse",
        isPointerInside: false,
      })
    ).toBe("hidden")
    expect(resolveUnderMouse(null)).toBe("hidden")
  })

  it("gives action on a link with an href, a button, a summary and a span inside a summary", () => {
    const host = buildTree(
      '<a href="#faq">FAQ</a><button type="button">Menu</button><details><summary><span>Question</span></summary></details>'
    )

    for (const selector of ["a", "button", "summary", "summary span"]) {
      expect(resolveUnderMouse(findElement(host, selector))).toBe("action")
    }
  })

  it("stays idle on a link without an href, a disabled button and plain text", () => {
    const host = buildTree(
      '<a>Anchor</a><button type="button" disabled>Send</button><p>Copy</p>'
    )

    for (const selector of ["a", "button", "p"]) {
      expect(resolveUnderMouse(findElement(host, selector))).toBe("idle")
    }
  })

  it("gives action on a chip that wraps a radio and on its dot, but stays idle on a field's label", () => {
    const host = buildTree(
      '<label id="chip"><input type="radio" name="service" value="branding" /><span id="dot"></span>Branding</label><label id="plain" for="name">Name</label><input id="name" />'
    )

    for (const selector of ["#chip", "#dot"]) {
      expect(resolveUnderMouse(findElement(host, selector))).toBe("action")
    }

    expect(resolveUnderMouse(findElement(host, "#plain"))).toBe("idle")
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
      expect(resolveUnderMouse(findElement(host, selector))).toBe("field")
    }
  })

  it("stays idle over the dots, so the ring keeps its size", () => {
    const host = buildTree('<div data-dot-slot=""><span>Name</span></div>')

    expect(resolveUnderMouse(findElement(host, "span"))).toBe("idle")
  })

  it("gives action to a link inside a dot slot", () => {
    const host = buildTree(
      '<div data-dot-slot=""><a href="#project">Project</a></div>'
    )

    expect(resolveUnderMouse(findElement(host, "a"))).toBe("action")
  })
})

describe("resolveRingDiameter", () => {
  it("keeps the 36px ring while idle, hidden or over a field", () => {
    for (const state of ["idle", "hidden", "field"] as const) {
      expect(resolveRingDiameter(state, CURSOR_TUNING)).toBe(36)
    }
  })

  it("grows to the 56px disc over an action", () => {
    expect(resolveRingDiameter("action", CURSOR_TUNING)).toBe(56)
  })
})
