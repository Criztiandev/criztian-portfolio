export type HeroWordmarkMode = "dots" | "text"

export type LineArtShapeId =
  | "branding"
  | "web-design"
  | "development"
  | "listening"
  | "planning"
  | "visualising"
  | "building"
  | "delivery"

export type DotGeneratedShapeId = "cube" | "sphere" | "dust" | LineArtShapeId

export type DotShapeId = "name" | DotGeneratedShapeId

export type DotShapeFit = "contain" | "fill"

export type DotShapeLibrary = Record<DotGeneratedShapeId, Float32Array>

export type CubicBezier = [number, number, number, number]

export type CubeVector = [number, number, number]

export type CubeEdge = {
  start: CubeVector
  end: CubeVector
}

export type RandomSource = () => number

export type LineArtPolyline = {
  kind: "polyline"
  points: CubeVector[]
}

export type LineArtArc = {
  kind: "arc"
  center: CubeVector
  radius: number
  startAngle: number
  endAngle: number
  ripples: number
  rippleDepth: number
}

export type LineArtStar = {
  kind: "star"
  center: CubeVector
  outerRadius: number
  innerRadius: number
  tips: number
}

export type LineArtStroke = LineArtPolyline | LineArtArc | LineArtStar

export type LineArtShape = {
  seed: number
  strokes: LineArtStroke[]
}

export type LineArtSegment = {
  start: CubeVector
  end: CubeVector
  length: number
}

export type DotFieldVector = {
  x: number
  y: number
}

export type DotFieldMorphTuning = {
  morphFollowRate: number
  morphSettleEpsilon: number
  morphStagger: number
  morphJitter: number
  morphArcPixels: number
  morphSpin: number
  cameraDistance: number
  wobbleSpeed: number
  stepMorphShare: number
  penJitter: number
  burstPixels: number
  burstScalePixels: number
  swell: number
  strikeSize: number
  strikeSeconds: number
  strikeMinIntervalSeconds: number
  strikeImpulse: number
}

export type DotFieldFollowTuning = Pick<
  DotFieldMorphTuning,
  "morphFollowRate" | "morphSettleEpsilon"
>

export type DotShapeTuning = {
  fit: DotShapeFit
  sizeRatio: number
  pointsPerArea: number
  hasPerspective: boolean
  spinSpeed: number
  pitch: number
  roll: number
  wobble: number
  staticYaw: number
  farLight: number
  depthRadius: number
  dotSize: number
  opacity: number
  inkRatio: number
}

export type DotSphereTuning = {
  rings: number
  meridians: number
  jitter: number
}

export type DotFieldRect = {
  x: number
  y: number
  width: number
  height: number
}

export type DotSceneMeasure = {
  id: string
  shapes: DotShapeId[]
  containerTop: number
  containerBottom: number
  stickyTop: number
  frameHeight: number
  slot: DotFieldRect | null
}

export type DotSceneKeyframe = {
  id: string
  shape: DotShapeId
  start: number
  end: number
  slot: DotFieldRect | null
}

export type DotTimelineSegment = {
  fromIndex: number
  toIndex: number
  progress: number
}

export type DotFieldLoopRestRequest = {
  isFieldAtRest: boolean
  hasSettled: boolean
  isProgressResting: boolean
  isSpinning: boolean
  isStriking: boolean
}

export type DotFieldPlacement = {
  isName: boolean
  shape: DotShapeId
  center: DotFieldVector
  halfSize: DotFieldVector
  rotation: Float32Array
  cameraDistance: number
  visible: number
  farLight: number
  depthRadius: number
  dotSize: number
  opacity: number
  inkHeight: number
}

export type DotFieldNameSample = {
  width: number
  height: number
  bounds: DotFieldBounds
  inkHeight: number
}

export type DotFieldPlacementRequest = {
  keyframe: DotSceneKeyframe
  viewport: DotFieldViewport
  nameSample: DotFieldNameSample
  introScale: number
  spinSeconds: number
  yawOffset: number
  isStatic: boolean
}

export type DotFieldLayout = {
  width: number
  height: number
  wordWidth: number
  wordHeight: number
  viewportHeight: number
  scenes: DotSceneMeasure[]
}

export type DotFieldFrame = {
  intro: DotFieldIntroFrame
  wordCenter: DotFieldVector
  wordBounds: DotFieldBounds
  progress: number
  strike: number
  from: DotFieldPlacement
  to: DotFieldPlacement
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

export type DotFieldPlacementUniforms = {
  isName: WebGLUniformLocation | null
  center: WebGLUniformLocation | null
  halfSize: WebGLUniformLocation | null
  rotation: WebGLUniformLocation | null
  cameraDistance: WebGLUniformLocation | null
  visible: WebGLUniformLocation | null
  farLight: WebGLUniformLocation | null
  depthRadius: WebGLUniformLocation | null
  dotSize: WebGLUniformLocation | null
  opacity: WebGLUniformLocation | null
}

export type DotFieldUniforms = {
  resolution: WebGLUniformLocation | null
  pixelRatio: WebGLUniformLocation | null
  dotSize: WebGLUniformLocation | null
  color: WebGLUniformLocation | null
  edgePixels: WebGLUniformLocation | null
  dotRoundness: WebGLUniformLocation | null
  introReveal: WebGLUniformLocation | null
  introSoftness: WebGLUniformLocation | null
  introDim: WebGLUniformLocation | null
  wordCenter: WebGLUniformLocation | null
  wordBounds: WebGLUniformLocation | null
  morph: WebGLUniformLocation | null
  morphStagger: WebGLUniformLocation | null
  morphJitter: WebGLUniformLocation | null
  morphArc: WebGLUniformLocation | null
  penJitter: WebGLUniformLocation | null
  burstPixels: WebGLUniformLocation | null
  burstScale: WebGLUniformLocation | null
  swell: WebGLUniformLocation | null
  strikeSize: WebGLUniformLocation | null
  strike: WebGLUniformLocation | null
  from: DotFieldPlacementUniforms
  to: DotFieldPlacementUniforms
}

export type DotFieldRuntime = {
  context: WebGL2RenderingContext
  program: WebGLProgram
  vertexArray: WebGLVertexArrayObject
  buffer: WebGLBuffer
  offsetBuffer: WebGLBuffer
  blankBuffer: WebGLBuffer
  shapeBuffers: Record<DotGeneratedShapeId, WebGLBuffer>
  shapeLibrary: DotShapeLibrary
  shapePoints: DotShapeLibrary
  boundFrom: WebGLBuffer | null
  boundTo: WebGLBuffer | null
  uniforms: DotFieldUniforms
  pointCount: number
  positions: Float32Array
  offsets: Float32Array
  velocities: Float32Array
  homes: Float32Array
  inkHeight: number
  maxDimension: number
}

export type DotFieldSampleRequest = {
  text: string
  fontFamily: string
  viewport: DotFieldViewport
  tuning: DotFieldTuning
}

export type UseDotFieldRequest = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  wordmarkRef: React.RefObject<HTMLElement | null>
  taglineRef: React.RefObject<HTMLElement | null>
  text: string
  fontFamily: string
  dotColor: string
  backgroundColor: string
  mode: HeroWordmarkMode
  onIntroSettled: () => void
  onUnsupported: () => void
}
