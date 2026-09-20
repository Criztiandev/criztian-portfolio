"use client"

import { useEffect, useRef } from "react"

import {
  CONTEXT_OPTIONS,
  DOT_FIELD_TUNING,
  HEIGHT_CHANGE_IGNORE_PX,
  MAX_FRAME_DELTA_SECONDS,
  MAX_PIXEL_RATIO,
  RESIZE_DEBOUNCE_MS,
  VISIBILITY_ROOT_MARGIN,
} from "@/data/hero.data"
import {
  hasFontLoadingApi,
  hasIntersectionObserver,
  hasResizeObserver,
  prefersFinePointer,
  prefersReducedMotion,
  readReducedMotionQuery,
} from "@/features/portfolio/browser-capability.rules"
import {
  applyFrameLerp,
  buildFontShorthand,
  parsePrimaryFontFamily,
  resolveAutoPointer,
  resolvePixelRatio,
  shouldRebuildPoints,
} from "@/features/portfolio/dot-field.rules"
import {
  applyStaticUniforms,
  createDotFieldRuntime,
  destroyRuntime,
  drawDotField,
  resizeDotField,
  uploadPoints,
} from "@/features/portfolio/services/dot-field-renderer.service"
import {
  sampleWordToPoints,
  waitForDisplayFont,
} from "@/features/portfolio/services/dot-field-sampler.service"
import type {
  DotFieldPointer,
  DotFieldRuntime,
  DotFieldViewport,
  UseDotFieldRequest,
} from "@/types/hero.type"

function createPointer(): DotFieldPointer {
  return {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    influence: 0,
    targetInfluence: 0,
  }
}

function readViewport(container: HTMLElement): DotFieldViewport {
  const rect = container.getBoundingClientRect()

  return {
    width: rect.width,
    height: rect.height,
    pixelRatio: resolvePixelRatio(window.devicePixelRatio, MAX_PIXEL_RATIO),
  }
}

export function useDotField(request: UseDotFieldRequest): void {
  const { containerRef, canvasRef, text, fontFamily, dotColor } = request

  const runtimeRef = useRef<DotFieldRuntime | null>(null)
  const pointerRef = useRef<DotFieldPointer>(createPointer())
  const viewportRef = useRef<DotFieldViewport | null>(null)
  const rebuildRef = useRef<(() => void) | null>(null)

  useEffect(
    function initialiseDotField() {
      const containerElement = containerRef.current
      const canvasElement = canvasRef.current

      if (containerElement === null || canvasElement === null) {
        return
      }

      const container: HTMLElement = containerElement
      const canvas: HTMLCanvasElement = canvasElement

      const context = canvas.getContext("webgl2", CONTEXT_OPTIONS)

      if (context === null) {
        container.dataset.status = "unsupported"
        return
      }

      let runtime: DotFieldRuntime

      try {
        runtime = createDotFieldRuntime(context)
      } catch {
        container.dataset.status = "unsupported"
        return
      }

      runtimeRef.current = runtime

      const pointer = pointerRef.current
      const reducedMotionQuery = readReducedMotionQuery()

      let frameId = 0
      let previousTimestamp = 0
      let elapsedSeconds = 0
      let isVisible = true
      let resizeHandle = 0

      function applyViewport(viewport: DotFieldViewport): void {
        const deviceWidth = Math.max(
          1,
          Math.round(viewport.width * viewport.pixelRatio)
        )
        const deviceHeight = Math.max(
          1,
          Math.round(viewport.height * viewport.pixelRatio)
        )

        canvas.width = deviceWidth
        canvas.height = deviceHeight
        canvas.style.width = viewport.width + "px"
        canvas.style.height = viewport.height + "px"

        applyStaticUniforms(
          runtime,
          DOT_FIELD_TUNING,
          viewport.pixelRatio,
          dotColor
        )
        resizeDotField(runtime, deviceWidth, deviceHeight)
      }

      function drawSingleFrame(): void {
        drawDotField(
          runtime,
          elapsedSeconds,
          pointer.currentX,
          pointer.currentY,
          pointer.influence
        )
      }

      function advanceAutoPointer(): void {
        const autoPointer = resolveAutoPointer(
          elapsedSeconds,
          canvas.width,
          canvas.height,
          DOT_FIELD_TUNING
        )

        pointer.targetX = autoPointer.x
        pointer.targetY = autoPointer.y
        pointer.targetInfluence = DOT_FIELD_TUNING.autoPointerInfluence
      }

      function renderFrame(timestamp: number): void {
        if (previousTimestamp === 0) {
          previousTimestamp = timestamp
        }

        const rawDelta = (timestamp - previousTimestamp) / 1000
        const deltaSeconds = Math.min(rawDelta, MAX_FRAME_DELTA_SECONDS)

        previousTimestamp = timestamp
        elapsedSeconds += deltaSeconds

        if (!prefersFinePointer()) {
          advanceAutoPointer()
        }

        const influenceRate =
          pointer.targetInfluence > pointer.influence
            ? DOT_FIELD_TUNING.influenceEnterLerp
            : DOT_FIELD_TUNING.influenceLeaveLerp

        pointer.currentX = applyFrameLerp(
          pointer.currentX,
          pointer.targetX,
          DOT_FIELD_TUNING.pointerLerp,
          deltaSeconds
        )
        pointer.currentY = applyFrameLerp(
          pointer.currentY,
          pointer.targetY,
          DOT_FIELD_TUNING.pointerLerp,
          deltaSeconds
        )
        pointer.influence = applyFrameLerp(
          pointer.influence,
          pointer.targetInfluence,
          influenceRate,
          deltaSeconds
        )

        drawSingleFrame()

        frameId = window.requestAnimationFrame(renderFrame)
      }

      function stopLoop(): void {
        if (frameId !== 0) {
          window.cancelAnimationFrame(frameId)
          frameId = 0
        }
      }

      function startLoop(): void {
        if (frameId !== 0 || !isVisible) {
          return
        }

        if (prefersReducedMotion()) {
          drawSingleFrame()
          return
        }

        previousTimestamp = 0
        frameId = window.requestAnimationFrame(renderFrame)
      }

      function onPointerMove(event: PointerEvent): void {
        const viewport = viewportRef.current

        if (viewport === null) {
          return
        }

        const rect = container.getBoundingClientRect()

        pointer.targetX = (event.clientX - rect.left) * viewport.pixelRatio
        pointer.targetY = (event.clientY - rect.top) * viewport.pixelRatio
        pointer.targetInfluence = 1
      }

      function onPointerLeave(): void {
        pointer.targetInfluence = 0
      }

      function onVisibilityChanged(): void {
        if (document.visibilityState === "hidden") {
          stopLoop()
          return
        }

        startLoop()
      }

      function onMotionPreferenceChanged(): void {
        stopLoop()
        startLoop()
      }

      function onContextLost(event: Event): void {
        event.preventDefault()
        stopLoop()
        container.dataset.status = "unsupported"
      }

      function applyResize(): void {
        const nextViewport = readViewport(container)

        if (nextViewport.width <= 0 || nextViewport.height <= 0) {
          return
        }

        const previousViewport = viewportRef.current

        viewportRef.current = nextViewport
        applyViewport(nextViewport)

        const needsRebuild =
          previousViewport === null ||
          shouldRebuildPoints(
            previousViewport,
            nextViewport,
            HEIGHT_CHANGE_IGNORE_PX
          )

        const rebuild = rebuildRef.current

        if (needsRebuild && rebuild !== null) {
          rebuild()
          return
        }

        if (prefersReducedMotion()) {
          drawSingleFrame()
        }
      }

      function onResizeObserved(): void {
        window.clearTimeout(resizeHandle)
        resizeHandle = window.setTimeout(applyResize, RESIZE_DEBOUNCE_MS)
      }

      function onHeroVisibility(entries: IntersectionObserverEntry[]): void {
        const entry = entries[0]

        if (entry === undefined) {
          return
        }

        isVisible = entry.isIntersecting

        if (isVisible) {
          startLoop()
          return
        }

        stopLoop()
      }

      const initialViewport = readViewport(container)

      viewportRef.current = initialViewport
      applyViewport(initialViewport)

      pointer.currentX = canvas.width / 2
      pointer.currentY = canvas.height / 2
      pointer.targetX = pointer.currentX
      pointer.targetY = pointer.currentY

      const resizeObserver = hasResizeObserver()
        ? new ResizeObserver(onResizeObserved)
        : null
      const intersectionObserver = hasIntersectionObserver()
        ? new IntersectionObserver(onHeroVisibility, {
            threshold: 0,
            rootMargin: VISIBILITY_ROOT_MARGIN,
          })
        : null

      resizeObserver?.observe(container)
      intersectionObserver?.observe(container)

      if (prefersFinePointer()) {
        container.addEventListener("pointermove", onPointerMove)
        container.addEventListener("pointerleave", onPointerLeave)
        container.addEventListener("pointercancel", onPointerLeave)
        window.addEventListener("blur", onPointerLeave)
      }

      document.addEventListener("visibilitychange", onVisibilityChanged)
      canvas.addEventListener("webglcontextlost", onContextLost)
      reducedMotionQuery?.addEventListener("change", onMotionPreferenceChanged)

      startLoop()

      return function cleanupDotField() {
        stopLoop()
        window.clearTimeout(resizeHandle)

        resizeObserver?.disconnect()
        intersectionObserver?.disconnect()

        container.removeEventListener("pointermove", onPointerMove)
        container.removeEventListener("pointerleave", onPointerLeave)
        container.removeEventListener("pointercancel", onPointerLeave)
        window.removeEventListener("blur", onPointerLeave)
        document.removeEventListener("visibilitychange", onVisibilityChanged)
        canvas.removeEventListener("webglcontextlost", onContextLost)
        reducedMotionQuery?.removeEventListener(
          "change",
          onMotionPreferenceChanged
        )

        destroyRuntime(runtime)

        if (!canvas.isConnected) {
          context.getExtension("WEBGL_lose_context")?.loseContext()
        }

        runtimeRef.current = null
      }
    },
    [containerRef, canvasRef, dotColor]
  )

  useEffect(
    function buildDotFieldGeometry() {
      const containerElement = containerRef.current
      const canvasElement = canvasRef.current

      if (containerElement === null || canvasElement === null) {
        return
      }

      const container: HTMLElement = containerElement
      const canvas: HTMLCanvasElement = canvasElement

      let isCancelled = false
      let hasSampledWithDisplayFont = false

      const primaryFamily = parsePrimaryFontFamily(fontFamily)
      const probeDescriptor = buildFontShorthand(
        DOT_FIELD_TUNING.fontWeight,
        DOT_FIELD_TUNING.probeFontSize,
        primaryFamily
      )

      function buildGeometry(): void {
        const runtime = runtimeRef.current
        const viewport = viewportRef.current

        if (isCancelled || runtime === null || viewport === null) {
          return
        }

        const sample = sampleWordToPoints({
          text: text.toUpperCase(),
          fontFamily: primaryFamily,
          viewport: {
            width: viewport.width * viewport.pixelRatio,
            height: viewport.height * viewport.pixelRatio,
            pixelRatio: viewport.pixelRatio,
          },
          tuning: DOT_FIELD_TUNING,
        })

        if (sample === null) {
          return
        }

        uploadPoints(runtime, sample)
        canvas.dataset.pointCount = String(sample.count)
        container.dataset.status = "running"
      }

      function onFontsLoadingDone(): void {
        if (isCancelled || hasSampledWithDisplayFont) {
          return
        }

        if (!document.fonts.check(probeDescriptor)) {
          return
        }

        hasSampledWithDisplayFont = true
        buildGeometry()
      }

      async function startGeometry(): Promise<void> {
        const isFontReady = await waitForDisplayFont(primaryFamily)

        if (isCancelled) {
          return
        }

        hasSampledWithDisplayFont = isFontReady
        buildGeometry()
      }

      rebuildRef.current = buildGeometry

      void startGeometry()

      if (hasFontLoadingApi()) {
        document.fonts.addEventListener("loadingdone", onFontsLoadingDone)
      }

      return function cleanupGeometry() {
        isCancelled = true
        rebuildRef.current = null

        if (hasFontLoadingApi()) {
          document.fonts.removeEventListener("loadingdone", onFontsLoadingDone)
        }
      }
    },
    [containerRef, canvasRef, text, fontFamily]
  )
}
