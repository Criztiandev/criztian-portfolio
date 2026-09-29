import { describe, expect, it } from "vitest"

import {
  CUBE_EDGE_JITTER,
  DOT_FIELD_MORPH_TUNING,
  DOT_SCENE_MOTION,
  DOT_FIELD_TUNING,
  DOT_SHAPE_TUNING,
  DOT_SPHERE_TUNING,
  HIDDEN_RANK,
  MAX_CANVAS_PIXELS,
  SHAPE_POINTS,
  SHAPE_STRIDE,
} from "@/data/hero.data"
import {
  buildCubeRotation,
  buildFontShorthand,
  buildSceneKeyframes,
  clampFontSize,
  createRandomSource,
  followMorphProgress,
  followTimelineProgress,
  followTriggeredProgress,
  generateCubePoints,
  generateDustPoints,
  generateSpherePoints,
  isShapeSpinning,
  padNamePoints,
  padShapePoints,
  parseCssPixels,
  parsePrimaryFontFamily,
  parseSceneShapes,
  projectShapePoints,
  resolveCanvasPixelRatio,
  resolveDotPitch,
  resolveFontSize,
  resolvePixelRatio,
  resolvePlacement,
  resolvePointTotal,
  resolveSceneState,
  resolveKeyframeRestTop,
  resolveStaticKeyframe,
  resolveThreadCommit,
  resolveThreadState,
  resolveTimelinePosition,
  resolveTriggeredTarget,
  resolveTimelineSegment,
  resolveViewportHeight,
  resolveVisibleFraction,
  samplePixelGrid,
  resolveArrivalStrike,
  applyArrivalImpulse,
  shouldLoopSleep,
  shouldRebuildPoints,
  stepDotPhysics,
  writeNameHomes,
} from "@/features/portfolio/dot-field.rules"
import type {
  DotFieldPlacement,
  DotFieldPlacementRequest,
  DotSceneKeyframe,
  DotSceneMeasure,
} from "@/types/hero.type"

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

describe("stepDotPhysics", () => {
  it("pushes a dot away, bounces it past home, then settles", () => {
    const homes = new Float32Array([100, 100, 1])
    const offsets = new Float32Array(2)
    const velocities = new Float32Array(2)
    const frameSeconds = 1 / 60

    function advance(isPointerDown: boolean): number {
      return stepDotPhysics(
        {
          homes,
          offsets,
          velocities,
          inkHeight: DOT_FIELD_TUNING.referenceInkHeight,
          pointer: isPointerDown ? { x: 90, y: 100, isActive: true } : null,
          deltaSeconds: frameSeconds,
        },
        DOT_FIELD_TUNING
      )
    }

    for (let frame = 0; frame < 30; frame += 1) {
      advance(true)
    }

    expect(offsets[0]).toBeGreaterThan(5)

    let deepestOvershoot = 0
    let motion = 0

    for (let frame = 0; frame < 600; frame += 1) {
      motion = advance(false)
      deepestOvershoot = Math.min(deepestOvershoot, offsets[0] ?? 0)
    }

    expect(deepestOvershoot).toBeLessThan(0)
    expect(motion).toBeLessThan(DOT_FIELD_TUNING.sleepThreshold)
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

describe("clampFontSize", () => {
  it("bounds the size on both ends", () => {
    expect(clampFontSize(20, 48, 900)).toBe(48)
    expect(clampFontSize(2000, 48, 900)).toBe(900)
    expect(clampFontSize(300, 48, 900)).toBe(300)
  })
})

const JITTER_BOUND = CUBE_EDGE_JITTER * 1.5 + 0.000001

function readShapePoint(points: Float32Array, index: number): number[] {
  const start = index * SHAPE_STRIDE

  return Array.from(points.subarray(start, start + SHAPE_STRIDE))
}

function countCoordinatesNearFace(coordinates: number[]): number {
  let nearFace = 0

  for (const coordinate of coordinates) {
    if (Math.abs(Math.abs(coordinate) - 1) <= JITTER_BOUND) {
      nearFace += 1
    }
  }

  return nearFace
}

function transformColumnMajor(matrix: Float32Array, vector: number[]) {
  const [vectorX, vectorY, vectorZ] = vector as [number, number, number]

  return [
    matrix[0] * vectorX + matrix[3] * vectorY + matrix[6] * vectorZ,
    matrix[1] * vectorX + matrix[4] * vectorY + matrix[7] * vectorZ,
    matrix[2] * vectorX + matrix[5] * vectorY + matrix[8] * vectorZ,
  ]
}

function buildPlacement(
  overrides: Partial<DotFieldPlacement>
): DotFieldPlacement {
  return {
    isName: false,
    shape: "cube",
    center: { x: 400, y: 300 },
    halfSize: { x: 100, y: 100 },
    rotation: buildCubeRotation(0, 0, 0),
    cameraDistance: 5,
    visible: 1,
    farLight: 1,
    depthRadius: 1,
    dotSize: 3,
    opacity: 1,
    inkHeight: 100,
    ...overrides,
  }
}

const SLOT = { x: 100, y: 200, width: 400, height: 400 }

function buildScene(overrides: Partial<DotSceneMeasure>): DotSceneMeasure {
  return {
    id: "cube",
    shapes: ["cube"],
    containerTop: 1000,
    containerBottom: 2500,
    stickyTop: 72,
    frameHeight: 828,
    slot: SLOT,
    ...overrides,
  }
}

const TIMELINE: DotSceneKeyframe[] = [
  { id: "name", shape: "name", start: 0, end: 90, slot: SLOT },
  { id: "cube", shape: "cube", start: 900, end: 1500, slot: SLOT },
  { id: "dust", shape: "dust", start: 2000, end: 3000, slot: null },
]

const VIEWPORT = { width: 1440, height: 900, pixelRatio: 2 }

const NAME_SAMPLE = {
  width: 2880,
  height: 1500,
  bounds: { left: 320, right: 2560 },
  inkHeight: 800,
}

function buildPlacementRequest(
  keyframe: DotSceneKeyframe,
  overrides: Partial<DotFieldPlacementRequest>
): DotFieldPlacementRequest {
  return {
    keyframe,
    viewport: VIEWPORT,
    nameSample: NAME_SAMPLE,
    introScale: 1,
    spinSeconds: 0,
    yawOffset: 0,
    isStatic: false,
    ...overrides,
  }
}

describe("createRandomSource", () => {
  it("repeats the same sequence for the same seed", () => {
    const first = createRandomSource(7)
    const second = createRandomSource(7)

    for (let draw = 0; draw < 20; draw += 1) {
      const value = first()

      expect(value).toBe(second())
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe("generateCubePoints", () => {
  it("returns four values per dot and repeats for the same count", () => {
    const first = generateCubePoints(500, CUBE_EDGE_JITTER)
    const second = generateCubePoints(500, CUBE_EDGE_JITTER)

    expect(first).toHaveLength(500 * SHAPE_STRIDE)
    expect(Array.from(first)).toEqual(Array.from(second))
  })

  it("returns an empty buffer for zero dots", () => {
    expect(generateCubePoints(0, CUBE_EDGE_JITTER)).toHaveLength(0)
  })

  it("keeps every dot on an edge within the jitter bound", () => {
    const points = generateCubePoints(500, CUBE_EDGE_JITTER)

    for (let index = 0; index < 500; index += 1) {
      const coordinates = readShapePoint(points, index).slice(0, 3)

      for (const coordinate of coordinates) {
        expect(Math.abs(coordinate)).toBeLessThanOrEqual(1 + JITTER_BOUND)
      }

      expect(countCoordinatesNearFace(coordinates)).toBeGreaterThanOrEqual(2)
    }
  })

  it("ranks every dot in [0, 1)", () => {
    const points = generateCubePoints(200, CUBE_EDGE_JITTER)

    for (let index = 0; index < 200; index += 1) {
      const rank = readShapePoint(points, index)[3] as number

      expect(rank).toBeGreaterThanOrEqual(0)
      expect(rank).toBeLessThan(1)
    }
  })
})

describe("generateSpherePoints", () => {
  it("stipples rings and meridians on the unit sphere", () => {
    const points = generateSpherePoints(600, DOT_SPHERE_TUNING)
    const bound = DOT_SPHERE_TUNING.jitter * 1.5 * Math.sqrt(3) + 0.000001

    expect(points).toHaveLength(600 * SHAPE_STRIDE)

    for (let index = 0; index < 600; index += 1) {
      const [pointX, pointY, pointZ, rank] = readShapePoint(points, index) as [
        number,
        number,
        number,
        number,
      ]

      expect(Math.abs(Math.hypot(pointX, pointY, pointZ) - 1)).toBeLessThan(
        bound
      )
      expect(rank).toBeGreaterThanOrEqual(0)
      expect(rank).toBeLessThan(1)
    }
  })
})

describe("generateDustPoints", () => {
  it("scatters flat dots across the unit square", () => {
    const points = generateDustPoints(300)

    for (let index = 0; index < 300; index += 1) {
      const [pointX, pointY, pointZ] = readShapePoint(points, index) as [
        number,
        number,
        number,
      ]

      expect(Math.abs(pointX)).toBeLessThanOrEqual(1)
      expect(Math.abs(pointY)).toBeLessThanOrEqual(1)
      expect(pointZ).toBe(0)
    }
  })
})

describe("padNamePoints", () => {
  it("keeps the sampled dots and hides the repeats", () => {
    const positions = new Float32Array([1, 2, 0.5, 3, 4, 0.75])

    expect(Array.from(padNamePoints(positions, 2, 5))).toEqual([
      1, 2, 0.5, 3, 4, 0.75, 1, 2, 0, 3, 4, 0, 1, 2, 0,
    ])
  })

  it("returns hidden dots when nothing was sampled", () => {
    expect(Array.from(padNamePoints(new Float32Array(0), 0, 2))).toEqual([
      0, 0, 0, 0, 0, 0,
    ])
  })
})

describe("padShapePoints", () => {
  it("repeats the shape and hides every repeat", () => {
    const points = new Float32Array([1, 0, 0, 0.25, 0, 1, 0, 0.5])

    expect(Array.from(padShapePoints(points, 3))).toEqual([
      1,
      0,
      0,
      0.25,
      0,
      1,
      0,
      0.5,
      1,
      0,
      0,
      HIDDEN_RANK,
    ])
  })
})

describe("resolvePointTotal", () => {
  it("never drops below the shape budget", () => {
    expect(resolvePointTotal(100)).toBe(SHAPE_POINTS)
    expect(resolvePointTotal(SHAPE_POINTS + 5)).toBe(SHAPE_POINTS + 5)
  })
})

describe("buildCubeRotation", () => {
  it("is the identity with no yaw, pitch or roll", () => {
    const matrix = Array.from(buildCubeRotation(0, 0, 0))
    const identity = [1, 0, 0, 0, 1, 0, 0, 0, 1]

    for (let index = 0; index < 9; index += 1) {
      expect(matrix[index]).toBeCloseTo(identity[index] as number, 6)
    }
  })

  it("is a proper rotation", () => {
    const matrix = buildCubeRotation(0.7, 0.45, -0.2)
    const columns = [
      [matrix[0], matrix[1], matrix[2]],
      [matrix[3], matrix[4], matrix[5]],
      [matrix[6], matrix[7], matrix[8]],
    ] as [number, number, number][]

    for (const column of columns) {
      expect(Math.hypot(...column)).toBeCloseTo(1, 5)
    }

    const [first, second, third] = columns as [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ]
    const determinant =
      first[0] * (second[1] * third[2] - second[2] * third[1]) -
      second[0] * (first[1] * third[2] - first[2] * third[1]) +
      third[0] * (first[1] * second[2] - first[2] * second[1])

    expect(determinant).toBeCloseTo(1, 5)
  })

  it("tilts the vertical axis toward the viewer by the pitch", () => {
    const pitch = 0.45
    const [axisX, axisY, axisZ] = transformColumnMajor(
      buildCubeRotation(1.3, pitch, 0),
      [0, 1, 0]
    )

    expect(axisX).toBeCloseTo(0, 5)
    expect(axisY).toBeCloseTo(Math.cos(pitch), 5)
    expect(axisZ).toBeCloseTo(Math.sin(pitch), 5)
  })

  it("leans the spin axis sideways by the roll, whatever the yaw", () => {
    const pitch = 0.45
    const roll = -0.2

    for (const yaw of [0, 1.3, 4]) {
      const [axisX, axisY, axisZ] = transformColumnMajor(
        buildCubeRotation(yaw, pitch, roll),
        [0, 1, 0]
      )

      expect(axisX).toBeCloseTo(-Math.sin(roll) * Math.cos(pitch), 5)
      expect(axisY).toBeCloseTo(Math.cos(roll) * Math.cos(pitch), 5)
      expect(axisZ).toBeCloseTo(Math.sin(pitch), 5)
    }
  })
})

describe("projectShapePoints", () => {
  function projectOne(
    placement: DotFieldPlacement,
    shapeX: number,
    shapeY: number,
    shapeZ: number
  ) {
    const points = new Float32Array([shapeX, shapeY, shapeZ, 0])
    const target = new Float32Array(3)

    projectShapePoints(points, placement, target)

    return Array.from(target)
  }

  const placement = buildPlacement({})

  it("puts the shape centre on the placement centre", () => {
    expect(projectOne(placement, 0, 0, 0)).toEqual([400, 300, 0])
  })

  it("maps shape x to the right and shape y upward on the canvas", () => {
    expect(projectOne(placement, 1, 0, 0)).toEqual([500, 300, 0])
    expect(projectOne(placement, 0, 1, 0)).toEqual([400, 200, 0])
  })

  it("enlarges points nearer the viewer by the perspective", () => {
    const [nearX] = projectOne(placement, 1, 0, 1) as [number]
    const [farX] = projectOne(placement, 1, 0, -1) as [number]

    expect(nearX - 400).toBeCloseTo(100 * (5 / 4), 3)
    expect(farX - 400).toBeCloseTo(100 * (5 / 6), 3)
  })

  it("stays flat without a camera and stretches with an uneven half size", () => {
    const flat = buildPlacement({
      cameraDistance: 0,
      halfSize: { x: 200, y: 50 },
    })

    expect(projectOne(flat, 1, 1, 1)).toEqual([600, 250, 0])
  })

  it("writes one stride-three home per shape point", () => {
    const points = generateCubePoints(40, CUBE_EDGE_JITTER)
    const target = new Float32Array(40 * 3)

    projectShapePoints(points, placement, target)

    for (let index = 0; index < 40; index += 1) {
      expect(Number.isFinite(target[index * 3])).toBe(true)
      expect(target[index * 3 + 2]).toBe(0)
    }
  })
})

describe("writeNameHomes", () => {
  it("places the sampled name at its origin and scale", () => {
    const positions = new Float32Array([10, 20, 1])
    const target = new Float32Array(3)
    const wordCenter = { x: 30, y: 40 }

    writeNameHomes(
      positions,
      buildPlacement({ center: { x: 100, y: 50 }, halfSize: { x: 1, y: 1 } }),
      wordCenter,
      target
    )

    expect(Array.from(target)).toEqual([110, 70, 0])

    writeNameHomes(
      positions,
      buildPlacement({
        center: { x: 100, y: 50 },
        halfSize: { x: 0.5, y: 0.5 },
      }),
      wordCenter,
      target
    )

    expect(Array.from(target)).toEqual([120, 80, 0])
  })
})

describe("resolveCanvasPixelRatio", () => {
  it("passes the device ratio through when the canvas fits the budget", () => {
    expect(resolveCanvasPixelRatio(1440, 900, 2, 16384)).toBe(2)
    expect(resolveCanvasPixelRatio(390, 844, 1.5, 16384)).toBe(1.5)
  })

  it("steps the ratio down to stay under the pixel budget", () => {
    const ratio = resolveCanvasPixelRatio(2560, 2200, 2, 16384)

    expect(ratio).toBeLessThan(2)
    expect(2560 * 2200 * ratio * ratio).toBeLessThanOrEqual(MAX_CANVAS_PIXELS)
  })

  it("keeps the backing store inside the GPU's maximum dimension", () => {
    const ratio = resolveCanvasPixelRatio(1000, 3000, 2, 4096)

    expect(3000 * ratio).toBeLessThanOrEqual(4096)
  })

  it("never renders below CSS resolution", () => {
    expect(resolveCanvasPixelRatio(4000, 4000, 2, 16384)).toBe(1)
  })
})

describe("followMorphProgress", () => {
  it("moves toward the target without overshooting", () => {
    const next = followMorphProgress(0, 1, 1 / 60, DOT_FIELD_MORPH_TUNING)

    expect(next).toBeGreaterThan(0)
    expect(next).toBeLessThan(1)
  })

  it("snaps onto the target once it is close enough", () => {
    expect(
      followMorphProgress(0.99999, 1, 1 / 60, DOT_FIELD_MORPH_TUNING)
    ).toBe(1)
  })
})

describe("followTimelineProgress", () => {
  it("eases within one segment", () => {
    const next = followTimelineProgress(1, 1.8, 1 / 60, DOT_FIELD_MORPH_TUNING)

    expect(next).toBeGreaterThan(1)
    expect(next).toBeLessThan(1.8)
  })

  it("snaps when the target is more than one segment away", () => {
    expect(followTimelineProgress(0, 3, 1 / 60, DOT_FIELD_MORPH_TUNING)).toBe(3)
  })
})

describe("parseSceneShapes", () => {
  it("keeps known shapes in order and drops the rest", () => {
    expect(parseSceneShapes("cube  bogus sphere")).toEqual(["cube", "sphere"])
    expect(parseSceneShapes(undefined)).toEqual([])
  })
})

describe("parseCssPixels", () => {
  it("reads a pixel length and treats anything else as zero", () => {
    expect(parseCssPixels("72px")).toBe(72)
    expect(parseCssPixels("auto")).toBe(0)
  })
})

describe("resolveViewportHeight", () => {
  it("reads the small viewport from the shortest pinned frame", () => {
    const scenes = [
      buildScene({ stickyTop: 0, frameHeight: 900 }),
      buildScene({ stickyTop: 72, frameHeight: 828 }),
      buildScene({ slot: null, frameHeight: 0 }),
    ]

    expect(resolveViewportHeight(scenes, 1000)).toBe(900)
  })

  it("ignores a frame that grew past one viewport", () => {
    const scenes = [
      buildScene({ stickyTop: 0, frameHeight: 900 }),
      buildScene({ stickyTop: 72, frameHeight: 1040 }),
    ]

    expect(resolveViewportHeight(scenes, 1000)).toBe(900)
  })

  it("falls back when nothing is pinned", () => {
    expect(resolveViewportHeight([buildScene({ slot: null })], 1000)).toBe(1000)
  })
})

describe("buildSceneKeyframes", () => {
  it("pins a slotted scene from its sticky top to its last full frame", () => {
    const [keyframe] = buildSceneKeyframes(
      [buildScene({})],
      900,
      DOT_FIELD_MORPH_TUNING
    )

    expect(keyframe).toEqual({
      id: "cube",
      shape: "cube",
      start: 928,
      end: 1600,
      slot: SLOT,
    })
  })

  it("spans a dust scene until its bottom meets the viewport's", () => {
    const [keyframe] = buildSceneKeyframes(
      [
        buildScene({
          id: "dust",
          shapes: ["dust"],
          containerTop: 3000,
          containerBottom: 5000,
          frameHeight: 0,
          slot: null,
        }),
      ],
      900,
      DOT_FIELD_MORPH_TUNING
    )

    expect(keyframe?.start).toBe(2928)
    expect(keyframe?.end).toBe(4100)
    expect(keyframe?.slot).toBeNull()
  })

  it("never ends a scene before it starts", () => {
    const [keyframe] = buildSceneKeyframes(
      [buildScene({ containerBottom: 1100 })],
      900,
      DOT_FIELD_MORPH_TUNING
    )

    expect(keyframe?.end).toBe(keyframe?.start)
  })

  it("centres each step on the copy pitch with the morph on each boundary", () => {
    const keyframes = buildSceneKeyframes(
      [
        buildScene({
          id: "steps",
          shapes: ["cube", "sphere", "dust"],
          containerTop: 1072,
        }),
      ],
      900,
      DOT_FIELD_MORPH_TUNING
    )
    const ranges: (string | number)[][] = []

    for (const keyframe of keyframes) {
      ranges.push([keyframe.id, keyframe.start, keyframe.end])
    }

    expect(ranges).toEqual([
      ["cube", 1000, 1090],
      ["sphere", 1210, 1390],
      ["dust", 1510, 1600],
    ])
  })

  it("gives a threaded scene its own morph share and threads its steps", () => {
    const keyframes = buildSceneKeyframes(
      [
        buildScene({
          id: "services",
          shapes: ["cube", "sphere", "dust"],
          containerTop: 1072,
        }),
      ],
      900,
      DOT_FIELD_MORPH_TUNING
    )
    const share = DOT_SCENE_MOTION.services?.share ?? 0
    const halfGap = (300 * share) / 2

    expect(keyframes[0]?.end).toBeCloseTo(1150 - halfGap, 6)
    expect(keyframes[1]?.start).toBeCloseTo(1150 + halfGap, 6)

    for (const keyframe of keyframes) {
      expect(keyframe.isThread).toBe(true)
    }
  })

  it("never threads a single-shape scene", () => {
    const keyframes = buildSceneKeyframes(
      [buildScene({ id: "services", shapes: ["dust"] })],
      900,
      DOT_FIELD_MORPH_TUNING
    )

    expect(keyframes[0]).not.toHaveProperty("isThread")
  })

  it("skips a scene without a known shape", () => {
    expect(
      buildSceneKeyframes(
        [buildScene({ shapes: [] })],
        900,
        DOT_FIELD_MORPH_TUNING
      )
    ).toEqual([])
  })
})

const THREAD_TIMELINE: DotSceneKeyframe[] = [
  { id: "cube", shape: "cube", start: 0, end: 100, slot: SLOT },
  {
    id: "branding",
    shape: "branding",
    start: 500,
    end: 600,
    slot: SLOT,
    isThread: true,
  },
  {
    id: "web-design",
    shape: "web-design",
    start: 1000,
    end: 1100,
    slot: SLOT,
    isThread: true,
  },
]

const TRIGGER = DOT_FIELD_MORPH_TUNING.threadTrigger

function triggerAt(
  scrollTarget: number,
  previousScrollTarget: number,
  committedTarget: number
): number {
  return resolveTriggeredTarget({
    keyframes: THREAD_TIMELINE,
    scrollTarget,
    previousScrollTarget,
    committedTarget,
    trigger: TRIGGER,
  })
}

describe("resolveTriggeredTarget", () => {
  it("keeps scrubbing a segment that is not threaded", () => {
    expect(triggerAt(0.4, 0.3, 0.3)).toBe(0.4)
  })

  it("commits to the next shape once a downward scroll passes the trigger", () => {
    expect(triggerAt(1 + TRIGGER / 2, 1, 1)).toBe(1)
    expect(triggerAt(1 + TRIGGER, 1 + TRIGGER / 2, 1)).toBe(2)
  })

  it("keeps playing forward while the reader keeps scrolling down", () => {
    expect(triggerAt(1.6, 1.5, 2)).toBe(2)
  })

  it("commits back once an upward scroll passes the trigger from the end", () => {
    expect(triggerAt(2 - TRIGGER / 2, 2, 2)).toBe(2)
    expect(triggerAt(1.5, 1.6, 2)).toBe(1)
  })

  it("stops at the near shape when a fast scroll enters from outside", () => {
    expect(triggerAt(1.5, 0.8, 0.8)).toBe(1)
    expect(triggerAt(1.5, 2.4, 2.4)).toBe(2)
  })

  it("holds the committed shape when the scroll stops", () => {
    expect(triggerAt(1.4, 1.4, 2)).toBe(2)
  })

  it("lands a fresh load on the nearer shape", () => {
    expect(triggerAt(1.3, Number.NaN, 0.5)).toBe(1)
    expect(triggerAt(1.7, Number.NaN, 0.5)).toBe(2)
  })
})

describe("followTriggeredProgress", () => {
  const seconds = DOT_FIELD_MORPH_TUNING.threadDrawSeconds

  it("draws a threaded segment at a constant speed", () => {
    expect(
      followTriggeredProgress(
        1,
        2,
        seconds / 4,
        THREAD_TIMELINE,
        DOT_FIELD_MORPH_TUNING
      )
    ).toBeCloseTo(1.25, 6)
  })

  it("lands exactly on the target", () => {
    expect(
      followTriggeredProgress(
        1.99,
        2,
        seconds / 4,
        THREAD_TIMELINE,
        DOT_FIELD_MORPH_TUNING
      )
    ).toBe(2)
  })

  it("follows any other segment as before", () => {
    expect(
      followTriggeredProgress(
        0.2,
        0.6,
        0.1,
        THREAD_TIMELINE,
        DOT_FIELD_MORPH_TUNING
      )
    ).toBe(followTimelineProgress(0.2, 0.6, 0.1, DOT_FIELD_MORPH_TUNING))
  })
})

describe("resolveThreadCommit", () => {
  it("announces a move from one threaded shape to the next", () => {
    expect(resolveThreadCommit(THREAD_TIMELINE, 1, 2)?.id).toBe("web-design")
    expect(resolveThreadCommit(THREAD_TIMELINE, 2, 1)?.id).toBe("branding")
  })

  it("announces an arrival into the threaded scene so the reader stops there", () => {
    expect(resolveThreadCommit(THREAD_TIMELINE, 0.6, 1)?.id).toBe("branding")
    expect(resolveThreadCommit(THREAD_TIMELINE, 0, 1)?.id).toBe("branding")
  })

  it("never holds the reader after a jump across scenes", () => {
    expect(resolveThreadCommit(THREAD_TIMELINE, 0, 2)).toBeNull()
  })

  it("stays quiet when nothing changed or the target is not a threaded shape", () => {
    expect(resolveThreadCommit(THREAD_TIMELINE, 2, 2)).toBeNull()
    expect(resolveThreadCommit(THREAD_TIMELINE, 1, 0.4)).toBeNull()
    expect(resolveThreadCommit(THREAD_TIMELINE, 1, 0)).toBeNull()
  })

  it("rests a committed shape at the middle of its range", () => {
    const branding = THREAD_TIMELINE[1]

    if (branding === undefined) {
      throw new Error("missing keyframe")
    }

    expect(resolveKeyframeRestTop(branding)).toBe(550)
  })
})

describe("resolveThreadState", () => {
  it("names the threaded shape nearest the target", () => {
    expect(resolveThreadState(THREAD_TIMELINE, 1)).toBe("branding")
    expect(resolveThreadState(THREAD_TIMELINE, 1.6)).toBe("web-design")
  })

  it("names nothing away from a threaded scene", () => {
    expect(resolveThreadState(THREAD_TIMELINE, 0.2)).toBeNull()
  })
})

describe("resolveTimelinePosition", () => {
  it("holds a formed keyframe across its range", () => {
    expect(resolveTimelinePosition(TIMELINE, 50, 1)).toBe(0)
    expect(resolveTimelinePosition(TIMELINE, 900, 1)).toBe(1)
    expect(resolveTimelinePosition(TIMELINE, 1200, 1)).toBe(1)
    expect(resolveTimelinePosition(TIMELINE, 3000, 1)).toBe(2)
  })

  it("travels between keyframes", () => {
    expect(resolveTimelinePosition(TIMELINE, 90 + 809 / 2, 1)).toBeCloseTo(
      0.5,
      6
    )
  })

  it("lands one tolerance before the next keyframe starts", () => {
    expect(resolveTimelinePosition(TIMELINE, 899, 1)).toBe(1)
    expect(resolveTimelinePosition(TIMELINE, 898, 1)).toBeLessThan(1)
  })

  it("stays on the last keyframe past the end", () => {
    expect(resolveTimelinePosition(TIMELINE, 9999, 1)).toBe(2)
  })

  it("switches without travelling when two keyframes touch", () => {
    const touching: DotSceneKeyframe[] = [
      { id: "name", shape: "name", start: 0, end: 1000, slot: SLOT },
      { id: "cube", shape: "cube", start: 1000.5, end: 1600, slot: SLOT },
    ]

    expect(resolveTimelinePosition(touching, 1000.2, 1)).toBe(0)
    expect(resolveTimelinePosition(touching, 1000.5, 1)).toBe(1)
  })

  it("rests at zero without keyframes", () => {
    expect(resolveTimelinePosition([], 500, 1)).toBe(0)
  })
})

describe("resolveTimelineSegment", () => {
  it("pairs a keyframe with the next", () => {
    expect(resolveTimelineSegment(0.25, 3)).toEqual({
      fromIndex: 0,
      toIndex: 1,
      progress: 0.25,
    })
  })

  it("rests on the last keyframe", () => {
    const resting = { fromIndex: 2, toIndex: 2, progress: 0 }

    expect(resolveTimelineSegment(2, 3)).toEqual(resting)
    expect(resolveTimelineSegment(5, 3)).toEqual(resting)
  })

  it("handles an empty timeline", () => {
    expect(resolveTimelineSegment(0, 0)).toEqual({
      fromIndex: 0,
      toIndex: 0,
      progress: 0,
    })
  })
})

describe("resolveStaticKeyframe", () => {
  it("finds the keyframe whose range holds the scroll", () => {
    expect(resolveStaticKeyframe(TIMELINE, 1200, 1)).toBe(1)
    expect(resolveStaticKeyframe(TIMELINE, 899.5, 1)).toBe(1)
    expect(resolveStaticKeyframe(TIMELINE, 500, 1)).toBe(-1)
  })
})

describe("resolveSceneState", () => {
  it("names a formed keyframe and reports travel", () => {
    expect(resolveSceneState(TIMELINE, 1)).toBe("cube")
    expect(resolveSceneState(TIMELINE, 1.5)).toBe("moving")
    expect(resolveSceneState(TIMELINE, -1)).toBe("moving")
  })
})

describe("resolveVisibleFraction", () => {
  it("scales the visible dots with the slot area", () => {
    expect(resolveVisibleFraction(0.042, 500 * 500, 7200)).toBe(1)
    expect(resolveVisibleFraction(0.042, 200 * 200, 7200)).toBeCloseTo(
      1680 / 7200,
      6
    )
    expect(resolveVisibleFraction(0.042, 0, 7200)).toBe(0)
  })
})

describe("resolvePlacement", () => {
  const nameKeyframe: DotSceneKeyframe = {
    id: "name",
    shape: "name",
    start: 0,
    end: 90,
    slot: { x: 0, y: 75, width: 1440, height: 750 },
  }

  it("puts the name at the rounded centre of its slot, full size", () => {
    const placement = resolvePlacement(buildPlacementRequest(nameKeyframe, {}))

    expect(placement.isName).toBe(true)
    expect(placement.center).toEqual({ x: 0, y: 150 })
    expect(placement.halfSize).toEqual({ x: 1, y: 1 })
  })

  it("shrinks the name to fit a smaller slot and applies the intro", () => {
    const placement = resolvePlacement(
      buildPlacementRequest(
        {
          ...nameKeyframe,
          slot: { x: 0, y: 0, width: 720, height: 750 },
        },
        { introScale: 0.5 }
      )
    )

    expect(placement.halfSize.x).toBeCloseTo((1440 / 2240) * 0.5, 6)
  })

  it("fits a contained shape to the slot's short side", () => {
    const placement = resolvePlacement(
      buildPlacementRequest(
        {
          id: "cube",
          shape: "cube",
          start: 900,
          end: 1500,
          slot: { x: 100, y: 200, width: 400, height: 300 },
        },
        {}
      )
    )
    const halfSide = 300 * DOT_SHAPE_TUNING.cube.sizeRatio * 2

    expect(placement.center).toEqual({ x: 600, y: 700 })
    expect(placement.halfSize.x).toBeCloseTo(halfSide, 6)
    expect(placement.halfSize.y).toBeCloseTo(halfSide, 6)
    expect(placement.cameraDistance).toBe(DOT_FIELD_MORPH_TUNING.cameraDistance)
  })

  it("fills the viewport with flat dust", () => {
    const placement = resolvePlacement(
      buildPlacementRequest(TIMELINE[2] as DotSceneKeyframe, {})
    )

    expect(placement.center).toEqual({ x: 1440, y: 900 })
    expect(placement.halfSize).toEqual({ x: 1440, y: 900 })
    expect(placement.cameraDistance).toBe(0)
    expect(Array.from(placement.rotation)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1])
  })

  it("holds the resting pose under reduced motion", () => {
    const placement = resolvePlacement(
      buildPlacementRequest(TIMELINE[1] as DotSceneKeyframe, {
        isStatic: true,
        spinSeconds: 12,
      })
    )
    const tuning = DOT_SHAPE_TUNING.cube

    expect(Array.from(placement.rotation)).toEqual(
      Array.from(buildCubeRotation(tuning.staticYaw, tuning.pitch, tuning.roll))
    )
  })
})

describe("isShapeSpinning", () => {
  it("turns the cube and leaves the name and dust still", () => {
    expect(isShapeSpinning("cube")).toBe(true)
    expect(isShapeSpinning("name")).toBe(false)
    expect(isShapeSpinning("dust")).toBe(false)
  })
})

describe("resolveArrivalStrike", () => {
  it("starts at full strength and decays to exactly zero at its duration", () => {
    expect(resolveArrivalStrike(0, 0.3)).toBe(1)
    expect(resolveArrivalStrike(0.15, 0.3)).toBeCloseTo(0.25)
    expect(resolveArrivalStrike(0.3, 0.3)).toBe(0)
    expect(resolveArrivalStrike(5, 0.3)).toBe(0)
  })

  it("is zero before any strike has started", () => {
    expect(resolveArrivalStrike(-1, 0.3)).toBe(0)
    expect(resolveArrivalStrike(Number.NEGATIVE_INFINITY, 0.3)).toBe(0)
  })
})

describe("applyArrivalImpulse", () => {
  it("kicks every dot outward from the shape centre", () => {
    const homes = new Float32Array([110, 100, 0, 100, 80, 0, 100, 100, 0])
    const velocities = new Float32Array(6)

    applyArrivalImpulse(homes, velocities, { x: 100, y: 100 }, 2)

    expect(Array.from(velocities)).toEqual([2, 0, 0, -2, 0, 0])
  })
})

describe("shouldLoopSleep", () => {
  const resting = {
    isFieldAtRest: true,
    hasSettled: true,
    isProgressResting: true,
    isSpinning: false,
    isStriking: false,
  }

  it("sleeps once everything rests", () => {
    expect(shouldLoopSleep(resting)).toBe(true)
  })

  it("keeps a spinning shape turning", () => {
    expect(shouldLoopSleep({ ...resting, isSpinning: true })).toBe(false)
  })

  it("keeps drawing until an arrival strike has decayed", () => {
    expect(shouldLoopSleep({ ...resting, isStriking: true })).toBe(false)
  })

  it("keeps running while anything is still moving", () => {
    expect(shouldLoopSleep({ ...resting, isFieldAtRest: false })).toBe(false)
    expect(shouldLoopSleep({ ...resting, hasSettled: false })).toBe(false)
    expect(shouldLoopSleep({ ...resting, isProgressResting: false })).toBe(
      false
    )
  })
})
