"use client"

import { useEffect, useRef } from "react"

import {
  SCENE_ANCHOR_TOLERANCE_PX,
  SCENE_FIT_BOX_SELECTOR,
  SCENE_FIT_FLOW,
  SCENE_FIT_TOLERANCE_PX,
  SCENE_FLOW_SHAPES,
  SCENE_SLOT_ATTRIBUTE,
} from "@/data/page-sections.data"
import {
  hasFontLoadingApi,
  hasResizeObserver,
} from "@/features/portfolio/browser-capability.rules"
import type { SceneFitGateProps } from "@/types/page-sections.type"

export function SceneFitGate({ shapes }: Readonly<SceneFitGateProps>) {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(
    function gateSceneFit() {
      const containerElement = markerRef.current?.parentElement ?? null

      if (containerElement === null) {
        return
      }

      const slotElement = containerElement.querySelector<HTMLElement>(
        `[${SCENE_SLOT_ATTRIBUTE}]`
      )

      if (slotElement === null) {
        return
      }

      const container: HTMLElement = containerElement
      const slot: HTMLElement = slotElement
      const boxes = Array.from(
        container.querySelectorAll<HTMLElement>(SCENE_FIT_BOX_SELECTOR)
      )

      let frameId = 0
      let isCancelled = false

      function hasOverflowingBox(): boolean {
        for (const box of boxes) {
          if (box.scrollHeight > box.clientHeight + SCENE_FIT_TOLERANCE_PX) {
            return true
          }
        }

        return false
      }

      function pinScene(): void {
        delete container.dataset.fit

        if (!slot.hasAttribute(SCENE_SLOT_ATTRIBUTE)) {
          slot.setAttribute(SCENE_SLOT_ATTRIBUTE, "")
        }

        if (container.dataset.dotShapes !== shapes) {
          container.dataset.dotShapes = shapes
        }
      }

      function flowScene(): void {
        container.dataset.fit = SCENE_FIT_FLOW
        slot.removeAttribute(SCENE_SLOT_ATTRIBUTE)

        if (container.dataset.dotShapes !== SCENE_FLOW_SHAPES) {
          container.dataset.dotShapes = SCENE_FLOW_SHAPES
        }
      }

      function keepReaderInPlace(paintedRect: DOMRect): void {
        const anchorLine = parseFloat(
          getComputedStyle(container).scrollMarginTop
        )

        if (paintedRect.bottom > anchorLine + SCENE_ANCHOR_TOLERANCE_PX) {
          return
        }

        const shift =
          container.getBoundingClientRect().bottom - paintedRect.bottom

        if (shift !== 0) {
          window.scrollBy({ top: shift, behavior: "instant" })
        }
      }

      function checkFit(): void {
        frameId = 0

        const paintedRect = container.getBoundingClientRect()

        delete container.dataset.fit

        if (hasOverflowingBox()) {
          flowScene()
        } else {
          pinScene()
        }

        keepReaderInPlace(paintedRect)
      }

      function scheduleCheck(): void {
        if (isCancelled || frameId !== 0) {
          return
        }

        frameId = window.requestAnimationFrame(checkFit)
      }

      const observer = hasResizeObserver()
        ? new ResizeObserver(scheduleCheck)
        : null

      observer?.observe(container)

      for (const box of boxes) {
        for (const child of box.children) {
          observer?.observe(child)
        }
      }

      if (hasFontLoadingApi()) {
        void document.fonts.ready.then(scheduleCheck)
      }

      scheduleCheck()

      return function releaseSceneFit() {
        isCancelled = true
        window.cancelAnimationFrame(frameId)
        observer?.disconnect()
        pinScene()
      }
    },
    [shapes]
  )

  return <span ref={markerRef} hidden />
}
