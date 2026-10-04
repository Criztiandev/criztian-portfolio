import { describe, expect, it } from "vitest"

import { formatSectionPosition } from "@/features/portfolio/section-label.rules"

describe("formatSectionPosition", () => {
  it("counts the item over the total, padded to two digits", () => {
    expect(formatSectionPosition(0, 3)).toBe(" · 01 / 03")
    expect(formatSectionPosition(2, 3)).toBe(" · 03 / 03")
    expect(formatSectionPosition(9, 12)).toBe(" · 10 / 12")
  })

  it("adds no count when there is only one item", () => {
    expect(formatSectionPosition(0, 1)).toBe("")
    expect(formatSectionPosition(0, 0)).toBe("")
  })
})
