import { useSyncExternalStore } from "react"

import {
  isMotionPaused,
  prefersReducedMotion,
  subscribeMotionPreference,
} from "@/features/portfolio/browser-capability.rules"

function readServerPause(): boolean {
  return false
}

export function useIsMotionPaused(): boolean {
  return useSyncExternalStore(
    subscribeMotionPreference,
    isMotionPaused,
    readServerPause
  )
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotionPreference,
    prefersReducedMotion,
    prefersReducedMotion
  )
}
