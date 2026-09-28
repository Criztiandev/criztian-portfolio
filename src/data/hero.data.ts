import type { Transition, UseScrollOptions, Variants } from "motion/react"

import type {
  CubeEdge,
  CubicBezier,
  DotFieldMorphTuning,
  DotFieldTuning,
  DotGeneratedShapeId,
  DotShapeId,
  DotShapeTuning,
  DotSphereTuning,
  HeroIntroTiming,
} from "@/types/hero.type"

export const RESIZE_DEBOUNCE_MS = 150

export const HEIGHT_CHANGE_IGNORE_PX = 120

export const MAX_FRAME_DELTA_SECONDS = 0.05

export const MAX_PIXEL_RATIO = 2

export const REFERENCE_FRAME_RATE = 60

export const POINT_STRIDE = 3

export const OFFSET_STRIDE = 2

export const SHAPE_STRIDE = 4

export const POINT_ATTRIBUTE_LOCATION = 0

export const OFFSET_ATTRIBUTE_LOCATION = 1

export const FROM_ATTRIBUTE_LOCATION = 2

export const TO_ATTRIBUTE_LOCATION = 3

export const SHAPE_POINTS = 7200

export const HIDDEN_RANK = 2

export const CUBE_SEED = 20260926

export const SPHERE_SEED = 20260928

export const DUST_SEED = 20260929

export const CUBE_EDGE_JITTER = 0.03

export const DOT_STAGE_SELECTOR = "[data-status]"

export const DOT_SCENE_SELECTOR = "[data-dot-scene]"

export const DOT_SLOT_SELECTOR = "[data-dot-slot]"

export const IN_PAGE_ANCHOR_SELECTOR = 'a[href^="#"]'

export const JUMP_CANCEL_EVENTS = [
  "wheel",
  "touchstart",
  "keydown",
  "scrollend",
]

export const MAX_CANVAS_PIXELS = 10_000_000

export const PIXEL_RATIO_STEPS = 4

export const FALLBACK_MAX_DIMENSION = 4096

export const MORPH_LANDING_TOLERANCE_PX = 1

export const OFFSCREEN_CLIP_POSITION = 2

export const DOT_SHAPE_IDS: DotShapeId[] = ["name", "cube", "sphere", "dust"]

export const GENERATED_SHAPE_IDS: DotGeneratedShapeId[] = [
  "cube",
  "sphere",
  "dust",
]

export const IDENTITY_ROTATION = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])

export const CUBE_EDGES: CubeEdge[] = [
  { start: [-1, -1, -1], end: [1, -1, -1] },
  { start: [-1, 1, -1], end: [1, 1, -1] },
  { start: [-1, -1, 1], end: [1, -1, 1] },
  { start: [-1, 1, 1], end: [1, 1, 1] },
  { start: [-1, -1, -1], end: [-1, 1, -1] },
  { start: [1, -1, -1], end: [1, 1, -1] },
  { start: [-1, -1, 1], end: [-1, 1, 1] },
  { start: [1, -1, 1], end: [1, 1, 1] },
  { start: [-1, -1, -1], end: [-1, -1, 1] },
  { start: [1, -1, -1], end: [1, -1, 1] },
  { start: [-1, 1, -1], end: [-1, 1, 1] },
  { start: [1, 1, -1], end: [1, 1, 1] },
]

export const DOT_FIELD_MORPH_TUNING: DotFieldMorphTuning = {
  morphFollowRate: 10,
  morphSettleEpsilon: 0.0001,
  morphStagger: 0.45,
  morphJitter: 0.35,
  morphArcPixels: 48,
  morphSpin: Math.PI / 2,
  cameraDistance: 5,
  wobbleSpeed: 0.9,
  stepMorphShare: 0.4,
}

export const DOT_SHAPE_TUNING: Record<DotGeneratedShapeId, DotShapeTuning> = {
  cube: {
    fit: "contain",
    sizeRatio: 0.26,
    pointsPerArea: 0.042,
    hasPerspective: true,
    spinSpeed: 0.3,
    pitch: 0.45,
    roll: -0.2,
    wobble: 0.07,
    staticYaw: 0.6,
    farLight: 0.35,
    depthRadius: Math.sqrt(3),
    dotSize: 3,
    opacity: 1,
    inkRatio: 0.65,
  },
  sphere: {
    fit: "contain",
    sizeRatio: 0.38,
    pointsPerArea: 0.042,
    hasPerspective: true,
    spinSpeed: 0.2,
    pitch: 0.35,
    roll: -0.1,
    wobble: 0.05,
    staticYaw: 0.4,
    farLight: 0.3,
    depthRadius: 1,
    dotSize: 2.5,
    opacity: 1,
    inkRatio: 0.65,
  },
  dust: {
    fit: "fill",
    sizeRatio: 1,
    pointsPerArea: 0.0012,
    hasPerspective: false,
    spinSpeed: 0,
    pitch: 0,
    roll: 0,
    wobble: 0,
    staticYaw: 0,
    farLight: 1,
    depthRadius: 1,
    dotSize: 2,
    opacity: 0.45,
    inkRatio: 0.25,
  },
}

export const DOT_SPHERE_TUNING: DotSphereTuning = {
  rings: 11,
  meridians: 12,
  jitter: 0.02,
}

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

export const HERO_COPY_FADE_SCROLL: UseScrollOptions = {
  offset: ["start start", "end start"],
}

export const HERO_COPY_FADE_PROGRESS = [0.09, 0.3]

export const HERO_COPY_FADE_OPACITY = [1, 0]

export const TEXT_PADDING_PX = 8

export const DISPLAY_LETTER_SPACING = "0.050em"

export const SIGNAL_EASE: CubicBezier = [0.65, 0, 0.35, 1]

export const INSTANT_TRANSITION: Transition = {
  duration: 0,
}

export const LIFT_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: HERO_INTRO_TIMING.liftPixels,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export const QUOTE_REVEAL_VARIANTS: Variants = {
  hidden: {
    clipPath: "inset(0% 100% 0% 0%)",
    x: -24,
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    x: 0,
  },
}

export const QUOTE_REVEAL_TRANSITION: Transition = {
  duration: 0.9,
  ease: SIGNAL_EASE,
}

export const QUOTE_AUTHOR_TRANSITION: Transition = {
  delay: 0.6,
  duration: 0.6,
  ease: "easeOut",
}

export const QUOTE_VIEWPORT = {
  once: true,
  amount: 0,
  margin: "0px 0px -20% 0px",
}
