import {
  CUBE_EDGES,
  CUBE_FACES,
  CUBE_POINT_STRIDE,
  CUBE_SEED,
  MAX_CANVAS_PIXELS,
  MAX_PIXEL_RATIO,
  OFFSET_STRIDE,
  PIXEL_RATIO_STEPS,
  POINT_STRIDE,
  REFERENCE_FRAME_RATE,
  SCENE_POINT_STRIDE,
  SCENE_SEED,
} from "@/data/hero.data"
import type {
  CubeEdge,
  CubeFace,
  CubeProjection,
  DotFieldBounds,
  DotFieldClaimRequest,
  DotFieldCompressedCube,
  DotFieldCompressRequest,
  DotFieldFollowTuning,
  DotFieldIntroFrame,
  DotFieldLoopRestRequest,
  DotFieldMorphTuning,
  DotFieldPhysicsRequest,
  DotFieldPointCloud,
  DotFieldRect,
  DotFieldSceneScroll,
  DotFieldSceneScrollRequest,
  DotFieldSceneTargetRequest,
  DotFieldSceneTargets,
  DotFieldSceneTuning,
  DotFieldSizeRequest,
  DotFieldTuning,
  DotFieldViewport,
  DotFieldWindowRequest,
  HeroBurstState,
  HeroIntroTiming,
  HeroMorphState,
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

function writeFacePoint(
  points: Float32Array,
  pointIndex: number,
  face: CubeFace,
  nextRandom: RandomSource
): void {
  for (let axis = 0; axis < 3; axis += 1) {
    if (axis === face.axis) {
      points[pointIndex + axis] = face.side
      continue
    }

    points[pointIndex + axis] = nextRandom() * 2 - 1
  }
}

export function isCubeEdgeIndex(
  index: number,
  count: number,
  edgeCount: number
): boolean {
  const before = Math.floor((index * edgeCount) / count)
  const after = Math.floor(((index + 1) * edgeCount) / count)

  return after > before
}

export function generateCubePoints(
  count: number,
  tuning: DotFieldMorphTuning
): Float32Array {
  const points = new Float32Array(Math.max(0, count) * CUBE_POINT_STRIDE)

  if (count <= 0) {
    return points
  }

  const nextRandom = createRandomSource(CUBE_SEED)
  const edgeCount = Math.min(count, tuning.cubeEdgePointLimit)

  let edgeOrdinal = 0
  let faceOrdinal = 0

  for (let index = 0; index < count; index += 1) {
    const pointIndex = index * CUBE_POINT_STRIDE

    points[pointIndex + 3] = nextRandom()

    if (isCubeEdgeIndex(index, count, edgeCount)) {
      const edge = CUBE_EDGES[edgeOrdinal % CUBE_EDGES.length]

      writeEdgePoint(
        points,
        pointIndex,
        edge,
        nextRandom,
        tuning.cubeEdgeJitter
      )
      points[pointIndex + 4] = 1
      edgeOrdinal += 1
      continue
    }

    const face = CUBE_FACES[faceOrdinal % CUBE_FACES.length]

    writeFacePoint(points, pointIndex, face, nextRandom)
    points[pointIndex + 4] = tuning.cubeFaceAlpha
    faceOrdinal += 1
  }

  return points
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

export function projectCubePoints(
  cubePoints: Float32Array,
  projection: CubeProjection,
  target: Float32Array
): void {
  const { center, halfSize, cameraDistance, rotation } = projection
  const count = cubePoints.length / CUBE_POINT_STRIDE

  for (let index = 0; index < count; index += 1) {
    const sourceIndex = index * CUBE_POINT_STRIDE
    const targetIndex = index * POINT_STRIDE
    const cubeX = cubePoints[sourceIndex]
    const cubeY = cubePoints[sourceIndex + 1]
    const cubeZ = cubePoints[sourceIndex + 2]

    const rotatedX =
      rotation[0] * cubeX + rotation[3] * cubeY + rotation[6] * cubeZ
    const rotatedY =
      rotation[1] * cubeX + rotation[4] * cubeY + rotation[7] * cubeZ
    const rotatedZ =
      rotation[2] * cubeX + rotation[5] * cubeY + rotation[8] * cubeZ
    const perspective =
      cameraDistance / Math.max(cameraDistance - rotatedZ, 0.5)

    target[targetIndex] = center.x + rotatedX * perspective * halfSize
    target[targetIndex + 1] = center.y - rotatedY * perspective * halfSize
    target[targetIndex + 2] = 0
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

export function resolveMorphState(progress: number): HeroMorphState {
  if (progress <= 0) {
    return "name"
  }

  if (progress >= 1) {
    return "cube"
  }

  return "moving"
}

export function resolveSceneScroll(
  request: DotFieldSceneScrollRequest,
  tuning: DotFieldSceneTuning
): DotFieldSceneScroll {
  const { scrolled, viewportHeight, projectsTop, stageWidth } = request

  const compressStart =
    projectsTop - tuning.compressStartViewport * viewportHeight
  const compressEnd = projectsTop - tuning.compressEndViewport * viewportHeight
  const rearmLine = compressEnd - tuning.rearmViewport * viewportHeight

  let rawCompress = 0

  if (viewportHeight > 0) {
    rawCompress = resolveStageProgress(
      scrolled,
      compressStart,
      compressEnd - compressStart
    )
  }

  return {
    rawCompress,
    isRearmed: scrolled < rearmLine,
    burstPoint: {
      x: stageWidth / 2,
      y: compressEnd + tuning.burstPointViewport * viewportHeight,
    },
    dustTop: compressEnd,
  }
}

export function resolveSceneTargets(
  request: DotFieldSceneTargetRequest,
  tuning: DotFieldSceneTuning
): DotFieldSceneTargets {
  const { rawCompress, isRearmed, compress, burst, burstTarget } = request

  let nextBurstTarget = burstTarget

  if (isRearmed) {
    nextBurstTarget = 0
  } else if (rawCompress >= 1 && compress >= tuning.burstGate) {
    nextBurstTarget = 1
  }

  let compressTarget = rawCompress

  if (nextBurstTarget === 1 || burst > tuning.burstHold) {
    compressTarget = 1
  }

  return {
    compressTarget,
    burstTarget: nextBurstTarget,
  }
}

export function resolveSpinBoost(
  compress: number,
  tuning: DotFieldSceneTuning
): number {
  return 1 + tuning.compressSpinBoost * compress
}

export function resolveCompressedCube(
  request: DotFieldCompressRequest,
  tuning: DotFieldSceneTuning,
  restingFarLight: number
): DotFieldCompressedCube {
  const { slotCenter, burstPoint, halfSize, compress } = request

  const travel = easeInOutCubic(compress)
  const scale = 1 - (1 - tuning.compressedScale) * compress

  return {
    center: {
      x: slotCenter.x + (burstPoint.x - slotCenter.x) * travel,
      y: slotCenter.y + (burstPoint.y - slotCenter.y) * travel,
    },
    halfSize: halfSize * scale,
    spinBoost: resolveSpinBoost(compress, tuning),
    farLight:
      restingFarLight + (tuning.compressFarLight - restingFarLight) * compress,
  }
}

export function resolveCanvasWindowTop(
  request: DotFieldWindowRequest,
  tuning: DotFieldSceneTuning
): number {
  const {
    scrolled,
    viewportHeight,
    canvasHeight,
    stageHeight,
    projectsTop,
    pixelRatio,
    isStatic,
  } = request

  if (isStatic || scrolled + viewportHeight <= projectsTop) {
    return 0
  }

  const slack = canvasHeight - viewportHeight
  const step = Math.max(
    1 / pixelRatio,
    Math.round(slack * tuning.windowStepRatio * pixelRatio) / pixelRatio
  )
  const highest = Math.max(0, stageHeight - canvasHeight)
  const anchored = Math.round((scrolled - slack / 2) / step) * step
  const clamped = Math.min(Math.max(anchored, 0), highest)

  return Math.round(clamped * pixelRatio) / pixelRatio
}

export function resolveFrameShare(
  visibleCount: number,
  frames: DotFieldRect[],
  tuning: DotFieldSceneTuning
): number {
  if (visibleCount <= 0 || frames.length === 0) {
    return 0
  }

  let perimeter = 0

  for (const frame of frames) {
    perimeter += 2 * (frame.width + frame.height + 4 * tuning.frameOutsetPx)
  }

  const needed = perimeter / tuning.frameDotSpacingPx

  return Math.min(tuning.maxFrameShare, needed / visibleCount)
}

export function resolveClaimTarget(
  request: DotFieldClaimRequest,
  tuning: DotFieldSceneTuning
): number {
  const { frameTop, scrolled, viewportHeight, burst } = request

  if (burst < tuning.claimGate || viewportHeight <= 0) {
    return 0
  }

  const frameTopInView = frameTop - scrolled
  const start = tuning.claimStartViewport * viewportHeight
  const span =
    (tuning.claimStartViewport - tuning.claimEndViewport) * viewportHeight

  if (span <= 0) {
    return 1
  }

  return clampProgress((start - frameTopInView) / span)
}

export function generateScenePoints(count: number): Float32Array {
  const points = new Float32Array(Math.max(0, count) * SCENE_POINT_STRIDE)
  const nextRandom = createRandomSource(SCENE_SEED)

  for (let index = 0; index < points.length; index += 1) {
    points[index] = nextRandom()
  }

  return points
}

export function resolveBurstState(
  burstTarget: number,
  isStatic: boolean
): HeroBurstState {
  if (isStatic) {
    return "off"
  }

  if (burstTarget === 1) {
    return "open"
  }

  return "idle"
}

export function shouldLoopSleep(request: DotFieldLoopRestRequest): boolean {
  const {
    isFieldAtRest,
    hasSettled,
    isMorphResting,
    isSceneResting,
    morph,
    burst,
  } = request

  if (!isFieldAtRest || !hasSettled || !isMorphResting || !isSceneResting) {
    return false
  }

  return morph === 0 || burst === 1
}
