import {
  CAPTION_LINE_STAGGER,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import type { StepMotionStyle } from "@/types/page-sections.type"

export function buildStepSceneStyle(stepCount: number): StepMotionStyle {
  return { "--steps": stepCount }
}

export function buildThreadCaptionStyle(): StepMotionStyle {
  return { "--caption-stagger": CAPTION_LINE_STAGGER }
}

export function buildLineStyle(line: number): StepMotionStyle {
  return { "--line": line }
}

export function buildShownCaptionStyle(): StepMotionStyle {
  return { "--caption-reveal": 1 }
}

export function buildOrbitStyle(): StepMotionStyle {
  return { "--orbit-spin-ratio": ORBIT_RING_SPIN_RATIO }
}

export function buildOrbitStepStyle(stepIndex: number): StepMotionStyle {
  return { "--orbit-index": stepIndex }
}

export function buildDigitStyle(digitIndex: number): StepMotionStyle {
  const tilt =
    ORBIT_DIGIT_TILTS_DEGREES[digitIndex % ORBIT_DIGIT_TILTS_DEGREES.length] ??
    0

  return { "--orbit-tilt": `${tilt}deg` }
}
