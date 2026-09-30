import {
  CAPTION_CASCADE_SPREAD,
  CAPTION_LINE_STAGGER,
  COPY_DRIFT_PX,
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

export function buildSceneCaptionStyle(lastLine: number): StepMotionStyle {
  const spreadStagger = CAPTION_CASCADE_SPREAD / Math.max(lastLine, 1)

  return {
    "--caption-stagger": Math.min(CAPTION_LINE_STAGGER, spreadStagger),
    "--caption-last": lastLine,
  }
}

export function buildCopyDriftStyle(): StepMotionStyle {
  return { "--copy-drift": `${COPY_DRIFT_PX}px` }
}

export function buildLineStyle(line: number): StepMotionStyle {
  return { "--line": line }
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
