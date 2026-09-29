"use client"

import Lenis from "lenis"
import { useEffect } from "react"

import {
  DOT_THREAD_COMMIT_EVENT,
  IN_PAGE_ANCHOR_SELECTOR,
} from "@/data/hero.data"
import {
  SMOOTH_SCROLL_LERP,
  SMOOTH_SCROLL_REST_VELOCITY,
  WHEEL_GESTURE_QUIET_MS,
} from "@/data/motion.data"
import {
  prefersFinePointer,
  prefersReducedMotion,
  readReducedMotionQuery,
} from "@/features/portfolio/browser-capability.rules"
import { easeInOutSine } from "@/features/portfolio/dot-field.rules"
import type { DotThreadCommitDetail } from "@/types/hero.type"

export function SmoothScroll() {
  useEffect(function attachSmoothScroll() {
    const canSmoothWheel = prefersFinePointer()
    const root = document.documentElement

    let lenis: Lenis | null = null
    let frameId = 0
    let glideFrameId = 0
    let glideStartTime = 0
    let lastWheelTime = 0
    let gestureTimer = 0

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

    function noteWheel() {
      lastWheelTime = window.performance.now()
      wakeLoop()
    }

    function waitForGestureEnd() {
      gestureTimer = 0

      if (lenis === null) {
        return
      }

      const quietFor = window.performance.now() - lastWheelTime

      if (quietFor >= WHEEL_GESTURE_QUIET_MS) {
        lenis.start()
        return
      }

      lenis.stop()
      gestureTimer = window.setTimeout(
        waitForGestureEnd,
        WHEEL_GESTURE_QUIET_MS - quietFor
      )
    }

    function releaseGestureHold() {
      if (gestureTimer !== 0) {
        window.clearTimeout(gestureTimer)
        gestureTimer = 0
      }

      if (lenis?.isStopped === true) {
        lenis.start()
      }
    }

    function stopLoop() {
      if (frameId === 0) {
        return
      }

      window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    function startLenis() {
      if (lenis !== null || !canSmoothWheel) {
        return
      }

      lenis = new Lenis({
        lerp: SMOOTH_SCROLL_LERP,
        anchors: { onStart: wakeLoop },
      })
      lenis.on("virtual-scroll", noteWheel)
    }

    function stopLenis() {
      stopLoop()
      releaseGestureHold()

      if (lenis === null) {
        return
      }

      lenis.destroy()
      lenis = null
    }

    function releaseTouchLock() {
      glideFrameId = 0
      glideStartTime = 0
      root.style.removeProperty("overflow")
      root.style.removeProperty("scrollbar-gutter")
    }

    function cancelTouchGlide() {
      if (glideFrameId === 0) {
        return
      }

      window.cancelAnimationFrame(glideFrameId)
      releaseTouchLock()
    }

    function glideWithTouchLocked(top: number, seconds: number) {
      cancelTouchGlide()

      const from = window.scrollY

      root.style.setProperty("scrollbar-gutter", "stable")
      root.style.setProperty("overflow", "hidden")

      function stepGlide(time: number) {
        if (glideStartTime === 0) {
          glideStartTime = time
        }

        const progress = Math.min(1, (time - glideStartTime) / (seconds * 1000))

        window.scrollTo({
          top: from + (top - from) * easeInOutSine(progress),
          behavior: "instant",
        })

        if (progress >= 1) {
          releaseTouchLock()
          return
        }

        glideFrameId = window.requestAnimationFrame(stepGlide)
      }

      glideFrameId = window.requestAnimationFrame(stepGlide)
    }

    function glideToThread(event: Event) {
      if (!(event instanceof CustomEvent) || prefersReducedMotion()) {
        return
      }

      const detail = event.detail as DotThreadCommitDetail

      if (lenis === null) {
        glideWithTouchLocked(detail.top, detail.seconds)
        return
      }

      releaseGestureHold()
      lenis.scrollTo(detail.top, {
        duration: detail.seconds,
        easing: easeInOutSine,
        lock: true,
        onComplete: waitForGestureEnd,
      })
      wakeLoop()
    }

    function releaseGlideForAnchor(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return
      }

      if (event.target.closest(IN_PAGE_ANCHOR_SELECTOR) === null) {
        return
      }

      cancelTouchGlide()
      releaseGestureHold()

      if (lenis?.isLocked === true) {
        lenis.stop()
        lenis.start()
      }
    }

    function yieldToKeyboard() {
      cancelTouchGlide()
      releaseGestureHold()

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
        cancelTouchGlide()
        stopLenis()
        return
      }

      startLenis()
    }

    const reducedMotionQuery = readReducedMotionQuery()

    if (!prefersReducedMotion()) {
      startLenis()
    }

    window.addEventListener(DOT_THREAD_COMMIT_EVENT, glideToThread)
    document.addEventListener("click", releaseGlideForAnchor, {
      capture: true,
    })
    window.addEventListener("keydown", yieldToKeyboard)
    window.addEventListener("scrollend", dropStaleScrollEnd, { capture: true })
    reducedMotionQuery?.addEventListener("change", onMotionPreferenceChanged)

    return function cleanup() {
      window.removeEventListener(DOT_THREAD_COMMIT_EVENT, glideToThread)
      document.removeEventListener("click", releaseGlideForAnchor, {
        capture: true,
      })
      window.removeEventListener("keydown", yieldToKeyboard)
      window.removeEventListener("scrollend", dropStaleScrollEnd, {
        capture: true,
      })
      reducedMotionQuery?.removeEventListener(
        "change",
        onMotionPreferenceChanged
      )
      cancelTouchGlide()
      stopLenis()
    }
  }, [])

  return null
}
