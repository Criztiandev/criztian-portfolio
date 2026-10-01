import type { Transition, UseScrollOptions, Variants } from "motion/react"

import type {
  CubeEdge,
  CubicBezier,
  DotFieldMorphTuning,
  DotFieldTextSample,
  DotFieldTuning,
  DotFrameOutset,
  DotGeneratedShapeId,
  DotSceneMotion,
  DotShapeId,
  DotShapeTuning,
  GatherShape,
  HeroIntroTiming,
  LaunchShape,
  LineArtShape,
  LineArtShapeId,
  LineArtStroke,
  ScatterRingShape,
  ScatterShapeId,
  TextShapeId,
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

export const SHAPE_POINTS = 12000

export const CUBE_POINTS = 7200

export const HIDDEN_RANK = 2

export const CUBE_SEED = 20260926

export const DUST_SEED = 20260929

export const CUBE_EDGE_JITTER = 0.03

export const DOT_STAGE_SELECTOR = "[data-status]"

export const DOT_SCENE_SELECTOR = "[data-dot-scene]"

export const DOT_SLOT_SELECTOR = "[data-dot-slot]"

export const IN_PAGE_ANCHOR_SELECTOR = 'a[href^="#"]'

export const THREAD_REVEAL_PROPERTY_PREFIX = "--reveal-"

export const THREAD_REVEAL_DECIMALS = 3

export const THREAD_TURN_PROPERTY = "--thread-turn"

export const SCENE_REVEAL_PROPERTY = "--scene-reveal"

export const SCENE_STEP_ID_SEPARATOR = "-"

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

export const GROWN_FRAME_TOLERANCE_PX = 1

export const OFFSCREEN_CLIP_POSITION = 2

export const LINE_ART_SHAPE_IDS: LineArtShapeId[] = [
  "branding",
  "web-design",
  "development",
  "planning",
  "visualising",
  "building",
  "frame",
  "handshake",
  "conversation",
]

export const SCATTER_SHAPE_IDS: ScatterShapeId[] = [
  "listening",
  "delivery",
  "gather",
]

export const TEXT_SHAPE_IDS: TextShapeId[] = ["sign"]

export const FOOTER_SIGN_TEXT = "Let's build"

export const TEXT_SHAPE_SEED = 20261014

export const TEXT_SHAPE_SHRINK = 0.97

export const TEXT_SHAPE_MAX_SAMPLES = 4

export const PLACEHOLDER_TEXT_SAMPLE: DotFieldTextSample = {
  width: 1,
  height: 1,
}

export const DOT_SHAPE_IDS: DotShapeId[] = [
  "name",
  "cube",
  "dust",
  ...LINE_ART_SHAPE_IDS,
  ...SCATTER_SHAPE_IDS,
  ...TEXT_SHAPE_IDS,
]

export const GENERATED_SHAPE_IDS: DotGeneratedShapeId[] = [
  "cube",
  "dust",
  ...LINE_ART_SHAPE_IDS,
  ...SCATTER_SHAPE_IDS,
  ...TEXT_SHAPE_IDS,
]

export const LINE_ART_JITTER = 0.015

export const CODE_JITTER = 0.011

export const FRAME_JITTER = 0.006

export const FRAME_EDGE = 0.98

export const JITTER_SPAN = 3

export const GATHER_SIDES = 4

export const ARC_SEGMENTS_PER_TURN = 96

export const MIN_ARC_SEGMENTS = 8

const FULL_TURN = Math.PI * 2

const PEN_START_ANGLE = Math.PI / 2

const PAGE_OUTLINE_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-0.9, 0.6, 0],
    [0.9, 0.6, 0],
    [0.9, -0.6, 0],
    [-0.9, -0.6, 0],
    [-0.9, 0.6, 0],
  ],
}

const PAGE_HEADER_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.9, 0.42, 0],
      [0.9, 0.42, 0],
    ],
  },
]

const PAGE_MARK_STROKES: LineArtStroke[] = [
  {
    kind: "arc",
    center: [-0.79, 0.51, 0],
    radius: 0.045,
    startAngle: PEN_START_ANGLE,
    endAngle: PEN_START_ANGLE - FULL_TURN,
  },
  {
    kind: "polyline",
    points: [
      [-0.75, 0.545, 0],
      [-0.68, 0.545, 0],
      [-0.68, 0.475, 0],
      [-0.75, 0.475, 0],
      [-0.75, 0.545, 0],
    ],
  },
]

const PAGE_NAV_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [0.42, 0.51, 0],
      [0.5, 0.51, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.56, 0.51, 0],
      [0.64, 0.51, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.7, 0.51, 0],
      [0.8, 0.51, 0],
    ],
  },
]

const PAGE_BLOCK_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.78, 0.3, 0],
      [0.28, 0.3, 0],
      [0.28, -0.1, 0],
      [-0.78, -0.1, 0],
      [-0.78, 0.3, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.38, 0.3, 0],
      [0.78, 0.3, 0],
      [0.78, -0.1, 0],
      [0.38, -0.1, 0],
      [0.38, 0.3, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.78, -0.2, 0],
      [-0.32, -0.2, 0],
      [-0.32, -0.5, 0],
      [-0.78, -0.5, 0],
      [-0.78, -0.2, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.23, -0.2, 0],
      [0.23, -0.2, 0],
      [0.23, -0.5, 0],
      [-0.23, -0.5, 0],
      [-0.23, -0.2, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.32, -0.2, 0],
      [0.78, -0.2, 0],
      [0.78, -0.5, 0],
      [0.32, -0.5, 0],
      [0.32, -0.2, 0],
    ],
  },
]

const PAGE_GRID_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.9, 0.2, 0],
      [0.9, 0.2, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.9, -0.2, 0],
      [0.9, -0.2, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.45, 0.6, 0],
      [-0.45, -0.6, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0, 0.6, 0],
      [0, -0.6, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.45, 0.6, 0],
      [0.45, -0.6, 0],
    ],
  },
]

const PAGE_CONTENT_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.7, 0.24, 0],
      [0.05, 0.24, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, 0.18, 0],
      [0.05, 0.18, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, 0.12, 0],
      [0.05, 0.12, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, 0.06, 0],
      [0.05, 0.06, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, 0, 0],
      [0.05, 0, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.43, 0.25, 0],
      [0.73, -0.05, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.73, 0.25, 0],
      [0.43, -0.05, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, -0.29, 0],
      [-0.4, -0.29, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7, -0.37, 0],
      [-0.49, -0.37, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.15, -0.29, 0],
      [0.15, -0.29, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.15, -0.37, 0],
      [0.06, -0.37, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.4, -0.29, 0],
      [0.7, -0.29, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.4, -0.37, 0],
      [0.61, -0.37, 0],
    ],
  },
]

const CODE_PANEL_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.55, 0.45, 0],
      [0.55, 0.45, 0],
      [0.55, -0.45, 0],
      [-0.55, -0.45, 0],
      [-0.55, 0.45, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.55, 0.33, 0],
      [0.55, 0.33, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.45, 0.22, 0],
      [-0.33, 0.22, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.38, 0.156, 0],
      [-0.22, 0.156, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.17, 0.156, 0],
      [0.03, 0.156, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.31, 0.092, 0],
      [-0.15, 0.092, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.31, 0.028, 0],
      [-0.15, 0.028, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.38, -0.036, 0],
      [-0.2, -0.036, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.31, -0.1, 0],
      [-0.15, -0.1, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.1, -0.1, 0],
      [0.02, -0.1, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.24, -0.164, 0],
      [-0.12, -0.164, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.07, -0.164, 0],
      [0.07, -0.164, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.24, -0.228, 0],
      [-0.12, -0.228, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.07, -0.228, 0],
      [0.15, -0.228, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.31, -0.292, 0],
      [-0.17, -0.292, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.12, -0.292, 0],
      [-0.04, -0.292, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [0.01, -0.292, 0],
      [0.21, -0.292, 0],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.45, -0.356, 0],
      [-0.35, -0.356, 0],
    ],
  },
]

const PAGE_WITH_MARK_STROKES: LineArtStroke[] = [
  PAGE_OUTLINE_STROKE,
  ...PAGE_HEADER_STROKES,
  ...PAGE_MARK_STROKES,
  ...PAGE_NAV_STROKES,
  ...PAGE_BLOCK_STROKES,
]

const BUILT_PAGE_STROKES: LineArtStroke[] = [
  ...PAGE_WITH_MARK_STROKES,
  ...PAGE_CONTENT_STROKES,
]

const BACK_ARM_SLEEVE_TOP_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-1, 0.5152, -0.08],
    [-0.5455, 0.5152, -0.08],
  ],
}

const FRONT_HAND_SLEEVE_TOP_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [1, 0.5152, 0.08],
    [0.5455, 0.5152, 0.08],
  ],
}

const BACK_ARM_SLEEVE_BOTTOM_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-1, -0.1515, -0.08],
    [-0.6061, -0.1515, -0.08],
  ],
}

const FRONT_HAND_SLEEVE_BOTTOM_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [1, -0.1515, 0.08],
    [0.6061, -0.1515, 0.08],
  ],
}

const BACK_ARM_CUFF_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-0.5455, 0.5152, -0.08],
    [-0.6061, -0.1515, -0.08],
  ],
}

const FRONT_HAND_CUFF_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [0.5455, 0.5152, 0.08],
    [0.6061, -0.1515, 0.08],
    [0.4848, -0.1515, 0.08],
  ],
}

const BACK_ARM_CUFF_SEAM_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-0.6182, 0.5273, -0.08],
    [-0.6788, -0.1636, -0.08],
  ],
}

const FRONT_HAND_CUFF_SEAM_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [0.6182, 0.5273, 0.08],
    [0.6788, -0.1636, 0.08],
  ],
}

const BACK_ARM_PALM_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.6061, -0.1515, -0.08],
      [-0.2121, -0.5455, -0.08],
    ],
  },
  {
    kind: "arc",
    center: [-0.1212, -0.4545, -0.08],
    radius: 0.1286,
    startAngle: -2.3562,
    endAngle: 0.7854,
  },
]

const FRONT_HAND_GRIP_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [0.5455, 0.4545, 0.08],
      [0.44, 0.4333, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [0.4166, 0.5523, 0.08],
    radius: 0.1212,
    startAngle: -1.3763,
    endAngle: -2.1138,
  },
  {
    kind: "polyline",
    points: [
      [0.3539, 0.4485, 0.08],
      [0.3255, 0.4655, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [0.1454, 0.1643, 0.08],
    radius: 0.3509,
    startAngle: 1.0319,
    endAngle: 2.3549,
  },
  {
    kind: "polyline",
    points: [
      [-0.1024, 0.4127, 0.08],
      [-0.2727, 0.2424, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [-0.1818, 0.1515, 0.08],
    radius: 0.1286,
    startAngle: -3.927,
    endAngle: -0.7854,
  },
  {
    kind: "polyline",
    points: [
      [-0.0909, 0.0606, 0.08],
      [-0.0376, 0.1139, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [0.0909, -0.0147, 0.08],
    radius: 0.1818,
    startAngle: 2.3556,
    endAngle: 0.786,
  },
  {
    kind: "polyline",
    points: [
      [0.2194, 0.1139, 0.08],
      [0.4545, -0.1212, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [0.3636, -0.2121, 0.08],
    radius: 0.1286,
    startAngle: 0.7854,
    endAngle: -2.3562,
  },
  {
    kind: "polyline",
    points: [
      [0.2727, -0.303, 0.08],
      [0.1212, -0.1515, 0.08],
    ],
  },
]

const BACK_ARM_HAND_TOP_STROKE: LineArtStroke = {
  kind: "polyline",
  points: [
    [-0.5455, 0.4545, -0.08],
    [-0.0606, 0.4545, -0.08],
  ],
}

const FRONT_HAND_FINGER_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.0606, -0.3333, 0.08],
      [0.0606, -0.4545, 0.08],
    ],
  },
  {
    kind: "arc",
    center: [0.1515, -0.3636, 0.08],
    radius: 0.1286,
    startAngle: -2.3562,
    endAngle: 0.7854,
  },
]

const QUESTION_BUBBLE_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.2679, 0.0089, -0.1],
      [-0.5, 0.0089, -0.1],
      [-0.75, -0.1875, -0.1],
      [-0.6786, 0.0089, -0.1],
      [-0.75, 0.0089, -0.1],
    ],
  },
  {
    kind: "arc",
    center: [-0.75, 0.1518, -0.1],
    radius: 0.1429,
    startAngle: -1.5708,
    endAngle: -3.1416,
  },
  {
    kind: "polyline",
    points: [
      [-0.8929, 0.1518, -0.1],
      [-0.8929, 0.5804, -0.1],
    ],
  },
  {
    kind: "arc",
    center: [-0.75, 0.5804, -0.1],
    radius: 0.1429,
    startAngle: -3.1416,
    endAngle: -4.7124,
  },
  {
    kind: "polyline",
    points: [
      [-0.75, 0.7232, -0.1],
      [0.125, 0.7232, -0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.125, 0.5804, -0.1],
    radius: 0.1429,
    startAngle: 1.5708,
    endAngle: 0,
  },
  {
    kind: "polyline",
    points: [
      [0.2679, 0.5804, -0.1],
      [0.2679, 0.1339, -0.1],
    ],
  },
]

const QUESTION_LINE_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.7143, 0.4554, -0.1],
      [0.0714, 0.4554, -0.1],
    ],
  },
  {
    kind: "polyline",
    points: [
      [-0.7143, 0.2768, -0.1],
      [-0.1429, 0.2768, -0.1],
    ],
  },
]

const ANSWER_BUBBLE_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [-0.125, 0.1339, 0.1],
      [0.75, 0.1339, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.75, -0.0089, 0.1],
    radius: 0.1429,
    startAngle: 1.5708,
    endAngle: 0,
  },
  {
    kind: "polyline",
    points: [
      [0.8929, -0.0089, 0.1],
      [0.8929, -0.3839, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.75, -0.3839, 0.1],
    radius: 0.1429,
    startAngle: 0,
    endAngle: -1.5708,
  },
  {
    kind: "polyline",
    points: [
      [0.75, -0.5268, 0.1],
      [0.6786, -0.5268, 0.1],
      [0.75, -0.7232, 0.1],
      [0.5, -0.5268, 0.1],
      [-0.125, -0.5268, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [-0.125, -0.3839, 0.1],
    radius: 0.1429,
    startAngle: -1.5708,
    endAngle: -3.1416,
  },
  {
    kind: "polyline",
    points: [
      [-0.2679, -0.3839, 0.1],
      [-0.2679, -0.0089, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [-0.125, -0.0089, 0.1],
    radius: 0.1429,
    startAngle: -3.1416,
    endAngle: -4.7124,
  },
]

const ANSWER_DOT_STROKES: LineArtStroke[] = [
  {
    kind: "polyline",
    points: [
      [0.0893, -0.1964, 0.1],
      [0.0536, -0.1964, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.0893, -0.1964, 0.1],
    radius: 0.0357,
    startAngle: -3.1416,
    endAngle: 3.1416,
  },
  {
    kind: "polyline",
    points: [
      [0.3125, -0.1964, 0.1],
      [0.2768, -0.1964, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.3125, -0.1964, 0.1],
    radius: 0.0357,
    startAngle: -3.1416,
    endAngle: 3.1416,
  },
  {
    kind: "polyline",
    points: [
      [0.5357, -0.1964, 0.1],
      [0.5, -0.1964, 0.1],
    ],
  },
  {
    kind: "arc",
    center: [0.5357, -0.1964, 0.1],
    radius: 0.0357,
    startAngle: -3.1416,
    endAngle: 3.1416,
  },
]

const HANDSHAKE_STROKES: LineArtStroke[] = [
  BACK_ARM_SLEEVE_TOP_STROKE,
  FRONT_HAND_SLEEVE_TOP_STROKE,
  BACK_ARM_SLEEVE_BOTTOM_STROKE,
  FRONT_HAND_SLEEVE_BOTTOM_STROKE,
  BACK_ARM_CUFF_STROKE,
  FRONT_HAND_CUFF_STROKE,
  BACK_ARM_CUFF_SEAM_STROKE,
  FRONT_HAND_CUFF_SEAM_STROKE,
  ...BACK_ARM_PALM_STROKES,
  ...FRONT_HAND_GRIP_STROKES,
  BACK_ARM_HAND_TOP_STROKE,
  ...FRONT_HAND_FINGER_STROKES,
]

const CONVERSATION_STROKES: LineArtStroke[] = [
  ...QUESTION_BUBBLE_STROKES,
  ...QUESTION_LINE_STROKES,
  ...ANSWER_BUBBLE_STROKES,
  ...ANSWER_DOT_STROKES,
]

export const LINE_ART_SHAPES: Record<LineArtShapeId, LineArtShape> = {
  branding: {
    seed: 20261001,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: [
          {
            kind: "arc",
            center: [-0.16, 0.12, 0.1],
            radius: 0.56,
            startAngle: PEN_START_ANGLE,
            endAngle: PEN_START_ANGLE - FULL_TURN,
          },
          {
            kind: "polyline",
            points: [
              [-0.2, 0.24, -0.3],
              [0.72, 0.24, -0.3],
              [0.72, -0.68, -0.3],
              [-0.2, -0.68, -0.3],
              [-0.2, 0.24, -0.3],
            ],
          },
        ],
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  "web-design": {
    seed: 20261002,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: PAGE_WITH_MARK_STROKES,
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  development: {
    seed: 20261003,
    jitter: CODE_JITTER,
    layers: [
      {
        strokes: PAGE_WITH_MARK_STROKES,
        offset: [-0.186, 0.119, -0.35],
        scale: 0.79,
      },
      {
        strokes: CODE_PANEL_STROKES,
        offset: [0.462, -0.237, 0.35],
        scale: 0.79,
      },
    ],
  },
  planning: {
    seed: 20261005,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: [PAGE_OUTLINE_STROKE, ...PAGE_GRID_STROKES],
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  visualising: {
    seed: 20261006,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: [
          PAGE_OUTLINE_STROKE,
          ...PAGE_HEADER_STROKES,
          ...PAGE_NAV_STROKES,
          ...PAGE_BLOCK_STROKES,
        ],
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  building: {
    seed: 20261007,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: BUILT_PAGE_STROKES,
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  frame: {
    seed: 20261011,
    jitter: FRAME_JITTER,
    layers: [
      {
        strokes: [
          {
            kind: "polyline",
            points: [
              [-FRAME_EDGE, FRAME_EDGE, 0],
              [FRAME_EDGE, FRAME_EDGE, 0],
              [FRAME_EDGE, -FRAME_EDGE, 0],
              [-FRAME_EDGE, -FRAME_EDGE, 0],
              [-FRAME_EDGE, FRAME_EDGE, 0],
            ],
          },
        ],
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  handshake: {
    seed: 20261012,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: HANDSHAKE_STROKES,
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
  conversation: {
    seed: 20261013,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: CONVERSATION_STROKES,
        offset: [0, 0, 0],
        scale: 1,
      },
    ],
  },
}

export const LISTENING_SHAPE: ScatterRingShape = {
  seed: 20261004,
  ringShare: 0.62,
  radiusX: 0.625,
  radiusY: 0.45,
  ringJitter: 0.06,
  scatterReach: 1.45,
  startAngle: PEN_START_ANGLE,
}

export const DELIVERY_SHAPE: LaunchShape = {
  seed: 20261008,
  page: {
    seed: 20261009,
    jitter: LINE_ART_JITTER,
    layers: [
      {
        strokes: BUILT_PAGE_STROKES,
        offset: [0, 0.17, 0],
        scale: 0.62,
      },
    ],
  },
  pageShare: 0.78,
  trailX: 0,
  trailTop: -0.15,
  trailBottom: -0.54,
  topWidth: 0.04,
  bottomWidth: 0.36,
  trailFalloff: 1.8,
}

export const GATHER_SHAPE: GatherShape = {
  seed: 20261010,
  perimeter: 0.84,
  lineShare: 0.4,
  lineJitter: 0.008,
  spreadFalloff: 2,
}

export const DOT_FRAME_OUTSET: DotFrameOutset = {
  maxPixels: 18,
  slotRatio: 0.05,
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
  threadHurrySeconds: 0.15,
  threadCaptionSpan: 0.5,
  sceneRevealSpan: 0.5,
  redrawEdge: 0.02,
}

export const DOT_SCENE_MOTION: Record<string, DotSceneMotion> = {
  project: {
    share: 0.72,
    isThread: true,
    hasTurn: false,
    isReadAfterPin: false,
  },
  services: {
    share: 0.72,
    isThread: true,
    hasTurn: false,
    isReadAfterPin: false,
  },
  process: { share: 0.4, isThread: true, hasTurn: true, isReadAfterPin: false },
  faq: { share: 0, isThread: false, hasTurn: false, isReadAfterPin: true },
}

const THREAD_LINE_ART_TUNING: DotShapeTuning = {
  fit: "contain",
  sizeRatio: 0.47,
  pointsPerArea: 0.05,
  pointCount: SHAPE_POINTS,
  hasPerspective: true,
  spinSpeed: 0,
  pitch: 0.2,
  roll: 0.05,
  wobble: 0.04,
  staticYaw: 0.3,
  sway: 0.32,
  farLight: 0.55,
  depthRadius: 0.45,
  dotSize: 2.5,
  opacity: 1,
  inkRatio: 0.65,
}

const PROCESS_LINE_ART_TUNING: DotShapeTuning = {
  fit: "contain",
  sizeRatio: 0.58,
  pointsPerArea: 0.05,
  pointCount: SHAPE_POINTS,
  hasPerspective: true,
  spinSpeed: 0,
  pitch: 0.2,
  roll: 0.05,
  wobble: 0,
  staticYaw: 0.3,
  sway: 0,
  farLight: 0.55,
  depthRadius: 0.4,
  dotSize: 2.5,
  opacity: 1,
  inkRatio: 0.65,
}

const MEETING_LINE_ART_TUNING: DotShapeTuning = {
  ...PROCESS_LINE_ART_TUNING,
  sizeRatio: 0.5,
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

const PLATE_FRAME_TUNING: DotShapeTuning = {
  fit: "fill",
  sizeRatio: 1 / FRAME_EDGE,
  pointsPerArea: 0.016,
  pointCount: SHAPE_POINTS,
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

export const DOT_SHAPE_TUNING: Record<DotGeneratedShapeId, DotShapeTuning> = {
  branding: THREAD_LINE_ART_TUNING,
  "web-design": THREAD_LINE_ART_TUNING,
  development: THREAD_LINE_ART_TUNING,
  listening: {
    ...PROCESS_LINE_ART_TUNING,
    dotSize: 2,
    opacity: 0.7,
  },
  planning: PROCESS_LINE_ART_TUNING,
  visualising: PROCESS_LINE_ART_TUNING,
  building: PROCESS_LINE_ART_TUNING,
  delivery: PROCESS_LINE_ART_TUNING,
  frame: PLATE_FRAME_TUNING,
  gather: {
    ...PLATE_FRAME_TUNING,
    sizeRatio: 1 / GATHER_SHAPE.perimeter,
    pointsPerArea: 0.012,
    dotSize: 2,
  },
  handshake: MEETING_LINE_ART_TUNING,
  conversation: MEETING_LINE_ART_TUNING,
  sign: {
    fit: "text",
    sizeRatio: 1,
    pointsPerArea: 0,
    pointCount: SHAPE_POINTS,
    hasPerspective: false,
    spinSpeed: 0,
    pitch: 0,
    roll: 0,
    wobble: 0,
    staticYaw: 0,
    sway: 0,
    farLight: 1,
    depthRadius: 1,
    dotSize: DOT_FIELD_TUNING.dotSize,
    opacity: 1,
    inkRatio: 1,
  },
  cube: {
    fit: "contain",
    sizeRatio: 0.26,
    pointsPerArea: 0.042,
    pointCount: CUBE_POINTS,
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
  dust: {
    fit: "fill",
    sizeRatio: 1,
    pointsPerArea: 0.0012,
    pointCount: SHAPE_POINTS,
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
    opacity: 0,
    inkRatio: 0.25,
  },
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

export const HERO_WORDMARK_TEXT_CLASS =
  "block text-center font-bold uppercase text-[min(25vw,40svh)] md:text-[clamp(3rem,18vw,16rem)]"

export const HERO_WORDMARK_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    scale: HERO_INTRO_TIMING.smallScale,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export const HERO_WORDMARK_TRANSITION: Transition = {
  opacity: {
    duration: HERO_INTRO_TIMING.sweepDelaySeconds,
    ease: "easeOut",
  },
  scale: {
    delay: HERO_INTRO_TIMING.growDelaySeconds,
    duration: HERO_INTRO_TIMING.growDurationSeconds,
    ease: SIGNAL_EASE,
  },
}

export const HERO_SWEEP_VARIANTS: Variants = {
  hidden: {
    clipPath: "inset(0% 100% 0% 0%)",
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
  },
}

export const HERO_SWEEP_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.sweepDelaySeconds,
  duration: HERO_INTRO_TIMING.sweepDurationSeconds,
  ease: SIGNAL_EASE,
}

export const HERO_TAGLINE_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.taglineDelayAfterSettleSeconds,
  duration: HERO_INTRO_TIMING.taglineDurationSeconds,
  ease: "easeOut",
}

export const HERO_SCROLL_CUE_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.scrollCueDelayAfterSettleSeconds,
  duration: HERO_INTRO_TIMING.scrollCueDurationSeconds,
  ease: "easeOut",
}

export const HERO_TEXT_SETTLE_MS =
  (HERO_INTRO_TIMING.growDelaySeconds + HERO_INTRO_TIMING.growDurationSeconds) *
  1000
