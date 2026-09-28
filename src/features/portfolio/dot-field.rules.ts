import {
  ARC_SEGMENTS_PER_TURN,
  CUBE_EDGE_JITTER,
  CUBE_EDGES,
  CUBE_SEED,
  DOT_FIELD_MORPH_TUNING,
  DOT_SHAPE_IDS,
  DOT_SHAPE_TUNING,
  DOT_SPHERE_TUNING,
  DUST_SEED,
  HIDDEN_RANK,
  IDENTITY_ROTATION,
  LINE_ART_JITTER,
  LINE_ART_SHAPES,
  MAX_CANVAS_PIXELS,
  MAX_PIXEL_RATIO,
  MIN_ARC_SEGMENTS,
  OFFSET_STRIDE,
  PIXEL_RATIO_STEPS,
  POINT_STRIDE,
  REFERENCE_FRAME_RATE,
  RIPPLE_SEGMENTS,
  SHAPE_POINTS,
  SHAPE_STRIDE,
  SPHERE_SEED,
} from "@/data/hero.data"
import type {
  CubeEdge,
  CubeVector,
  DotFieldBounds,
  DotFieldFollowTuning,
  DotFieldIntroFrame,
  DotFieldLoopRestRequest,
  DotFieldMorphTuning,
  DotFieldPhysicsRequest,
  DotFieldPlacement,
  DotFieldPlacementRequest,
  DotFieldPointCloud,
  DotFieldRect,
  DotFieldSizeRequest,
  DotFieldTuning,
  DotFieldVector,
  DotFieldViewport,
  DotSceneKeyframe,
  DotSceneMeasure,
  DotShapeId,
  DotShapeLibrary,
  DotSphereTuning,
  DotTimelineSegment,
  HeroIntroTiming,
  LineArtArc,
  LineArtSegment,
  LineArtShape,
  LineArtStar,
  LineArtStroke,
  RandomSource,
} from "@/types/hero.type"

const MAX_PITCH_ATTEMPTS = 24

export function parsePrimaryFontFamily(fontFamily: string): string {
  const parts = fontFamily.split(",")
  const primary = parts[0]

  if (primary === undefined) {
    return ""
  }

  return primary.trim().replace(/^["']|["']$/g, "")
}

export function buildFontShorthand(
  weight: number,
  fontSize: number,
  family: string
): string {
  return `${weight} ${fontSize}px "${family}"`
}

export function clampFontSize(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (!Number.isFinite(value)) {
    return minimum
  }

  if (value < minimum) {
    return minimum
  }

  if (value > maximum) {
    return maximum
  }

  return value
}

export function resolveFontSize(request: DotFieldSizeRequest): number {
  const { measureInkWidth, targetWidth, probeSize } = request

  const probeWidth = measureInkWidth(probeSize)

  if (probeWidth <= 0) {
    return probeSize
  }

  const firstEstimate = (targetWidth / probeWidth) * probeSize
  const measuredWidth = measureInkWidth(firstEstimate)

  if (measuredWidth <= 0) {
    return firstEstimate
  }

  return firstEstimate * (targetWidth / measuredWidth)
}

export function resolvePixelRatio(reported: number, maximum: number): number {
  if (!Number.isFinite(reported) || reported <= 0) {
    return 1
  }

  if (reported > maximum) {
    return maximum
  }

  if (reported < 1) {
    return 1
  }

  return reported
}

export function resolveDotPitch(
  basePitch: number,
  pixelRatio: number,
  widthPx: number,
  heightPx: number,
  maxPointCount: number
): number {
  let pitch = Math.max(1, Math.round(basePitch * pixelRatio))

  for (let attempt = 0; attempt < MAX_PITCH_ATTEMPTS; attempt += 1) {
    const columns = Math.ceil(widthPx / pitch)
    const rows = Math.ceil(heightPx / pitch)

    if (columns * rows <= maxPointCount) {
      return pitch
    }

    pitch += 1
  }

  return pitch
}

export function samplePixelGrid(
  data: Uint8ClampedArray,
  widthPx: number,
  heightPx: number,
  pitchPx: number,
  threshold: number
): DotFieldPointCloud {
  const pitch = Math.max(1, Math.round(pitchPx))
  const collected: number[] = []

  for (let rowY = 0; rowY < heightPx; rowY += pitch) {
    for (let columnX = 0; columnX < widthPx; columnX += pitch) {
      const alphaIndex = (rowY * widthPx + columnX) * 4 + 3
      const alpha = data[alphaIndex]

      if (alpha === undefined || alpha <= threshold) {
        continue
      }

      collected.push(columnX, rowY, alpha / 255)
    }
  }

  return {
    positions: new Float32Array(collected),
    count: collected.length / POINT_STRIDE,
  }
}

export function stepDotPhysics(
  request: DotFieldPhysicsRequest,
  tuning: DotFieldTuning
): number {
  const { homes, offsets, velocities, inkHeight, pointer, deltaSeconds } =
    request

  const steps = deltaSeconds * REFERENCE_FRAME_RATE
  const scale = inkHeight / tuning.referenceInkHeight
  const radius = tuning.pointerRadius * scale
  const radiusSquared = radius * radius
  const push = tuning.pointerPush * scale * steps
  const spring = tuning.springStiffness * steps
  const damping = Math.pow(tuning.springDamping, steps)
  const count = offsets.length / OFFSET_STRIDE

  let maxMotion = 0

  for (let index = 0; index < count; index += 1) {
    const homeIndex = index * POINT_STRIDE
    const offsetIndex = index * OFFSET_STRIDE
    const offsetX = offsets[offsetIndex]
    const offsetY = offsets[offsetIndex + 1]

    let velocityX = velocities[offsetIndex] - offsetX * spring
    let velocityY = velocities[offsetIndex + 1] - offsetY * spring

    if (pointer !== null) {
      const awayX = homes[homeIndex] + offsetX - pointer.x
      const awayY = homes[homeIndex + 1] + offsetY - pointer.y
      const distanceSquared = awayX * awayX + awayY * awayY

      if (distanceSquared > 0 && distanceSquared < radiusSquared) {
        const distance = Math.sqrt(distanceSquared)
        const falloff = (radius - distance) / radius
        const strength = (falloff * push) / distance

        velocityX += awayX * strength
        velocityY += awayY * strength
      }
    }

    velocityX *= damping
    velocityY *= damping

    const nextX = offsetX + velocityX * steps
    const nextY = offsetY + velocityY * steps

    offsets[offsetIndex] = nextX
    offsets[offsetIndex + 1] = nextY
    velocities[offsetIndex] = velocityX
    velocities[offsetIndex + 1] = velocityY

    maxMotion = Math.max(
      maxMotion,
      Math.abs(nextX),
      Math.abs(nextY),
      Math.abs(velocityX),
      Math.abs(velocityY)
    )
  }

  return maxMotion
}

export function shouldRebuildPoints(
  previous: DotFieldViewport,
  next: DotFieldViewport,
  heightTolerancePx: number
): boolean {
  if (previous.width !== next.width) {
    return true
  }

  if (previous.pixelRatio !== next.pixelRatio) {
    return true
  }

  return Math.abs(previous.height - next.height) > heightTolerancePx
}

export function hexToRgbTriplet(hex: string): [number, number, number] {
  const normalized = hex.trim().replace("#", "")

  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)

  if (
    !Number.isFinite(red) ||
    !Number.isFinite(green) ||
    !Number.isFinite(blue)
  ) {
    return [1, 1, 1]
  }

  return [red / 255, green / 255, blue / 255]
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  if (value > 1) {
    return 1
  }

  return value
}

export function easeInOutCubic(progress: number): number {
  if (progress < 0.5) {
    return 4 * progress * progress * progress
  }

  return 1 - Math.pow(-2 * progress + 2, 3) / 2
}

export function resolveStageProgress(
  introSeconds: number,
  delaySeconds: number,
  durationSeconds: number
): number {
  if (durationSeconds <= 0) {
    return 1
  }

  return clampProgress((introSeconds - delaySeconds) / durationSeconds)
}

export function resolveIntroFrame(
  introSeconds: number,
  timing: HeroIntroTiming,
  bounds: DotFieldBounds,
  pixelRatio: number
): DotFieldIntroFrame {
  const sweepProgress = easeInOutCubic(
    resolveStageProgress(
      introSeconds,
      timing.sweepDelaySeconds,
      timing.sweepDurationSeconds
    )
  )
  const growProgress = easeInOutCubic(
    resolveStageProgress(
      introSeconds,
      timing.growDelaySeconds,
      timing.growDurationSeconds
    )
  )

  const softness = Math.max(timing.sweepSoftnessPx * pixelRatio, 1)
  const span = Math.max(bounds.right - bounds.left, 1)
  const travel = span + softness * 2

  return {
    scale: timing.smallScale + (1 - timing.smallScale) * growProgress,
    revealX: bounds.left - softness + sweepProgress * travel,
    softness,
    dim: timing.dimAlpha,
    isSettled:
      introSeconds >= timing.growDelaySeconds + timing.growDurationSeconds,
  }
}

export function resolveCanvasPixelRatio(
  cssWidth: number,
  cssHeight: number,
  reportedRatio: number,
  maxDimension: number
): number {
  const deviceRatio = resolvePixelRatio(reportedRatio, MAX_PIXEL_RATIO)

  if (cssWidth <= 0 || cssHeight <= 0) {
    return deviceRatio
  }

  const areaLimit = Math.sqrt(MAX_CANVAS_PIXELS / (cssWidth * cssHeight))
  const dimensionLimit = Math.min(
    maxDimension / cssWidth,
    maxDimension / cssHeight
  )
  const budgetRatio =
    Math.floor(Math.min(areaLimit, dimensionLimit) * PIXEL_RATIO_STEPS) /
    PIXEL_RATIO_STEPS

  return Math.max(1, Math.min(deviceRatio, budgetRatio))
}

export function createRandomSource(seed: number): RandomSource {
  let state = seed >>> 0

  return function nextRandom(): number {
    state = (state + 0x6d2b79f5) >>> 0

    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function resolveJitter(nextRandom: RandomSource, jitter: number): number {
  const spread = nextRandom() + nextRandom() + nextRandom() - 1.5

  return spread * jitter
}

function writeEdgePoint(
  points: Float32Array,
  pointIndex: number,
  edge: CubeEdge,
  nextRandom: RandomSource,
  jitter: number
): void {
  const along = nextRandom()

  for (let axis = 0; axis < 3; axis += 1) {
    const start = edge.start[axis]
    const end = edge.end[axis]

    points[pointIndex + axis] =
      start + (end - start) * along + resolveJitter(nextRandom, jitter)
  }
}

export function generateCubePoints(
  count: number,
  jitter: number
): Float32Array {
  const points = new Float32Array(Math.max(0, count) * SHAPE_STRIDE)
  const nextRandom = createRandomSource(CUBE_SEED)

  for (let index = 0; index < count; index += 1) {
    const pointIndex = index * SHAPE_STRIDE
    const edge = CUBE_EDGES[index % CUBE_EDGES.length]

    points[pointIndex + 3] = nextRandom()
    writeEdgePoint(points, pointIndex, edge, nextRandom, jitter)
  }

  return points
}

export function generateSpherePoints(
  count: number,
  tuning: DotSphereTuning
): Float32Array {
  const points = new Float32Array(Math.max(0, count) * SHAPE_STRIDE)
  const nextRandom = createRandomSource(SPHERE_SEED)
  const lineCount = tuning.rings + tuning.meridians

  for (let index = 0; index < count; index += 1) {
    const pointIndex = index * SHAPE_STRIDE
    const line = index % lineCount
    const around = nextRandom() * Math.PI * 2

    points[pointIndex + 3] = nextRandom()

    let latitude = around
    let longitude = (Math.PI * (line - tuning.rings)) / tuning.meridians

    if (line < tuning.rings) {
      latitude = (Math.PI * (line + 1)) / (tuning.rings + 1) - Math.PI / 2
      longitude = around
    }

    const ringRadius = Math.cos(latitude)

    points[pointIndex] =
      ringRadius * Math.cos(longitude) +
      resolveJitter(nextRandom, tuning.jitter)
    points[pointIndex + 1] =
      Math.sin(latitude) + resolveJitter(nextRandom, tuning.jitter)
    points[pointIndex + 2] =
      ringRadius * Math.sin(longitude) +
      resolveJitter(nextRandom, tuning.jitter)
  }

  return points
}

export function generateDustPoints(count: number): Float32Array {
  const points = new Float32Array(Math.max(0, count) * SHAPE_STRIDE)
  const nextRandom = createRandomSource(DUST_SEED)

  for (let index = 0; index < count; index += 1) {
    const pointIndex = index * SHAPE_STRIDE

    points[pointIndex] = nextRandom() * 2 - 1
    points[pointIndex + 1] = nextRandom() * 2 - 1
    points[pointIndex + 2] = 0
    points[pointIndex + 3] = nextRandom()
  }

  return points
}

function flattenArc(arc: LineArtArc): CubeVector[] {
  const sweep = arc.endAngle - arc.startAngle
  const turns = Math.abs(sweep) / (Math.PI * 2)
  const segmentCount = Math.max(
    MIN_ARC_SEGMENTS,
    Math.ceil(turns * ARC_SEGMENTS_PER_TURN),
    Math.ceil(turns * arc.ripples * RIPPLE_SEGMENTS)
  )
  const vertices: CubeVector[] = []

  for (let step = 0; step <= segmentCount; step += 1) {
    const angle = arc.startAngle + (sweep * step) / segmentCount
    const radius = arc.radius + arc.rippleDepth * Math.sin(arc.ripples * angle)

    vertices.push([
      arc.center[0] + radius * Math.cos(angle),
      arc.center[1] + radius * Math.sin(angle),
      arc.center[2],
    ])
  }

  return vertices
}

function flattenStar(star: LineArtStar): CubeVector[] {
  const vertices: CubeVector[] = []
  const cornerCount = star.tips * 2

  for (let step = 0; step <= cornerCount; step += 1) {
    const angle = Math.PI / 2 + (step * Math.PI) / star.tips
    let radius = star.innerRadius

    if (step % 2 === 0) {
      radius = star.outerRadius
    }

    vertices.push([
      star.center[0] + radius * Math.cos(angle),
      star.center[1] + radius * Math.sin(angle),
      star.center[2],
    ])
  }

  return vertices
}

function flattenLineArtStroke(stroke: LineArtStroke): CubeVector[] {
  if (stroke.kind === "polyline") {
    return stroke.points
  }

  if (stroke.kind === "star") {
    return flattenStar(stroke)
  }

  return flattenArc(stroke)
}

function measureDistance(start: CubeVector, end: CubeVector): number {
  return Math.hypot(end[0] - start[0], end[1] - start[1], end[2] - start[2])
}

export function buildLineArtSegments(
  strokes: LineArtStroke[]
): LineArtSegment[] {
  const segments: LineArtSegment[] = []

  for (const stroke of strokes) {
    const vertices = flattenLineArtStroke(stroke)

    for (let index = 1; index < vertices.length; index += 1) {
      const start = vertices[index - 1]
      const end = vertices[index]

      segments.push({ start, end, length: measureDistance(start, end) })
    }
  }

  return segments
}

export function generateLineArtPoints(
  shape: LineArtShape,
  count: number,
  jitter: number
): Float32Array {
  const points = new Float32Array(Math.max(0, count) * SHAPE_STRIDE)
  const segments = buildLineArtSegments(shape.strokes)
  let totalLength = 0

  for (const segment of segments) {
    totalLength += segment.length
  }

  if (count <= 0 || totalLength <= 0) {
    return points
  }

  const nextRandom = createRandomSource(shape.seed)
  let segmentIndex = 0
  let segmentOffset = 0

  for (let index = 0; index < count; index += 1) {
    const target = ((index + nextRandom()) / count) * totalLength

    while (
      segmentIndex < segments.length - 1 &&
      segmentOffset + segments[segmentIndex].length < target
    ) {
      segmentOffset += segments[segmentIndex].length
      segmentIndex += 1
    }

    const segment = segments[segmentIndex]
    let along = 0

    if (segment.length > 0) {
      along = clampProgress((target - segmentOffset) / segment.length)
    }

    const pointIndex = index * SHAPE_STRIDE

    for (let axis = 0; axis < 3; axis += 1) {
      const start = segment.start[axis]
      const end = segment.end[axis]
      const position =
        start + (end - start) * along + resolveJitter(nextRandom, jitter)

      points[pointIndex + axis] = Math.min(1, Math.max(-1, position))
    }

    points[pointIndex + 3] = nextRandom()
  }

  return points
}

export function buildShapeLibrary(): DotShapeLibrary {
  return {
    cube: generateCubePoints(SHAPE_POINTS, CUBE_EDGE_JITTER),
    sphere: generateSpherePoints(SHAPE_POINTS, DOT_SPHERE_TUNING),
    dust: generateDustPoints(SHAPE_POINTS),
    branding: generateLineArtPoints(
      LINE_ART_SHAPES.branding,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    "web-design": generateLineArtPoints(
      LINE_ART_SHAPES["web-design"],
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    development: generateLineArtPoints(
      LINE_ART_SHAPES.development,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    listening: generateLineArtPoints(
      LINE_ART_SHAPES.listening,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    planning: generateLineArtPoints(
      LINE_ART_SHAPES.planning,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    visualising: generateLineArtPoints(
      LINE_ART_SHAPES.visualising,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
    building: generateLineArtPoints(
      LINE_ART_SHAPES.building,
      SHAPE_POINTS,
      CUBE_EDGE_JITTER
    ),
    delivery: generateLineArtPoints(
      LINE_ART_SHAPES.delivery,
      SHAPE_POINTS,
      LINE_ART_JITTER
    ),
  }
}

export function resolvePointTotal(nameCount: number): number {
  return Math.max(nameCount, SHAPE_POINTS)
}

export function padNamePoints(
  positions: Float32Array,
  count: number,
  total: number
): Float32Array {
  const padded = new Float32Array(total * POINT_STRIDE)

  if (count <= 0) {
    return padded
  }

  padded.set(positions.subarray(0, count * POINT_STRIDE))

  for (let index = count; index < total; index += 1) {
    const sourceIndex = (index % count) * POINT_STRIDE
    const targetIndex = index * POINT_STRIDE

    padded[targetIndex] = positions[sourceIndex]
    padded[targetIndex + 1] = positions[sourceIndex + 1]
    padded[targetIndex + 2] = 0
  }

  return padded
}

export function padShapePoints(
  points: Float32Array,
  total: number
): Float32Array {
  const padded = new Float32Array(total * SHAPE_STRIDE)
  const count = points.length / SHAPE_STRIDE

  if (count <= 0) {
    return padded
  }

  for (let index = 0; index < total; index += 1) {
    const sourceIndex = (index % count) * SHAPE_STRIDE
    const targetIndex = index * SHAPE_STRIDE

    padded[targetIndex] = points[sourceIndex]
    padded[targetIndex + 1] = points[sourceIndex + 1]
    padded[targetIndex + 2] = points[sourceIndex + 2]
    padded[targetIndex + 3] =
      index < count ? points[sourceIndex + 3] : HIDDEN_RANK
  }

  return padded
}

export function buildCubeRotation(
  yaw: number,
  pitch: number,
  roll: number
): Float32Array {
  const yawCos = Math.cos(yaw)
  const yawSin = Math.sin(yaw)
  const pitchCos = Math.cos(pitch)
  const pitchSin = Math.sin(pitch)
  const rollCos = Math.cos(roll)
  const rollSin = Math.sin(roll)

  return new Float32Array([
    rollCos * yawCos - rollSin * pitchSin * yawSin,
    rollSin * yawCos + rollCos * pitchSin * yawSin,
    -pitchCos * yawSin,
    -rollSin * pitchCos,
    rollCos * pitchCos,
    pitchSin,
    rollCos * yawSin + rollSin * pitchSin * yawCos,
    rollSin * yawSin - rollCos * pitchSin * yawCos,
    pitchCos * yawCos,
  ])
}

export function projectShapePoints(
  points: Float32Array,
  placement: DotFieldPlacement,
  target: Float32Array
): void {
  const { center, halfSize, cameraDistance, rotation } = placement
  const count = Math.min(
    points.length / SHAPE_STRIDE,
    target.length / POINT_STRIDE
  )

  for (let index = 0; index < count; index += 1) {
    const sourceIndex = index * SHAPE_STRIDE
    const targetIndex = index * POINT_STRIDE
    const shapeX = points[sourceIndex]
    const shapeY = points[sourceIndex + 1]
    const shapeZ = points[sourceIndex + 2]

    const rotatedX =
      rotation[0] * shapeX + rotation[3] * shapeY + rotation[6] * shapeZ
    const rotatedY =
      rotation[1] * shapeX + rotation[4] * shapeY + rotation[7] * shapeZ
    const rotatedZ =
      rotation[2] * shapeX + rotation[5] * shapeY + rotation[8] * shapeZ

    let perspective = 1

    if (cameraDistance > 0) {
      perspective = cameraDistance / Math.max(cameraDistance - rotatedZ, 0.5)
    }

    target[targetIndex] = center.x + rotatedX * perspective * halfSize.x
    target[targetIndex + 1] = center.y - rotatedY * perspective * halfSize.y
    target[targetIndex + 2] = 0
  }
}

export function writeNameHomes(
  positions: Float32Array,
  placement: DotFieldPlacement,
  wordCenter: DotFieldVector,
  target: Float32Array
): void {
  const scale = placement.halfSize.x
  const count = Math.min(positions.length, target.length) / POINT_STRIDE

  for (let index = 0; index < count; index += 1) {
    const pointIndex = index * POINT_STRIDE

    target[pointIndex] =
      placement.center.x +
      wordCenter.x +
      (positions[pointIndex] - wordCenter.x) * scale
    target[pointIndex + 1] =
      placement.center.y +
      wordCenter.y +
      (positions[pointIndex + 1] - wordCenter.y) * scale
    target[pointIndex + 2] = 0
  }
}

export function followMorphProgress(
  current: number,
  target: number,
  deltaSeconds: number,
  tuning: DotFieldFollowTuning
): number {
  const gap = target - current

  if (Math.abs(gap) < tuning.morphSettleEpsilon) {
    return target
  }

  const blend = 1 - Math.exp(-tuning.morphFollowRate * deltaSeconds)

  return current + gap * blend
}

export function followTimelineProgress(
  current: number,
  target: number,
  deltaSeconds: number,
  tuning: DotFieldFollowTuning
): number {
  if (Math.abs(target - current) > 1) {
    return target
  }

  return followMorphProgress(current, target, deltaSeconds, tuning)
}

export function parseSceneShapes(value: string | undefined): DotShapeId[] {
  const shapes: DotShapeId[] = []

  if (value === undefined) {
    return shapes
  }

  for (const token of value.split(/\s+/)) {
    for (const shape of DOT_SHAPE_IDS) {
      if (shape === token) {
        shapes.push(shape)
      }
    }
  }

  return shapes
}

export function parseCssPixels(value: string): number {
  const parsed = Number.parseFloat(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return parsed
}

export function resolveViewportHeight(
  scenes: DotSceneMeasure[],
  fallback: number
): number {
  let height = 0

  for (const scene of scenes) {
    if (scene.slot !== null) {
      height = Math.max(height, scene.frameHeight + scene.stickyTop)
    }
  }

  if (height <= 0) {
    return fallback
  }

  return height
}

export function buildSceneKeyframes(
  scenes: DotSceneMeasure[],
  viewportHeight: number,
  tuning: DotFieldMorphTuning
): DotSceneKeyframe[] {
  const keyframes: DotSceneKeyframe[] = []

  for (const scene of scenes) {
    const firstShape = scene.shapes[0]

    if (firstShape === undefined) {
      continue
    }

    const start = scene.containerTop - scene.stickyTop

    let end = scene.containerBottom - viewportHeight

    if (scene.slot !== null) {
      end = scene.containerBottom - scene.frameHeight - scene.stickyTop
    }

    end = Math.max(start, end)

    if (scene.shapes.length === 1) {
      keyframes.push({
        id: scene.id,
        shape: firstShape,
        start,
        end,
        slot: scene.slot,
      })
      continue
    }

    const lastIndex = scene.shapes.length - 1
    const stepPitch = (end - start) / lastIndex
    const halfGap = (stepPitch * tuning.stepMorphShare) / 2

    let index = 0

    for (const shape of scene.shapes) {
      let stepStart = start + (index - 0.5) * stepPitch + halfGap
      let stepEnd = start + (index + 0.5) * stepPitch - halfGap

      if (index === 0) {
        stepStart = start
      }

      if (index === lastIndex) {
        stepEnd = end
      }

      keyframes.push({
        id: shape,
        shape,
        start: stepStart,
        end: stepEnd,
        slot: scene.slot,
      })
      index += 1
    }
  }

  return keyframes
}

export function resolveTimelinePosition(
  keyframes: DotSceneKeyframe[],
  scrolled: number,
  landingTolerance: number
): number {
  let index = 0

  for (const keyframe of keyframes) {
    if (scrolled > keyframe.end) {
      index += 1
      continue
    }

    const previous = keyframes[index - 1]

    if (previous === undefined || scrolled >= keyframe.start) {
      return index
    }

    const arrival = keyframe.start - landingTolerance

    if (arrival <= previous.end) {
      return index - 1
    }

    return (
      index -
      1 +
      clampProgress((scrolled - previous.end) / (arrival - previous.end))
    )
  }

  return Math.max(0, keyframes.length - 1)
}

export function resolveTimelineSegment(
  progress: number,
  keyframeCount: number
): DotTimelineSegment {
  const lastIndex = Math.max(0, keyframeCount - 1)
  const clamped = Math.min(Math.max(progress, 0), lastIndex)
  const fromIndex = Math.floor(clamped)

  if (fromIndex >= lastIndex) {
    return {
      fromIndex: lastIndex,
      toIndex: lastIndex,
      progress: 0,
    }
  }

  return {
    fromIndex,
    toIndex: fromIndex + 1,
    progress: clamped - fromIndex,
  }
}

export function resolveStaticKeyframe(
  keyframes: DotSceneKeyframe[],
  scrolled: number,
  landingTolerance: number
): number {
  let index = 0

  for (const keyframe of keyframes) {
    const isAfterStart = scrolled >= keyframe.start - landingTolerance
    const isBeforeEnd = scrolled <= keyframe.end + landingTolerance

    if (isAfterStart && isBeforeEnd) {
      return index
    }

    index += 1
  }

  return -1
}

export function resolveSceneState(
  keyframes: DotSceneKeyframe[],
  progress: number
): string {
  if (!Number.isInteger(progress)) {
    return "moving"
  }

  const keyframe = keyframes[progress]

  if (keyframe === undefined) {
    return "moving"
  }

  return keyframe.id
}

export function resolveVisibleFraction(
  pointsPerArea: number,
  area: number,
  shapePoints: number
): number {
  if (shapePoints <= 0 || area <= 0) {
    return 0
  }

  return Math.min(1, (pointsPerArea * area) / shapePoints)
}

export function isShapeSpinning(shape: DotShapeId): boolean {
  if (shape === "name") {
    return false
  }

  return DOT_SHAPE_TUNING[shape].spinSpeed > 0
}

function resolveKeyframeSlot(
  keyframe: DotSceneKeyframe,
  viewport: DotFieldViewport
): DotFieldRect {
  if (keyframe.slot !== null) {
    return keyframe.slot
  }

  return {
    x: 0,
    y: 0,
    width: viewport.width,
    height: viewport.height,
  }
}

export function resolvePlacement(
  request: DotFieldPlacementRequest
): DotFieldPlacement {
  const {
    keyframe,
    viewport,
    nameSample,
    introScale,
    spinSeconds,
    yawOffset,
    isStatic,
  } = request

  const slot = resolveKeyframeSlot(keyframe, viewport)
  const pixelRatio = viewport.pixelRatio
  const slotCenterX = (slot.x + slot.width / 2) * pixelRatio
  const slotCenterY = (slot.y + slot.height / 2) * pixelRatio

  if (keyframe.shape === "name") {
    const inkWidth = Math.max(
      nameSample.bounds.right - nameSample.bounds.left,
      1
    )
    const inkHeight = Math.max(nameSample.inkHeight, 1)
    const fit = Math.min(
      1,
      (slot.width * pixelRatio) / inkWidth,
      (slot.height * pixelRatio) / inkHeight
    )
    const scale = fit * introScale

    return {
      isName: true,
      shape: "name",
      center: {
        x: Math.round(slotCenterX - nameSample.width / 2),
        y: Math.round(slotCenterY - nameSample.height / 2),
      },
      halfSize: { x: scale, y: scale },
      rotation: IDENTITY_ROTATION,
      cameraDistance: 0,
      visible: 1,
      farLight: 1,
      depthRadius: 1,
      dotSize: 0,
      opacity: 1,
      inkHeight: nameSample.inkHeight * scale,
    }
  }

  const tuning = DOT_SHAPE_TUNING[keyframe.shape]
  const shortSide = Math.min(slot.width, slot.height)

  let halfSize = {
    x: shortSide * tuning.sizeRatio * pixelRatio,
    y: shortSide * tuning.sizeRatio * pixelRatio,
  }

  if (tuning.fit === "fill") {
    halfSize = {
      x: (slot.width / 2) * pixelRatio,
      y: (slot.height / 2) * pixelRatio,
    }
  }

  let rotation: Float32Array = IDENTITY_ROTATION
  let cameraDistance = 0

  if (tuning.hasPerspective) {
    const wobblePhase = spinSeconds * DOT_FIELD_MORPH_TUNING.wobbleSpeed

    cameraDistance = DOT_FIELD_MORPH_TUNING.cameraDistance
    rotation = buildCubeRotation(
      spinSeconds * tuning.spinSpeed + yawOffset,
      tuning.pitch + tuning.wobble * Math.sin(wobblePhase),
      tuning.roll + tuning.wobble * Math.cos(wobblePhase)
    )

    if (isStatic) {
      rotation = buildCubeRotation(tuning.staticYaw, tuning.pitch, tuning.roll)
    }
  }

  return {
    isName: false,
    shape: keyframe.shape,
    center: { x: slotCenterX, y: slotCenterY },
    halfSize,
    rotation,
    cameraDistance,
    visible: resolveVisibleFraction(
      tuning.pointsPerArea,
      slot.width * slot.height,
      SHAPE_POINTS
    ),
    farLight: tuning.farLight,
    depthRadius: tuning.depthRadius,
    dotSize: tuning.dotSize,
    opacity: tuning.opacity,
    inkHeight: shortSide * tuning.inkRatio * pixelRatio,
  }
}

export function shouldLoopSleep(request: DotFieldLoopRestRequest): boolean {
  const {
    isFieldAtRest,
    hasSettled,
    isProgressResting,
    isSpinning,
    isStriking,
  } = request

  if (!isFieldAtRest || !hasSettled || !isProgressResting) {
    return false
  }

  return !isSpinning && !isStriking
}

export function resolveArrivalStrike(
  ageSeconds: number,
  durationSeconds: number
): number {
  if (ageSeconds < 0 || ageSeconds >= durationSeconds) {
    return 0
  }

  const remaining = 1 - ageSeconds / durationSeconds

  return remaining * remaining
}

export function applyArrivalImpulse(
  homes: Float32Array,
  velocities: Float32Array,
  center: DotFieldVector,
  strength: number
): void {
  const count = velocities.length / OFFSET_STRIDE

  for (let index = 0; index < count; index += 1) {
    const homeIndex = index * POINT_STRIDE
    const velocityIndex = index * OFFSET_STRIDE
    const awayX = homes[homeIndex] - center.x
    const awayY = homes[homeIndex + 1] - center.y
    const distance = Math.hypot(awayX, awayY)

    if (distance === 0) {
      continue
    }

    velocities[velocityIndex] += (awayX / distance) * strength
    velocities[velocityIndex + 1] += (awayY / distance) * strength
  }
}
