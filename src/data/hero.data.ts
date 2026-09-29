import type { Transition, UseScrollOptions, Variants } from "motion/react"

import type {
  CubeEdge,
  CubicBezier,
  DotFieldMorphTuning,
  DotFieldTuning,
  DotGeneratedShapeId,
  DotSceneMotion,
  DotShapeId,
  DotShapeTuning,
  DotSphereTuning,
  HeroIntroTiming,
  LineArtShape,
  LineArtShapeId,
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

export const DOT_THREAD_COMMIT_EVENT = "dotthreadcommit"

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

export const LINE_ART_SHAPE_IDS: LineArtShapeId[] = [
  "branding",
  "web-design",
  "development",
  "listening",
  "planning",
  "visualising",
  "building",
  "delivery",
]

export const DOT_SHAPE_IDS: DotShapeId[] = [
  "name",
  "cube",
  "sphere",
  "dust",
  ...LINE_ART_SHAPE_IDS,
]

export const GENERATED_SHAPE_IDS: DotGeneratedShapeId[] = [
  "cube",
  "sphere",
  "dust",
  ...LINE_ART_SHAPE_IDS,
]

export const LINE_ART_JITTER = 0.02

export const ARC_SEGMENTS_PER_TURN = 96

export const MIN_ARC_SEGMENTS = 8

export const RIPPLE_SEGMENTS = 12

const FULL_TURN = Math.PI * 2

export const LINE_ART_SHAPES: Record<LineArtShapeId, LineArtShape> = {
  branding: {
    seed: 20261001,
    strokes: [
      {
        kind: "arc",
        center: [0, 0, -0.3],
        radius: 0.88,
        startAngle: Math.PI / 2,
        endAngle: Math.PI / 2 + FULL_TURN,
        ripples: 18,
        rippleDepth: 0.06,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.68,
        startAngle: Math.PI / 2,
        endAngle: Math.PI / 2 + FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "star",
        center: [0, 0, 0.35],
        outerRadius: 0.44,
        innerRadius: 0.18,
        tips: 5,
      },
    ],
  },
  "web-design": {
    seed: 20261002,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-0.95, 0.66, -0.2],
          [0.95, 0.66, -0.2],
          [0.95, -0.66, -0.2],
          [-0.95, -0.66, -0.2],
          [-0.95, 0.66, -0.2],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.95, 0.4, -0.2],
          [0.95, 0.4, -0.2],
        ],
      },
      {
        kind: "arc",
        center: [-0.82, 0.53, 0.1],
        radius: 0.045,
        startAngle: 0,
        endAngle: FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [-0.7, 0.53, 0.1],
        radius: 0.045,
        startAngle: 0,
        endAngle: FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [-0.58, 0.53, 0.1],
        radius: 0.045,
        startAngle: 0,
        endAngle: FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "polyline",
        points: [
          [-0.4, 0.59, 0.25],
          [0.8, 0.59, 0.25],
          [0.8, 0.47, 0.25],
          [-0.4, 0.47, 0.25],
          [-0.4, 0.59, 0.25],
        ],
      },
    ],
  },
  development: {
    seed: 20261003,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-0.42, 0.62, -0.3],
          [-0.95, 0, -0.3],
          [-0.42, -0.62, -0.3],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.17, -0.8, 0.3],
          [0.17, 0.8, 0.3],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.42, 0.62, -0.3],
          [0.95, 0, -0.3],
          [0.42, -0.62, -0.3],
        ],
      },
    ],
  },
  listening: {
    seed: 20261004,
    strokes: [
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.2,
        startAngle: Math.PI / 2,
        endAngle: Math.PI / 2 + FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.46,
        startAngle: -Math.PI / 4,
        endAngle: Math.PI / 4,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.46,
        startAngle: (Math.PI * 3) / 4,
        endAngle: (Math.PI * 5) / 4,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.7,
        startAngle: -Math.PI / 4,
        endAngle: Math.PI / 4,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.7,
        startAngle: (Math.PI * 3) / 4,
        endAngle: (Math.PI * 5) / 4,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.94,
        startAngle: -Math.PI / 4,
        endAngle: Math.PI / 4,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "arc",
        center: [0, 0, 0],
        radius: 0.94,
        startAngle: (Math.PI * 3) / 4,
        endAngle: (Math.PI * 5) / 4,
        ripples: 0,
        rippleDepth: 0,
      },
    ],
  },
  planning: {
    seed: 20261005,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-0.9, 0.9, 0],
          [0.9, 0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.9, 0.45, 0],
          [0.9, 0.45, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.9, 0, 0],
          [0.9, 0, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.9, -0.45, 0],
          [0.9, -0.45, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.9, -0.9, 0],
          [0.9, -0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.9, 0.9, 0],
          [-0.9, -0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.45, 0.9, 0],
          [-0.45, -0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0, 0.9, 0],
          [0, -0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.45, 0.9, 0],
          [0.45, -0.9, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.9, 0.9, 0],
          [0.9, -0.9, 0],
        ],
      },
    ],
  },
  visualising: {
    seed: 20261006,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-0.95, 0.72, 0],
          [0.95, 0.72, 0],
          [0.95, -0.72, 0],
          [-0.95, -0.72, 0],
          [-0.95, 0.72, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.95, 0.48, 0],
          [0.95, 0.48, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.8, 0.32, 0],
          [0.05, 0.32, 0],
          [0.05, -0.56, 0],
          [-0.8, -0.56, 0],
          [-0.8, 0.32, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.8, 0.32, 0],
          [0.05, -0.56, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.05, 0.32, 0],
          [-0.8, -0.56, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.22, 0.28, 0],
          [0.8, 0.28, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.22, 0.1, 0],
          [0.8, 0.1, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.22, -0.08, 0],
          [0.58, -0.08, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.22, -0.36, 0],
          [0.6, -0.36, 0],
          [0.6, -0.56, 0],
          [0.22, -0.56, 0],
          [0.22, -0.36, 0],
        ],
      },
    ],
  },
  building: {
    seed: 20261007,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-1, -1, -1],
          [1, -1, -1],
          [1, -1, 1],
          [-1, -1, 1],
          [-1, -1, -1],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-1, 1, -1],
          [1, 1, -1],
          [1, 1, 1],
          [-1, 1, 1],
          [-1, 1, -1],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-1, -1, -1],
          [-1, 1, -1],
        ],
      },
      {
        kind: "polyline",
        points: [
          [1, -1, -1],
          [1, 1, -1],
        ],
      },
      {
        kind: "polyline",
        points: [
          [1, -1, 1],
          [1, 1, 1],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-1, -1, 1],
          [-1, 1, 1],
        ],
      },
    ],
  },
  delivery: {
    seed: 20261008,
    strokes: [
      {
        kind: "polyline",
        points: [
          [-0.24, -0.45, 0],
          [-0.24, 0.35, 0],
          [-0.2, 0.58, 0],
          [-0.11, 0.8, 0],
          [0, 0.95, 0],
          [0.11, 0.8, 0],
          [0.2, 0.58, 0],
          [0.24, 0.35, 0],
          [0.24, -0.45, 0],
          [-0.24, -0.45, 0],
        ],
      },
      {
        kind: "arc",
        center: [0, 0.22, 0],
        radius: 0.1,
        startAngle: Math.PI / 2,
        endAngle: Math.PI / 2 + FULL_TURN,
        ripples: 0,
        rippleDepth: 0,
      },
      {
        kind: "polyline",
        points: [
          [-0.24, -0.05, 0],
          [-0.52, -0.42, 0],
          [-0.52, -0.6, 0],
          [-0.24, -0.45, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [0.24, -0.05, 0],
          [0.52, -0.42, 0],
          [0.52, -0.6, 0],
          [0.24, -0.45, 0],
        ],
      },
      {
        kind: "polyline",
        points: [
          [-0.14, -0.55, 0],
          [-0.07, -0.78, 0],
          [0, -0.63, 0],
          [0.07, -0.94, 0],
          [0.14, -0.55, 0],
        ],
      },
    ],
  },
}

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
  penJitter: 0.12,
  burstPixels: 34,
  burstScalePixels: 240,
  swell: 0.35,
  strikeSize: 0.5,
  strikeSeconds: 0.3,
  strikeMinIntervalSeconds: 0.5,
  strikeImpulse: 1.6,
  swaySpeed: 0.45,
  threadStagger: 0.97,
  threadJitter: 0.015,
  threadArcPixels: 90,
  threadBurst: 0.12,
  threadSpin: 0.2,
  threadTrigger: 0.12,
  threadDrawSeconds: 1.6,
  threadArriveSeconds: 0.9,
}

export const DOT_SCENE_MOTION: Record<string, DotSceneMotion> = {
  services: { share: 0.72, isThread: true },
}

const FLAT_LINE_ART_TUNING: DotShapeTuning = {
  fit: "contain",
  sizeRatio: 0.4,
  pointsPerArea: 0.042,
  hasPerspective: false,
  spinSpeed: 0,
  pitch: 0,
  roll: 0,
  wobble: 0,
  staticYaw: 0,
  sway: 0,
  farLight: 1,
  depthRadius: 1,
  dotSize: 2.5,
  opacity: 1,
  inkRatio: 0.65,
}

const THREAD_LINE_ART_TUNING: DotShapeTuning = {
  fit: "contain",
  sizeRatio: 0.42,
  pointsPerArea: 0.05,
  hasPerspective: true,
  spinSpeed: 0,
  pitch: 0.22,
  roll: -0.05,
  wobble: 0.04,
  staticYaw: -0.25,
  sway: 0.32,
  farLight: 0.45,
  depthRadius: 1.2,
  dotSize: 2.5,
  opacity: 1,
  inkRatio: 0.65,
}

export const DOT_SHAPE_TUNING: Record<DotGeneratedShapeId, DotShapeTuning> = {
  branding: THREAD_LINE_ART_TUNING,
  "web-design": THREAD_LINE_ART_TUNING,
  development: THREAD_LINE_ART_TUNING,
  listening: FLAT_LINE_ART_TUNING,
  planning: FLAT_LINE_ART_TUNING,
  visualising: FLAT_LINE_ART_TUNING,
  delivery: FLAT_LINE_ART_TUNING,
  building: {
    fit: "contain",
    sizeRatio: 0.26,
    pointsPerArea: 0.042,
    hasPerspective: true,
    spinSpeed: 0.3,
    pitch: 0.45,
    roll: -0.2,
    wobble: 0.07,
    staticYaw: 0.6,
    sway: 0,
    farLight: 0.35,
    depthRadius: Math.sqrt(3),
    dotSize: 3,
    opacity: 1,
    inkRatio: 0.65,
  },
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
    sway: 0,
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
    sway: 0,
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
    sway: 0,
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
