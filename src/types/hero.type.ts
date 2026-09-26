export type HeroWordmarkMode = "dots" | "text"

export type HeroMorphState = "name" | "moving" | "cube"

export type HeroBurstState = "off" | "idle" | "open"

export type CubicBezier = [number, number, number, number]

export type CubeVector = [number, number, number]

export type CubeEdge = {
  start: CubeVector
  end: CubeVector
}

export type CubeFace = {
  axis: 0 | 1 | 2
  side: number
}

export type RandomSource = () => number

export type DotFieldVector = {
  x: number
  y: number
}

export type DotFieldMorphTuning = {
  morphStartRatio: number
  morphFollowRate: number
  morphSettleEpsilon: number
  morphStagger: number
  morphJitter: number
  morphArcPixels: number
  cubeHalfSizeRatio: number
  cameraDistance: number
  cubePitch: number
  cubeRoll: number
  cubeWobble: number
  wobbleSpeed: number
  cubeStaticYaw: number
  spinSpeed: number
  morphSpin: number
  cubeEdgePointLimit: number
  cubeEdgeJitter: number
  cubeFaceAlpha: number
  farLight: number
  cubeDotSize: number
  cubeInkRatio: number
}

export type DotFieldSceneTuning = {
  compressStartViewport: number
  compressEndViewport: number
  burstPointViewport: number
  compressedScale: number
  compressSpinBoost: number
  compressFarLight: number
  burstGate: number
  burstHold: number
  burstFollowRate: number
  rearmViewport: number
  burstStagger: number
  sparkRadiusRatio: number
  sparkFade: number
  dustShare: number
  dustOpacity: number
  dustDotSize: number
  frameBandViewport: number
  maxFrameShare: number
  frameDotSpacingPx: number
  frameOutsetPx: number
  frameJitterPx: number
  frameDotSize: number
  frameOpacity: number
  claimStartViewport: number
  claimEndViewport: number
  claimGate: number
  claimStagger: number
  windowStepRatio: number
}

export type DotFieldFollowTuning = Pick<
  DotFieldMorphTuning,
  "morphFollowRate" | "morphSettleEpsilon"
>

export type DotFieldRect = {
  x: number
  y: number
  width: number
  height: number
}

export type DotFieldSceneScrollRequest = {
  scrolled: number
  viewportHeight: number
  projectsTop: number
  stageWidth: number
}

export type DotFieldSceneScroll = {
  rawCompress: number
  isRearmed: boolean
  burstPoint: DotFieldVector
  dustTop: number
}

export type DotFieldSceneTargetRequest = {
  rawCompress: number
  isRearmed: boolean
  compress: number
  burst: number
  burstTarget: number
}

export type DotFieldSceneTargets = {
  compressTarget: number
  burstTarget: number
}

export type DotFieldCompressRequest = {
  slotCenter: DotFieldVector
  burstPoint: DotFieldVector
  halfSize: number
  compress: number
}

export type DotFieldCompressedCube = {
  center: DotFieldVector
  halfSize: number
  spinBoost: number
  farLight: number
}

export type DotFieldClaimRequest = {
  frameTop: number
  scrolled: number
  viewportHeight: number
  burst: number
}

export type DotFieldWindowRequest = {
  scrolled: number
  viewportHeight: number
  canvasHeight: number
  stageHeight: number
  projectsTop: number
  pixelRatio: number
  isStatic: boolean
  isSceneActive: boolean
}

export type DotFieldLoopRestRequest = {
  isFieldAtRest: boolean
  hasSettled: boolean
  isMorphResting: boolean
  isSceneResting: boolean
  morph: number
  burst: number
}

export type CubeProjection = {
  center: DotFieldVector
  halfSize: number
  cameraDistance: number
  rotation: Float32Array
}

export type DotFieldLayout = {
  width: number
  height: number
  wordWidth: number
  wordHeight: number
  wordCenter: DotFieldVector
  cubeCenter: DotFieldVector
  cubeSide: number
  morphStart: number
  morphEnd: number
  stageHeight: number
  projectsTop: number
  projectsBottom: number
  frames: DotFieldRect[]
}

export type DotFieldLayoutElements = {
  stage: HTMLElement
  hero: HTMLElement
  wordmark: HTMLElement
  cube: HTMLElement
  projects: HTMLElement
}

export type DotFieldFrame = {
  intro: DotFieldIntroFrame
  wordOrigin: DotFieldVector
  wordCenter: DotFieldVector
  wordBounds: DotFieldBounds
  cubeCenter: DotFieldVector
  cubeHalfSize: number
  rotation: Float32Array
  morphPasses: number[]
  windowTop: number
  burst: number
  farLight: number
  sparkRadius: number
  dustRect: DotFieldRect
  shares: DotFieldVector
  frameCount: number
  frameRects: Float32Array
  claims: Float32Array
  frameBand: number
}

export type HeroIntroTiming = {
  smallScale: number
  sweepDelaySeconds: number
  sweepDurationSeconds: number
  sweepSoftnessPx: number
  dimAlpha: number
  growDelaySeconds: number
  growDurationSeconds: number
  liftPixels: number
  taglineDelayAfterSettleSeconds: number
  taglineDurationSeconds: number
  scrollCueDelayAfterSettleSeconds: number
  scrollCueDurationSeconds: number
}

export type DotFieldBounds = {
  left: number
  right: number
}

export type DotFieldIntroFrame = {
  scale: number
  revealX: number
  softness: number
  dim: number
  isSettled: boolean
}

export type MeasureInkWidth = (fontSize: number) => number

export type DotFieldTuning = {
  dotPitch: number
  dotSize: number
  dotEdgePixels: number
  dotRoundness: number
  alphaThreshold: number
  widthRatio: number
  narrowWidthRatio: number
  narrowViewportWidth: number
  maxHeightRatio: number
  minFontSize: number
  maxFontSize: number
  probeFontSize: number
  fontWeight: number
  maxPointCount: number
  pointerRadius: number
  pointerPush: number
  springStiffness: number
  springDamping: number
  referenceInkHeight: number
  sleepThreshold: number
}

export type DotFieldViewport = {
  width: number
  height: number
  pixelRatio: number
}

export type DotFieldPointCloud = {
  positions: Float32Array
  count: number
}

export type DotFieldSample = {
  positions: Float32Array
  count: number
  left: number
  right: number
  inkHeight: number
}

export type DotFieldSizeRequest = {
  measureInkWidth: MeasureInkWidth
  targetWidth: number
  probeSize: number
}

export type DotFieldPointer = {
  x: number
  y: number
  isActive: boolean
}

export type DotFieldPhysicsRequest = {
  homes: Float32Array
  offsets: Float32Array
  velocities: Float32Array
  inkHeight: number
  pointer: DotFieldPointer | null
  deltaSeconds: number
}

export type DotFieldUniforms = {
  resolution: WebGLUniformLocation | null
  pixelRatio: WebGLUniformLocation | null
  dotSize: WebGLUniformLocation | null
  color: WebGLUniformLocation | null
  edgePixels: WebGLUniformLocation | null
  dotRoundness: WebGLUniformLocation | null
  introScale: WebGLUniformLocation | null
  introReveal: WebGLUniformLocation | null
  introSoftness: WebGLUniformLocation | null
  introDim: WebGLUniformLocation | null
  wordOrigin: WebGLUniformLocation | null
  wordCenter: WebGLUniformLocation | null
  wordBounds: WebGLUniformLocation | null
  morph: WebGLUniformLocation | null
  morphStagger: WebGLUniformLocation | null
  morphJitter: WebGLUniformLocation | null
  morphArc: WebGLUniformLocation | null
  cubeCenter: WebGLUniformLocation | null
  cubeHalfSize: WebGLUniformLocation | null
  cubeRotation: WebGLUniformLocation | null
  cameraDistance: WebGLUniformLocation | null
  farLight: WebGLUniformLocation | null
  cubeDotSize: WebGLUniformLocation | null
  windowTop: WebGLUniformLocation | null
  burst: WebGLUniformLocation | null
  burstStagger: WebGLUniformLocation | null
  sparkRadius: WebGLUniformLocation | null
  sparkFade: WebGLUniformLocation | null
  dustRect: WebGLUniformLocation | null
  shares: WebGLUniformLocation | null
  dustOpacity: WebGLUniformLocation | null
  dustDotSize: WebGLUniformLocation | null
  frameCount: WebGLUniformLocation | null
  frameRects: WebGLUniformLocation | null
  claims: WebGLUniformLocation | null
  frameBand: WebGLUniformLocation | null
  frameOutset: WebGLUniformLocation | null
  frameJitter: WebGLUniformLocation | null
  frameDotSize: WebGLUniformLocation | null
  frameOpacity: WebGLUniformLocation | null
  claimStagger: WebGLUniformLocation | null
}

export type DotFieldRuntime = {
  context: WebGL2RenderingContext
  program: WebGLProgram
  vertexArray: WebGLVertexArrayObject
  buffer: WebGLBuffer
  offsetBuffer: WebGLBuffer
  cubeBuffer: WebGLBuffer
  sceneBuffer: WebGLBuffer
  uniforms: DotFieldUniforms
  pointCount: number
  positions: Float32Array
  offsets: Float32Array
  velocities: Float32Array
  inkHeight: number
  cubePoints: Float32Array
  cubeHomes: Float32Array
  maxDimension: number
}

export type DotFieldPhysicsSpace = {
  homes: Float32Array
  inkHeight: number
  pointer: DotFieldPointer
}

export type DotFieldSampleRequest = {
  text: string
  fontFamily: string
  viewport: DotFieldViewport
  tuning: DotFieldTuning
}

export type UseDotFieldRequest = {
  stageRef: React.RefObject<HTMLElement | null>
  heroRef: React.RefObject<HTMLElement | null>
  wordmarkRef: React.RefObject<HTMLElement | null>
  taglineRef: React.RefObject<HTMLElement | null>
  cubeRef: React.RefObject<HTMLElement | null>
  projectsRef: React.RefObject<HTMLElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  text: string
  fontFamily: string
  dotColor: string
  mode: HeroWordmarkMode
  onIntroSettled: () => void
  onUnsupported: () => void
}
