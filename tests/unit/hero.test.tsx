import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Hero } from "@/features/portfolio/components/hero.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"

const DISPLAY_FONT_FAMILY = `"Antonio", "Antonio Fallback"`

function renderHero() {
  return render(
    <div data-status="idle" data-scene="name" className="group/stage">
      <Hero
        content={createDefaultSiteContent()}
        displayFontFamily={DISPLAY_FONT_FAMILY}
      />
    </div>
  )
}

describe("Hero", () => {
  it("exposes the name as the only level one heading", () => {
    renderHero()

    expect(
      screen.getByRole("heading", { level: 1, name: "Criztian" })
    ).toBeInTheDocument()
    expect(document.querySelectorAll("h1")).toHaveLength(1)
  })

  it("keeps the canvas out of the accessibility tree", () => {
    const { container } = renderHero()
    const canvas = container.querySelector("canvas")

    expect(canvas).not.toBeNull()
    expect(canvas).toHaveAttribute("aria-hidden", "true")
  })

  it("falls back to text when webgl is unavailable", () => {
    const { container } = renderHero()
    const stage = container.querySelector("[data-status]")

    expect(stage).toHaveAttribute("data-status", "unsupported")
  })

  it("never starts an animation loop without a webgl context", () => {
    const requestFrame = vi.spyOn(window, "requestAnimationFrame")

    renderHero()

    expect(requestFrame).not.toHaveBeenCalled()

    requestFrame.mockRestore()
  })

  it("holds the hero, the quote and exactly one canvas in one stage", () => {
    const { container } = renderHero()
    const stage = container.querySelector("[data-status]")

    expect(container.querySelectorAll("[data-status]")).toHaveLength(1)
    expect(stage?.querySelector("#home")).not.toBeNull()
    expect(stage?.querySelector("#quote")).not.toBeNull()
    expect(container.querySelectorAll("canvas")).toHaveLength(1)
  })

  it("renders the projects inside the stage without a second canvas", () => {
    const { container } = renderHero()
    const stage = container.querySelector("[data-status]")

    expect(stage?.querySelector("#project")).not.toBeNull()
    expect(container.querySelectorAll("[data-status]")).toHaveLength(1)
    expect(container.querySelectorAll("canvas")).toHaveLength(1)
    expect(container.querySelectorAll("h1")).toHaveLength(1)
  })

  it("starts with the dots forming the name", () => {
    const { container } = renderHero()

    expect(container.querySelector("[data-status]")).toHaveAttribute(
      "data-scene",
      "name"
    )
  })

  it("pins the name, the cube and the projects as dot scenes", () => {
    const { container } = renderHero()
    const scenes = container.querySelectorAll("[data-dot-scene]")

    expect(scenes).toHaveLength(3)

    for (const scene of scenes) {
      expect(scene.querySelectorAll("[data-dot-slot]")).toHaveLength(1)
    }
  })

  it("never starts an animation loop on scroll without a webgl context", () => {
    const requestFrame = vi.spyOn(window, "requestAnimationFrame")

    renderHero()
    fireEvent.scroll(window)

    expect(requestFrame).not.toHaveBeenCalled()

    requestFrame.mockRestore()
  })

  it("keeps the cube slot out of the accessibility tree", () => {
    const { container } = renderHero()
    const slot = container.querySelector("#quote [data-dot-slot]")

    expect(slot).toHaveAttribute("aria-hidden", "true")
    expect(slot).toBeEmptyDOMElement()
  })
})
