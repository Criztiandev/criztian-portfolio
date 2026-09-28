import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { QuoteSection } from "@/features/portfolio/components/quote-section.component"

const QUOTE_TEXT = "Ship the whole thing."

function renderQuote(author: string) {
  return render(<QuoteSection quote={{ text: QUOTE_TEXT, author }} />)
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
})
