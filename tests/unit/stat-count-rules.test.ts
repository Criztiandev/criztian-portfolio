import { describe, expect, it } from "vitest"

import {
  buildStatCountStyle,
  parseStatCount,
} from "@/features/portfolio/stat-count.rules"

const UNCOUNTABLE_VALUES = [
  "",
  "+5",
  "$40",
  "about 10",
  "1,000+",
  "3.5",
  "4.5k",
  "10 of 12",
]

const UNPRINTABLE_VALUES = ["05+", "007", "99999999999999999999"]

describe("parseStatCount", () => {
  it("counts up to a plain integer and keeps what follows as the suffix", () => {
    expect(parseStatCount("5+")).toEqual({ target: 5, suffix: "+" })
    expect(parseStatCount("500+")).toEqual({ target: 500, suffix: "+" })
    expect(parseStatCount("140")).toEqual({ target: 140, suffix: "" })
    expect(parseStatCount("12 yrs")).toEqual({ target: 12, suffix: " yrs" })
  })

  it("gives no count to anything but a whole number and a suffix", () => {
    for (const value of UNCOUNTABLE_VALUES) {
      expect(parseStatCount(value), value).toBeNull()
    }
  })

  it("gives no count when the counter could not print the value back", () => {
    for (const value of UNPRINTABLE_VALUES) {
      expect(parseStatCount(value), value).toBeNull()
    }
  })
})

describe("buildStatCountStyle", () => {
  it("hands the counter its target", () => {
    expect(buildStatCountStyle({ target: 500, suffix: "+" })).toEqual({
      "--stat-value": 500,
    })
  })
})
