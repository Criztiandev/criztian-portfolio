"use client"

import { useEffect, useRef } from "react"

import {
  BURST_FOLLOW_TUNING,
  CONTEXT_OPTIONS,
  DOT_FRAME_RECT_STRIDE,
  DOT_FRAME_SELECTOR,
  DOT_FIELD_MORPH_TUNING,
  DOT_FIELD_SCENE_TUNING,
  DOT_FIELD_TUNING,
  HEIGHT_CHANGE_IGNORE_PX,
  HERO_INTRO_TIMING,
  MAX_DOT_FRAMES,
  MAX_FRAME_DELTA_SECONDS,
  MORPH_LANDING_TOLERANCE_PX,
  PROJECTS_MUTATION_OPTIONS,
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
  generateScenePoints,
  parsePrimaryFontFamily,
  projectCubePoints,
  resolveBurstState,
  resolveCanvasPixelRatio,
  resolveCanvasWindowTop,
  resolveClaimTarget,
  resolveCompressedCube,
  resolveFrameShare,
  resolveIntroFrame,
  resolveMorphState,
  resolveSceneScroll,
  resolveSceneTargets,
  resolveSpinBoost,
  resolveStageProgress,
  shouldLoopSleep,
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
  DotFieldRect,
  DotFieldRuntime,
  DotFieldSceneScroll,
  DotFieldViewport,
  HeroBurstState,
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

function readFrameRects(
  projects: HTMLElement,
  stageRect: DOMRect
): DotFieldRect[] {
  const frames: DotFieldRect[] = []
  const frameElements = projects.querySelectorAll(DOT_FRAME_SELECTOR)

  for (const frameElement of frameElements) {
    if (frames.length >= MAX_DOT_FRAMES) {
      break
    }

    const frameRect = frameElement.getBoundingClientRect()

    frames.push({
      x: frameRect.left - stageRect.left,
      y: frameRect.top - stageRect.top,
      width: frameRect.width,
      height: frameRect.height,
    })
  }

  return frames
}

function readLayout(elements: DotFieldLayoutElements): DotFieldLayout {
  const stageRect = elements.stage.getBoundingClientRect()
  const wordRect = elements.wordmark.getBoundingClientRect()
  const cubeRect = elements.cube.getBoundingClientRect()
  const projectsRect = elements.projects.getBoundingClientRect()
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
    stageHeight: stageRect.height,
    projectsTop: projectsRect.top - stageRect.top,
    projectsBottom: projectsRect.bottom - stageRect.top,
    frames: readFrameRects(elements.projects, stageRect),
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

function readScrolled(stage: HTMLElement): number {
  return -stage.getBoundingClientRect().top
}

function readSceneScroll(
  scrolled: number,
  layout: DotFieldLayout
): DotFieldSceneScroll {
  return resolveSceneScroll(
    {
      scrolled,
      viewportHeight: window.innerHeight,
      projectsTop: layout.projectsTop,
      stageWidth: layout.width,
    },
    DOT_FIELD_SCENE_TUNING
  )
}

function resolveMorphTarget(scrolled: number, layout: DotFieldLayout): number {
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
    projectsRef,
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
      const projectsElement = projectsRef.current
      const canvasElement = canvasRef.current

      if (
        stageElement === null ||
        heroElement === null ||
        wordmarkElement === null ||
        cubeElement === null ||
        projectsElement === null ||
        canvasElement === null
      ) {
        return
      }

      const stage: HTMLElement = stageElement
      const wordmark: HTMLElement = wordmarkElement
      const cube: HTMLElement = cubeElement
      const projects: HTMLElement = projectsElement
      const canvas: HTMLCanvasElement = canvasElement
      const tagline = taglineRef.current
      const layoutElements: DotFieldLayoutElements = {
        stage,
        hero: heroElement,
        wordmark,
        cube,
        projects,
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
        stage.dataset.burst = "off"
        unsupportedCallbackRef.current()
        return
      }

      let runtime: DotFieldRuntime

      try {
        runtime = createDotFieldRuntime(context)
      } catch {
        stage.dataset.status = "unsupported"
        stage.dataset.burst = "off"
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
      let canvasHeight = 0
      let layout = readLayout(layoutElements)
      let scrolled = readScrolled(stage)
      let sceneScroll = readSceneScroll(scrolled, layout)
      let morph = 0
      let morphTarget = 0
      let compress = 0
      let compressTarget = 0
      let burst = 0
      let burstTarget = 0
      let windowTop = 0
      const claims = new Float32Array(MAX_DOT_FRAMES)
      const claimTargets = new Float32Array(MAX_DOT_FRAMES)
      const frameRects = new Float32Array(
        MAX_DOT_FRAMES * DOT_FRAME_RECT_STRIDE
      )
      let spinYaw = 0
      let wobblePhase = 0
      let isFieldAtRest = true
      let areClaimsResting = true
      let morphState: HeroMorphState = "name"
      let burstState: HeroBurstState = "off"

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
        canvasHeight = deviceHeight / pixelRatio
        canvas.style.width = deviceWidth / pixelRatio + "px"
        canvas.style.height = canvasHeight + "px"

        applyStaticUniforms(
          runtime,
          DOT_FIELD_TUNING,
          DOT_FIELD_MORPH_TUNING,
          DOT_FIELD_SCENE_TUNING,
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
        const sceneTuning = DOT_FIELD_SCENE_TUNING
        const compressed = resolveCompressedCube(
          {
            slotCenter: {
              x: layout.cubeCenter.x * pixelRatio,
              y: layout.cubeCenter.y * pixelRatio,
            },
            burstPoint: {
              x: sceneScroll.burstPoint.x * pixelRatio,
              y: sceneScroll.burstPoint.y * pixelRatio,
            },
            halfSize: layout.cubeSide * tuning.cubeHalfSizeRatio * pixelRatio,
            compress,
          },
          sceneTuning,
          tuning.farLight
        )
        const dustHeight = layout.projectsBottom - sceneScroll.dustTop
        const sparkReach = Math.max(layout.width, window.innerHeight)
        const visibleCount = Math.min(
          runtime.pointCount,
          tuning.cubeEdgePointLimit
        )
        const frameShare = resolveFrameShare(
          visibleCount,
          layout.frames,
          sceneTuning
        )

        writeFrameRects()

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
          cubeCenter: compressed.center,
          cubeHalfSize: compressed.halfSize,
          rotation: buildCubeRotation(yaw, pitch, roll),
          morphPasses,
          windowTop: windowTop * pixelRatio,
          burst,
          farLight: compressed.farLight,
          sparkRadius: sceneTuning.sparkRadiusRatio * sparkReach * pixelRatio,
          dustRect: {
            x: 0,
            y: sceneScroll.dustTop * pixelRatio,
            width: layout.width * pixelRatio,
            height: Math.max(0, dustHeight) * pixelRatio,
          },
          shares: {
            x: frameShare,
            y: frameShare + sceneTuning.dustShare,
          },
          frameCount: layout.frames.length,
          frameRects,
          claims,
          frameBand:
            sceneTuning.frameBandViewport * window.innerHeight * pixelRatio,
        }
      }

      function drawSingleFrame(): void {
        drawDotField(runtime, buildFrame())
      }

      function canPush(): boolean {
        if (!hasSettledRef.current || compress !== 0 || burst !== 0) {
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

      function publishBurstState(): void {
        const nextState = resolveBurstState(burstTarget, prefersReducedMotion())

        if (nextState === burstState) {
          return
        }

        burstState = nextState
        stage.dataset.burst = nextState
      }

      function writeFrameRects(): void {
        frameRects.fill(0)

        let offset = 0

        for (const frame of layout.frames) {
          frameRects[offset] = frame.x * pixelRatio
          frameRects[offset + 1] = frame.y * pixelRatio
          frameRects[offset + 2] = frame.width * pixelRatio
          frameRects[offset + 3] = frame.height * pixelRatio
          offset += DOT_FRAME_RECT_STRIDE
        }
      }

      function writeClaimTargets(): void {
        claimTargets.fill(0)

        let index = 0

        for (const frame of layout.frames) {
          claimTargets[index] = resolveClaimTarget(
            {
              frameTop: frame.y,
              scrolled,
              viewportHeight: window.innerHeight,
              burst,
            },
            DOT_FIELD_SCENE_TUNING
          )
          index += 1
        }
      }

      function followClaims(deltaSeconds: number): boolean {
        let isResting = true

        for (let index = 0; index < MAX_DOT_FRAMES; index += 1) {
          claims[index] = followMorphProgress(
            claims[index],
            claimTargets[index],
            deltaSeconds,
            DOT_FIELD_MORPH_TUNING
          )

          if (claims[index] !== claimTargets[index]) {
            isResting = false
          }
        }

        return isResting
      }

      function advanceScene(deltaSeconds: number): void {
        const targets = resolveSceneTargets(
          {
            rawCompress: sceneScroll.rawCompress,
            isRearmed: sceneScroll.isRearmed,
            compress,
            burst,
            burstTarget,
          },
          DOT_FIELD_SCENE_TUNING
        )

        compressTarget = targets.compressTarget
        burstTarget = targets.burstTarget
        compress = followMorphProgress(
          compress,
          compressTarget,
          deltaSeconds,
          DOT_FIELD_MORPH_TUNING
        )
        burst = followMorphProgress(
          burst,
          burstTarget,
          deltaSeconds,
          BURST_FOLLOW_TUNING
        )
        writeClaimTargets()
        areClaimsResting = followClaims(deltaSeconds)
      }

      function snapScene(): void {
        if (prefersReducedMotion()) {
          compress = 0
          compressTarget = 0
          burst = 0
          burstTarget = 0
          claims.fill(0)
          claimTargets.fill(0)
          areClaimsResting = true
          return
        }

        const targets = resolveSceneTargets(
          {
            rawCompress: sceneScroll.rawCompress,
            isRearmed: sceneScroll.isRearmed,
            compress: sceneScroll.rawCompress,
            burst: 0,
            burstTarget: 0,
          },
          DOT_FIELD_SCENE_TUNING
        )

        compressTarget = targets.compressTarget
        compress = compressTarget
        burstTarget = targets.burstTarget
        burst = burstTarget
        writeClaimTargets()
        claims.set(claimTargets)
        areClaimsResting = true
      }

      function syncCanvasWindow(): boolean {
        const nextTop = resolveCanvasWindowTop(
          {
            scrolled,
            viewportHeight: window.innerHeight,
            canvasHeight,
            stageHeight: layout.stageHeight,
            projectsTop: layout.projectsTop,
            pixelRatio,
            isStatic: prefersReducedMotion(),
            isSceneActive: compress > 0 || burst > 0,
          },
          DOT_FIELD_SCENE_TUNING
        )

        if (nextTop === windowTop) {
          return false
        }

        windowTop = nextTop

        if (nextTop === 0) {
          canvas.style.transform = ""
        } else {
          canvas.style.transform = "translate3d(0, " + nextTop + "px, 0)"
        }

        return true
      }

      function readScrollTargets(): void {
        scrolled = readScrolled(stage)
        morphTarget = resolveMorphTarget(scrolled, layout)
        sceneScroll = readSceneScroll(scrolled, layout)
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

        advanceScene(deltaSeconds)
        syncCanvasWindow()

        if (morph > 0 && burst < 1) {
          const spinBoost = resolveSpinBoost(compress, DOT_FIELD_SCENE_TUNING)

          spinYaw += DOT_FIELD_MORPH_TUNING.spinSpeed * spinBoost * deltaSeconds
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
        publishBurstState()

        const isLoopDone = shouldLoopSleep({
          isFieldAtRest,
          hasSettled: hasSettledRef.current,
          isMorphResting: morph === morphTarget,
          isSceneResting:
            compress === compressTarget &&
            burst === burstTarget &&
            areClaimsResting,
          morph,
          burst,
        })

        if (isLoopDone) {
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
        readScrollTargets()
        morph = morphTarget
        snapScene()
        syncCanvasWindow()
        publishMorphState(morph)
        publishBurstState()
      }

      function onScroll(): void {
        readScrollTargets()

        if (prefersReducedMotion()) {
          morph = morphTarget
          publishMorphState(morph)
          return
        }

        if (syncCanvasWindow() && frameId === 0) {
          drawSingleFrame()
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
        drawSingleFrame()
        startLoop()
      }

      function onContextLost(event: Event): void {
        event.preventDefault()
        stopLoop()
        stage.dataset.status = "unsupported"
        stage.dataset.burst = "off"
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

        readScrollTargets()
        syncCanvasWindow()
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
        readScrollTargets()
        syncCanvasWindow()

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
      resizeObserver?.observe(projects)

      const mutationObserver = new MutationObserver(onLayoutObserved)

      mutationObserver.observe(projects, PROJECTS_MUTATION_OPTIONS)

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
        mutationObserver.disconnect()
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
    [
      stageRef,
      heroRef,
      wordmarkRef,
      taglineRef,
      cubeRef,
      projectsRef,
      canvasRef,
      mode,
    ]
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
          generateCubePoints(sample.count, DOT_FIELD_MORPH_TUNING),
          generateScenePoints(sample.count)
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
