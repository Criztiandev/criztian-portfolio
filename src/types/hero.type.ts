export type DotFieldStatus = "idle" | "running" | "text" | "unsupported"

export type HeroWordmarkMode = "pending" | "dots" | "text"

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
  maxHeightRatio: number
  minFontSize: number
  maxFontSize: number
  probeFontSize: number
  fontWeight: number
  maxPointCount: number
  vortexRadius: number
  vortexSwirl: number
  vortexPush: number
  vortexFade: number
  vortexShrink: number
  waveAmplitude: number
  waveSecondaryAmplitude: number
  waveFrequency: number
  waveSecondaryFrequency: number
  waveSpeed: number
  waveSecondarySpeed: number
  pointerLerp: number
  influenceEnterLerp: number
  influenceLeaveLerp: number
  autoPointerXFrequency: number
  autoPointerYFrequency: number
  autoPointerXAmplitude: number
  autoPointerYAmplitude: number
  autoPointerInfluence: number
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
}

export type DotFieldSizeRequest = {
  measureInkWidth: MeasureInkWidth
  targetWidth: number
  probeSize: number
}

export type DotFieldPointerPosition = {
  x: number
  y: number
}

export type DotFieldPointer = {
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  influence: number
  targetInfluence: number
}

export type DotFieldUniforms = {
  resolution: WebGLUniformLocation | null
  pointer: WebGLUniformLocation | null
  influence: WebGLUniformLocation | null
  time: WebGLUniformLocation | null
  pixelRatio: WebGLUniformLocation | null
  dotSize: WebGLUniformLocation | null
  vortexRadius: WebGLUniformLocation | null
  vortexSwirl: WebGLUniformLocation | null
  vortexPush: WebGLUniformLocation | null
  vortexFade: WebGLUniformLocation | null
  vortexShrink: WebGLUniformLocation | null
  wave: WebGLUniformLocation | null
  waveSpeed: WebGLUniformLocation | null
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
  uniforms: DotFieldUniforms
  pointCount: number
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
