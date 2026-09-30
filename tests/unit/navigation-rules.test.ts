import { describe, expect, it } from "vitest"

import {
  PORTFOLIO_PRIMARY_NAVIGATION,
  SCROLL_SPY_TOLERANCE_PX,
} from "@/data/navigation.data"
import { DEFAULT_PORTFOLIO_SECTION } from "@/data/portfolio.data"
import { resolveActiveSection } from "@/features/portfolio/navigation.rules"
import type { SectionTop } from "@/types/portfolio.type"

const PAGE_TOPS: SectionTop[] = [
  { id: "home", top: -4200 },
  { id: "project", top: -2600 },
  { id: "services", top: -900 },
  { id: "process", top: 0 },
  { id: "about", top: 980 },
  { id: "testimonials", top: 1900 },
  { id: "faq", top: 2800 },
  { id: "contact", top: 3700 },
]

function resolve(tops: SectionTop[]) {
  return resolveActiveSection(
    tops,
    SCROLL_SPY_TOLERANCE_PX,
    DEFAULT_PORTFOLIO_SECTION
  )
}

function isPrimarySection(id: string): boolean {
  for (const item of PORTFOLIO_PRIMARY_NAVIGATION) {
    if (item.id === id) {
      return true
    }
  }

  return false
}

describe("resolveActiveSection", () => {
  it("returns the last section that has reached its landing under the header", () => {
    expect(resolve(PAGE_TOPS)).toBe("process")
  })

  it("picks by page order, not by the top nearest the line", () => {
    expect(
      resolve([
        { id: "home", top: -3000 },
        { id: "project", top: 40 },
        { id: "services", top: -20 },
        { id: "process", top: 500 },
      ])
    ).toBe("services")
  })

  it("returns a section that has no primary link", () => {
    const resolved = resolve([
      { id: "home", top: -5200 },
      { id: "about", top: -800 },
      { id: "testimonials", top: 0 },
      { id: "faq", top: 900 },
      { id: "contact", top: 1800 },
    ])

    expect(resolved).toBe("testimonials")
    expect(isPrimarySection(resolved)).toBe(false)
  })

  it("skips a section that is missing from the page", () => {
    expect(
      resolve([
        { id: "home", top: -5200 },
        { id: "about", top: -600 },
        { id: "faq", top: 400 },
        { id: "contact", top: 1300 },
      ])
    ).toBe("about")
  })

  it("falls back to home when no section has reached the line", () => {
    expect(
      resolve([
        { id: "project", top: 400 },
        { id: "services", top: 1300 },
      ])
    ).toBe(DEFAULT_PORTFOLIO_SECTION)
    expect(resolve([])).toBe("home")
  })

  it("counts a section within the tolerance of its landing as reached, and one past it as not", () => {
    const onTheLine: SectionTop[] = [
      { id: "home", top: -900 },
      { id: "about", top: SCROLL_SPY_TOLERANCE_PX },
    ]
    const pastTheLine: SectionTop[] = [
      { id: "home", top: -900 },
      { id: "about", top: SCROLL_SPY_TOLERANCE_PX + 0.5 },
    ]

    expect(SCROLL_SPY_TOLERANCE_PX).toBe(1)
    expect(resolve(onTheLine)).toBe("about")
    expect(resolve(pastTheLine)).toBe("home")
  })
})
