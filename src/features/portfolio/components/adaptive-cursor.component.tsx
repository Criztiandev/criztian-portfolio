"use client"

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"
import { useEffect, useState } from "react"

import { CURSOR_TUNING, INDICATOR_TRANSITION } from "@/data/motion.data"
import {
  prefersReducedMotion,
  subscribeMotionPreference,
  supportsCustomCursor,
} from "@/features/portfolio/browser-capability.rules"
import {
  resolveCursorState,
  resolveRingDiameter,
} from "@/features/portfolio/cursor.rules"
import { resolveMotionTransition } from "@/features/portfolio/motion.rules"
import type { CursorState } from "@/types/portfolio.type"

export function AdaptiveCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("hidden")
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const ringX = useSpring(pointerX, CURSOR_TUNING.spring)
  const ringY = useSpring(pointerY, CURSOR_TUNING.spring)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const stretchTarget = useTransform(
    scrollVelocity,
    [-CURSOR_TUNING.stretchVelocity, 0, CURSOR_TUNING.stretchVelocity],
    [CURSOR_TUNING.stretchScale, 1, CURSOR_TUNING.stretchScale]
  )
  const stretch = useSpring(stretchTarget, CURSOR_TUNING.stretchSpring)

  useEffect(
    function attachCursor() {
      if (!supportsCustomCursor()) {
        return
      }

      const root = document.documentElement
      let isReducedMotionPreferred = prefersReducedMotion()
      let pointerType = "mouse"
      let isPointerInside = false
      let lastX = 0
      let lastY = 0
      let publishedState: CursorState = "hidden"

      function resolveFromPoint(): void {
        let element: Element | null = null

        if (isPointerInside && pointerType === "mouse") {
          element = document.elementFromPoint(lastX, lastY)
        }

        const nextState = resolveCursorState({
          element,
          pointerType,
          isPointerInside,
        })

        if (nextState !== publishedState) {
          publishedState = nextState
          setCursorState(nextState)
        }
      }

      function onPointer(event: PointerEvent): void {
        if (event.pointerType !== "mouse") {
          pointerType = event.pointerType
          delete root.dataset.cursor
          resolveFromPoint()
          return
        }

        if (publishedState === "hidden") {
          ringX.jump(event.clientX)
          ringY.jump(event.clientY)
          setIsReducedMotion(isReducedMotionPreferred)
        }

        pointerType = event.pointerType
        isPointerInside = true
        lastX = event.clientX
        lastY = event.clientY

        if (root.dataset.cursor !== "on") {
          root.dataset.cursor = "on"
        }

        pointerX.set(lastX)
        pointerY.set(lastY)
        resolveFromPoint()
      }

      function onPointerLeave(): void {
        isPointerInside = false
        resolveFromPoint()
      }

      function onMotionPreferenceChanged(): void {
        isReducedMotionPreferred = prefersReducedMotion()
        setIsReducedMotion(isReducedMotionPreferred)
      }

      const stopScrollHitTest = scrollY.on("change", resolveFromPoint)

      window.addEventListener("pointermove", onPointer, { passive: true })
      window.addEventListener("pointerover", onPointer, { passive: true })
      window.addEventListener("pointerdown", onPointer, { passive: true })
      root.addEventListener("pointerleave", onPointerLeave)

      const releaseMotionPreference = subscribeMotionPreference(
        onMotionPreferenceChanged
      )

      return function cleanup() {
        window.removeEventListener("pointermove", onPointer)
        window.removeEventListener("pointerover", onPointer)
        window.removeEventListener("pointerdown", onPointer)
        root.removeEventListener("pointerleave", onPointerLeave)
        releaseMotionPreference()
        stopScrollHitTest()
        delete root.dataset.cursor
      }
    },
    [pointerX, pointerY, ringX, ringY, scrollY]
  )

  const isShown = cursorState !== "hidden" && cursorState !== "field"
  const isAction = cursorState === "action"
  const isStretching = cursorState === "idle" && !isReducedMotion
  const ringDiameter = resolveRingDiameter(cursorState, CURSOR_TUNING)
  const transition = resolveMotionTransition(
    INDICATOR_TRANSITION,
    isReducedMotion
  )

  return (
    <motion.div
      data-cursor-state={cursorState}
      initial={false}
      animate={{ opacity: isShown ? 1 : 0 }}
      transition={transition}
      className="pointer-events-none fixed top-0 left-0 z-50 size-0 mix-blend-difference forced-colors:hidden"
    >
      <motion.div
        initial={false}
        animate={{
          width: ringDiameter,
          height: ringDiameter,
          opacity: isAction ? 1 : CURSOR_TUNING.ringOpacity,
        }}
        transition={transition}
        style={{
          x: isReducedMotion ? pointerX : ringX,
          y: isReducedMotion ? pointerY : ringY,
          scaleY: isStretching ? stretch : 1,
        }}
        className="absolute top-0 left-0 -translate-1/2 rounded-full border border-white"
      >
        <motion.div
          initial={false}
          animate={{ opacity: isAction ? 1 : 0 }}
          transition={transition}
          className="absolute inset-0 rounded-full bg-white"
        />
      </motion.div>
      <motion.div
        style={{
          x: pointerX,
          y: pointerY,
          width: CURSOR_TUNING.dotSize,
          height: CURSOR_TUNING.dotSize,
        }}
        className="absolute top-0 left-0 -translate-1/2 rounded-full bg-white mix-blend-difference"
      />
    </motion.div>
  )
}
