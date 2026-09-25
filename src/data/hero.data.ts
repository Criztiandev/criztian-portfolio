import type { DotFieldTuning, HeroIntroTiming } from "@/types/hero.type"

export const RESIZE_DEBOUNCE_MS = 150

export const HEIGHT_CHANGE_IGNORE_PX = 120

export const MAX_FRAME_DELTA_SECONDS = 0.05

export const MAX_PIXEL_RATIO = 2

export const VISIBILITY_ROOT_MARGIN = "120px"

export const REFERENCE_FRAME_RATE = 60

export const POINT_STRIDE = 3

export const OFFSET_STRIDE = 2

export const POINT_ATTRIBUTE_LOCATION = 0

export const OFFSET_ATTRIBUTE_LOCATION = 1

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
  dotPitch: 3,
  dotSize: 4,
  dotEdgePixels: 1,
  dotRoundness: 1,
  alphaThreshold: 128,
  widthRatio: 0.78,
  narrowWidthRatio: 0.92,
  narrowViewportWidth: 768,
  maxHeightRatio: 0.57,
  minFontSize: 48,
  maxFontSize: 900,
  probeFontSize: 100,
  fontWeight: 700,
  maxPointCount: 250000,
  pointerRadius: 300,
  pointerPush: 2,
  springStiffness: 0.05,
  springDamping: 0.95,
  referenceInkHeight: 294,
  sleepThreshold: 0.1,
}

export const HERO_SCROLL_LABEL = "Scroll to explore"

export const SETTLED_INTRO_SECONDS = 1000

export const HERO_INTRO_TIMING: HeroIntroTiming = {
  smallScale: 0.75,
  sweepDelaySeconds: 0.25,
  sweepDurationSeconds: 0.9,
  sweepSoftnessPx: 26,
  dimAlpha: 0.14,
  growDelaySeconds: 1.05,
  growDurationSeconds: 1.25,
  liftPixels: 16,
  taglineDelayAfterSettleSeconds: 0.05,
  taglineDurationSeconds: 0.7,
  scrollCueDelayAfterSettleSeconds: 0.3,
  scrollCueDurationSeconds: 0.6,
}

export const TEXT_PADDING_PX = 8

export const DISPLAY_LETTER_SPACING = "0.050em"
