import { describe, expect, it } from "vitest"

import {
  DELIVERY_SHAPE,
  DOT_SHAPE_IDS,
  DOT_SHAPE_TUNING,
  FRAME_EDGE,
  GATHER_SHAPE,
  GATHER_SIDES,
  GENERATED_SHAPE_IDS,
  JITTER_SPAN,
  LINE_ART_SHAPE_IDS,
  LINE_ART_SHAPES,
  LISTENING_SHAPE,
  SCATTER_SHAPE_IDS,
  SHAPE_POINTS,
  SHAPE_STRIDE,
} from "@/data/hero.data"
import {
  CONTACT_SCENE_SHAPES,
  FRAME_SCENE_SHAPES,
  PROCESS_SCENE_SHAPES,
  SERVICES_SCENE_SHAPES,
} from "@/data/page-sections.data"
import {
  buildLineArtSegments,
  buildShapeLibrary,
  generateGatherPoints,
  generateLaunchPoints,
  generateLineArtPoints,
  generateScatterRingPoints,
  parseSceneShapes,
} from "@/features/portfolio/dot-field.rules"
import type { LineArtShapeId } from "@/types/hero.type"

const PEN_STEP_ALLOWANCE = 2

const FLOAT_TOLERANCE = 0.000001

const ANGLE_TOLERANCE = 0.001

const RING_SHARE_TOLERANCE = 0.08

const SCATTER_SHARE_FLOOR = 0.25

function measureGap(points: Float32Array, index: number): number {
  const current = index * SHAPE_STRIDE
  const previous = current - SHAPE_STRIDE

  return Math.hypot(
    points[current] - points[previous],
    points[current + 1] - points[previous + 1],
    points[current + 2] - points[previous + 2]
  )
}

function countStrokes(shape: LineArtShapeId): number {
  let strokes = 0

  for (const layer of LINE_ART_SHAPES[shape].layers) {
    strokes += layer.strokes.length
  }

  return strokes
}

function countMismatches(first: Float32Array, second: Float32Array): number {
  let mismatches = Math.abs(first.length - second.length)

  for (
    let index = 0;
    index < Math.min(first.length, second.length);
    index += 1
  ) {
    if (first[index] !== second[index]) {
      mismatches += 1
    }
  }

  return mismatches
}

function wrapAngle(angle: number): number {
  return Math.atan2(Math.sin(angle), Math.cos(angle))
}

describe("line-art shape generators", () => {
  for (const shape of LINE_ART_SHAPE_IDS) {
    const definition = LINE_ART_SHAPES[shape]
    const count = DOT_SHAPE_TUNING[shape].pointCount

    it(`generates ${shape} deterministically for its seed`, () => {
      const first = generateLineArtPoints(definition, count)
      const second = generateLineArtPoints(definition, count)

      expect(first).toEqual(second)
    })

    it(`generates exactly its point count for ${shape}`, () => {
      const points = generateLineArtPoints(definition, count)

      expect(points.length).toBe(count * SHAPE_STRIDE)
    })

    it(`emits ${shape} in pen order along its strokes`, () => {
      const points = generateLineArtPoints(definition, count)
      let totalLength = 0

      for (const segment of buildLineArtSegments(definition.layers)) {
        totalLength += segment.length
      }

      const bound =
        JITTER_SPAN * Math.sqrt(3) * definition.jitter +
        (PEN_STEP_ALLOWANCE * totalLength) / count
      let penLifts = 0

      for (let index = 1; index < count; index += 1) {
        if (measureGap(points, index) > bound) {
          penLifts += 1
        }
      }

      expect(penLifts).toBeLessThanOrEqual(countStrokes(shape) - 1)
    })
  }

  it("draws the frame as a thin rectangle at the frame edge", () => {
    const points = generateLineArtPoints(
      LINE_ART_SHAPES.frame,
      DOT_SHAPE_TUNING.frame.pointCount
    )
    const band =
      (JITTER_SPAN / 2) * LINE_ART_SHAPES.frame.jitter + FLOAT_TOLERANCE

    const strays: number[] = []

    for (let index = 0; index < DOT_SHAPE_TUNING.frame.pointCount; index += 1) {
      const offset = index * SHAPE_STRIDE
      const edge = Math.max(
        Math.abs(points[offset]),
        Math.abs(points[offset + 1])
      )

      if (Math.abs(edge - FRAME_EDGE) > band) {
        strays.push(index)
      }
    }

    expect(strays).toEqual([])
  })
})

describe("scattered shape generators", () => {
  it("rings the listening points clockwise from the top in pen order", () => {
    const count = DOT_SHAPE_TUNING.listening.pointCount
    const points = generateScatterRingPoints(LISTENING_SHAPE, count)
    const step = (Math.PI * 2) / count
    const band = (JITTER_SPAN / 2) * LISTENING_SHAPE.ringJitter
    const outOfOrder: number[] = []
    let onRing = 0

    for (let index = 0; index < count; index += 1) {
      const offset = index * SHAPE_STRIDE
      const unitX = points[offset] / LISTENING_SHAPE.radiusX
      const unitY = points[offset + 1] / LISTENING_SHAPE.radiusY
      const reach = Math.hypot(unitX, unitY)
      const expected =
        LISTENING_SHAPE.startAngle - ((index + 0.5) / count) * Math.PI * 2
      const drift = Math.abs(wrapAngle(Math.atan2(unitY, unitX) - expected))

      if (reach > 0.01 && drift > step / 2 + ANGLE_TOLERANCE) {
        outOfOrder.push(index)
      }

      if (Math.abs(reach - 1) <= band) {
        onRing += 1
      }
    }

    expect(outOfOrder).toEqual([])
    expect(onRing / count).toBeGreaterThanOrEqual(LISTENING_SHAPE.ringShare)
    expect(onRing / count).toBeLessThanOrEqual(
      LISTENING_SHAPE.ringShare + RING_SHARE_TOLERANCE
    )
  })

  it("draws the delivered page, then its trail downward and widening", () => {
    const count = DOT_SHAPE_TUNING.delivery.pointCount
    const points = generateLaunchPoints(DELIVERY_SHAPE, count)
    const pageCount = Math.round(count * DELIVERY_SHAPE.pageShare)
    const page = generateLineArtPoints(DELIVERY_SHAPE.page, pageCount)
    const trailLength = DELIVERY_SHAPE.trailTop - DELIVERY_SHAPE.trailBottom
    const strays: number[] = []
    let previousY = DELIVERY_SHAPE.trailTop

    expect(points.subarray(0, pageCount * SHAPE_STRIDE)).toEqual(page)

    for (let index = pageCount; index < count; index += 1) {
      const offset = index * SHAPE_STRIDE
      const pointY = points[offset + 1]
      const along = (DELIVERY_SHAPE.trailTop - pointY) / trailLength
      const width =
        DELIVERY_SHAPE.topWidth +
        (DELIVERY_SHAPE.bottomWidth - DELIVERY_SHAPE.topWidth) * along
      const isClimbing = pointY > previousY + FLOAT_TOLERANCE
      const isBelowTrail = pointY < DELIVERY_SHAPE.trailBottom - FLOAT_TOLERANCE
      const isTooWide =
        Math.abs(points[offset] - DELIVERY_SHAPE.trailX) >
        width / 2 + FLOAT_TOLERANCE

      if (isClimbing || isBelowTrail || isTooWide) {
        strays.push(index)
      }

      previousY = pointY
    }

    expect(strays).toEqual([])
  })

  it("gathers a dotted perimeter clockwise with points scattered outside it", () => {
    const count = DOT_SHAPE_TUNING.gather.pointCount
    const points = generateGatherPoints(GATHER_SHAPE, count)
    const band = (JITTER_SPAN / 2) * GATHER_SHAPE.lineJitter + FLOAT_TOLERANCE
    const inner = GATHER_SHAPE.perimeter - band
    const strays: number[] = []
    let onLine = 0
    let scattered = 0

    for (let index = 0; index < count; index += 1) {
      const offset = index * SHAPE_STRIDE
      const pointX = points[offset]
      const pointY = points[offset + 1]
      const edge = Math.max(Math.abs(pointX), Math.abs(pointY))
      const side = Math.floor((index * GATHER_SIDES) / count)
      const sideReach = [pointY, pointX, -pointY, -pointX][side] ?? 0

      if (edge < inner || edge > 1 || sideReach < inner) {
        strays.push(index)
      }

      if (Math.abs(edge - GATHER_SHAPE.perimeter) <= band) {
        onLine += 1
      } else {
        scattered += 1
      }
    }

    expect(strays).toEqual([])
    expect(onLine / count).toBeGreaterThanOrEqual(GATHER_SHAPE.lineShare)
    expect(scattered / count).toBeGreaterThan(SCATTER_SHARE_FLOOR)
  })
})

describe("the shape library", () => {
  it("registers every generated shape in the id lists and the tuning", () => {
    const generated = [...GENERATED_SHAPE_IDS].sort()
    const drawings = [
      "cube",
      "dust",
      ...LINE_ART_SHAPE_IDS,
      ...SCATTER_SHAPE_IDS,
    ].sort()
    const drawable: string[] = []

    for (const shape of DOT_SHAPE_IDS) {
      if (shape !== "name") {
        drawable.push(shape)
      }
    }

    expect(Object.keys(DOT_SHAPE_TUNING).sort()).toEqual(generated)
    expect(drawable.sort()).toEqual(generated)
    expect(drawings).toEqual(generated)
  })

  it("builds every shape deterministically at its point count", () => {
    const library = buildShapeLibrary()
    const again = buildShapeLibrary()

    for (const shape of GENERATED_SHAPE_IDS) {
      const count = DOT_SHAPE_TUNING[shape].pointCount

      expect(count, shape).toBeLessThanOrEqual(SHAPE_POINTS)
      expect(library[shape].length, shape).toBe(count * SHAPE_STRIDE)
      expect(countMismatches(library[shape], again[shape]), shape).toBe(0)
    }
  })

  it("keeps every drawing inside the model cube with a rank below one", () => {
    const library = buildShapeLibrary()

    const strays: string[] = []

    for (const shape of [...LINE_ART_SHAPE_IDS, ...SCATTER_SHAPE_IDS]) {
      const points = library[shape]

      for (let offset = 0; offset < points.length; offset += SHAPE_STRIDE) {
        const rank = points[offset + 3]
        let isOutside = rank < 0 || rank >= 1

        for (let axis = 0; axis < 3; axis += 1) {
          if (Math.abs(points[offset + axis]) > 1) {
            isOutside = true
          }
        }

        if (isOutside) {
          strays.push(shape + " #" + offset / SHAPE_STRIDE)
        }
      }
    }

    expect(strays).toEqual([])
  })

  it("wires every scene to known shapes", () => {
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
    expect(parseSceneShapes(FRAME_SCENE_SHAPES)).toEqual(["frame"])
    expect(parseSceneShapes(CONTACT_SCENE_SHAPES)).toEqual(["gather"])
  })
})
