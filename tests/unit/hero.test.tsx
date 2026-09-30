import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { HERO_SCROLL_LABEL } from "@/data/hero.data"
import { DEFAULT_HERO_TAGLINE_TEXT } from "@/data/site-content.data"
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

async function readCopyFadeWrappers(): Promise<
  [HTMLElement | null, HTMLElement | null]
> {
  await act(async function flushMotionRender() {})

  const tagline = screen.getByText(DEFAULT_HERO_TAGLINE_TEXT)
  const cue = screen.getByText(HERO_SCROLL_LABEL)

  return [
    tagline.parentElement?.parentElement ?? null,
    cue.parentElement?.parentElement ?? null,
  ]
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

  it("renders only the canvas layer and the home scene", () => {
    const { container } = renderHero()
    const stage = container.querySelector("[data-status]")

    expect(stage?.querySelector("#home")).not.toBeNull()
    expect(stage?.querySelector("#quote")).toBeNull()
    expect(stage?.querySelector("#project")).toBeNull()
    expect(container.querySelectorAll("canvas")).toHaveLength(1)
  })

  it("keeps the canvas outside every sticky frame", () => {
    const { container } = renderHero()
    const canvas = container.querySelector("canvas")

    expect(canvas?.closest("#home")).toBeNull()
    expect(canvas?.closest("[data-dot-scene]")).toBeNull()
  })

  it("starts the tagline and cue fade at full opacity at scroll 0", async () => {
    render(
      <Hero
        content={createDefaultSiteContent()}
        displayFontFamily={DISPLAY_FONT_FAMILY}
      />
    )

    const [taglineFade, cueFade] = await readCopyFadeWrappers()

    expect(taglineFade?.style.opacity).toBe("1")
    expect(cueFade?.style.opacity).toBe("1")
  })

  it("holds the tagline and cue at full opacity without webgl", async () => {
    const { container } = renderHero()

    const [taglineFade, cueFade] = await readCopyFadeWrappers()

    expect(container.querySelector("[data-status]")).toHaveAttribute(
      "data-status",
      "unsupported"
    )
    expect(taglineFade?.style.opacity).toBe("1")
    expect(cueFade?.style.opacity).toBe("1")
  })

  it("tags the four intro elements Motion hides on the server for the no-JavaScript reveal", () => {
    const { container } = renderHero()
    const heading = screen.getByRole("heading", { level: 1 })
    const tagline = screen.getByText(DEFAULT_HERO_TAGLINE_TEXT).parentElement
    const cue = screen.getByText(HERO_SCROLL_LABEL).parentElement

    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(4)
    expect(heading).toHaveAttribute("data-reveal", "")
    expect(heading.parentElement?.parentElement).toHaveAttribute(
      "data-reveal",
      ""
    )
    expect(tagline).toHaveAttribute("data-reveal", "")
    expect(cue).toHaveAttribute("data-reveal", "")
  })

  it("starts with the dots forming the name", () => {
    const { container } = renderHero()

    expect(container.querySelector("[data-status]")).toHaveAttribute(
      "data-scene",
      "name"
    )
  })

  it("pins the name as the one dot scene with one slot", () => {
    const { container } = renderHero()
    const scenes = container.querySelectorAll("[data-dot-scene]")

    expect(scenes).toHaveLength(1)
    expect(scenes[0]).toHaveAttribute("data-dot-scene", "name")
    expect(scenes[0]?.querySelectorAll("[data-dot-slot]")).toHaveLength(1)
  })

  it("never starts an animation loop on scroll without a webgl context", () => {
    const requestFrame = vi.spyOn(window, "requestAnimationFrame")

    renderHero()
    fireEvent.scroll(window)

    expect(requestFrame).not.toHaveBeenCalled()

    requestFrame.mockRestore()
  })
})
