import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { DOT_FIELD_MORPH_TUNING } from "@/data/hero.data"
import { PROCESS_SCENE, SERVICES_SCENE } from "@/data/page-sections.data"
import { buildSceneKeyframes } from "@/features/portfolio/dot-field.rules"
import {
  CAPTION_SHOW_DELAY_SHARE,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_PATH_LENGTH,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import {
  buildAssembleStyle,
  buildDigitStyle,
  buildOrbitStyle,
  buildThreadCaptionStyle,
  resolveAssembleHandover,
  resolveSceneHandovers,
  resolveSceneShare,
  resolveStepHandover,
} from "@/features/portfolio/step-motion.rules"
import type { DotSceneMeasure, DotShapeId } from "@/types/hero.type"

const SHARE = DOT_FIELD_MORPH_TUNING.stepMorphShare

const CONTAINER_TOP = 1000

const STICKY_TOP = 72

const FRAME_HEIGHT = 828

const PORTRAIT_PITCH = 403

const PRECISION = 6

function buildMeasure(
  id: string,
  shapes: DotShapeId[],
  frameHeight: number,
  pitch: number
): DotSceneMeasure {
  return {
    id,
    shapes,
    containerTop: CONTAINER_TOP,
    containerBottom: CONTAINER_TOP + frameHeight + (shapes.length - 1) * pitch,
    stickyTop: STICKY_TOP,
    frameHeight,
    slot: { x: 0, y: STICKY_TOP, width: 400, height: 400 },
  }
}

function readSceneShapes(shapes: string): DotShapeId[] {
  const ids: DotShapeId[] = []

  for (const id of shapes.split(" ")) {
    ids.push(id as DotShapeId)
  }

  return ids
}

describe("resolveStepHandover", () => {
  it("rolls the first step in over the tail of the entry flight", () => {
    expect(resolveStepHandover(0, 3, SHARE)).toEqual({
      inFrom: -SHARE,
      inTo: 0,
      outFrom: 0.5 - SHARE / 2,
      outTo: 0.5 + SHARE / 2,
    })
  })

  it("centres every later handover on the half pitch", () => {
    const handover = resolveStepHandover(3, 5, SHARE)

    expect(handover.inFrom).toBeCloseTo(2.5 - SHARE / 2, PRECISION)
    expect(handover.inTo).toBeCloseTo(2.5 + SHARE / 2, PRECISION)
    expect(handover.outFrom).toBeCloseTo(3.5 - SHARE / 2, PRECISION)
    expect(handover.outTo).toBeCloseTo(3.5 + SHARE / 2, PRECISION)
  })

  it("never rolls the last step out", () => {
    const handover = resolveStepHandover(2, 3, SHARE)

    expect(handover.outFrom).toBeNull()
    expect(handover.outTo).toBeNull()
  })

  it("hands each step over on the next step's roll in", () => {
    const handovers = resolveSceneHandovers(5, SHARE)

    for (let stepIndex = 0; stepIndex < 4; stepIndex += 1) {
      expect(handovers[stepIndex]?.outFrom).toBe(
        handovers[stepIndex + 1]?.inFrom
      )
      expect(handovers[stepIndex]?.outTo).toBe(handovers[stepIndex + 1]?.inTo)
    }
  })
})

describe("copy and dots share one timeline", () => {
  const cases = [
    {
      name: "services, split",
      id: SERVICES_SCENE.sceneId,
      shapes: SERVICES_SCENE.shapes,
      pitch: FRAME_HEIGHT,
    },
    {
      name: "process, split",
      id: PROCESS_SCENE.sceneId,
      shapes: PROCESS_SCENE.shapes,
      pitch: FRAME_HEIGHT,
    },
    {
      name: "process, portrait",
      id: PROCESS_SCENE.sceneId,
      shapes: PROCESS_SCENE.shapes,
      pitch: PORTRAIT_PITCH,
    },
  ]

  for (const scene of cases) {
    it(`rolls each step in exactly over the transit into its shape (${scene.name})`, () => {
      const shapes = readSceneShapes(scene.shapes)
      const keyframes = buildSceneKeyframes(
        [buildMeasure(scene.id, shapes, FRAME_HEIGHT, scene.pitch)],
        FRAME_HEIGHT,
        DOT_FIELD_MORPH_TUNING
      )
      const handovers = resolveSceneHandovers(
        shapes.length,
        resolveSceneShare(scene.id)
      )
      const pinStart = CONTAINER_TOP - STICKY_TOP

      expect(keyframes).toHaveLength(shapes.length)
      expect(keyframes[0]?.start).toBeCloseTo(
        pinStart + (handovers[0]?.inTo ?? 1) * scene.pitch,
        PRECISION
      )

      for (let stepIndex = 1; stepIndex < shapes.length; stepIndex += 1) {
        const handover = handovers[stepIndex]

        expect(pinStart + (handover?.inFrom ?? 0) * scene.pitch).toBeCloseTo(
          keyframes[stepIndex - 1]?.end ?? 0,
          PRECISION
        )
        expect(pinStart + (handover?.inTo ?? 0) * scene.pitch).toBeCloseTo(
          keyframes[stepIndex]?.start ?? 0,
          PRECISION
        )
      }
    })
  }
})

describe("the service captions", () => {
  it("shows a caption as its drawing is finishing", () => {
    const style = buildThreadCaptionStyle()

    expect(style["--caption-show-delay"]).toBe(
      `${DOT_FIELD_MORPH_TUNING.threadDrawSeconds * CAPTION_SHOW_DELAY_SHARE}s`
    )
  })

  it("has a literal caption selector for every service shape", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8"
    )

    for (const shape of SERVICES_SCENE.shapes.split(" ")) {
      const selector = new RegExp(
        `\\[data-thread="${shape}"\\]\\s+\\[data-caption="${shape}"\\]\\s+\\[data-caption-line\\]`
      )

      expect(css).toMatch(selector)
    }
  })
})

describe("the orbit", () => {
  const handovers = resolveSceneHandovers(
    PROCESS_SCENE.steps.length,
    resolveSceneShare(PROCESS_SCENE.sceneId)
  )

  it("assembles the first two steps on the entry flight", () => {
    expect(resolveAssembleHandover(0, handovers)).toBe(handovers[0])
    expect(resolveAssembleHandover(1, handovers)).toBe(handovers[0])
  })

  it("assembles every later step as it turns in from the right edge", () => {
    for (
      let stepIndex = 2;
      stepIndex < PROCESS_SCENE.steps.length;
      stepIndex += 1
    ) {
      expect(resolveAssembleHandover(stepIndex, handovers)).toBe(
        handovers[stepIndex - 1]
      )
    }
  })

  it("writes the assemble range in pitch units", () => {
    const handover = resolveStepHandover(2, 5, SHARE)

    expect(buildAssembleStyle(handover)).toEqual({
      "--assemble-from": handover.inFrom,
      "--assemble-to": handover.inTo,
    })
  })

  it("spins the ring in path units per radian", () => {
    const style = buildOrbitStyle()

    expect(style["--orbit-spin-ratio"]).toBe(ORBIT_RING_SPIN_RATIO)
    expect(style["--orbit-units-per-radian"]).toBeCloseTo(
      ORBIT_RING_PATH_LENGTH / (2 * Math.PI),
      PRECISION
    )
  })

  it("tilts every digit from the fixed list and wraps around it", () => {
    const count = ORBIT_DIGIT_TILTS_DEGREES.length

    expect(buildDigitStyle(0)).toEqual({
      "--orbit-tilt": `${ORBIT_DIGIT_TILTS_DEGREES[0]}deg`,
    })
    expect(buildDigitStyle(count + 1)).toEqual(buildDigitStyle(1))
  })

  it("has no data-scene keyed rule left in the stylesheet", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8"
    )

    expect(css).not.toMatch(/\[data-scene=/)
  })
})
