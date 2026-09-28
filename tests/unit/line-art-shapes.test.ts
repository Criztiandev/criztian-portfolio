import { describe, expect, it } from "vitest"

import {
  CUBE_EDGE_JITTER,
  DOT_SHAPE_TUNING,
  GENERATED_SHAPE_IDS,
  LINE_ART_JITTER,
  LINE_ART_SHAPE_IDS,
  LINE_ART_SHAPES,
  SHAPE_POINTS,
  SHAPE_STRIDE,
} from "@/data/hero.data"
import {
  PROCESS_SCENE_SHAPES,
  SERVICES_SCENE_SHAPES,
} from "@/data/page-sections.data"
import {
  buildLineArtSegments,
  buildShapeLibrary,
  generateLineArtPoints,
  parseSceneShapes,
} from "@/features/portfolio/dot-field.rules"

const PEN_STEP_ALLOWANCE = 2

function resolveJitter(shape: string): number {
  if (shape === "building") {
    return CUBE_EDGE_JITTER
  }

  return LINE_ART_JITTER
}

function measureGap(points: Float32Array, index: number): number {
  const current = index * SHAPE_STRIDE
  const previous = current - SHAPE_STRIDE

  return Math.hypot(
    points[current] - points[previous],
    points[current + 1] - points[previous + 1],
    points[current + 2] - points[previous + 2]
  )
}

describe("line-art shape generators", () => {
  for (const shape of LINE_ART_SHAPE_IDS) {
    const definition = LINE_ART_SHAPES[shape]
    const jitter = resolveJitter(shape)

    it(`generates ${shape} deterministically for its seed`, () => {
      const first = generateLineArtPoints(definition, SHAPE_POINTS, jitter)
      const second = generateLineArtPoints(definition, SHAPE_POINTS, jitter)

      expect(first).toEqual(second)
    })

    it(`generates exactly SHAPE_POINTS points for ${shape}`, () => {
      const points = generateLineArtPoints(definition, SHAPE_POINTS, jitter)

      expect(points.length).toBe(SHAPE_POINTS * SHAPE_STRIDE)
    })

    it(`keeps every ${shape} point in the model cube with a rank below one`, () => {
      const points = generateLineArtPoints(definition, SHAPE_POINTS, jitter)

      for (let index = 0; index < SHAPE_POINTS; index += 1) {
        const offset = index * SHAPE_STRIDE

        for (let axis = 0; axis < 3; axis += 1) {
          expect(Math.abs(points[offset + axis])).toBeLessThanOrEqual(1)
        }

        expect(points[offset + 3]).toBeGreaterThanOrEqual(0)
        expect(points[offset + 3]).toBeLessThan(1)
      }
    })

    it(`emits ${shape} in pen order along its strokes`, () => {
      const points = generateLineArtPoints(definition, SHAPE_POINTS, jitter)
      let totalLength = 0

      for (const segment of buildLineArtSegments(definition.strokes)) {
        totalLength += segment.length
      }

      const bound =
        3 * Math.sqrt(3) * jitter +
        (PEN_STEP_ALLOWANCE * totalLength) / SHAPE_POINTS
      let penLifts = 0

      for (let index = 1; index < SHAPE_POINTS; index += 1) {
        if (measureGap(points, index) > bound) {
          penLifts += 1
        }
      }

      expect(penLifts).toBeLessThanOrEqual(definition.strokes.length - 1)
    })
  }

  it("uploads every tuned shape", () => {
    const tuned = Object.keys(DOT_SHAPE_TUNING).sort()
    const uploaded = [...GENERATED_SHAPE_IDS].sort()

    expect(uploaded).toEqual(tuned)
  })

  it("builds a library entry for every generated shape", () => {
    const library = buildShapeLibrary()

    for (const shape of GENERATED_SHAPE_IDS) {
      expect(library[shape].length, shape).toBe(SHAPE_POINTS * SHAPE_STRIDE)
    }
  })

  it("wires the three services and five process steps to known shapes", () => {
    expect(parseSceneShapes(SERVICES_SCENE_SHAPES)).toEqual([
      "branding",
      "web-design",
      "development",
    ])
    expect(parseSceneShapes(PROCESS_SCENE_SHAPES)).toEqual([
      "listening",
      "planning",
      "visualising",
      "building",
      "delivery",
    ])
  })
})
