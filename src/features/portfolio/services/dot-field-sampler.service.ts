import {
  DISPLAY_LETTER_SPACING,
  DOT_FIELD_TUNING,
  TEXT_PADDING_PX,
} from "@/data/hero.data"
import { hasFontLoadingApi } from "@/features/portfolio/browser-capability.rules"
import {
  buildFontShorthand,
  clampFontSize,
  resolveDotPitch,
  resolveFontSize,
  samplePixelGrid,
} from "@/features/portfolio/dot-field.rules"
import type { DotFieldSample, DotFieldSampleRequest } from "@/types/hero.type"

export async function waitForDisplayFont(
  primaryFamily: string
): Promise<boolean> {
  if (!hasFontLoadingApi()) {
    return false
  }

  if (primaryFamily.length === 0) {
    return false
  }

  const descriptor = buildFontShorthand(
    DOT_FIELD_TUNING.fontWeight,
    DOT_FIELD_TUNING.probeFontSize,
    primaryFamily
  )

  try {
    await document.fonts.load(descriptor)
    await document.fonts.ready
  } catch {
    return false
  }

  return document.fonts.check(descriptor)
}

function createMeasuringContext(): CanvasRenderingContext2D | null {
  const canvas = document.createElement("canvas")

  return canvas.getContext("2d")
}

function applyDisplayFont(
  context: CanvasRenderingContext2D,
  fontSize: number,
  fontFamily: string
): boolean {
  context.font = buildFontShorthand(
    DOT_FIELD_TUNING.fontWeight,
    fontSize,
    fontFamily
  )

  if ("letterSpacing" in context) {
    context.letterSpacing = DISPLAY_LETTER_SPACING
  }

  return context.font.length > 0
}

export function sampleWordToPoints(
  request: DotFieldSampleRequest
): DotFieldSample | null {
  const { text, fontFamily, viewport, tuning } = request

  if (text.length === 0 || viewport.width <= 0 || viewport.height <= 0) {
    return null
  }

  const measuringContext = createMeasuringContext()

  if (measuringContext === null) {
    return null
  }

  function measureInkWidth(fontSize: number): number {
    if (measuringContext === null) {
      return 0
    }

    if (!applyDisplayFont(measuringContext, fontSize, fontFamily)) {
      return 0
    }

    const metrics = measuringContext.measureText(text)

    return metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  }

  const targetWidth = viewport.width * tuning.widthRatio
  const estimatedSize = resolveFontSize({
    measureInkWidth,
    targetWidth,
    probeSize: tuning.probeFontSize,
  })

  if (!applyDisplayFont(measuringContext, estimatedSize, fontFamily)) {
    return null
  }

  const estimatedMetrics = measuringContext.measureText(text)
  const estimatedHeight =
    estimatedMetrics.actualBoundingBoxAscent +
    estimatedMetrics.actualBoundingBoxDescent

  let fontSize = estimatedSize

  if (estimatedHeight > 0) {
    const heightLimit = viewport.height * tuning.maxHeightRatio
    const heightCappedSize = (estimatedSize * heightLimit) / estimatedHeight

    fontSize = Math.min(estimatedSize, heightCappedSize)
  }

  fontSize = clampFontSize(fontSize, tuning.minFontSize, tuning.maxFontSize)

  const renderCanvas = document.createElement("canvas")
  const renderContext = renderCanvas.getContext("2d", {
    willReadFrequently: true,
  })

  if (renderContext === null) {
    return null
  }

  if (!applyDisplayFont(renderContext, fontSize, fontFamily)) {
    return null
  }

  const metrics = renderContext.measureText(text)
  const inkWidth =
    metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const inkHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

  if (inkWidth <= 0 || inkHeight <= 0) {
    return null
  }

  const canvasWidth = Math.ceil(inkWidth) + TEXT_PADDING_PX * 2
  const canvasHeight = Math.ceil(inkHeight) + TEXT_PADDING_PX * 2

  renderCanvas.width = canvasWidth
  renderCanvas.height = canvasHeight

  applyDisplayFont(renderContext, fontSize, fontFamily)
  renderContext.fillStyle = "#ffffff"
  renderContext.textBaseline = "alphabetic"
  renderContext.fillText(
    text,
    TEXT_PADDING_PX + metrics.actualBoundingBoxLeft,
    TEXT_PADDING_PX + metrics.actualBoundingBoxAscent
  )

  const imageData = renderContext.getImageData(0, 0, canvasWidth, canvasHeight)
  const pitch = resolveDotPitch(
    tuning.dotPitch,
    viewport.pixelRatio,
    canvasWidth,
    canvasHeight,
    tuning.maxPointCount
  )

  const pointCloud = samplePixelGrid(
    imageData.data,
    canvasWidth,
    canvasHeight,
    pitch,
    tuning.alphaThreshold
  )

  const offsetX = (viewport.width - canvasWidth) / 2
  const offsetY = (viewport.height - canvasHeight) / 2

  for (let index = 0; index < pointCloud.count; index += 1) {
    pointCloud.positions[index * 3] += offsetX
    pointCloud.positions[index * 3 + 1] += offsetY
  }

  return {
    positions: pointCloud.positions,
    count: pointCloud.count,
    left: offsetX + TEXT_PADDING_PX,
    right: offsetX + canvasWidth - TEXT_PADDING_PX,
  }
}
