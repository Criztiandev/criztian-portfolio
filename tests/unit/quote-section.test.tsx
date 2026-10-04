import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  COPY_DRIFT_CLASS,
  SCREEN_TIMELINE_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import { QuoteSection } from "@/features/portfolio/components/quote-section.component"
import {
  buildCopyDriftStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"

const QUOTE_TEXT = "Ship the whole thing."

const MOTION_STYLE_PROPERTIES = ["opacity", "transform", "clip-path"]

function renderQuote(author: string) {
  return render(<QuoteSection quote={{ text: QUOTE_TEXT, author }} />)
}

function findElement(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector)

  if (element === null) {
    throw new Error(`${selector} is missing`)
  }

  return element
}

describe("QuoteSection", () => {
  it("renders the quote as a blockquote inside a figure", () => {
    const { container } = renderQuote("")
    const paragraph = container.querySelector("figure > blockquote > p")

    expect(paragraph).toHaveTextContent(QUOTE_TEXT)
  })

  it("hides the caption when there is no author", () => {
    const { container } = renderQuote("")

    expect(container.querySelector("figcaption")).toHaveAttribute("hidden")
  })

  it("credits the author in a caption", () => {
    renderQuote("Ada Lovelace")

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.getByText("Ada Lovelace").tagName).toBe("FIGCAPTION")
    expect(screen.getByText("Ada Lovelace")).not.toHaveAttribute("hidden")
  })

  it("adds no heading and keeps the text readable to assistive tech", () => {
    renderQuote("Ada Lovelace")

    expect(screen.queryByRole("heading")).toBeNull()
    expect(screen.getByText(QUOTE_TEXT).closest("[aria-hidden]")).toBeNull()
  })

  it("pins the cube in one empty slot hidden from assistive tech", () => {
    const { container } = renderQuote("")
    const scene = container.querySelector("#quote[data-dot-scene='cube']")
    const slots = container.querySelectorAll("[data-dot-slot]")

    expect(scene).not.toBeNull()
    expect(slots).toHaveLength(1)
    expect(slots[0]).toHaveAttribute("aria-hidden", "true")
    expect(slots[0]).toBeEmptyDOMElement()
  })

  it("sweeps the quote and then its author with the cube's dots", () => {
    const { container } = renderQuote("Ada Lovelace")
    const paragraph = findElement(container, "figure > blockquote > p")
    const caption = findElement(container, "figure > figcaption")

    expect(paragraph).toHaveClass(SWEPT_LINE_CLASS)
    expect(caption).toHaveClass(SWEPT_LINE_CLASS)
    expect(paragraph.style.getPropertyValue("--line")).toBe("0")
    expect(caption.style.getPropertyValue("--line")).toBe("1")
  })

  it("renders no Motion reveal styles on the quote", () => {
    const { container } = renderQuote("Ada Lovelace")
    const parts = [
      findElement(container, "figure"),
      findElement(container, "figure > blockquote > p"),
      findElement(container, "figure > figcaption"),
    ]

    for (const part of parts) {
      for (const property of MOTION_STYLE_PROPERTIES) {
        expect(part.style.getPropertyValue(property), property).toBe("")
      }
    }
  })

  it("drifts the copy column on the section's own screen timeline", () => {
    const { container } = renderQuote("")
    const section = findElement(container, "#quote")
    const sceneStyle = {
      ...buildSceneCaptionStyle(1),
      ...buildCopyDriftStyle(),
    }

    expect(section).toHaveClass(SCREEN_TIMELINE_CLASS)
    expect(findElement(container, "figure")).toHaveClass(COPY_DRIFT_CLASS)
    expect(section.style.getPropertyValue("--caption-last")).toBe("1")

    for (const [property, value] of Object.entries(sceneStyle)) {
      expect(section.style.getPropertyValue(property), property).toBe(
        String(value)
      )
    }
  })
})
