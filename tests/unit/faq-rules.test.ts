import { describe, expect, it } from "vitest"

import {
  DEFAULT_FAQ_ITEMS,
  FAQ_MAX,
  NEW_FAQ_ITEM,
} from "@/data/site-content.data"
import {
  formatFaqNumber,
  selectVisibleFaqItems,
} from "@/features/portfolio/faq.rules"

describe("selectVisibleFaqItems", () => {
  it("keeps every seed question in order", () => {
    expect(selectVisibleFaqItems(DEFAULT_FAQ_ITEMS)).toEqual(DEFAULT_FAQ_ITEMS)
  })

  it("hides a blank or whitespace question and keeps the order", () => {
    const first = { question: "First?", answer: "One." }
    const blank = { question: "", answer: "Hidden." }
    const spaces = { question: "   ", answer: "Hidden too." }
    const second = { question: "Second?", answer: "Two." }

    expect(selectVisibleFaqItems([first, blank, spaces, second])).toEqual([
      first,
      second,
    ])
  })

  it("keeps a question whose answer is still blank", () => {
    expect(selectVisibleFaqItems([NEW_FAQ_ITEM])).toEqual([NEW_FAQ_ITEM])
  })

  it("returns an empty list when no question is written", () => {
    expect(selectVisibleFaqItems([{ question: "", answer: "" }])).toEqual([])
    expect(selectVisibleFaqItems([])).toEqual([])
  })
})

describe("formatFaqNumber", () => {
  it("numbers the visible rows from 01", () => {
    expect(formatFaqNumber(0)).toBe("01")
    expect(formatFaqNumber(1)).toBe("02")
    expect(formatFaqNumber(8)).toBe("09")
  })

  it("keeps two digits up to the most questions", () => {
    expect(formatFaqNumber(9)).toBe("10")
    expect(formatFaqNumber(FAQ_MAX - 1)).toBe(String(FAQ_MAX))
  })
})
