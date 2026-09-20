import { describe, expect, it } from "vitest"

import { DOT_FIELD_TUNING } from "@/data/hero.data"
import {
  applyFrameLerp,
  buildFontShorthand,
  clampFontSize,
  parsePrimaryFontFamily,
  resolveAutoPointer,
  resolveDotPitch,
  resolveFontSize,
  resolvePixelRatio,
  samplePixelGrid,
  shouldRebuildPoints,
} from "@/features/portfolio/dot-field.rules"

const IMAGE_SIZE = 8

function createAlphaMask(): Uint8ClampedArray {
  return new Uint8ClampedArray(IMAGE_SIZE * IMAGE_SIZE * 4)
}

function setAlpha(
  data: Uint8ClampedArray,
  columnX: number,
  rowY: number,
  alpha: number
): void {
  data[(rowY * IMAGE_SIZE + columnX) * 4 + 3] = alpha
}

function readPoint(
  positions: Float32Array,
  index: number
): { x: number; y: number; coverage: number } {
  return {
    x: positions[index * 3] as number,
    y: positions[index * 3 + 1] as number,
    coverage: positions[index * 3 + 2] as number,
  }
}

describe("samplePixelGrid", () => {
  it("emits one point per on-grid opaque cell", () => {
    const data = createAlphaMask()

    for (let rowY = 2; rowY <= 5; rowY += 1) {
      for (let columnX = 2; columnX <= 5; columnX += 1) {
        setAlpha(data, columnX, rowY, 255)
      }
    }

    const sample = samplePixelGrid(data, IMAGE_SIZE, IMAGE_SIZE, 2, 40)

    expect(sample.count).toBe(4)
    expect(sample.positions).toHaveLength(12)

    const first = readPoint(sample.positions, 0)
    expect(first.x).toBe(2)
    expect(first.y).toBe(2)
    expect(first.coverage).toBeCloseTo(1, 5)
  })

  it("keeps partial alpha as coverage rather than discarding it", () => {
    const data = createAlphaMask()
    setAlpha(data, 4, 4, 128)

    const sample = samplePixelGrid(data, IMAGE_SIZE, IMAGE_SIZE, 2, 40)

    expect(sample.count).toBe(1)
    expect(readPoint(sample.positions, 0).coverage).toBeCloseTo(128 / 255, 5)
  })

  it("drops cells at or below the threshold", () => {
    const data = createAlphaMask()
    setAlpha(data, 4, 4, 40)

    const sample = samplePixelGrid(data, IMAGE_SIZE, IMAGE_SIZE, 2, 40)

    expect(sample.count).toBe(0)
  })

  it("returns an empty sample for a blank mask", () => {
    const sample = samplePixelGrid(
      createAlphaMask(),
      IMAGE_SIZE,
      IMAGE_SIZE,
      2,
      40
    )

    expect(sample.count).toBe(0)
    expect(sample.positions).toHaveLength(0)
  })
})

describe("parsePrimaryFontFamily", () => {
  it("takes the first family and never the metric fallback", () => {
    expect(parsePrimaryFontFamily(`"Antonio", "Antonio Fallback"`)).toBe(
      "Antonio"
    )
  })

  it("handles single quotes as next/font emits them in development", () => {
    expect(parsePrimaryFontFamily("'Antonio', 'Antonio Fallback'")).toBe(
      "Antonio"
    )
  })

  it("handles an unquoted single family", () => {
    expect(parsePrimaryFontFamily("Antonio")).toBe("Antonio")
  })
})

describe("buildFontShorthand", () => {
  it("quotes the family so a multi-word name still parses", () => {
    expect(buildFontShorthand(700, 240, "Antonio")).toBe('700 240px "Antonio"')
  })
})

describe("resolveFontSize", () => {
  it("converges on a linear measurer", () => {
    function measureLinear(fontSize: number): number {
      return fontSize * 3.64
    }

    const resolved = resolveFontSize({
      measureInkWidth: measureLinear,
      targetWidth: 1037,
      probeSize: 100,
    })

    expect(measureLinear(resolved)).toBeCloseTo(1037, 1)
  })

  it("still converges when the measurer is not perfectly linear", () => {
    function measureWithBearing(fontSize: number): number {
      return fontSize * 3.64 + 12
    }

    const resolved = resolveFontSize({
      measureInkWidth: measureWithBearing,
      targetWidth: 1037,
      probeSize: 100,
    })

    expect(measureWithBearing(resolved)).toBeCloseTo(1037, 0)
  })

  it("falls back to the probe size when measurement fails", () => {
    function measureZero(): number {
      return 0
    }

    expect(
      resolveFontSize({
        measureInkWidth: measureZero,
        targetWidth: 1037,
        probeSize: 100,
      })
    ).toBe(100)
  })
})

describe("applyFrameLerp", () => {
  it("advances the same amount at 120Hz as at 60Hz", () => {
    const singleStep = applyFrameLerp(0, 1, 0.14, 1 / 60)

    const firstHalf = applyFrameLerp(0, 1, 0.14, 1 / 120)
    const secondHalf = applyFrameLerp(firstHalf, 1, 0.14, 1 / 120)

    expect(secondHalf).toBeCloseTo(singleStep, 6)
  })

  it("snaps to the target when the rate is saturated", () => {
    expect(applyFrameLerp(0, 1, 1, 1 / 60)).toBe(1)
  })
})

describe("shouldRebuildPoints", () => {
  it("ignores a mobile url bar sized height change", () => {
    expect(
      shouldRebuildPoints(
        { width: 390, height: 844, pixelRatio: 2 },
        { width: 390, height: 774, pixelRatio: 2 },
        120
      )
    ).toBe(false)
  })

  it("rebuilds on a real height change", () => {
    expect(
      shouldRebuildPoints(
        { width: 390, height: 844, pixelRatio: 2 },
        { width: 390, height: 644, pixelRatio: 2 },
        120
      )
    ).toBe(true)
  })

  it("rebuilds on any width change", () => {
    expect(
      shouldRebuildPoints(
        { width: 390, height: 844, pixelRatio: 2 },
        { width: 391, height: 844, pixelRatio: 2 },
        120
      )
    ).toBe(true)
  })

  it("rebuilds when the display density changes", () => {
    expect(
      shouldRebuildPoints(
        { width: 390, height: 844, pixelRatio: 2 },
        { width: 390, height: 844, pixelRatio: 1 },
        120
      )
    ).toBe(true)
  })
})

describe("resolvePixelRatio", () => {
  it("caps a high density display", () => {
    expect(resolvePixelRatio(3, 2)).toBe(2)
  })

  it("floors a nonsensical report", () => {
    expect(resolvePixelRatio(0, 2)).toBe(1)
    expect(resolvePixelRatio(Number.NaN, 2)).toBe(1)
    expect(resolvePixelRatio(0.5, 2)).toBe(1)
  })
})

describe("resolveDotPitch", () => {
  it("keeps the base pitch when the cell count is affordable", () => {
    expect(resolveDotPitch(5, 1, 2074, 416, 60000)).toBe(5)
  })

  it("coarsens the pitch rather than exceeding the point ceiling", () => {
    const pitch = resolveDotPitch(5, 1, 8000, 2000, 60000)
    const columns = Math.ceil(8000 / pitch)
    const rows = Math.ceil(2000 / pitch)

    expect(pitch).toBeGreaterThan(5)
    expect(columns * rows).toBeLessThanOrEqual(60000)
  })

  it("scales the pitch with the pixel ratio so density is display independent", () => {
    expect(resolveDotPitch(2, 2, 2074, 416, 250000)).toBe(4)
    expect(resolveDotPitch(2, 1.5, 2074, 416, 250000)).toBe(3)
  })

  it("samples the same grid at every pixel ratio", () => {
    const cellCounts: number[] = []

    for (const pixelRatio of [1, 1.5, 2]) {
      const width = Math.round(1037 * pixelRatio)
      const height = Math.round(306 * pixelRatio)
      const pitch = resolveDotPitch(2, pixelRatio, width, height, 250000)

      cellCounts.push(Math.ceil(width / pitch) * Math.ceil(height / pitch))
    }

    for (const cellCount of cellCounts) {
      expect(cellCount).toBeCloseTo(cellCounts[0] ?? 0, -3)
    }
  })
})

describe("resolveAutoPointer", () => {
  it("starts at the centre and stays inside the viewport", () => {
    const start = resolveAutoPointer(0, 1000, 600, DOT_FIELD_TUNING)

    expect(start.x).toBeCloseTo(500, 5)
    expect(start.y).toBeCloseTo(300, 5)

    for (let second = 0; second < 40; second += 1) {
      const position = resolveAutoPointer(second, 1000, 600, DOT_FIELD_TUNING)

      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThanOrEqual(1000)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThanOrEqual(600)
    }
  })
})

describe("clampFontSize", () => {
  it("bounds the size on both ends", () => {
    expect(clampFontSize(20, 48, 900)).toBe(48)
    expect(clampFontSize(2000, 48, 900)).toBe(900)
    expect(clampFontSize(300, 48, 900)).toBe(300)
  })
})
