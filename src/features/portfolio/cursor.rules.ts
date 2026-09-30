import { DOT_SLOT_SELECTOR } from "@/data/hero.data"
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
  pushRadius,
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

  if (pushRadius !== null && element.closest(DOT_SLOT_SELECTOR) !== null) {
    return "push"
  }

  return "idle"
}

export function resolveRingDiameter(
  state: CursorState,
  pushRadius: number | null,
  tuning: CursorTuning
): number {
  if (state === "action") {
    return tuning.actionSize
  }

  if (state === "push" && pushRadius !== null) {
    return pushRadius * 2
  }

  return tuning.ringSize
}

export function parsePushRadius(value: string | undefined): number | null {
  if (value === undefined) {
    return null
  }

  const radius = Number(value)

  if (!Number.isFinite(radius) || radius <= 0) {
    return null
  }

  return radius
}
