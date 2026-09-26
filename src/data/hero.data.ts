import type { Transition, Variants } from "motion/react"

import type {
  CubeEdge,
  CubeFace,
  CubicBezier,
  DotFieldFollowTuning,
  DotFieldMorphTuning,
  DotFieldSceneTuning,
  DotFieldTuning,
  HeroIntroTiming,
} from "@/types/hero.type"

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

export const CUBE_POINT_STRIDE = 5

export const CUBE_POSITION_COMPONENTS = 3

export const CUBE_DETAIL_COMPONENTS = 2

export const CUBE_POSITION_ATTRIBUTE_LOCATION = 2

export const CUBE_DETAIL_ATTRIBUTE_LOCATION = 3

export const CUBE_SEED = 20260926

export const SCENE_POINT_STRIDE = 4

export const SCENE_ATTRIBUTE_LOCATION = 4

export const SCENE_SEED = 20260927

export const MAX_DOT_FRAMES = 6

export const DOT_FRAME_RECT_STRIDE = 4

export const DOT_FRAME_SELECTOR = "[data-dot-frame]"

export const PROJECTS_MUTATION_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  characterData: true,
  attributeFilter: ["hidden"],
}

export const MAX_CANVAS_PIXELS = 10_000_000

export const PIXEL_RATIO_STEPS = 4

export const FALLBACK_MAX_DIMENSION = 4096

export const REDUCED_MOTION_MORPH_PASSES = [0, 1]

export const MORPH_LANDING_TOLERANCE_PX = 1

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

export const CUBE_FACES: CubeFace[] = [
  { axis: 0, side: -1 },
  { axis: 0, side: 1 },
  { axis: 1, side: -1 },
  { axis: 1, side: 1 },
  { axis: 2, side: -1 },
  { axis: 2, side: 1 },
]

export const DOT_FIELD_MORPH_TUNING: DotFieldMorphTuning = {
  morphStartRatio: 0.1,
  morphFollowRate: 10,
  morphSettleEpsilon: 0.0001,
  morphStagger: 0.45,
  morphJitter: 0.35,
  morphArcPixels: 48,
  cubeHalfSizeRatio: 0.26,
  cameraDistance: 5,
  cubePitch: 0.45,
  cubeRoll: -0.2,
  cubeWobble: 0.07,
  wobbleSpeed: 0.9,
  cubeStaticYaw: 0.6,
  spinSpeed: 0.3,
  morphSpin: Math.PI / 2,
  cubeEdgePointLimit: 7200,
  cubeEdgeJitter: 0.03,
  cubeFaceAlpha: 0,
  farLight: 0.35,
  cubeDotSize: 3,
  cubeInkRatio: 0.65,
}

export const DOT_FIELD_SCENE_TUNING: DotFieldSceneTuning = {
  compressStartViewport: 0.7,
  compressEndViewport: 0.35,
  burstPointViewport: 0.3,
  compressedScale: 0.16,
  compressSpinBoost: 5,
  compressFarLight: 1,
  burstGate: 0.98,
  burstHold: 0.02,
  burstFollowRate: 4,
  rearmViewport: 0.1,
  burstStagger: 0.3,
  sparkRadiusRatio: 0.6,
  sparkFade: 0.6,
  dustShare: 0.25,
  dustOpacity: 0.45,
  dustDotSize: 2,
  frameBandViewport: 0.3,
  maxFrameShare: 0.6,
  frameDotSpacingPx: 3,
  frameOutsetPx: 10,
  frameJitterPx: 2,
  frameDotSize: 2.5,
  frameOpacity: 0.75,
  claimStartViewport: 0.95,
  claimEndViewport: 0.6,
  claimGate: 0.6,
  claimStagger: 0.5,
  windowStepRatio: 0.25,
}

export const BURST_FOLLOW_TUNING: DotFieldFollowTuning = {
  morphFollowRate: DOT_FIELD_SCENE_TUNING.burstFollowRate,
  morphSettleEpsilon: DOT_FIELD_MORPH_TUNING.morphSettleEpsilon,
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
