import type { DotFieldTuning } from "@/types/hero.type"

export const RESIZE_DEBOUNCE_MS = 150

export const HEIGHT_CHANGE_IGNORE_PX = 120

export const MAX_FRAME_DELTA_SECONDS = 0.05

export const MAX_PIXEL_RATIO = 2

export const VISIBILITY_ROOT_MARGIN = "120px"

export const REFERENCE_FRAME_RATE = 60

export const POINT_STRIDE = 3

export const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: "high-performance",
}

export const DOT_FIELD_TUNING: DotFieldTuning = {
  dotPitch: 6,
  dotSize: 6.3,
  dotEdgePixels: 1,
  dotRoundness: 1,
  alphaThreshold: 40,
  widthRatio: 0.78,
  maxHeightRatio: 0.85,
  minFontSize: 48,
  maxFontSize: 900,
  probeFontSize: 100,
  fontWeight: 700,
  maxPointCount: 250000,
  vortexRadius: 190,
  vortexSwirl: 1.35,
  vortexPush: 22,
  vortexFade: 0.12,
  vortexShrink: 0.1,
  waveAmplitude: 0,
  waveSecondaryAmplitude: 0,
  waveFrequency: 0.0042,
  waveSecondaryFrequency: 0.011,
  waveSpeed: 0.55,
  waveSecondarySpeed: -0.31,
  pointerLerp: 0.14,
  influenceEnterLerp: 0.09,
  influenceLeaveLerp: 0.06,
  autoPointerXFrequency: 0.27,
  autoPointerYFrequency: 0.41,
  autoPointerXAmplitude: 0.3,
  autoPointerYAmplitude: 0.18,
  autoPointerInfluence: 0.7,
}

export const TEXT_PADDING_PX = 8

export const DISPLAY_LETTER_SPACING = "0.050em"
