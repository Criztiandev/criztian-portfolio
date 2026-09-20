import { describe, expect, it } from "vitest"

import {
  isHoneypotFilled,
  isOverSubmissionCount,
  isTooFast,
  readClientAddress,
} from "@/features/contact/contact.rules"

const NOW = 1_700_000_000_000

describe("isTooFast", () => {
  it("accepts a form that sat on screen for ten seconds", () => {
    expect(isTooFast(NOW - 10_000, NOW)).toBe(false)
  })

  it("rejects an instant submission", () => {
    expect(isTooFast(NOW - 200, NOW)).toBe(true)
  })

  it("rejects exactly at the boundary minus a millisecond", () => {
    expect(isTooFast(NOW - 1_999, NOW)).toBe(true)
    expect(isTooFast(NOW - 2_000, NOW)).toBe(false)
  })

  it("rejects when renderedAt is missing, rather than letting NaN pass", () => {
    expect(isTooFast(undefined, NOW)).toBe(true)
  })

  it("rejects a non-numeric renderedAt", () => {
    expect(isTooFast("1700000000000", NOW)).toBe(true)
    expect(isTooFast(null, NOW)).toBe(true)
    expect(isTooFast(Number.NaN, NOW)).toBe(true)
    expect(isTooFast(Number.POSITIVE_INFINITY, NOW)).toBe(true)
  })
})

describe("isHoneypotFilled", () => {
  it("passes an empty honeypot", () => {
    expect(isHoneypotFilled("")).toBe(false)
    expect(isHoneypotFilled(undefined)).toBe(false)
  })

  it("catches any filled value", () => {
    expect(isHoneypotFilled("http://spam.test")).toBe(true)
  })

  it("catches whitespace-only padding", () => {
    expect(isHoneypotFilled("   ")).toBe(false)
  })
})

describe("isOverSubmissionCount", () => {
  it("allows below the limit", () => {
    expect(isOverSubmissionCount(4)).toBe(false)
  })

  it("blocks at and above the limit", () => {
    expect(isOverSubmissionCount(5)).toBe(true)
    expect(isOverSubmissionCount(9)).toBe(true)
  })

  it("fails open when the count is unavailable", () => {
    expect(isOverSubmissionCount(null)).toBe(false)
  })
})

describe("readClientAddress", () => {
  it("takes the first entry of x-forwarded-for", () => {
    const requestHeaders = new Headers({
      "x-forwarded-for": "203.0.113.5, 70.41.3.18",
    })

    expect(readClientAddress(requestHeaders)).toBe("203.0.113.5")
  })

  it("falls back to x-real-ip", () => {
    const requestHeaders = new Headers({ "x-real-ip": "198.51.100.7" })

    expect(readClientAddress(requestHeaders)).toBe("198.51.100.7")
  })

  it("returns null when neither header is present", () => {
    expect(readClientAddress(new Headers())).toBe(null)
  })
})
