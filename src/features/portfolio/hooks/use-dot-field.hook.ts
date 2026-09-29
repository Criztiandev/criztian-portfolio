"use client"

import { useEffect, useRef } from "react"

import {
  CONTEXT_OPTIONS,
  DOT_FIELD_MORPH_TUNING,
  DOT_FIELD_TUNING,
  DOT_SCENE_MOTION,
  DOT_SCENE_SELECTOR,
  DOT_SLOT_SELECTOR,
  DOT_STAGE_SELECTOR,
  HEIGHT_CHANGE_IGNORE_PX,
  HERO_INTRO_TIMING,
  IN_PAGE_ANCHOR_SELECTOR,
  JUMP_CANCEL_EVENTS,
  MAX_FRAME_DELTA_SECONDS,
  MORPH_LANDING_TOLERANCE_PX,
  RESIZE_DEBOUNCE_MS,
  SETTLED_INTRO_SECONDS,
  THREAD_REVEAL_DECIMALS,
  THREAD_REVEAL_PROPERTY_PREFIX,
} from "@/data/hero.data"
import {
  hasFontLoadingApi,
  hasResizeObserver,
  prefersReducedMotion,
  readReducedMotionQuery,
} from "@/features/portfolio/browser-capability.rules"
import {
  applyArrivalImpulse,
  buildFontShorthand,
  buildSceneKeyframes,
  buildShapeLibrary,
  easeInOutSine,
  followTriggeredProgress,
  isShapeSpinning,
  parseCssPixels,
  parsePrimaryFontFamily,
  parseSceneShapes,
  projectShapePoints,
  resolveCanvasPixelRatio,
  resolveIntroFrame,
  resolvePlacement,
  resolveSceneState,
  resolveThreadReveal,
  resolveThreadState,
  resolveStaticKeyframe,
  resolveArrivalStrike,
  resolveTimelinePosition,
  resolveTriggeredTarget,
  resolveTimelineSegment,
  resolveViewportHeight,
  shouldLoopSleep,
  shouldRebuildPoints,
  stepDotPhysics,
  writeNameHomes,
} from "@/features/portfolio/dot-field.rules"
import {
  applyClearColor,
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
  DotFieldFrame,
  DotFieldIntroFrame,
  DotFieldLayout,
  DotFieldNameSample,
  DotFieldPlacement,
  DotFieldPointer,
  DotFieldRuntime,
  DotFieldVector,
  DotFieldViewport,
  DotSceneKeyframe,
  DotSceneMeasure,
  DotTimelineSegment,
  UseDotFieldRequest,
} from "@/types/hero.type"

const PLACEHOLDER_NAME_SAMPLE: DotFieldNameSample = {
  width: 0,
  height: 0,
  bounds: {
    left: 0,
    right: 1,
  },
  inkHeight: 1,
}

function createPointer(): DotFieldPointer {
  return {
    x: 0,
    y: 0,
    isActive: false,
  }
}

function warnOnContractBreach(
  container: HTMLElement,
  frame: Element,
  slot: HTMLElement
): void {
  if (process.env.NODE_ENV === "production") {
    return
  }

  const style = getComputedStyle(container)
  const hasPadding =
    parseCssPixels(style.paddingTop) !== 0 ||
    parseCssPixels(style.paddingBottom) !== 0

  if (!frame.contains(slot) || hasPadding) {
    console.warn(
      `Dot scene "${container.dataset.dotScene}" breaks the DOM contract in plans/handoff.md`
    )
  }
}

function readSceneMeasure(
  container: HTMLElement,
  scrolled: number
): DotSceneMeasure {
  const containerRect = container.getBoundingClientRect()
  const slot = container.querySelector<HTMLElement>(DOT_SLOT_SELECTOR)
  const frame = container.firstElementChild
  const measure: DotSceneMeasure = {
    id: container.dataset.dotScene ?? "",
    shapes: parseSceneShapes(container.dataset.dotShapes),
    containerTop: containerRect.top + scrolled,
    containerBottom: containerRect.bottom + scrolled,
    stickyTop: parseCssPixels(getComputedStyle(container).scrollMarginTop),
    frameHeight: 0,
    slot: null,
  }

  if (slot === null || frame === null) {
    return measure
  }

  warnOnContractBreach(container, frame, slot)

  const frameRect = frame.getBoundingClientRect()
  const slotRect = slot.getBoundingClientRect()
  const stickyTop = parseCssPixels(getComputedStyle(frame).top)

  return {
    ...measure,
    stickyTop,
    frameHeight: frameRect.height,
    slot: {
      x: slotRect.left,
      y: slotRect.top - frameRect.top + stickyTop,
      width: slotRect.width,
      height: slotRect.height,
    },
  }
}

function readLayout(
  stage: HTMLElement,
  layer: HTMLElement,
  wordmark: HTMLElement
): DotFieldLayout {
  const layerRect = layer.getBoundingClientRect()
  const wordRect = wordmark.getBoundingClientRect()
  const scenes: DotSceneMeasure[] = []
  const containers = stage.querySelectorAll<HTMLElement>(DOT_SCENE_SELECTOR)

  for (const container of containers) {
    scenes.push(readSceneMeasure(container, window.scrollY))
  }

  return {
    width: layerRect.width,
    height: layerRect.height,
    wordWidth: wordRect.width,
    wordHeight: wordRect.height,
    viewportHeight: resolveViewportHeight(scenes, layerRect.height),
    scenes,
  }
}

function readThreadContainers(stage: HTMLElement): HTMLElement[] {
  const containers: HTMLElement[] = []

  for (const container of stage.querySelectorAll<HTMLElement>(
    DOT_SCENE_SELECTOR
  )) {
    const motion = DOT_SCENE_MOTION[container.dataset.dotScene ?? ""]

    if (motion?.isThread === true) {
      containers.push(container)
    }
  }

  return containers
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
  if (layout.width <= 0 || layout.height <= 0) {
    return false
  }

  return layout.wordWidth > 0 && layout.wordHeight > 0
}

function buildKeyframes(layout: DotFieldLayout): DotSceneKeyframe[] {
  return buildSceneKeyframes(
    layout.scenes,
    layout.viewportHeight,
    DOT_FIELD_MORPH_TUNING
  )
}

export function useDotField(request: UseDotFieldRequest): void {
  const {
    canvasRef,
    wordmarkRef,
    taglineRef,
    text,
    fontFamily,
    dotColor,
    backgroundColor,
    mode,
    onIntroSettled,
    onUnsupported,
  } = request

  const runtimeRef = useRef<DotFieldRuntime | null>(null)
  const pointerRef = useRef<DotFieldPointer>(createPointer())
  const viewportRef = useRef<DotFieldViewport | null>(null)
  const nameSampleRef = useRef<DotFieldNameSample | null>(null)
  const rebuildRef = useRef<(() => void) | null>(null)
  const redrawRef = useRef<(() => void) | null>(null)
  const introStartRef = useRef<number | null>(null)
  const hasSettledRef = useRef(false)
  const dotColorRef = useRef(dotColor)
  const backgroundColorRef = useRef(backgroundColor)
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
      const canvasElement = canvasRef.current
      const wordmarkElement = wordmarkRef.current

      if (canvasElement === null || wordmarkElement === null) {
        return
      }

      const stageElement =
        canvasElement.closest<HTMLElement>(DOT_STAGE_SELECTOR)
      const layerElement = canvasElement.parentElement

      if (stageElement === null || layerElement === null) {
        return
      }

      const canvas: HTMLCanvasElement = canvasElement
      const wordmark: HTMLElement = wordmarkElement
      const stage: HTMLElement = stageElement
      const layer: HTMLElement = layerElement
      const tagline = taglineRef.current

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

      function markUnsupported(): void {
        stage.dataset.status = "unsupported"
        unsupportedCallbackRef.current()
      }

      const context = canvas.getContext("webgl2", CONTEXT_OPTIONS)

      if (context === null) {
        markUnsupported()
        return
      }

      let runtime: DotFieldRuntime

      try {
        runtime = createDotFieldRuntime(context, buildShapeLibrary())
      } catch {
        markUnsupported()
        return
      }

      runtimeRef.current = runtime
      applyDotColor(runtime, dotColorRef.current)
      applyClearColor(runtime, backgroundColorRef.current)

      const pointer = pointerRef.current
      const reducedMotionQuery = readReducedMotionQuery()
      const slots = Array.from(
        stage.querySelectorAll<HTMLElement>(DOT_SLOT_SELECTOR)
      )

      let frameId = 0
      let previousTimestamp = 0
      let elapsedSeconds = 0
      let resizeHandle = 0
      let pixelRatio = 1
      let layout = readLayout(stage, layer, wordmark)
      let keyframes = buildKeyframes(layout)
      let progress = 0
      let progressTarget = 0
      let previousScrollTarget = Number.NaN
      let threadState: string | null = null
      const threadContainers = readThreadContainers(stage)
      const threadReveals = new Map<string, string>()
      let staticIndex = -1
      let spinSeconds = 0
      let isFieldAtRest = true
      let sceneState = stage.dataset.scene ?? ""
      let jumpScrollTop: number | null = null
      let isSnapPending = false
      let landedIndex = -1
      let strikeStartSeconds = Number.NEGATIVE_INFINITY

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

      function resolveNameSample(): DotFieldNameSample {
        const sample = nameSampleRef.current

        if (sample === null) {
          return PLACEHOLDER_NAME_SAMPLE
        }

        return sample
      }

      function resolveIntro(): DotFieldIntroFrame {
        const sample = nameSampleRef.current

        if (sample === null) {
          return resolveIntroFrame(
            SETTLED_INTRO_SECONDS,
            HERO_INTRO_TIMING,
            PLACEHOLDER_NAME_SAMPLE.bounds,
            pixelRatio
          )
        }

        if (hasSettledRef.current || prefersReducedMotion()) {
          notifySettled()

          return resolveIntroFrame(
            SETTLED_INTRO_SECONDS,
            HERO_INTRO_TIMING,
            sample.bounds,
            pixelRatio
          )
        }

        if (introStartRef.current === null) {
          introStartRef.current = elapsedSeconds
        }

        const frame = resolveIntroFrame(
          elapsedSeconds - introStartRef.current,
          HERO_INTRO_TIMING,
          sample.bounds,
          pixelRatio
        )

        if (frame.isSettled) {
          notifySettled()
        }

        return frame
      }

      function resolveSegment(): DotTimelineSegment {
        if (!prefersReducedMotion()) {
          return resolveTimelineSegment(progress, keyframes.length)
        }

        return {
          fromIndex: staticIndex,
          toIndex: staticIndex,
          progress: 0,
        }
      }

      function placeKeyframe(
        keyframe: DotSceneKeyframe,
        yawOffset: number,
        introScale: number
      ): DotFieldPlacement {
        return resolvePlacement({
          keyframe,
          viewport: {
            width: layout.width,
            height: layout.height,
            pixelRatio,
          },
          nameSample: resolveNameSample(),
          introScale,
          spinSeconds,
          yawOffset,
          isStatic: prefersReducedMotion(),
        })
      }

      function resolveStrike(): number {
        if (prefersReducedMotion()) {
          return 0
        }

        return resolveArrivalStrike(
          elapsedSeconds - strikeStartSeconds,
          DOT_FIELD_MORPH_TUNING.strikeSeconds
        )
      }

      function resolveShapeCenter(frame: DotFieldFrame): DotFieldVector {
        const placement = frame.from

        if (placement.shape !== "name") {
          return placement.center
        }

        return {
          x: placement.center.x + frame.wordCenter.x,
          y: placement.center.y + frame.wordCenter.y,
        }
      }

      function strikeOnLanding(frame: DotFieldFrame): void {
        if (!Number.isInteger(progress)) {
          landedIndex = -1
          return
        }

        if (progress === landedIndex) {
          return
        }

        landedIndex = progress

        const sinceLastStrike = elapsedSeconds - strikeStartSeconds

        if (
          !canPush() ||
          sinceLastStrike < DOT_FIELD_MORPH_TUNING.strikeMinIntervalSeconds
        ) {
          return
        }

        strikeStartSeconds = elapsedSeconds
        writeHomes(frame)
        applyArrivalImpulse(
          runtime.homes,
          runtime.velocities,
          resolveShapeCenter(frame),
          (DOT_FIELD_MORPH_TUNING.strikeImpulse * frame.from.inkHeight) /
            DOT_FIELD_TUNING.referenceInkHeight
        )
        isFieldAtRest = false
      }

      function buildFrame(): DotFieldFrame | null {
        const segment = resolveSegment()
        const fromKeyframe = keyframes[segment.fromIndex]
        const toKeyframe = keyframes[segment.toIndex]

        if (fromKeyframe === undefined || toKeyframe === undefined) {
          return null
        }

        const intro = resolveIntro()
        const nameSample = resolveNameSample()
        const isThread =
          fromKeyframe.isThread === true && toKeyframe.isThread === true

        let morphSpin = DOT_FIELD_MORPH_TUNING.morphSpin

        if (isThread) {
          morphSpin *= DOT_FIELD_MORPH_TUNING.threadSpin
        }

        return {
          intro,
          wordCenter: {
            x: nameSample.width / 2,
            y: nameSample.height / 2,
          },
          wordBounds: nameSample.bounds,
          progress: isThread
            ? easeInOutSine(segment.progress)
            : segment.progress,
          strike: resolveStrike(),
          thread: isThread ? 1 : 0,
          from: placeKeyframe(
            fromKeyframe,
            segment.progress * morphSpin,
            intro.scale
          ),
          to: placeKeyframe(
            toKeyframe,
            (segment.progress - 1) * morphSpin,
            intro.scale
          ),
        }
      }

      function publishSceneState(): void {
        let nextState = resolveSceneState(keyframes, progress)

        if (prefersReducedMotion()) {
          nextState = resolveSceneState(keyframes, staticIndex)
        }

        if (nextState === sceneState) {
          return
        }

        sceneState = nextState
        stage.dataset.scene = nextState
      }

      function publishThreadState(): void {
        const nextState = resolveThreadState(keyframes, progressTarget)

        if (nextState === threadState) {
          return
        }

        threadState = nextState

        if (nextState === null) {
          delete stage.dataset.thread
          return
        }

        stage.dataset.thread = nextState
      }

      function publishThreadReveal(): void {
        for (let index = 0; index < keyframes.length; index += 1) {
          const keyframe = keyframes[index]

          if (keyframe?.isThread !== true) {
            continue
          }

          const reveal = resolveThreadReveal(
            progress,
            index,
            DOT_FIELD_MORPH_TUNING.threadCaptionSpan
          ).toFixed(THREAD_REVEAL_DECIMALS)

          if (threadReveals.get(keyframe.id) === reveal) {
            continue
          }

          threadReveals.set(keyframe.id, reveal)

          for (const container of threadContainers) {
            container.style.setProperty(
              THREAD_REVEAL_PROPERTY_PREFIX + keyframe.id,
              reveal
            )
          }
        }
      }

      function drawSingleFrame(): void {
        drawDotField(runtime, buildFrame())
        publishSceneState()
        publishThreadState()
        publishThreadReveal()
      }

      function canPush(): boolean {
        if (!hasSettledRef.current || prefersReducedMotion()) {
          return false
        }

        if (!Number.isInteger(progress)) {
          return false
        }

        const keyframe = keyframes[progress]

        return keyframe !== undefined && keyframe.slot !== null
      }

      function writeHomes(frame: DotFieldFrame): void {
        const placement = frame.from

        if (placement.shape === "name") {
          writeNameHomes(
            runtime.positions,
            placement,
            frame.wordCenter,
            runtime.homes
          )
          return
        }

        projectShapePoints(
          runtime.shapePoints[placement.shape],
          placement,
          runtime.homes
        )
      }

      function isSegmentSpinning(): boolean {
        const segment = resolveTimelineSegment(progress, keyframes.length)
        const fromKeyframe = keyframes[segment.fromIndex]
        const toKeyframe = keyframes[segment.toIndex]
        const isFromSpinning =
          fromKeyframe !== undefined && isShapeSpinning(fromKeyframe.shape)
        const isToSpinning =
          segment.progress > 0 &&
          toKeyframe !== undefined &&
          isShapeSpinning(toKeyframe.shape)

        return isFromSpinning || isToSpinning
      }

      function renderFrame(timestamp: number): void {
        if (previousTimestamp === 0) {
          previousTimestamp = timestamp
        }

        const rawDelta = (timestamp - previousTimestamp) / 1000
        const deltaSeconds = Math.min(rawDelta, MAX_FRAME_DELTA_SECONDS)

        previousTimestamp = timestamp
        elapsedSeconds += deltaSeconds

        if (isSnapPending) {
          progress = progressTarget
          isSnapPending = false
        } else {
          progress = followTriggeredProgress(
            progress,
            progressTarget,
            deltaSeconds,
            keyframes,
            DOT_FIELD_MORPH_TUNING
          )
        }

        if (progress >= 1) {
          notifySettled()
        }

        const isSpinning = isSegmentSpinning()

        if (isSpinning) {
          spinSeconds += deltaSeconds
        }

        let frame = buildFrame()

        if (frame !== null) {
          strikeOnLanding(frame)
          frame = { ...frame, strike: resolveStrike() }
        }

        const isPushing = frame !== null && pointer.isActive && canPush()

        if (frame !== null && (isPushing || !isFieldAtRest)) {
          if (isPushing) {
            writeHomes(frame)
          }

          const motion = stepDotPhysics(
            {
              homes: runtime.homes,
              offsets: runtime.offsets,
              velocities: runtime.velocities,
              inkHeight: frame.from.inkHeight,
              pointer: isPushing ? pointer : null,
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
        publishSceneState()
        publishThreadState()
        publishThreadReveal()

        const isLoopDone = shouldLoopSleep({
          isFieldAtRest,
          hasSettled: hasSettledRef.current,
          isProgressResting: progress === progressTarget,
          isSpinning,
          isStriking: frame !== null && frame.strike > 0,
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
        if (frameId !== 0 || document.visibilityState === "hidden") {
          return
        }

        if (prefersReducedMotion()) {
          drawSingleFrame()
          return
        }

        previousTimestamp = 0
        frameId = window.requestAnimationFrame(renderFrame)
      }

      function resolveScrollSource(): number {
        const scrolled = window.scrollY

        if (jumpScrollTop === null) {
          return scrolled
        }

        if (Math.abs(scrolled - jumpScrollTop) <= MORPH_LANDING_TOLERANCE_PX) {
          jumpScrollTop = null

          return scrolled
        }

        return jumpScrollTop
      }

      function readScrollTargets(): boolean {
        const scrolled = resolveScrollSource()
        const nextStaticIndex = resolveStaticKeyframe(
          keyframes,
          scrolled,
          MORPH_LANDING_TOLERANCE_PX
        )
        const hasStaticChanged = nextStaticIndex !== staticIndex

        const scrollTarget = resolveTimelinePosition(
          keyframes,
          scrolled,
          MORPH_LANDING_TOLERANCE_PX
        )

        progressTarget = resolveTriggeredTarget({
          keyframes,
          scrollTarget,
          previousScrollTarget,
          committedTarget: progressTarget,
          trigger: DOT_FIELD_MORPH_TUNING.threadTrigger,
        })

        if (Math.abs(scrollTarget - previousScrollTarget) > 1) {
          isSnapPending = true
        }

        previousScrollTarget = scrollTarget
        staticIndex = nextStaticIndex

        return hasStaticChanged
      }

      function syncToScroll(): void {
        readScrollTargets()
        progress = progressTarget
        landedIndex = Number.isInteger(progress) ? progress : -1
      }

      function onScroll(): void {
        const hasStaticChanged = readScrollTargets()

        if (prefersReducedMotion()) {
          if (hasStaticChanged) {
            drawSingleFrame()
          }

          return
        }

        startLoop()
      }

      function onAnchorClick(event: MouseEvent): void {
        const isModified =
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey

        if (isModified || !(event.target instanceof Element)) {
          return
        }

        const anchor = event.target.closest<HTMLAnchorElement>(
          IN_PAGE_ANCHOR_SELECTOR
        )

        if (anchor === null) {
          return
        }

        const destination = document.getElementById(
          decodeURIComponent(anchor.hash.slice(1))
        )

        if (destination === null) {
          return
        }

        const margin = parseCssPixels(
          getComputedStyle(destination).scrollMarginTop
        )
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight
        const destinationTop =
          destination.getBoundingClientRect().top + window.scrollY - margin

        jumpScrollTop = Math.min(Math.max(destinationTop, 0), maxScroll)
        onScroll()
      }

      function clearJump(): void {
        jumpScrollTop = null
      }

      function onPointerMove(event: PointerEvent): void {
        const layerRect = layer.getBoundingClientRect()

        pointer.x = (event.clientX - layerRect.left) * pixelRatio
        pointer.y = (event.clientY - layerRect.top) * pixelRatio
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
        pointer.isActive = false
        isFieldAtRest = true
        runtime.offsets.fill(0)
        runtime.velocities.fill(0)
        uploadOffsets(runtime)
        syncToScroll()
        drawSingleFrame()
        startLoop()
      }

      function onContextLost(event: Event): void {
        event.preventDefault()
        stopLoop()
        markUnsupported()
      }

      function applyResize(): void {
        const nextLayout = readLayout(stage, layer, wordmark)

        if (!isUsableLayout(nextLayout)) {
          return
        }

        layout = nextLayout
        keyframes = buildKeyframes(layout)

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
        drawSingleFrame()
        startLoop()
      }

      function onLayoutObserved(): void {
        const nextLayout = readLayout(stage, layer, wordmark)

        if (!isUsableLayout(nextLayout)) {
          return
        }

        const isResized = hasLayoutSizeChanged(layout, nextLayout)

        layout = nextLayout
        keyframes = buildKeyframes(layout)
        readScrollTargets()

        if (isResized) {
          window.clearTimeout(resizeHandle)
          resizeHandle = window.setTimeout(applyResize, RESIZE_DEBOUNCE_MS)
        }

        drawSingleFrame()
        startLoop()
      }

      applyCanvasSize()
      syncToScroll()

      if (progressTarget > 0) {
        notifySettled()
      }

      const resizeObserver = hasResizeObserver()
        ? new ResizeObserver(onLayoutObserved)
        : null
      const observedElements: HTMLElement[] = [stage, layer, wordmark]

      if (tagline !== null) {
        observedElements.push(tagline)
      }

      for (const observedElement of observedElements) {
        resizeObserver?.observe(observedElement)
      }

      for (const slot of slots) {
        resizeObserver?.observe(slot)
        slot.addEventListener("pointermove", onPointerMove)
        slot.addEventListener("pointerdown", onPointerMove)
        slot.addEventListener("pointerleave", onPointerLeave)
        slot.addEventListener("pointercancel", onPointerLeave)
      }

      window.addEventListener("scroll", onScroll, { passive: true })
      document.addEventListener("click", onAnchorClick, { capture: true })

      for (const eventName of JUMP_CANCEL_EVENTS) {
        window.addEventListener(eventName, clearJump, { passive: true })
      }

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

        for (const slot of slots) {
          slot.removeEventListener("pointermove", onPointerMove)
          slot.removeEventListener("pointerdown", onPointerMove)
          slot.removeEventListener("pointerleave", onPointerLeave)
          slot.removeEventListener("pointercancel", onPointerLeave)
        }

        window.removeEventListener("scroll", onScroll)
        document.removeEventListener("click", onAnchorClick, { capture: true })

        for (const eventName of JUMP_CANCEL_EVENTS) {
          window.removeEventListener(eventName, clearJump)
        }

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
    [canvasRef, wordmarkRef, taglineRef, mode]
  )

  useEffect(
    function recolourDotField() {
      dotColorRef.current = dotColor
      backgroundColorRef.current = backgroundColor

      const runtime = runtimeRef.current

      if (runtime === null) {
        return
      }

      applyDotColor(runtime, dotColor)
      applyClearColor(runtime, backgroundColor)

      const redraw = redrawRef.current

      if (redraw !== null) {
        redraw()
      }
    },
    [dotColor, backgroundColor]
  )

  useEffect(
    function buildDotFieldGeometry() {
      if (mode !== "dots") {
        return
      }

      const canvasElement = canvasRef.current

      if (canvasElement === null) {
        return
      }

      const stageElement =
        canvasElement.closest<HTMLElement>(DOT_STAGE_SELECTOR)

      if (stageElement === null) {
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

        uploadPoints(runtime, sample)
        nameSampleRef.current = {
          width: sampleViewport.width,
          height: sampleViewport.height,
          bounds: {
            left: sample.left,
            right: sample.right,
          },
          inkHeight: sample.inkHeight,
        }
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
    [canvasRef, text, fontFamily, mode]
  )
}
