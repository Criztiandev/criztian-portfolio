import {
  DOT_FIELD_MORPH_TUNING,
  DOT_SCENE_MOTION,
  SIGNAL_EASE,
} from "@/data/hero.data"
import {
  CAPTION_LINE_STAGGER,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_PATH_LENGTH,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import type { StepHandover, StepMotionStyle } from "@/types/page-sections.type"

export function resolveSceneShare(sceneId: string): number {
  return (
    DOT_SCENE_MOTION[sceneId]?.share ?? DOT_FIELD_MORPH_TUNING.stepMorphShare
  )
}

export function resolveStepHandover(
  stepIndex: number,
  stepCount: number,
  share: number
): StepHandover {
  let inFrom = stepIndex - 0.5 - share / 2
  let inTo = stepIndex - 0.5 + share / 2

  if (stepIndex === 0) {
    inFrom = -share
    inTo = 0
  }

  if (stepIndex >= stepCount - 1) {
    return { inFrom, inTo, outFrom: null, outTo: null }
  }

  const next = resolveStepHandover(stepIndex + 1, stepCount, share)

  return { inFrom, inTo, outFrom: next.inFrom, outTo: next.inTo }
}

export function resolveSceneHandovers(
  stepCount: number,
  share: number
): StepHandover[] {
  const handovers: StepHandover[] = []

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    handovers.push(resolveStepHandover(stepIndex, stepCount, share))
  }

  return handovers
}

export function buildStepSceneStyle(stepCount: number): StepMotionStyle {
  return {
    "--steps": stepCount,
    "--signal-ease": `cubic-bezier(${SIGNAL_EASE.join(", ")})`,
  }
}

export function buildThreadCaptionStyle(): StepMotionStyle {
  return { "--caption-stagger": CAPTION_LINE_STAGGER }
}

export function buildTravelStyle(handover: StepHandover): StepMotionStyle {
  return {
    "--in-from": handover.inFrom,
    "--in-to": handover.inTo,
  }
}

export function resolveAssembleHandover(
  stepIndex: number,
  handovers: StepHandover[]
): StepHandover | undefined {
  return handovers[Math.max(stepIndex - 1, 0)]
}

export function buildAssembleStyle(handover: StepHandover): StepMotionStyle {
  return {
    "--assemble-from": handover.inFrom,
    "--assemble-to": handover.inTo,
  }
}

export function buildOrbitStyle(): StepMotionStyle {
  return {
    "--orbit-spin-ratio": ORBIT_RING_SPIN_RATIO,
    "--orbit-units-per-radian": ORBIT_RING_PATH_LENGTH / (2 * Math.PI),
  }
}

export function buildDigitStyle(digitIndex: number): StepMotionStyle {
  const tilt =
    ORBIT_DIGIT_TILTS_DEGREES[digitIndex % ORBIT_DIGIT_TILTS_DEGREES.length] ??
    0

  return { "--orbit-tilt": `${tilt}deg` }
}
