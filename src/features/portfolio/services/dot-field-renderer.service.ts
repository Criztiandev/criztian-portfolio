import {
  FALLBACK_MAX_DIMENSION,
  FROM_ATTRIBUTE_LOCATION,
  GENERATED_SHAPE_IDS,
  OFFSET_ATTRIBUTE_LOCATION,
  OFFSET_STRIDE,
  POINT_ATTRIBUTE_LOCATION,
  POINT_STRIDE,
  SHAPE_STRIDE,
  TO_ATTRIBUTE_LOCATION,
} from "@/data/hero.data"
import {
  hexToRgbTriplet,
  padNamePoints,
  padShapePoints,
  resolvePointTotal,
} from "@/features/portfolio/dot-field.rules"
import { DOT_FIELD_FRAGMENT_SHADER } from "@/features/portfolio/shaders/dot-field.fragment-shader"
import { DOT_FIELD_VERTEX_SHADER } from "@/features/portfolio/shaders/dot-field.vertex-shader"
import type {
  DotFieldFrame,
  DotFieldMorphTuning,
  DotFieldPlacement,
  DotFieldPlacementUniforms,
  DotFieldRuntime,
  DotFieldSample,
  DotFieldTuning,
  DotFieldUniforms,
  DotGeneratedShapeId,
  DotShapeLibrary,
} from "@/types/hero.type"

function compileShader(
  context: WebGL2RenderingContext,
  shaderType: number,
  source: string
): WebGLShader {
  const shader = context.createShader(shaderType)

  if (shader === null) {
    throw new Error("dot_field_shader_unavailable")
  }

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (context.getShaderParameter(shader, context.COMPILE_STATUS) !== true) {
    const info = context.getShaderInfoLog(shader) ?? "unknown"
    context.deleteShader(shader)

    throw new Error(`dot_field_shader_compile_failed: ${info}`)
  }

  return shader
}

export function createDotFieldProgram(
  context: WebGL2RenderingContext
): WebGLProgram {
  const vertexShader = compileShader(
    context,
    context.VERTEX_SHADER,
    DOT_FIELD_VERTEX_SHADER
  )

  const fragmentShader = compileShader(
    context,
    context.FRAGMENT_SHADER,
    DOT_FIELD_FRAGMENT_SHADER
  )

  const program = context.createProgram()

  if (program === null) {
    context.deleteShader(vertexShader)
    context.deleteShader(fragmentShader)

    throw new Error("dot_field_program_unavailable")
  }

  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.linkProgram(program)

  context.detachShader(program, vertexShader)
  context.detachShader(program, fragmentShader)
  context.deleteShader(vertexShader)
  context.deleteShader(fragmentShader)

  if (context.getProgramParameter(program, context.LINK_STATUS) !== true) {
    const info = context.getProgramInfoLog(program) ?? "unknown"
    context.deleteProgram(program)

    throw new Error(`dot_field_program_link_failed: ${info}`)
  }

  return program
}

function resolvePlacementUniforms(
  context: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string
): DotFieldPlacementUniforms {
  return {
    isName: context.getUniformLocation(program, `${name}.isName`),
    center: context.getUniformLocation(program, `${name}.center`),
    halfSize: context.getUniformLocation(program, `${name}.halfSize`),
    rotation: context.getUniformLocation(program, `${name}.rotation`),
    cameraDistance: context.getUniformLocation(
      program,
      `${name}.cameraDistance`
    ),
    visible: context.getUniformLocation(program, `${name}.visible`),
    farLight: context.getUniformLocation(program, `${name}.farLight`),
    depthRadius: context.getUniformLocation(program, `${name}.depthRadius`),
    dotSize: context.getUniformLocation(program, `${name}.dotSize`),
    opacity: context.getUniformLocation(program, `${name}.opacity`),
  }
}

function resolveUniformLocations(
  context: WebGL2RenderingContext,
  program: WebGLProgram
): DotFieldUniforms {
  return {
    resolution: context.getUniformLocation(program, "uResolution"),
    pixelRatio: context.getUniformLocation(program, "uPixelRatio"),
    dotSize: context.getUniformLocation(program, "uDotSize"),
    color: context.getUniformLocation(program, "uColor"),
    edgePixels: context.getUniformLocation(program, "uEdgePixels"),
    dotRoundness: context.getUniformLocation(program, "uDotRoundness"),
    introReveal: context.getUniformLocation(program, "uIntroReveal"),
    introSoftness: context.getUniformLocation(program, "uIntroSoftness"),
    introDim: context.getUniformLocation(program, "uIntroDim"),
    wordCenter: context.getUniformLocation(program, "uWordCenter"),
    wordBounds: context.getUniformLocation(program, "uWordBounds"),
    morph: context.getUniformLocation(program, "uMorph"),
    morphStagger: context.getUniformLocation(program, "uMorphStagger"),
    morphJitter: context.getUniformLocation(program, "uMorphJitter"),
    morphArc: context.getUniformLocation(program, "uMorphArc"),
    penJitter: context.getUniformLocation(program, "uPenJitter"),
    burstPixels: context.getUniformLocation(program, "uBurstPixels"),
    burstScale: context.getUniformLocation(program, "uBurstScale"),
    swell: context.getUniformLocation(program, "uSwell"),
    strikeSize: context.getUniformLocation(program, "uStrikeSize"),
    strike: context.getUniformLocation(program, "uStrike"),
    from: resolvePlacementUniforms(context, program, "uFrom"),
    to: resolvePlacementUniforms(context, program, "uTo"),
  }
}

function readMaxDimension(context: WebGL2RenderingContext): number {
  const viewportDimensions: unknown = context.getParameter(
    context.MAX_VIEWPORT_DIMS
  )
  const renderbufferSize: unknown = context.getParameter(
    context.MAX_RENDERBUFFER_SIZE
  )

  if (
    !(viewportDimensions instanceof Int32Array) ||
    typeof renderbufferSize !== "number"
  ) {
    return FALLBACK_MAX_DIMENSION
  }

  return Math.min(
    viewportDimensions[0],
    viewportDimensions[1],
    renderbufferSize
  )
}

function createBuffer(context: WebGL2RenderingContext): WebGLBuffer {
  const buffer = context.createBuffer()

  if (buffer === null) {
    throw new Error("dot_field_buffers_unavailable")
  }

  return buffer
}

function pointShapeAttribute(
  context: WebGL2RenderingContext,
  location: number,
  buffer: WebGLBuffer
): void {
  context.bindBuffer(context.ARRAY_BUFFER, buffer)
  context.enableVertexAttribArray(location)
  context.vertexAttribPointer(
    location,
    SHAPE_STRIDE,
    context.FLOAT,
    false,
    0,
    0
  )
}

export function createDotFieldRuntime(
  context: WebGL2RenderingContext,
  shapeLibrary: DotShapeLibrary
): DotFieldRuntime {
  const program = createDotFieldProgram(context)
  const vertexArray = context.createVertexArray()

  if (vertexArray === null) {
    context.deleteProgram(program)

    throw new Error("dot_field_buffers_unavailable")
  }

  const buffer = createBuffer(context)
  const offsetBuffer = createBuffer(context)
  const blankBuffer = createBuffer(context)
  const shapeBuffers: Record<DotGeneratedShapeId, WebGLBuffer> = {
    cube: createBuffer(context),
    sphere: createBuffer(context),
    dust: createBuffer(context),
    branding: createBuffer(context),
    "web-design": createBuffer(context),
    development: createBuffer(context),
    listening: createBuffer(context),
    planning: createBuffer(context),
    visualising: createBuffer(context),
    building: createBuffer(context),
    delivery: createBuffer(context),
  }

  context.bindVertexArray(vertexArray)

  context.bindBuffer(context.ARRAY_BUFFER, buffer)
  context.enableVertexAttribArray(POINT_ATTRIBUTE_LOCATION)
  context.vertexAttribPointer(
    POINT_ATTRIBUTE_LOCATION,
    POINT_STRIDE,
    context.FLOAT,
    false,
    0,
    0
  )

  context.bindBuffer(context.ARRAY_BUFFER, offsetBuffer)
  context.enableVertexAttribArray(OFFSET_ATTRIBUTE_LOCATION)
  context.vertexAttribPointer(
    OFFSET_ATTRIBUTE_LOCATION,
    OFFSET_STRIDE,
    context.FLOAT,
    false,
    0,
    0
  )

  pointShapeAttribute(context, FROM_ATTRIBUTE_LOCATION, blankBuffer)
  pointShapeAttribute(context, TO_ATTRIBUTE_LOCATION, blankBuffer)

  context.bindVertexArray(null)

  context.disable(context.DEPTH_TEST)
  context.enable(context.BLEND)
  context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)
  context.clearColor(0, 0, 0, 1)

  return {
    context,
    program,
    vertexArray,
    buffer,
    offsetBuffer,
    blankBuffer,
    shapeBuffers,
    shapeLibrary,
    shapePoints: {
      cube: new Float32Array(0),
      sphere: new Float32Array(0),
      dust: new Float32Array(0),
      branding: new Float32Array(0),
      "web-design": new Float32Array(0),
      development: new Float32Array(0),
      listening: new Float32Array(0),
      planning: new Float32Array(0),
      visualising: new Float32Array(0),
      building: new Float32Array(0),
      delivery: new Float32Array(0),
    },
    boundFrom: blankBuffer,
    boundTo: blankBuffer,
    uniforms: resolveUniformLocations(context, program),
    pointCount: 0,
    positions: new Float32Array(0),
    offsets: new Float32Array(0),
    velocities: new Float32Array(0),
    homes: new Float32Array(0),
    inkHeight: 0,
    maxDimension: readMaxDimension(context),
  }
}

export function applyStaticUniforms(
  runtime: DotFieldRuntime,
  tuning: DotFieldTuning,
  morphTuning: DotFieldMorphTuning,
  pixelRatio: number
): void {
  const { context, uniforms } = runtime

  context.useProgram(runtime.program)
  context.uniform1f(uniforms.pixelRatio, pixelRatio)
  context.uniform1f(uniforms.dotSize, tuning.dotSize)
  context.uniform1f(uniforms.edgePixels, tuning.dotEdgePixels)
  context.uniform1f(uniforms.dotRoundness, tuning.dotRoundness)
  context.uniform1f(uniforms.morphStagger, morphTuning.morphStagger)
  context.uniform1f(uniforms.morphJitter, morphTuning.morphJitter)
  context.uniform1f(uniforms.morphArc, morphTuning.morphArcPixels * pixelRatio)
  context.uniform1f(uniforms.penJitter, morphTuning.penJitter)
  context.uniform1f(uniforms.burstPixels, morphTuning.burstPixels * pixelRatio)
  context.uniform1f(
    uniforms.burstScale,
    morphTuning.burstScalePixels * pixelRatio
  )
  context.uniform1f(uniforms.swell, morphTuning.swell)
  context.uniform1f(uniforms.strikeSize, morphTuning.strikeSize)
}

export function applyDotColor(
  runtime: DotFieldRuntime,
  dotColor: string
): void {
  const { context, uniforms } = runtime
  const [red, green, blue] = hexToRgbTriplet(dotColor)

  context.useProgram(runtime.program)
  context.uniform3f(uniforms.color, red, green, blue)
}

export function applyClearColor(
  runtime: DotFieldRuntime,
  backgroundColor: string
): void {
  const [red, green, blue] = hexToRgbTriplet(backgroundColor)

  runtime.context.clearColor(red, green, blue, 1)
}

export function resizeDotField(runtime: DotFieldRuntime): void {
  const { context, uniforms } = runtime
  const widthPx = context.drawingBufferWidth
  const heightPx = context.drawingBufferHeight

  context.viewport(0, 0, widthPx, heightPx)
  context.useProgram(runtime.program)
  context.uniform2f(uniforms.resolution, widthPx, heightPx)
}

function uploadShapeBuffers(runtime: DotFieldRuntime, total: number): void {
  const { context } = runtime

  for (const shape of GENERATED_SHAPE_IDS) {
    const padded = padShapePoints(runtime.shapeLibrary[shape], total)

    runtime.shapePoints[shape] = padded
    context.bindBuffer(context.ARRAY_BUFFER, runtime.shapeBuffers[shape])
    context.bufferData(context.ARRAY_BUFFER, padded, context.STATIC_DRAW)
  }

  context.bindBuffer(context.ARRAY_BUFFER, runtime.blankBuffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(total * SHAPE_STRIDE),
    context.STATIC_DRAW
  )
}

export function uploadPoints(
  runtime: DotFieldRuntime,
  sample: DotFieldSample
): void {
  const { context } = runtime
  const total = resolvePointTotal(sample.count)

  if (total !== runtime.pointCount) {
    uploadShapeBuffers(runtime, total)
    runtime.offsets = new Float32Array(total * OFFSET_STRIDE)
    runtime.velocities = new Float32Array(total * OFFSET_STRIDE)
    runtime.homes = new Float32Array(total * POINT_STRIDE)

    context.bindBuffer(context.ARRAY_BUFFER, runtime.offsetBuffer)
    context.bufferData(
      context.ARRAY_BUFFER,
      runtime.offsets,
      context.DYNAMIC_DRAW
    )
  }

  runtime.positions = padNamePoints(sample.positions, sample.count, total)
  runtime.inkHeight = sample.inkHeight

  context.bindBuffer(context.ARRAY_BUFFER, runtime.buffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    runtime.positions,
    context.STATIC_DRAW
  )

  runtime.pointCount = total
}

export function uploadOffsets(runtime: DotFieldRuntime): void {
  const { context } = runtime

  context.bindBuffer(context.ARRAY_BUFFER, runtime.offsetBuffer)
  context.bufferSubData(context.ARRAY_BUFFER, 0, runtime.offsets)
}

function resolvePlacementBuffer(
  runtime: DotFieldRuntime,
  placement: DotFieldPlacement,
  fallback: DotFieldPlacement
): WebGLBuffer {
  if (placement.shape !== "name") {
    return runtime.shapeBuffers[placement.shape]
  }

  if (fallback.shape !== "name") {
    return runtime.shapeBuffers[fallback.shape]
  }

  return runtime.blankBuffer
}

function bindPlacementBuffers(
  runtime: DotFieldRuntime,
  frame: DotFieldFrame
): void {
  const { context } = runtime
  const fromBuffer = resolvePlacementBuffer(runtime, frame.from, frame.to)
  const toBuffer = resolvePlacementBuffer(runtime, frame.to, frame.from)

  if (fromBuffer !== runtime.boundFrom) {
    pointShapeAttribute(context, FROM_ATTRIBUTE_LOCATION, fromBuffer)
    runtime.boundFrom = fromBuffer
  }

  if (toBuffer !== runtime.boundTo) {
    pointShapeAttribute(context, TO_ATTRIBUTE_LOCATION, toBuffer)
    runtime.boundTo = toBuffer
  }
}

function applyPlacement(
  context: WebGL2RenderingContext,
  uniforms: DotFieldPlacementUniforms,
  placement: DotFieldPlacement
): void {
  context.uniform1f(uniforms.isName, placement.isName ? 1 : 0)
  context.uniform2f(uniforms.center, placement.center.x, placement.center.y)
  context.uniform2f(
    uniforms.halfSize,
    placement.halfSize.x,
    placement.halfSize.y
  )
  context.uniformMatrix3fv(uniforms.rotation, false, placement.rotation)
  context.uniform1f(uniforms.cameraDistance, placement.cameraDistance)
  context.uniform1f(uniforms.visible, placement.visible)
  context.uniform1f(uniforms.farLight, placement.farLight)
  context.uniform1f(uniforms.depthRadius, placement.depthRadius)
  context.uniform1f(uniforms.dotSize, placement.dotSize)
  context.uniform1f(uniforms.opacity, placement.opacity)
}

export function drawDotField(
  runtime: DotFieldRuntime,
  frame: DotFieldFrame | null
): void {
  const { context, uniforms } = runtime

  context.clear(context.COLOR_BUFFER_BIT)

  if (runtime.pointCount === 0 || frame === null) {
    return
  }

  const { intro } = frame

  context.useProgram(runtime.program)
  context.bindVertexArray(runtime.vertexArray)
  bindPlacementBuffers(runtime, frame)

  context.uniform1f(uniforms.introReveal, intro.revealX)
  context.uniform1f(uniforms.introSoftness, intro.softness)
  context.uniform1f(uniforms.introDim, intro.dim)
  context.uniform2f(uniforms.wordCenter, frame.wordCenter.x, frame.wordCenter.y)
  context.uniform2f(
    uniforms.wordBounds,
    frame.wordBounds.left,
    frame.wordBounds.right
  )
  context.uniform1f(uniforms.morph, frame.progress)
  context.uniform1f(uniforms.strike, frame.strike)
  applyPlacement(context, uniforms.from, frame.from)
  applyPlacement(context, uniforms.to, frame.to)

  context.drawArrays(context.POINTS, 0, runtime.pointCount)
  context.bindVertexArray(null)
}

export function destroyRuntime(runtime: DotFieldRuntime): void {
  const { context } = runtime

  context.deleteBuffer(runtime.buffer)
  context.deleteBuffer(runtime.offsetBuffer)
  context.deleteBuffer(runtime.blankBuffer)

  for (const shape of GENERATED_SHAPE_IDS) {
    context.deleteBuffer(runtime.shapeBuffers[shape])
  }

  context.deleteVertexArray(runtime.vertexArray)
  context.deleteProgram(runtime.program)
}
