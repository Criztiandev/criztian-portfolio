"use client"

import { useEffect, useRef } from "react"

import {
  CONTEXT_OPTIONS,
  DOT_FIELD_MORPH_TUNING,
  DOT_FIELD_TUNING,
  HEIGHT_CHANGE_IGNORE_PX,
  HERO_INTRO_TIMING,
  MAX_FRAME_DELTA_SECONDS,
  MORPH_LANDING_TOLERANCE_PX,
  REDUCED_MOTION_MORPH_PASSES,
  RESIZE_DEBOUNCE_MS,
  SETTLED_INTRO_SECONDS,
  VISIBILITY_ROOT_MARGIN,
} from "@/data/hero.data"
import {
  hasFontLoadingApi,
  hasIntersectionObserver,
  hasResizeObserver,
  prefersReducedMotion,
  readReducedMotionQuery,
} from "@/features/portfolio/browser-capability.rules"
import {
  buildCubeRotation,
  buildFontShorthand,
  followMorphProgress,
  generateCubePoints,
  parsePrimaryFontFamily,
  projectCubePoints,
  resolveCanvasPixelRatio,
  resolveIntroFrame,
  resolveMorphState,
  resolveStageProgress,
  shouldRebuildPoints,
  stepDotPhysics,
} from "@/features/portfolio/dot-field.rules"
import {
  applyDotColor,
  applyStaticUniforms,
  createDotFieldRuntime,
  destroyRuntime,
  drawDotField,
  resizeDotField,
  uploadOffsets,
  uploadPoints,
} from "@/features/portfolio/services/dot-field-renderer.service"
import {
  sampleWordToPoints,
  waitForDisplayFont,
} from "@/features/portfolio/services/dot-field-sampler.service"
import type {
  DotFieldBounds,
  DotFieldFrame,
  DotFieldIntroFrame,
  DotFieldLayout,
  DotFieldLayoutElements,
  DotFieldPhysicsSpace,
  DotFieldPointer,
  DotFieldRuntime,
  DotFieldViewport,
  HeroMorphState,
  UseDotFieldRequest,
} from "@/types/hero.type"

const PLACEHOLDER_BOUNDS: DotFieldBounds = {
  left: 0,
  right: 1,
}

function createPointer(): DotFieldPointer {
  return {
    x: 0,
    y: 0,
    isActive: false,
  }
}

function readLayout(elements: DotFieldLayoutElements): DotFieldLayout {
  const stageRect = elements.stage.getBoundingClientRect()
  const wordRect = elements.wordmark.getBoundingClientRect()
  const cubeRect = elements.cube.getBoundingClientRect()
  const heroHeight = elements.hero.getBoundingClientRect().height
  const cubeBottom = cubeRect.bottom - stageRect.top

  return {
    width: stageRect.width,
    height: Math.max(heroHeight, cubeBottom),
    wordWidth: wordRect.width,
    wordHeight: wordRect.height,
    wordCenter: {
      x: wordRect.left + wordRect.width / 2 - stageRect.left,
      y: wordRect.top + wordRect.height / 2 - stageRect.top,
    },
    cubeCenter: {
      x: cubeRect.left + cubeRect.width / 2 - stageRect.left,
      y: cubeRect.top + cubeRect.height / 2 - stageRect.top,
    },
    cubeSide: Math.min(cubeRect.width, cubeRect.height),
    morphStart: heroHeight * DOT_FIELD_MORPH_TUNING.morphStartRatio,
    morphEnd: heroHeight - MORPH_LANDING_TOLERANCE_PX,
  }
}

function hasLayoutSizeChanged(
  previous: DotFieldLayout,
  next: DotFieldLayout
): boolean {
  if (previous.width !== next.width || previous.height !== next.height) {
    return true
  }

  return (
    previous.wordWidth !== next.wordWidth ||
    previous.wordHeight !== next.wordHeight
  )
}

function isUsableLayout(layout: DotFieldLayout): boolean {
  return layout.width > 0 && layout.wordWidth > 0 && layout.wordHeight > 0
}

function readMorphTarget(stage: HTMLElement, layout: DotFieldLayout): number {
  const scrolled = -stage.getBoundingClientRect().top

  return resolveStageProgress(
    scrolled,
    layout.morphStart,
    layout.morphEnd - layout.morphStart
  )
}

export function useDotField(request: UseDotFieldRequest): void {
  const {
    stageRef,
    heroRef,
    wordmarkRef,
    taglineRef,
    cubeRef,
    canvasRef,
    text,
    fontFamily,
    dotColor,
    mode,
    onIntroSettled,
    onUnsupported,
  } = request

  const runtimeRef = useRef<DotFieldRuntime | null>(null)
  const pointerRef = useRef<DotFieldPointer>(createPointer())
  const viewportRef = useRef<DotFieldViewport | null>(null)
  const sampledViewportRef = useRef<DotFieldViewport | null>(null)
  const rebuildRef = useRef<(() => void) | null>(null)
  const redrawRef = useRef<(() => void) | null>(null)
  const boundsRef = useRef<DotFieldBounds | null>(null)
  const introStartRef = useRef<number | null>(null)
  const hasSettledRef = useRef(false)
  const dotColorRef = useRef(dotColor)
  const settleCallbackRef = useRef(onIntroSettled)
  const unsupportedCallbackRef = useRef(onUnsupported)

  useEffect(
    function keepCallbacksFresh() {
      settleCallbackRef.current = onIntroSettled
      unsupportedCallbackRef.current = onUnsupported
    },
    [onIntroSettled, onUnsupported]
  )

  useEffect(
    function initialiseDotField() {
      const stageElement = stageRef.current
      const heroElement = heroRef.current
      const wordmarkElement = wordmarkRef.current
      const cubeElement = cubeRef.current
      const canvasElement = canvasRef.current

      if (
        stageElement === null ||
        heroElement === null ||
        wordmarkElement === null ||
        cubeElement === null ||
        canvasElement === null
      ) {
        return
      }

      const stage: HTMLElement = stageElement
      const wordmark: HTMLElement = wordmarkElement
      const cube: HTMLElement = cubeElement
      const canvas: HTMLCanvasElement = canvasElement
      const tagline = taglineRef.current
      const layoutElements: DotFieldLayoutElements = {
        stage,
        hero: heroElement,
        wordmark,
        cube,
      }

      if (mode === "text") {
        return
      }

      function notifySettled(): void {
        if (hasSettledRef.current) {
          return
        }

        hasSettledRef.current = true
        settleCallbackRef.current()
      }

      const context = canvas.getContext("webgl2", CONTEXT_OPTIONS)

      if (context === null) {
        stage.dataset.status = "unsupported"
        unsupportedCallbackRef.current()
        return
      }

      let runtime: DotFieldRuntime

      try {
        runtime = createDotFieldRuntime(context)
      } catch {
        stage.dataset.status = "unsupported"
        unsupportedCallbackRef.current()
        return
      }

      runtimeRef.current = runtime
      applyDotColor(runtime, dotColorRef.current)

      const pointer = pointerRef.current
      const wordPointer = createPointer()
      const reducedMotionQuery = readReducedMotionQuery()

      let frameId = 0
      let previousTimestamp = 0
      let elapsedSeconds = 0
      let isVisible = true
      let resizeHandle = 0
      let pixelRatio = 1
      let layout = readLayout(layoutElements)
      let morph = 0
      let morphTarget = 0
      let spinYaw = 0
      let wobblePhase = 0
      let isFieldAtRest = true
      let morphState: HeroMorphState = "name"

      function applyCanvasSize(): void {
        pixelRatio = resolveCanvasPixelRatio(
          layout.width,
          layout.height,
          window.devicePixelRatio,
          runtime.maxDimension
        )

        const deviceWidth = Math.max(1, Math.round(layout.width * pixelRatio))
        const deviceHeight = Math.max(1, Math.round(layout.height * pixelRatio))

        canvas.width = deviceWidth
        canvas.height = deviceHeight
        canvas.style.width = deviceWidth / pixelRatio + "px"
        canvas.style.height = deviceHeight / pixelRatio + "px"

        applyStaticUniforms(
          runtime,
          DOT_FIELD_TUNING,
          DOT_FIELD_MORPH_TUNING,
          pixelRatio
        )
        resizeDotField(runtime)

        viewportRef.current = {
          width: layout.wordWidth,
          height: layout.wordHeight,
          pixelRatio,
        }
      }

      function resolveIntro(): DotFieldIntroFrame {
        const bounds = boundsRef.current

        if (bounds === null) {
          return resolveIntroFrame(
            SETTLED_INTRO_SECONDS,
            HERO_INTRO_TIMING,
            PLACEHOLDER_BOUNDS,
            pixelRatio
          )
        }

        if (hasSettledRef.current || prefersReducedMotion()) {
          notifySettled()

          return resolveIntroFrame(
            SETTLED_INTRO_SECONDS,
            HERO_INTRO_TIMING,
            bounds,
            pixelRatio
          )
        }

        if (introStartRef.current === null) {
          introStartRef.current = elapsedSeconds
        }

        const frame = resolveIntroFrame(
          elapsedSeconds - introStartRef.current,
          HERO_INTRO_TIMING,
          bounds,
          pixelRatio
        )

        if (frame.isSettled) {
          notifySettled()
        }

        return frame
      }

      function buildFrame(): DotFieldFrame {
        const sampled = sampledViewportRef.current
        const sampleWidth = sampled === null ? 0 : sampled.width
        const sampleHeight = sampled === null ? 0 : sampled.height
        const bounds = boundsRef.current
        const isStatic = prefersReducedMotion()
        const tuning = DOT_FIELD_MORPH_TUNING

        let yaw = spinYaw + morph * tuning.morphSpin
        let pitch = tuning.cubePitch + tuning.cubeWobble * Math.sin(wobblePhase)
        let roll = tuning.cubeRoll + tuning.cubeWobble * Math.cos(wobblePhase)
        let morphPasses = [morph]

        if (isStatic) {
          yaw = tuning.cubeStaticYaw
          pitch = tuning.cubePitch
          roll = tuning.cubeRoll
          morphPasses = REDUCED_MOTION_MORPH_PASSES
        }

        return {
          intro: resolveIntro(),
          wordOrigin: {
            x: Math.round(layout.wordCenter.x * pixelRatio - sampleWidth / 2),
            y: Math.round(layout.wordCenter.y * pixelRatio - sampleHeight / 2),
          },
          wordCenter: {
            x: sampleWidth / 2,
            y: sampleHeight / 2,
          },
          wordBounds: bounds === null ? PLACEHOLDER_BOUNDS : bounds,
          cubeCenter: {
            x: layout.cubeCenter.x * pixelRatio,
            y: layout.cubeCenter.y * pixelRatio,
          },
          cubeHalfSize: layout.cubeSide * tuning.cubeHalfSizeRatio * pixelRatio,
          rotation: buildCubeRotation(yaw, pitch, roll),
          morphPasses,
        }
      }

      function drawSingleFrame(): void {
        drawDotField(runtime, buildFrame())
      }

      function canPush(): boolean {
        if (!hasSettledRef.current) {
          return false
        }

        return morph === 0 || morph === 1
      }

      function resolvePhysicsSpace(frame: DotFieldFrame): DotFieldPhysicsSpace {
        if (morph === 1) {
          projectCubePoints(
            runtime.cubePoints,
            {
              center: frame.cubeCenter,
              halfSize: frame.cubeHalfSize,
              cameraDistance: DOT_FIELD_MORPH_TUNING.cameraDistance,
              rotation: frame.rotation,
            },
            runtime.cubeHomes
          )

          return {
            homes: runtime.cubeHomes,
            inkHeight:
              layout.cubeSide *
              DOT_FIELD_MORPH_TUNING.cubeInkRatio *
              pixelRatio,
            pointer,
          }
        }

        wordPointer.x = pointer.x - frame.wordOrigin.x
        wordPointer.y = pointer.y - frame.wordOrigin.y
        wordPointer.isActive = pointer.isActive

        return {
          homes: runtime.positions,
          inkHeight: runtime.inkHeight,
          pointer: wordPointer,
        }
      }

      function publishMorphState(progress: number): void {
        const nextState = resolveMorphState(progress)

        if (nextState === morphState) {
          return
        }

        morphState = nextState
        stage.dataset.morph = nextState
      }

      function renderFrame(timestamp: number): void {
        if (previousTimestamp === 0) {
          previousTimestamp = timestamp
        }

        const rawDelta = (timestamp - previousTimestamp) / 1000
        const deltaSeconds = Math.min(rawDelta, MAX_FRAME_DELTA_SECONDS)

        previousTimestamp = timestamp
        elapsedSeconds += deltaSeconds

        morph = followMorphProgress(
          morph,
          morphTarget,
          deltaSeconds,
          DOT_FIELD_MORPH_TUNING
        )

        if (morph >= 1) {
          notifySettled()
        }

        if (morph > 0) {
          spinYaw += DOT_FIELD_MORPH_TUNING.spinSpeed * deltaSeconds
          wobblePhase += DOT_FIELD_MORPH_TUNING.wobbleSpeed * deltaSeconds
        }

        const frame = buildFrame()
        const isPushing = pointer.isActive && canPush()

        if (isPushing || !isFieldAtRest) {
          const physicsSpace = resolvePhysicsSpace(frame)
          const motion = stepDotPhysics(
            {
              homes: physicsSpace.homes,
              offsets: runtime.offsets,
              velocities: runtime.velocities,
              inkHeight: physicsSpace.inkHeight,
              pointer: isPushing ? physicsSpace.pointer : null,
              deltaSeconds,
            },
            DOT_FIELD_TUNING
          )

          isFieldAtRest = !isPushing && motion < DOT_FIELD_TUNING.sleepThreshold

          if (isFieldAtRest) {
            runtime.offsets.fill(0)
            runtime.velocities.fill(0)
          }

          uploadOffsets(runtime)
        }

        drawDotField(runtime, frame)
        publishMorphState(morph)

        const isMorphResting = morph === morphTarget

        if (
          isFieldAtRest &&
          hasSettledRef.current &&
          isMorphResting &&
          morph === 0
        ) {
          frameId = 0
          return
        }

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

      function syncMorphToScroll(): void {
        morphTarget = readMorphTarget(stage, layout)
        morph = morphTarget
        publishMorphState(morph)
      }

      function onScroll(): void {
        morphTarget = readMorphTarget(stage, layout)

        if (prefersReducedMotion()) {
          morph = morphTarget
          publishMorphState(morph)
          return
        }

        startLoop()
      }

      function onPointerMove(event: PointerEvent): void {
        const stageRect = stage.getBoundingClientRect()

        pointer.x = (event.clientX - stageRect.left) * pixelRatio
        pointer.y = (event.clientY - stageRect.top) * pixelRatio
        pointer.isActive = true

        if (reducedMotionQuery?.matches === true || !canPush()) {
          return
        }

        startLoop()
      }

      function onPointerLeave(): void {
        pointer.isActive = false
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
        syncMorphToScroll()
        startLoop()
      }

      function onContextLost(event: Event): void {
        event.preventDefault()
        stopLoop()
        stage.dataset.status = "unsupported"
        unsupportedCallbackRef.current()
      }

      function applyResize(): void {
        const nextLayout = readLayout(layoutElements)

        if (!isUsableLayout(nextLayout)) {
          return
        }

        layout = nextLayout

        const previousViewport = viewportRef.current

        applyCanvasSize()

        const nextViewport = viewportRef.current
        const needsRebuild =
          previousViewport === null ||
          nextViewport === null ||
          shouldRebuildPoints(
            previousViewport,
            nextViewport,
            HEIGHT_CHANGE_IGNORE_PX
          )

        const rebuild = rebuildRef.current

        if (needsRebuild && rebuild !== null) {
          rebuild()
        }

        morphTarget = readMorphTarget(stage, layout)
        drawSingleFrame()
        startLoop()
      }

      function onLayoutObserved(): void {
        const nextLayout = readLayout(layoutElements)

        if (!isUsableLayout(nextLayout)) {
          return
        }

        const isResized = hasLayoutSizeChanged(layout, nextLayout)

        layout = nextLayout
        morphTarget = readMorphTarget(stage, layout)

        if (isResized) {
          window.clearTimeout(resizeHandle)
          resizeHandle = window.setTimeout(applyResize, RESIZE_DEBOUNCE_MS)
        }

        drawSingleFrame()
        startLoop()
      }

      function onCanvasVisibility(entries: IntersectionObserverEntry[]): void {
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

      applyCanvasSize()
      syncMorphToScroll()

      if (morphTarget > 0) {
        notifySettled()
      }

      const resizeObserver = hasResizeObserver()
        ? new ResizeObserver(onLayoutObserved)
        : null
      const intersectionObserver = hasIntersectionObserver()
        ? new IntersectionObserver(onCanvasVisibility, {
            threshold: 0,
            rootMargin: VISIBILITY_ROOT_MARGIN,
          })
        : null

      resizeObserver?.observe(stage)
      resizeObserver?.observe(wordmark)

      if (tagline !== null) {
        resizeObserver?.observe(tagline)
      }

      intersectionObserver?.observe(canvas)

      const pointerTargets = [wordmark, cube]

      for (const pointerTarget of pointerTargets) {
        pointerTarget.addEventListener("pointermove", onPointerMove)
        pointerTarget.addEventListener("pointerdown", onPointerMove)
        pointerTarget.addEventListener("pointerleave", onPointerLeave)
        pointerTarget.addEventListener("pointercancel", onPointerLeave)
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("blur", onPointerLeave)
      document.addEventListener("visibilitychange", onVisibilityChanged)
      canvas.addEventListener("webglcontextlost", onContextLost)
      reducedMotionQuery?.addEventListener("change", onMotionPreferenceChanged)

      redrawRef.current = drawSingleFrame

      startLoop()

      return function cleanupDotField() {
        stopLoop()
        redrawRef.current = null
        window.clearTimeout(resizeHandle)

        resizeObserver?.disconnect()
        intersectionObserver?.disconnect()

        for (const pointerTarget of pointerTargets) {
          pointerTarget.removeEventListener("pointermove", onPointerMove)
          pointerTarget.removeEventListener("pointerdown", onPointerMove)
          pointerTarget.removeEventListener("pointerleave", onPointerLeave)
          pointerTarget.removeEventListener("pointercancel", onPointerLeave)
        }

        window.removeEventListener("scroll", onScroll)
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
    [stageRef, heroRef, wordmarkRef, taglineRef, cubeRef, canvasRef, mode]
  )

  useEffect(
    function recolourDotField() {
      dotColorRef.current = dotColor

      const runtime = runtimeRef.current

      if (runtime === null) {
        return
      }

      applyDotColor(runtime, dotColor)

      const redraw = redrawRef.current

      if (redraw !== null) {
        redraw()
      }
    },
    [dotColor]
  )

  useEffect(
    function buildDotFieldGeometry() {
      if (mode !== "dots") {
        return
      }

      const stageElement = stageRef.current
      const canvasElement = canvasRef.current

      if (stageElement === null || canvasElement === null) {
        return
      }

      const stage: HTMLElement = stageElement
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

        const sampleViewport: DotFieldViewport = {
          width: viewport.width * viewport.pixelRatio,
          height: viewport.height * viewport.pixelRatio,
          pixelRatio: viewport.pixelRatio,
        }

        const sample = sampleWordToPoints({
          text: text.toUpperCase(),
          fontFamily: primaryFamily,
          viewport: sampleViewport,
          tuning: DOT_FIELD_TUNING,
        })

        if (sample === null) {
          return
        }

        uploadPoints(
          runtime,
          sample,
          generateCubePoints(sample.count, DOT_FIELD_MORPH_TUNING)
        )
        boundsRef.current = { left: sample.left, right: sample.right }
        sampledViewportRef.current = sampleViewport
        canvas.dataset.pointCount = String(sample.count)
        stage.dataset.status = "running"

        const redraw = redrawRef.current

        if (redraw !== null) {
          redraw()
        }
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
    [stageRef, canvasRef, text, fontFamily, mode]
  )
}
