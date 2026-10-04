import {
  CURSOR_ACTION_SELECTOR,
  CURSOR_FIELD_SELECTOR,
} from "@/data/motion.data"
import type {
  CursorState,
  CursorStateRequest,
  CursorTuning,
} from "@/types/portfolio.type"

export function resolveCursorState({
  element,
  pointerType,
  isPointerInside,
}: CursorStateRequest): CursorState {
  if (pointerType !== "mouse" || !isPointerInside || element === null) {
    return "hidden"
  }

  if (element.closest(CURSOR_FIELD_SELECTOR) !== null) {
    return "field"
  }

  if (element.closest(CURSOR_ACTION_SELECTOR) !== null) {
    return "action"
  }

  return "idle"
}

export function resolveRingDiameter(
  state: CursorState,
  tuning: CursorTuning
): number {
  if (state === "action") {
    return tuning.actionSize
  }

  return tuning.ringSize
}
