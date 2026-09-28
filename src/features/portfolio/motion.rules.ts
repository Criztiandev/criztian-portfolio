import type { Transition } from "motion/react"

import { INSTANT_TRANSITION } from "@/data/hero.data"

export function resolveMotionTransition(
  transition: Transition,
  shouldReduceMotion: boolean
): Transition {
  if (shouldReduceMotion) {
    return INSTANT_TRANSITION
  }

  return transition
}
