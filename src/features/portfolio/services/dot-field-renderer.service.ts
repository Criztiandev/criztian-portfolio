import {
  CUBE_DETAIL_ATTRIBUTE_LOCATION,
  CUBE_DETAIL_COMPONENTS,
  CUBE_POINT_STRIDE,
  CUBE_POSITION_ATTRIBUTE_LOCATION,
  CUBE_POSITION_COMPONENTS,
  FALLBACK_MAX_DIMENSION,
  OFFSET_ATTRIBUTE_LOCATION,
  OFFSET_STRIDE,
  POINT_ATTRIBUTE_LOCATION,
  POINT_STRIDE,
  SCENE_ATTRIBUTE_LOCATION,
  SCENE_POINT_STRIDE,
} from "@/data/hero.data"
import { hexToRgbTriplet } from "@/features/portfolio/dot-field.rules"
import { DOT_FIELD_FRAGMENT_SHADER } from "@/features/portfolio/shaders/dot-field.fragment-shader"
import { DOT_FIELD_VERTEX_SHADER } from "@/features/portfolio/shaders/dot-field.vertex-shader"
import type {
  DotFieldFrame,
  DotFieldMorphTuning,
  DotFieldRuntime,
  DotFieldSample,
  DotFieldSceneTuning,
  DotFieldTuning,
  DotFieldUniforms,
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
    introScale: context.getUniformLocation(program, "uIntroScale"),
    introReveal: context.getUniformLocation(program, "uIntroReveal"),
    introSoftness: context.getUniformLocation(program, "uIntroSoftness"),
    introDim: context.getUniformLocation(program, "uIntroDim"),
    wordOrigin: context.getUniformLocation(program, "uWordOrigin"),
    wordCenter: context.getUniformLocation(program, "uWordCenter"),
    wordBounds: context.getUniformLocation(program, "uWordBounds"),
    morph: context.getUniformLocation(program, "uMorph"),
    morphStagger: context.getUniformLocation(program, "uMorphStagger"),
    morphJitter: context.getUniformLocation(program, "uMorphJitter"),
    morphArc: context.getUniformLocation(program, "uMorphArc"),
    cubeCenter: context.getUniformLocation(program, "uCubeCenter"),
    cubeHalfSize: context.getUniformLocation(program, "uCubeHalfSize"),
    cubeRotation: context.getUniformLocation(program, "uCubeRotation"),
    cameraDistance: context.getUniformLocation(program, "uCameraDistance"),
    farLight: context.getUniformLocation(program, "uFarLight"),
    cubeDotSize: context.getUniformLocation(program, "uCubeDotSize"),
    windowTop: context.getUniformLocation(program, "uWindowTop"),
    burst: context.getUniformLocation(program, "uBurst"),
    burstStagger: context.getUniformLocation(program, "uBurstStagger"),
    sparkRadius: context.getUniformLocation(program, "uSparkRadius"),
    sparkFade: context.getUniformLocation(program, "uSparkFade"),
    dustRect: context.getUniformLocation(program, "uDustRect"),
    shares: context.getUniformLocation(program, "uShares"),
    dustOpacity: context.getUniformLocation(program, "uDustOpacity"),
    dustDotSize: context.getUniformLocation(program, "uDustDotSize"),
    frameCount: context.getUniformLocation(program, "uFrameCount"),
    frameRects: context.getUniformLocation(program, "uFrameRects"),
    claims: context.getUniformLocation(program, "uClaims"),
    frameBand: context.getUniformLocation(program, "uFrameBand"),
    frameOutset: context.getUniformLocation(program, "uFrameOutset"),
    frameJitter: context.getUniformLocation(program, "uFrameJitter"),
    frameDotSize: context.getUniformLocation(program, "uFrameDotSize"),
    frameOpacity: context.getUniformLocation(program, "uFrameOpacity"),
    claimStagger: context.getUniformLocation(program, "uClaimStagger"),
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

export function createDotFieldRuntime(
  context: WebGL2RenderingContext
): DotFieldRuntime {
  const program = createDotFieldProgram(context)
  const vertexArray = context.createVertexArray()
  const buffer = context.createBuffer()
  const offsetBuffer = context.createBuffer()
  const cubeBuffer = context.createBuffer()
  const sceneBuffer = context.createBuffer()

  if (
    vertexArray === null ||
    buffer === null ||
    offsetBuffer === null ||
    cubeBuffer === null ||
    sceneBuffer === null
  ) {
    context.deleteProgram(program)

    throw new Error("dot_field_buffers_unavailable")
  }

  const floatBytes = Float32Array.BYTES_PER_ELEMENT
  const cubeStrideBytes = CUBE_POINT_STRIDE * floatBytes

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

  context.bindBuffer(context.ARRAY_BUFFER, cubeBuffer)
  context.enableVertexAttribArray(CUBE_POSITION_ATTRIBUTE_LOCATION)
  context.vertexAttribPointer(
    CUBE_POSITION_ATTRIBUTE_LOCATION,
    CUBE_POSITION_COMPONENTS,
    context.FLOAT,
    false,
    cubeStrideBytes,
    0
  )
  context.enableVertexAttribArray(CUBE_DETAIL_ATTRIBUTE_LOCATION)
  context.vertexAttribPointer(
    CUBE_DETAIL_ATTRIBUTE_LOCATION,
    CUBE_DETAIL_COMPONENTS,
    context.FLOAT,
    false,
    cubeStrideBytes,
    CUBE_POSITION_COMPONENTS * floatBytes
  )

  context.bindBuffer(context.ARRAY_BUFFER, sceneBuffer)
  context.enableVertexAttribArray(SCENE_ATTRIBUTE_LOCATION)
  context.vertexAttribPointer(
    SCENE_ATTRIBUTE_LOCATION,
    SCENE_POINT_STRIDE,
    context.FLOAT,
    false,
    0,
    0
  )

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
    cubeBuffer,
    sceneBuffer,
    uniforms: resolveUniformLocations(context, program),
    pointCount: 0,
    positions: new Float32Array(0),
    offsets: new Float32Array(0),
    velocities: new Float32Array(0),
    inkHeight: 0,
    cubePoints: new Float32Array(0),
    cubeHomes: new Float32Array(0),
    maxDimension: readMaxDimension(context),
  }
}

export function applyStaticUniforms(
  runtime: DotFieldRuntime,
  tuning: DotFieldTuning,
  morphTuning: DotFieldMorphTuning,
  sceneTuning: DotFieldSceneTuning,
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
  context.uniform1f(uniforms.cameraDistance, morphTuning.cameraDistance)
  context.uniform1f(uniforms.cubeDotSize, morphTuning.cubeDotSize)
  context.uniform1f(uniforms.burstStagger, sceneTuning.burstStagger)
  context.uniform1f(uniforms.sparkFade, sceneTuning.sparkFade)
  context.uniform1f(uniforms.dustOpacity, sceneTuning.dustOpacity)
  context.uniform1f(uniforms.dustDotSize, sceneTuning.dustDotSize)
  context.uniform1f(
    uniforms.frameOutset,
    sceneTuning.frameOutsetPx * pixelRatio
  )
  context.uniform1f(
    uniforms.frameJitter,
    sceneTuning.frameJitterPx * pixelRatio
  )
  context.uniform1f(uniforms.frameDotSize, sceneTuning.frameDotSize)
  context.uniform1f(uniforms.frameOpacity, sceneTuning.frameOpacity)
  context.uniform1f(uniforms.claimStagger, sceneTuning.claimStagger)
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

export function resizeDotField(runtime: DotFieldRuntime): void {
  const { context, uniforms } = runtime
  const widthPx = context.drawingBufferWidth
  const heightPx = context.drawingBufferHeight

  context.viewport(0, 0, widthPx, heightPx)
  context.useProgram(runtime.program)
  context.uniform2f(uniforms.resolution, widthPx, heightPx)
}

export function uploadPoints(
  runtime: DotFieldRuntime,
  sample: DotFieldSample,
  cubePoints: Float32Array,
  scenePoints: Float32Array
): void {
  const { context } = runtime

  runtime.positions = sample.positions
  runtime.offsets = new Float32Array(sample.count * OFFSET_STRIDE)
  runtime.velocities = new Float32Array(sample.count * OFFSET_STRIDE)
  runtime.inkHeight = sample.inkHeight
  runtime.cubePoints = cubePoints
  runtime.cubeHomes = new Float32Array(sample.count * POINT_STRIDE)

  context.bindBuffer(context.ARRAY_BUFFER, runtime.buffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    sample.positions,
    context.STATIC_DRAW
  )

  context.bindBuffer(context.ARRAY_BUFFER, runtime.offsetBuffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    runtime.offsets,
    context.DYNAMIC_DRAW
  )

  context.bindBuffer(context.ARRAY_BUFFER, runtime.cubeBuffer)
  context.bufferData(context.ARRAY_BUFFER, cubePoints, context.STATIC_DRAW)

  context.bindBuffer(context.ARRAY_BUFFER, runtime.sceneBuffer)
  context.bufferData(context.ARRAY_BUFFER, scenePoints, context.STATIC_DRAW)

  runtime.pointCount = sample.count
}

export function uploadOffsets(runtime: DotFieldRuntime): void {
  const { context } = runtime

  context.bindBuffer(context.ARRAY_BUFFER, runtime.offsetBuffer)
  context.bufferSubData(context.ARRAY_BUFFER, 0, runtime.offsets)
}

export function drawDotField(
  runtime: DotFieldRuntime,
  frame: DotFieldFrame
): void {
  const { context, uniforms } = runtime
  const { intro } = frame

  context.clear(context.COLOR_BUFFER_BIT)

  if (runtime.pointCount === 0) {
    return
  }

  context.useProgram(runtime.program)
  context.bindVertexArray(runtime.vertexArray)

  context.uniform1f(uniforms.introScale, intro.scale)
  context.uniform1f(uniforms.introReveal, intro.revealX)
  context.uniform1f(uniforms.introSoftness, intro.softness)
  context.uniform1f(uniforms.introDim, intro.dim)
  context.uniform2f(uniforms.wordOrigin, frame.wordOrigin.x, frame.wordOrigin.y)
  context.uniform2f(uniforms.wordCenter, frame.wordCenter.x, frame.wordCenter.y)
  context.uniform2f(
    uniforms.wordBounds,
    frame.wordBounds.left,
    frame.wordBounds.right
  )
  context.uniform2f(uniforms.cubeCenter, frame.cubeCenter.x, frame.cubeCenter.y)
  context.uniform1f(uniforms.cubeHalfSize, frame.cubeHalfSize)
  context.uniformMatrix3fv(uniforms.cubeRotation, false, frame.rotation)
  context.uniform1f(uniforms.farLight, frame.farLight)
  context.uniform1f(uniforms.windowTop, frame.windowTop)
  context.uniform1f(uniforms.burst, frame.burst)
  context.uniform1f(uniforms.sparkRadius, frame.sparkRadius)
  context.uniform4f(
    uniforms.dustRect,
    frame.dustRect.x,
    frame.dustRect.y,
    frame.dustRect.width,
    frame.dustRect.height
  )
  context.uniform2f(uniforms.shares, frame.shares.x, frame.shares.y)
  context.uniform1f(uniforms.frameCount, frame.frameCount)
  context.uniform4fv(uniforms.frameRects, frame.frameRects)
  context.uniform1fv(uniforms.claims, frame.claims)
  context.uniform1f(uniforms.frameBand, frame.frameBand)

  for (const morph of frame.morphPasses) {
    context.uniform1f(uniforms.morph, morph)
    context.drawArrays(context.POINTS, 0, runtime.pointCount)
  }

  context.bindVertexArray(null)
}

export function destroyRuntime(runtime: DotFieldRuntime): void {
  const { context } = runtime

  context.deleteBuffer(runtime.buffer)
  context.deleteBuffer(runtime.offsetBuffer)
  context.deleteBuffer(runtime.cubeBuffer)
  context.deleteBuffer(runtime.sceneBuffer)
  context.deleteVertexArray(runtime.vertexArray)
  context.deleteProgram(runtime.program)
}
