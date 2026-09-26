import { describe, expect, it } from "vitest"

import {
  BURST_FOLLOW_TUNING,
  CUBE_POINT_STRIDE,
  DOT_FIELD_MORPH_TUNING,
  DOT_FIELD_SCENE_TUNING,
  DOT_FIELD_TUNING,
  MAX_CANVAS_PIXELS,
  SCENE_POINT_STRIDE,
} from "@/data/hero.data"
import {
  buildCubeRotation,
  buildFontShorthand,
  clampFontSize,
  createRandomSource,
  followMorphProgress,
  generateCubePoints,
  generateScenePoints,
  isCubeEdgeIndex,
  parsePrimaryFontFamily,
  projectCubePoints,
  resolveBurstState,
  resolveCanvasPixelRatio,
  resolveCanvasWindowTop,
  resolveClaimTarget,
  resolveCompressedCube,
  resolveDotPitch,
  resolveFontSize,
  resolveFrameShare,
  resolveMorphState,
  resolvePixelRatio,
  resolveSceneScroll,
  resolveSceneTargets,
  samplePixelGrid,
  shouldLoopSleep,
  shouldRebuildPoints,
  stepDotPhysics,
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

const FACE_TUNING = {
  ...DOT_FIELD_MORPH_TUNING,
  cubeEdgePointLimit: 120,
  cubeFaceAlpha: 0.25,
}

const JITTER_BOUND = FACE_TUNING.cubeEdgeJitter * 1.5 + 0.000001

function readCubePoint(points: Float32Array, index: number): number[] {
  const start = index * CUBE_POINT_STRIDE

  return Array.from(points.subarray(start, start + CUBE_POINT_STRIDE))
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

describe("isCubeEdgeIndex", () => {
  it("selects exactly the requested number of edge dots", () => {
    let selected = 0

    for (let index = 0; index < 1000; index += 1) {
      if (isCubeEdgeIndex(index, 1000, 137)) {
        selected += 1
      }
    }

    expect(selected).toBe(137)
  })
})

describe("generateCubePoints", () => {
  it("returns five values per dot and repeats for the same count", () => {
    const first = generateCubePoints(500, FACE_TUNING)
    const second = generateCubePoints(500, FACE_TUNING)

    expect(first).toHaveLength(500 * CUBE_POINT_STRIDE)
    expect(Array.from(first)).toEqual(Array.from(second))
  })

  it("returns an empty buffer for zero dots", () => {
    expect(generateCubePoints(0, FACE_TUNING)).toHaveLength(0)
  })

  it("puts the edge limit on edges and the rest on faces", () => {
    const points = generateCubePoints(500, FACE_TUNING)

    let edgeDots = 0
    let faceDots = 0

    for (let index = 0; index < 500; index += 1) {
      const brightness = readCubePoint(points, index)[4]

      if (brightness === 1) {
        edgeDots += 1
      }

      if (brightness === FACE_TUNING.cubeFaceAlpha) {
        faceDots += 1
      }
    }

    expect(edgeDots).toBe(FACE_TUNING.cubeEdgePointLimit)
    expect(faceDots).toBe(500 - FACE_TUNING.cubeEdgePointLimit)
  })

  it("puts every dot on an edge when there are few dots", () => {
    const points = generateCubePoints(60, FACE_TUNING)

    for (let index = 0; index < 60; index += 1) {
      expect(readCubePoint(points, index)[4]).toBe(1)
    }
  })

  it("keeps edge dots on an edge within the jitter bound", () => {
    const points = generateCubePoints(500, FACE_TUNING)

    for (let index = 0; index < 500; index += 1) {
      const point = readCubePoint(points, index)
      const coordinates = point.slice(0, 3)

      for (const coordinate of coordinates) {
        expect(Math.abs(coordinate)).toBeLessThanOrEqual(1 + JITTER_BOUND)
      }

      if (point[4] === 1) {
        expect(countCoordinatesNearFace(coordinates)).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it("draws edge dots from the whole index range", () => {
    const count = 1000
    const points = generateCubePoints(count, FACE_TUNING)

    let firstEdge = count
    let lastEdge = -1

    for (let index = 0; index < count; index += 1) {
      if (readCubePoint(points, index)[4] === 1) {
        firstEdge = Math.min(firstEdge, index)
        lastEdge = Math.max(lastEdge, index)
      }
    }

    expect(firstEdge).toBeLessThan(count * 0.1)
    expect(lastEdge).toBeGreaterThan(count * 0.9)
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

describe("projectCubePoints", () => {
  const projection = {
    center: { x: 400, y: 300 },
    halfSize: 100,
    cameraDistance: 5,
    rotation: buildCubeRotation(0, 0, 0),
  }

  function projectOne(cubeX: number, cubeY: number, cubeZ: number) {
    const cubePoints = new Float32Array([cubeX, cubeY, cubeZ, 0, 1])
    const target = new Float32Array(3)

    projectCubePoints(cubePoints, projection, target)

    return Array.from(target)
  }

  it("puts the cube centre on the projection centre", () => {
    expect(projectOne(0, 0, 0)).toEqual([400, 300, 0])
  })

  it("maps cube x to the right and cube y upward on the canvas", () => {
    expect(projectOne(1, 0, 0)).toEqual([500, 300, 0])
    expect(projectOne(0, 1, 0)).toEqual([400, 200, 0])
  })

  it("enlarges points nearer the viewer by the perspective", () => {
    const [nearX] = projectOne(1, 0, 1) as [number]
    const [farX] = projectOne(1, 0, -1) as [number]

    expect(nearX - 400).toBeCloseTo(100 * (5 / 4), 3)
    expect(farX - 400).toBeCloseTo(100 * (5 / 6), 3)
  })

  it("writes one stride-three home per cube point", () => {
    const cubePoints = generateCubePoints(40, FACE_TUNING)
    const target = new Float32Array(40 * 3)

    projectCubePoints(cubePoints, projection, target)

    for (let index = 0; index < 40; index += 1) {
      expect(Number.isFinite(target[index * 3])).toBe(true)
      expect(target[index * 3 + 2]).toBe(0)
    }
  })
})

describe("resolveCanvasPixelRatio", () => {
  it("passes the device ratio through when the canvas fits the budget", () => {
    expect(resolveCanvasPixelRatio(1440, 1400, 2, 16384)).toBe(2)
    expect(resolveCanvasPixelRatio(390, 1300, 1.5, 16384)).toBe(1.5)
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

describe("resolveMorphState", () => {
  it("names the resting and moving states", () => {
    expect(resolveMorphState(-0.1)).toBe("name")
    expect(resolveMorphState(0)).toBe("name")
    expect(resolveMorphState(0.5)).toBe("moving")
    expect(resolveMorphState(1)).toBe("cube")
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

const WINDOW_REQUEST = {
  scrolled: 0,
  viewportHeight: 900,
  canvasHeight: 1422,
  stageHeight: 6000,
  projectsTop: 1800,
  pixelRatio: 2,
  isStatic: false,
}

describe("resolveCanvasWindowTop", () => {
  it("stays at the stage top until the projects enter the viewport", () => {
    expect(
      resolveCanvasWindowTop(
        { ...WINDOW_REQUEST, scrolled: 900 },
        DOT_FIELD_SCENE_TUNING
      )
    ).toBe(0)
  })

  it("stays at the stage top under reduced motion", () => {
    expect(
      resolveCanvasWindowTop(
        { ...WINDOW_REQUEST, scrolled: 3000, isStatic: true },
        DOT_FIELD_SCENE_TUNING
      )
    ).toBe(0)
  })

  it("keeps the viewport inside the window with margin on both sides", () => {
    const slack = WINDOW_REQUEST.canvasHeight - WINDOW_REQUEST.viewportHeight
    const margin = (slack * 3) / 8 - 1

    for (let scrolled = 901; scrolled < 4500; scrolled += 7) {
      const windowTop = resolveCanvasWindowTop(
        { ...WINDOW_REQUEST, scrolled },
        DOT_FIELD_SCENE_TUNING
      )
      const bottomMargin =
        windowTop +
        WINDOW_REQUEST.canvasHeight -
        (scrolled + WINDOW_REQUEST.viewportHeight)

      expect(scrolled - windowTop).toBeGreaterThanOrEqual(margin)
      expect(bottomMargin).toBeGreaterThanOrEqual(margin)
    }
  })

  it("moves in whole device pixels", () => {
    for (let scrolled = 901; scrolled < 4500; scrolled += 13) {
      const windowTop = resolveCanvasWindowTop(
        { ...WINDOW_REQUEST, scrolled, pixelRatio: 1.75 },
        DOT_FIELD_SCENE_TUNING
      )
      const devicePixels = windowTop * 1.75

      expect(Math.abs(devicePixels - Math.round(devicePixels))).toBeLessThan(
        1e-6
      )
    }
  })

  it("never runs past the end of the stage", () => {
    const windowTop = resolveCanvasWindowTop(
      { ...WINDOW_REQUEST, scrolled: 20000 },
      DOT_FIELD_SCENE_TUNING
    )

    expect(windowTop).toBe(
      WINDOW_REQUEST.stageHeight - WINDOW_REQUEST.canvasHeight
    )
  })
})

const SCENE_SCROLL_REQUEST = {
  scrolled: 0,
  viewportHeight: 900,
  projectsTop: 1800,
  stageWidth: 1440,
}

function readCompressAt(scrolled: number): number {
  return resolveSceneScroll(
    { ...SCENE_SCROLL_REQUEST, scrolled },
    DOT_FIELD_SCENE_TUNING
  ).rawCompress
}

function readRearmedAt(scrolled: number): boolean {
  return resolveSceneScroll(
    { ...SCENE_SCROLL_REQUEST, scrolled },
    DOT_FIELD_SCENE_TUNING
  ).isRearmed
}

describe("resolveSceneScroll", () => {
  it("compresses while the projects rise from 70% to 35% of the view", () => {
    expect(readCompressAt(1000)).toBe(0)
    expect(readCompressAt(1170)).toBe(0)
    expect(readCompressAt(1327.5)).toBeCloseTo(0.5)
    expect(readCompressAt(1485)).toBe(1)
    expect(readCompressAt(2000)).toBe(1)
  })

  it("rearms the burst only well above the burst line", () => {
    expect(readRearmedAt(1390)).toBe(true)
    expect(readRearmedAt(1400)).toBe(false)
    expect(readRearmedAt(1485)).toBe(false)
  })

  it("places the burst point above the projects when it fires", () => {
    const scroll = resolveSceneScroll(
      { ...SCENE_SCROLL_REQUEST, scrolled: 1485 },
      DOT_FIELD_SCENE_TUNING
    )

    expect(scroll.burstPoint.x).toBe(720)
    expect(scroll.burstPoint.y).toBe(1485 + 270)
    expect(scroll.dustTop).toBe(1485)
  })

  it("does nothing without a viewport", () => {
    const scroll = resolveSceneScroll(
      { ...SCENE_SCROLL_REQUEST, scrolled: 5000, viewportHeight: 0 },
      DOT_FIELD_SCENE_TUNING
    )

    expect(scroll.rawCompress).toBe(0)
  })
})

const SCENE_TARGET_REQUEST = {
  rawCompress: 0,
  isRearmed: true,
  compress: 0,
  burst: 0,
  burstTarget: 0,
}

describe("resolveSceneTargets", () => {
  it("fires the burst once the knot has fully compressed", () => {
    const early = resolveSceneTargets(
      {
        ...SCENE_TARGET_REQUEST,
        rawCompress: 1,
        isRearmed: false,
        compress: 0.9,
      },
      DOT_FIELD_SCENE_TUNING
    )
    const ready = resolveSceneTargets(
      {
        ...SCENE_TARGET_REQUEST,
        rawCompress: 1,
        isRearmed: false,
        compress: 0.99,
      },
      DOT_FIELD_SCENE_TUNING
    )

    expect(early.burstTarget).toBe(0)
    expect(ready.burstTarget).toBe(1)
  })

  it("keeps the burst open inside the hysteresis band", () => {
    const targets = resolveSceneTargets(
      {
        ...SCENE_TARGET_REQUEST,
        rawCompress: 0.8,
        isRearmed: false,
        compress: 1,
        burst: 1,
        burstTarget: 1,
      },
      DOT_FIELD_SCENE_TUNING
    )

    expect(targets.burstTarget).toBe(1)
    expect(targets.compressTarget).toBe(1)
  })

  it("holds the knot shut until the dots are home", () => {
    const imploding = resolveSceneTargets(
      {
        ...SCENE_TARGET_REQUEST,
        rawCompress: 0.2,
        compress: 1,
        burst: 0.5,
        burstTarget: 1,
      },
      DOT_FIELD_SCENE_TUNING
    )
    const home = resolveSceneTargets(
      {
        ...SCENE_TARGET_REQUEST,
        rawCompress: 0.2,
        compress: 1,
        burst: 0.01,
        burstTarget: 0,
      },
      DOT_FIELD_SCENE_TUNING
    )

    expect(imploding.burstTarget).toBe(0)
    expect(imploding.compressTarget).toBe(1)
    expect(home.compressTarget).toBe(0.2)
  })

  it("bursts forward and reassembles backward without stalling", () => {
    const scene = { compress: 0, burst: 0, burstTarget: 0 }

    function runFrames(rawCompress: number, isRearmed: boolean): void {
      for (let frame = 0; frame < 600; frame += 1) {
        const targets = resolveSceneTargets(
          { rawCompress, isRearmed, ...scene },
          DOT_FIELD_SCENE_TUNING
        )

        scene.burstTarget = targets.burstTarget
        scene.compress = followMorphProgress(
          scene.compress,
          targets.compressTarget,
          1 / 60,
          DOT_FIELD_MORPH_TUNING
        )
        scene.burst = followMorphProgress(
          scene.burst,
          targets.burstTarget,
          1 / 60,
          BURST_FOLLOW_TUNING
        )
      }
    }

    runFrames(1, false)
    expect(scene.burst).toBe(1)

    runFrames(0, true)
    expect(scene.burst).toBe(0)
    expect(scene.compress).toBe(0)

    runFrames(1, false)
    expect(scene.burst).toBe(1)
  })
})

const COMPRESS_REQUEST = {
  slotCenter: { x: 720, y: 1215 },
  burstPoint: { x: 720, y: 1935 },
  halfSize: 200,
  compress: 0,
}

describe("resolveCompressedCube", () => {
  it("is the resting cube when nothing is compressed", () => {
    expect(
      resolveCompressedCube(
        COMPRESS_REQUEST,
        DOT_FIELD_SCENE_TUNING,
        DOT_FIELD_MORPH_TUNING.farLight
      )
    ).toEqual({
      center: COMPRESS_REQUEST.slotCenter,
      halfSize: 200,
      spinBoost: 1,
      farLight: DOT_FIELD_MORPH_TUNING.farLight,
    })
  })

  it("shrinks into a bright knot at the burst point", () => {
    const knot = resolveCompressedCube(
      { ...COMPRESS_REQUEST, compress: 1 },
      DOT_FIELD_SCENE_TUNING,
      DOT_FIELD_MORPH_TUNING.farLight
    )

    expect(knot.center).toEqual(COMPRESS_REQUEST.burstPoint)
    expect(knot.halfSize).toBeCloseTo(
      200 * DOT_FIELD_SCENE_TUNING.compressedScale
    )
    expect(knot.spinBoost).toBe(1 + DOT_FIELD_SCENE_TUNING.compressSpinBoost)
    expect(knot.farLight).toBe(DOT_FIELD_SCENE_TUNING.compressFarLight)
  })
})

describe("generateScenePoints", () => {
  it("is deterministic, four values per dot, all in [0, 1)", () => {
    const first = generateScenePoints(500)
    const second = generateScenePoints(500)

    expect(first.length).toBe(500 * SCENE_POINT_STRIDE)
    expect(Array.from(first)).toEqual(Array.from(second))

    for (const value of first) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it("returns nothing for no dots", () => {
    expect(generateScenePoints(0).length).toBe(0)
  })
})

describe("resolveBurstState", () => {
  it("reports off, idle and open", () => {
    expect(resolveBurstState(1, true)).toBe("off")
    expect(resolveBurstState(0, false)).toBe("idle")
    expect(resolveBurstState(1, false)).toBe("open")
  })
})

const LOOP_AT_REST = {
  isFieldAtRest: true,
  hasSettled: true,
  isMorphResting: true,
  isSceneResting: true,
  morph: 0,
  burst: 0,
}

describe("shouldLoopSleep", () => {
  it("sleeps on the resting name and on settled dust", () => {
    expect(shouldLoopSleep(LOOP_AT_REST)).toBe(true)
    expect(shouldLoopSleep({ ...LOOP_AT_REST, morph: 1, burst: 1 })).toBe(true)
  })

  it("keeps the cube spinning while it is on screen", () => {
    expect(shouldLoopSleep({ ...LOOP_AT_REST, morph: 1 })).toBe(false)
  })

  it("keeps running while anything is still moving", () => {
    expect(shouldLoopSleep({ ...LOOP_AT_REST, isSceneResting: false })).toBe(
      false
    )
    expect(shouldLoopSleep({ ...LOOP_AT_REST, isFieldAtRest: false })).toBe(
      false
    )
  })
})

const DESKTOP_FRAME = { x: 600, y: 2000, width: 768, height: 538 }

describe("resolveFrameShare", () => {
  it("gives no dots to frames when there are none", () => {
    expect(resolveFrameShare(7200, [], DOT_FIELD_SCENE_TUNING)).toBe(0)
    expect(resolveFrameShare(0, [DESKTOP_FRAME], DOT_FIELD_SCENE_TUNING)).toBe(
      0
    )
  })

  it("asks for one dot per spacing step around each frame", () => {
    const outset = DOT_FIELD_SCENE_TUNING.frameOutsetPx
    const perimeter = 2 * (768 + 538 + 4 * outset)
    const expected = perimeter / DOT_FIELD_SCENE_TUNING.frameDotSpacingPx / 7200

    expect(
      resolveFrameShare(7200, [DESKTOP_FRAME], DOT_FIELD_SCENE_TUNING)
    ).toBeCloseTo(expected)
  })

  it("never takes more than its cap", () => {
    const frames = [DESKTOP_FRAME, DESKTOP_FRAME, DESKTOP_FRAME, DESKTOP_FRAME]

    expect(resolveFrameShare(1800, frames, DOT_FIELD_SCENE_TUNING)).toBe(
      DOT_FIELD_SCENE_TUNING.maxFrameShare
    )
  })
})

const CLAIM_REQUEST = {
  frameTop: 2000,
  scrolled: 0,
  viewportHeight: 900,
  burst: 1,
}

function readClaimAt(scrolled: number, burst: number): number {
  return resolveClaimTarget(
    { ...CLAIM_REQUEST, scrolled, burst },
    DOT_FIELD_SCENE_TUNING
  )
}

describe("resolveClaimTarget", () => {
  it("draws the frame as it rises from 95% to 60% of the view", () => {
    expect(readClaimAt(2000 - 900, 1)).toBe(0)
    expect(readClaimAt(2000 - 855, 1)).toBe(0)
    expect(readClaimAt(2000 - 697.5, 1)).toBeCloseTo(0.5)
    expect(readClaimAt(2000 - 540, 1)).toBe(1)
    expect(readClaimAt(2000, 1)).toBe(1)
  })

  it("waits for the burst to carry the dots out first", () => {
    expect(readClaimAt(2000, 0.5)).toBe(0)
    expect(readClaimAt(2000, DOT_FIELD_SCENE_TUNING.claimGate)).toBe(1)
  })
})
