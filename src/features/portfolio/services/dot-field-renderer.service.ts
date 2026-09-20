import { POINT_STRIDE } from "@/data/hero.data"
import { hexToRgbTriplet } from "@/features/portfolio/dot-field.rules"
import { DOT_FIELD_FRAGMENT_SHADER } from "@/features/portfolio/shaders/dot-field.fragment-shader"
import { DOT_FIELD_VERTEX_SHADER } from "@/features/portfolio/shaders/dot-field.vertex-shader"
import type {
  DotFieldRuntime,
  DotFieldSample,
  DotFieldTuning,
  DotFieldUniforms,
} from "@/types/hero.type"

const POINT_ATTRIBUTE_LOCATION = 0

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
    pointer: context.getUniformLocation(program, "uPointer"),
    influence: context.getUniformLocation(program, "uInfluence"),
    time: context.getUniformLocation(program, "uTime"),
    pixelRatio: context.getUniformLocation(program, "uPixelRatio"),
    dotSize: context.getUniformLocation(program, "uDotSize"),
    vortexRadius: context.getUniformLocation(program, "uVortexRadius"),
    vortexSwirl: context.getUniformLocation(program, "uVortexSwirl"),
    vortexPush: context.getUniformLocation(program, "uVortexPush"),
    vortexFade: context.getUniformLocation(program, "uVortexFade"),
    vortexShrink: context.getUniformLocation(program, "uVortexShrink"),
    wave: context.getUniformLocation(program, "uWave"),
    waveSpeed: context.getUniformLocation(program, "uWaveSpeed"),
    color: context.getUniformLocation(program, "uColor"),
    edgePixels: context.getUniformLocation(program, "uEdgePixels"),
  }
}

export function createDotFieldRuntime(
  context: WebGL2RenderingContext
): DotFieldRuntime {
  const program = createDotFieldProgram(context)
  const vertexArray = context.createVertexArray()
  const buffer = context.createBuffer()

  if (vertexArray === null || buffer === null) {
    context.deleteProgram(program)

    throw new Error("dot_field_buffers_unavailable")
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
  context.bindVertexArray(null)

  context.disable(context.DEPTH_TEST)
  context.enable(context.BLEND)
  context.blendFunc(context.SRC_ALPHA, context.ONE)
  context.clearColor(0, 0, 0, 1)

  return {
    context,
    program,
    vertexArray,
    buffer,
    uniforms: resolveUniformLocations(context, program),
    pointCount: 0,
  }
}

export function applyStaticUniforms(
  runtime: DotFieldRuntime,
  tuning: DotFieldTuning,
  pixelRatio: number,
  dotColor: string
): void {
  const { context, uniforms } = runtime
  const [red, green, blue] = hexToRgbTriplet(dotColor)

  context.useProgram(runtime.program)
  context.uniform1f(uniforms.pixelRatio, pixelRatio)
  context.uniform1f(uniforms.dotSize, tuning.dotSize)
  context.uniform1f(uniforms.vortexRadius, tuning.vortexRadius)
  context.uniform1f(uniforms.vortexSwirl, tuning.vortexSwirl)
  context.uniform1f(uniforms.vortexPush, tuning.vortexPush)
  context.uniform1f(uniforms.vortexFade, tuning.vortexFade)
  context.uniform1f(uniforms.vortexShrink, tuning.vortexShrink)
  context.uniform1f(uniforms.edgePixels, tuning.dotEdgePixels)
  context.uniform3f(uniforms.color, red, green, blue)
  context.uniform4f(
    uniforms.wave,
    tuning.waveAmplitude,
    tuning.waveSecondaryAmplitude,
    tuning.waveFrequency,
    tuning.waveSecondaryFrequency
  )
  context.uniform2f(
    uniforms.waveSpeed,
    tuning.waveSpeed,
    tuning.waveSecondarySpeed
  )
}

export function resizeDotField(
  runtime: DotFieldRuntime,
  widthPx: number,
  heightPx: number
): void {
  const { context, uniforms } = runtime

  context.viewport(0, 0, widthPx, heightPx)
  context.useProgram(runtime.program)
  context.uniform2f(uniforms.resolution, widthPx, heightPx)
}

export function uploadPoints(
  runtime: DotFieldRuntime,
  sample: DotFieldSample
): void {
  const { context } = runtime

  context.bindBuffer(context.ARRAY_BUFFER, runtime.buffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    sample.positions,
    context.STATIC_DRAW
  )

  runtime.pointCount = sample.count
}

export function drawDotField(
  runtime: DotFieldRuntime,
  elapsedSeconds: number,
  pointerX: number,
  pointerY: number,
  influence: number
): void {
  const { context, uniforms } = runtime

  context.clear(context.COLOR_BUFFER_BIT)

  if (runtime.pointCount === 0) {
    return
  }

  context.useProgram(runtime.program)
  context.bindVertexArray(runtime.vertexArray)

  context.uniform1f(uniforms.time, elapsedSeconds)
  context.uniform2f(uniforms.pointer, pointerX, pointerY)
  context.uniform1f(uniforms.influence, influence)

  context.drawArrays(context.POINTS, 0, runtime.pointCount)
  context.bindVertexArray(null)
}

export function destroyRuntime(runtime: DotFieldRuntime): void {
  const { context } = runtime

  context.deleteBuffer(runtime.buffer)
  context.deleteVertexArray(runtime.vertexArray)
  context.deleteProgram(runtime.program)
}
