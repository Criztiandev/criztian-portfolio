export type HeroWordmarkMode = "dots" | "text"

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

export type SiteHeaderPlacement = "leading" | "trailing" | "action"

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
}

export type DotFieldRuntime = {
  context: WebGL2RenderingContext
  program: WebGLProgram
  vertexArray: WebGLVertexArrayObject
  buffer: WebGLBuffer
  offsetBuffer: WebGLBuffer
  uniforms: DotFieldUniforms
  pointCount: number
  positions: Float32Array
  offsets: Float32Array
  velocities: Float32Array
  inkHeight: number
}

export type DotFieldSampleRequest = {
  text: string
  fontFamily: string
  viewport: DotFieldViewport
  tuning: DotFieldTuning
}

export type UseDotFieldRequest = {
  containerRef: React.RefObject<HTMLElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  text: string
  fontFamily: string
  dotColor: string
  mode: HeroWordmarkMode
  onIntroSettled: () => void
  onUnsupported: () => void
}
