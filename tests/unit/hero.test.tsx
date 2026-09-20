import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Hero } from "@/features/portfolio/components/hero.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"

const DISPLAY_FONT_FAMILY = `"Antonio", "Antonio Fallback"`

function renderHero() {
  return render(
    <Hero
      content={createDefaultSiteContent()}
      displayFontFamily={DISPLAY_FONT_FAMILY}
    />
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
})
