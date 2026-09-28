"use client"

import Lenis from "lenis"
import { useEffect } from "react"

import {
  SMOOTH_SCROLL_LERP,
  SMOOTH_SCROLL_REST_VELOCITY,
} from "@/data/motion.data"
import {
  prefersFinePointer,
  prefersReducedMotion,
  readReducedMotionQuery,
} from "@/features/portfolio/browser-capability.rules"

export function SmoothScroll() {
  useEffect(function attachSmoothScroll() {
    if (!prefersFinePointer()) {
      return
    }

    let lenis: Lenis | null = null
    let frameId = 0

    function tick(time: number) {
      frameId = 0

      if (lenis === null) {
        return
      }

      const isWakeFrame = lenis.time === 0

      lenis.raf(time)

      if (lenis.isScrolling !== "smooth") {
        return
      }

      const hasStalled =
        !isWakeFrame && Math.abs(lenis.velocity) < SMOOTH_SCROLL_REST_VELOCITY

      if (hasStalled) {
        lenis.stop()
        lenis.start()
        return
      }

      frameId = window.requestAnimationFrame(tick)
    }

    function wakeLoop() {
      if (lenis === null || frameId !== 0) {
        return
      }

      lenis.time = 0
      frameId = window.requestAnimationFrame(tick)
    }

    function stopLoop() {
      if (frameId === 0) {
        return
      }

      window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    function startLenis() {
      if (lenis !== null) {
        return
      }

      lenis = new Lenis({
        lerp: SMOOTH_SCROLL_LERP,
        anchors: { onStart: wakeLoop },
      })
      lenis.on("virtual-scroll", wakeLoop)
    }

    function stopLenis() {
      stopLoop()

      if (lenis === null) {
        return
      }

      lenis.destroy()
      lenis = null
    }

    function yieldToKeyboard() {
      if (lenis === null || lenis.isScrolling !== "smooth") {
        return
      }

      lenis.stop()
      lenis.start()
    }

    function dropStaleScrollEnd(event: Event) {
      if (!(event instanceof CustomEvent)) {
        return
      }

      if (lenis?.isScrolling === "smooth") {
        event.stopImmediatePropagation()
      }
    }

    function onMotionPreferenceChanged() {
      if (prefersReducedMotion()) {
        stopLenis()
        return
      }

      startLenis()
    }

    const reducedMotionQuery = readReducedMotionQuery()

    if (!prefersReducedMotion()) {
      startLenis()
    }

    window.addEventListener("keydown", yieldToKeyboard)
    window.addEventListener("scrollend", dropStaleScrollEnd, { capture: true })
    reducedMotionQuery?.addEventListener("change", onMotionPreferenceChanged)

    return function cleanup() {
      window.removeEventListener("keydown", yieldToKeyboard)
      window.removeEventListener("scrollend", dropStaleScrollEnd, {
        capture: true,
      })
      reducedMotionQuery?.removeEventListener(
        "change",
        onMotionPreferenceChanged
      )
      stopLenis()
    }
  }, [])

  return null
}
