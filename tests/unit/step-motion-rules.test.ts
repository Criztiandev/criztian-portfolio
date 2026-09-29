import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { THREAD_TURN_PROPERTY } from "@/data/hero.data"
import {
  CAPTION_LINE_STAGGER,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import { PROCESS_SCENE, SERVICES_SCENE } from "@/data/page-sections.data"
import {
  buildDigitStyle,
  buildOrbitStepStyle,
  buildOrbitStyle,
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"

function readStylesheet(): string {
  return readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8")
}

function readUtility(css: string, name: string): string {
  const start = css.indexOf(`@utility ${name} {`)

  if (start === -1) {
    return ""
  }

  return css.slice(start, css.indexOf("\n}", start))
}

describe("the step scenes", () => {
  it("counts the steps for the container's height", () => {
    expect(buildStepSceneStyle(5)["--steps"]).toBe(5)
  })
})

describe("the service captions", () => {
  it("staggers the caption lines as a share of the reveal", () => {
    const style = buildThreadCaptionStyle()

    expect(style["--caption-stagger"]).toBe(CAPTION_LINE_STAGGER)
  })

  it("keys every service caption and position to its shape's reveal", () => {
    const css = readStylesheet()

    for (const shape of SERVICES_SCENE.shapes.split(" ")) {
      const selector = new RegExp(
        `\\[data-caption="${shape}"\\],\\s*\\[data-position="${shape}"\\]\\s*\\{\\s*--caption-reveal:\\s*var\\(--reveal-${shape}\\);`
      )

      expect(css).toMatch(selector)
    }
  })
})

describe("the orbit", () => {
  it("keys every step's position to its shape's reveal", () => {
    const css = readStylesheet()

    for (const shape of PROCESS_SCENE.shapes.split(" ")) {
      const selector = new RegExp(
        `\\[data-position="${shape}"\\]\\s*\\{\\s*--caption-reveal:\\s*var\\(--reveal-${shape}\\);`
      )

      expect(css).toMatch(selector)
    }
  })

  it("turns, assembles and lights each step from the dots' own turn", () => {
    const step = readUtility(readStylesheet(), "orbit-step")

    expect(step).toContain(`var(${THREAD_TURN_PROPERTY}, 0)`)
    expect(step).toMatch(/--orbit-assemble:/)
    expect(step).toContain("max(0, var(--orbit-index) - 1)")
    expect(step).toMatch(/--orbit-lit:/)
    expect(step).toMatch(/rotate:/)
  })

  it("assembles the digits from the step's assemble, never on a clock", () => {
    const digit = readUtility(readStylesheet(), "orbit-digit")

    expect(digit).toContain("var(--orbit-assemble)")
    expect(digit).not.toMatch(/animation|transition/)
  })

  it("drives only the ring's drift by the scroll timeline", () => {
    const css = readStylesheet()
    const timelines = css.match(/animation-timeline:\s*--step-scene/g) ?? []

    expect(timelines).toHaveLength(1)
    expect(readUtility(css, "orbit-spin")).toContain("--step-scene")
    expect(css).not.toMatch(/@utility orbit-(turn|reveal)\b/)
  })

  it("drifts the ring's dots by the orbit's spin ratio", () => {
    expect(buildOrbitStyle()).toEqual({
      "--orbit-spin-ratio": ORBIT_RING_SPIN_RATIO,
    })
  })

  it("places each step by its index on the ring", () => {
    expect(buildOrbitStepStyle(3)).toEqual({ "--orbit-index": 3 })
  })

  it("tilts every digit from the fixed list and wraps around it", () => {
    const count = ORBIT_DIGIT_TILTS_DEGREES.length

    expect(buildDigitStyle(0)).toEqual({
      "--orbit-tilt": `${ORBIT_DIGIT_TILTS_DEGREES[0]}deg`,
    })
    expect(buildDigitStyle(count + 1)).toEqual(buildDigitStyle(1))
  })

  it("has no data-scene keyed rule left in the stylesheet", () => {
    expect(readStylesheet()).not.toMatch(/\[data-scene=/)
  })
})
