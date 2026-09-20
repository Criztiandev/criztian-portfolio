import { POINT_STRIDE, REFERENCE_FRAME_RATE } from "@/data/hero.data"
import type {
  DotFieldBounds,
  DotFieldIntroFrame,
  DotFieldPointCloud,
  DotFieldPointerPosition,
  DotFieldSizeRequest,
  DotFieldTuning,
  DotFieldViewport,
  HeroIntroTiming,
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

export function applyFrameLerp(
  current: number,
  target: number,
  ratePerFrame: number,
  deltaSeconds: number
): number {
  if (ratePerFrame <= 0) {
    return current
  }

  if (ratePerFrame >= 1) {
    return target
  }

  const steps = deltaSeconds * REFERENCE_FRAME_RATE
  const factor = 1 - Math.pow(1 - ratePerFrame, steps)

  return current + (target - current) * factor
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

export function resolveAutoPointer(
  elapsedSeconds: number,
  widthPx: number,
  heightPx: number,
  tuning: DotFieldTuning
): DotFieldPointerPosition {
  const offsetX = Math.sin(elapsedSeconds * tuning.autoPointerXFrequency)
  const offsetY = Math.sin(elapsedSeconds * tuning.autoPointerYFrequency)

  return {
    x: widthPx / 2 + offsetX * widthPx * tuning.autoPointerXAmplitude,
    y: heightPx / 2 + offsetY * heightPx * tuning.autoPointerYAmplitude,
  }
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
