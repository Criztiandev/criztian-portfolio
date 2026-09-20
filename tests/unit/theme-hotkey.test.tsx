import { describe, expect, it } from "vitest"

import { shouldToggleTheme } from "@/providers/theme.provider"

function keyEvent(init: KeyboardEventInit, target?: Element): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { bubbles: true, ...init })

  if (target) {
    Object.defineProperty(event, "target", { value: target })
  }

  return event
}

function withElement(html: string): Element {
  const host = document.createElement("div")
  host.innerHTML = html
  document.body.appendChild(host)

  const element = host.firstElementChild

  if (element === null) {
    throw new Error("no element produced")
  }

  return element
}

describe("shouldToggleTheme", () => {
  it("toggles on a bare 'd'", () => {
    expect(shouldToggleTheme(keyEvent({ key: "d" }))).toBe(true)
  })

  it("toggles on uppercase 'D'", () => {
    expect(shouldToggleTheme(keyEvent({ key: "D" }))).toBe(true)
  })

  it("ignores a keydown whose key is undefined, as autofill dispatches", () => {
    const event = keyEvent({})
    Object.defineProperty(event, "key", { value: undefined })

    expect(function evaluate() {
      return shouldToggleTheme(event)
    }).not.toThrow()

    expect(shouldToggleTheme(event)).toBe(false)
  })

  it("ignores other keys", () => {
    expect(shouldToggleTheme(keyEvent({ key: "a" }))).toBe(false)
  })

  it("ignores modifier combinations", () => {
    expect(shouldToggleTheme(keyEvent({ key: "d", ctrlKey: true }))).toBe(false)
    expect(shouldToggleTheme(keyEvent({ key: "d", metaKey: true }))).toBe(false)
    expect(shouldToggleTheme(keyEvent({ key: "d", altKey: true }))).toBe(false)
  })

  it("ignores repeats", () => {
    expect(shouldToggleTheme(keyEvent({ key: "d", repeat: true }))).toBe(false)
  })

  it("ignores 'd' typed into a text input", () => {
    const input = withElement('<input type="text" />')

    expect(shouldToggleTheme(keyEvent({ key: "d" }, input))).toBe(false)
  })

  it("ignores 'd' typed into a password field", () => {
    const input = withElement('<input type="password" />')

    expect(shouldToggleTheme(keyEvent({ key: "d" }, input))).toBe(false)
  })

  it("ignores 'd' in a textarea", () => {
    const textarea = withElement("<textarea></textarea>")

    expect(shouldToggleTheme(keyEvent({ key: "d" }, textarea))).toBe(false)
  })

  it("ignores 'd' while a button has focus", () => {
    const button = withElement("<button type='button'>Sign in</button>")

    expect(shouldToggleTheme(keyEvent({ key: "d" }, button))).toBe(false)
  })

  it("ignores 'd' inside a dialog", () => {
    const dialog = withElement('<div role="dialog"><span>x</span></div>')
    const inner = dialog.querySelector("span")

    expect(shouldToggleTheme(keyEvent({ key: "d" }, inner!))).toBe(false)
  })
})
