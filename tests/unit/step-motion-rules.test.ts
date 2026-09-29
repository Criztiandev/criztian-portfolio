import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import {
  THREAD_REVEAL_PROPERTY_PREFIX,
  THREAD_TURN_PROPERTY,
} from "@/data/hero.data"
import {
  CAPTION_LINE_STAGGER,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import { PROCESS_SCENE, SERVICES_SCENE } from "@/data/page-sections.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { PROJECTS_MAX } from "@/data/site-content.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"
import {
  buildDigitStyle,
  buildOrbitStepStyle,
  buildOrbitStyle,
  buildLineStyle,
  buildShownCaptionStyle,
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

describe("the caption lines", () => {
  it("numbers each line for the stagger of its sweep", () => {
    expect(buildLineStyle(0)).toEqual({ "--line": 0 })
    expect(buildLineStyle(2)).toEqual({ "--line": 2 })
  })
})

describe("the projects deck", () => {
  it("shows a lone project's copy in full", () => {
    expect(buildShownCaptionStyle()).toEqual({ "--caption-reveal": 1 })
  })

  it("keys every project card to its step's reveal, up to the most projects", () => {
    const css = readStylesheet()

    for (let index = 0; index < PROJECTS_MAX; index += 1) {
      const step = formatSceneStepId(PROJECTS_SCENE_ID, index)
      const selector = new RegExp(
        `\\[data-caption="${step}"\\]\\s*\\{\\s*--caption-reveal:\\s*var\\(${THREAD_REVEAL_PROPERTY_PREFIX}${step}\\);`
      )

      expect(css).toMatch(selector)
    }
  })

  it("shows the focused project's card and hides the rest, in that order", () => {
    const css = readStylesheet()
    const hideRest = css.search(
      /\[data-deck\]:has\(:focus-visible\) \[data-caption\]\s*\{\s*--caption-reveal:\s*0;/
    )
    const showFocused = css.search(
      /\[data-deck\] \[data-caption\]:has\(:focus-visible\)\s*\{\s*--caption-reveal:\s*1;/
    )

    expect(hideRest).toBeGreaterThan(-1)
    expect(showFocused).toBeGreaterThan(hideRest)
  })

  it("wipes the plate in from the left on the caption reveal, never sliding it", () => {
    const css = readStylesheet()
    const plate = readUtility(css, "plate-sweep")
    const lineReveal = readUtility(css, "caption-line").match(
      /--line-reveal:[^;]*;/
    )

    expect(lineReveal).not.toBeNull()
    expect(plate).toContain(lineReveal?.[0])
    expect(plate).toMatch(
      /clip-path:\s*inset\(0 calc\(100% - var\(--line-reveal\) \* 100%\) 0 0\);/
    )
    expect(plate).not.toMatch(/translate|transform/)
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
