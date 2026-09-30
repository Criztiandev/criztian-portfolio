import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { CONTACT_ACKNOWLEDGEMENT_CLASS } from "@/data/contact.data"
import {
  SCENE_REVEAL_PROPERTY,
  SIGNAL_EASE,
  THREAD_REVEAL_PROPERTY_PREFIX,
  THREAD_TURN_PROPERTY,
} from "@/data/hero.data"
import {
  CAPTION_CASCADE_SPREAD,
  CAPTION_LINE_STAGGER,
  COPY_DRIFT_PX,
  MOBILE_MENU_WIPE_CLASS,
  ORBIT_DIGIT_TILTS_DEGREES,
  ORBIT_RING_SPIN_RATIO,
} from "@/data/motion.data"
import {
  COPY_DRIFT_CLASS,
  FAQ_DISCLOSURE_CLASS,
  FAQ_PLUS_TURN_CLASS,
  PROCESS_SCENE,
  SCREEN_TIMELINE_CLASS,
  SERVICES_SCENE,
} from "@/data/page-sections.data"
import { PROJECTS_SCENE_ID } from "@/data/portfolio.data"
import { PROJECTS_MAX } from "@/data/site-content.data"
import { formatSceneStepId } from "@/features/portfolio/dot-field.rules"
import {
  buildCopyDriftStyle,
  buildDigitStyle,
  buildOrbitStepStyle,
  buildOrbitStyle,
  buildLineStyle,
  buildSceneCaptionStyle,
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"

const FULL_STAGGER_LINES = 4

const LONGEST_SCENE_LINES = 12

const SPREAD_TOLERANCE = 1e-9

function readStylesheet(): string {
  return readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8")
}

function readBlock(css: string, header: string): string {
  const start = css.indexOf(`${header} {`)

  if (start === -1) {
    return ""
  }

  return css.slice(start, css.indexOf("\n}", start))
}

function readUtility(css: string, name: string): string {
  return readBlock(css, `@utility ${name}`)
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
        `\\[data-caption="${shape}"\\],\\s*\\[data-position="${shape}"\\]\\s*\\{\\s*--caption-reveal:\\s*min\\(var\\(--reveal-${shape}\\), var\\(--title-gate, 1\\)\\);`
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

  it("wipes across and leaves a full line above and below, so padded links keep their tap area", () => {
    const line = readUtility(readStylesheet(), "caption-line")

    expect(line).toMatch(
      /clip-path:\s*inset\(-100% calc\(100% - var\(--line-reveal\) \* 104%\) -100% 0\);/
    )
  })
})

describe("the projects deck", () => {
  it("keys every project card to its step's reveal, up to the most projects", () => {
    const css = readStylesheet()

    for (let index = 0; index < PROJECTS_MAX; index += 1) {
      const step = formatSceneStepId(PROJECTS_SCENE_ID, index)
      const selector = new RegExp(
        `\\[data-caption="${step}"\\]\\s*\\{\\s*--caption-reveal:\\s*min\\(var\\(${THREAD_REVEAL_PROPERTY_PREFIX}${step}\\), var\\(--title-gate, 1\\)\\);`
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
        `\\[data-position="${shape}"\\]\\s*\\{\\s*--caption-reveal:\\s*min\\(var\\(--reveal-${shape}\\), var\\(--title-gate, 1\\)\\);`
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

    expect(readUtility(css, "orbit-spin")).toMatch(
      /animation-timeline:\s*--screen;/
    )
    expect(readUtility(css, "orbit-step")).not.toMatch(/animation/)
    expect(readUtility(css, "orbit-digit")).not.toMatch(/animation/)
    expect(css).not.toContain("--step-scene")
    expect(css).not.toMatch(/@utility orbit-(turn|reveal)\b/)
  })

  it("lets the wheel's copy and numerals leave with its dots", () => {
    const step = readUtility(readStylesheet(), "orbit-step")

    expect(step).toMatch(/--orbit-assemble:[^;]*var\(--scene-lit, 1\)/)
    expect(step).toMatch(/--orbit-lit:[^;]*var\(--scene-lit, 1\)/)
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

describe("the scene sweep", () => {
  it("staggers up to four lines by the caption stagger, then spreads them", () => {
    for (let lastLine = 1; lastLine <= LONGEST_SCENE_LINES; lastLine += 1) {
      const style = buildSceneCaptionStyle(lastLine)
      const stagger = Number(style["--caption-stagger"])

      expect(style["--caption-last"]).toBe(lastLine)
      expect(lastLine * stagger).toBeLessThanOrEqual(
        CAPTION_CASCADE_SPREAD + SPREAD_TOLERANCE
      )

      if (lastLine <= FULL_STAGGER_LINES) {
        expect(stagger, `${lastLine}`).toBe(CAPTION_LINE_STAGGER)
      } else {
        expect(stagger, `${lastLine}`).toBeCloseTo(
          CAPTION_CASCADE_SPREAD / lastLine
        )
      }
    }
  })

  it("sweeps only on a screen with motion, on a running stage, never in a flowed scene", () => {
    const swept = readBlock(readStylesheet(), "@custom-variant swept")

    expect(swept).toContain(
      "@media screen and (prefers-reduced-motion: no-preference)"
    )
    expect(swept.replace(/\s+/g, " ")).toContain(
      '&:where([data-status="running"] *):not( [data-fit], [data-fit] *, [data-motion="paused"] * )'
    )
    expect(swept).not.toMatch(/animation-timeline|height/)
  })

  it("stops every sweep, board, drift and transition while the page's motion is paused", () => {
    const css = readStylesheet()
    const paused = '[data-motion="paused"] *'

    expect(readBlock(css, "@custom-variant staged")).toContain(paused)
    expect(readBlock(css, "@custom-variant swept")).toContain(paused)
    expect(readBlock(css, "@custom-variant motion-safe")).toContain(
      `&:not(${paused})`
    )
    expect(readBlock(css, "@custom-variant motion-reduce")).toContain(
      `&:where(${paused})`
    )
    expect(readUtility(css, COPY_DRIFT_CLASS)).toContain(`&:not(${paused})`)
    expect(css).toMatch(
      /html\[data-motion="paused"\] \{\s*scroll-behavior: auto;/
    )
  })

  it("shows each section's title big once the old section has cleared, and docks it before the dots land", () => {
    const css = readStylesheet()
    const title = readUtility(css, "section-title")
    const keyframes = readBlock(css, "@keyframes section-title")
    const word = readUtility(css, "section-title-word")

    expect(title).toContain("@supports (animation-timeline: view())")
    expect(title).toMatch(/animation-timeline:\s*--screen;/)
    expect(title).toMatch(/animation-range:\s*cover;/)
    expect(title).toMatch(/animation-fill-mode:\s*forwards;/)
    expect(title).not.toMatch(/animation:/)
    expect(keyframes).toMatch(
      /entry 0% \{\s*--title-grow: 1;\s*--title-hold: 0;/
    )
    expect(keyframes).toMatch(/entry 38% \{\s*--title-hold: 0;/)
    expect(keyframes).toMatch(/entry 44% \{\s*--title-hold: 1;/)
    expect(keyframes).toMatch(/entry 68% \{\s*--title-grow: 1;/)
    expect(keyframes).toMatch(/entry 90% \{\s*--title-grow: 0;/)
    expect(keyframes).toMatch(/exit 0% \{\s*--title-hold: 1;/)
    expect(keyframes).toMatch(/exit 1% \{\s*--title-hold: 0;/)
    expect(word).toMatch(/scale:[^;]*tan\(atan2\(var\(--title-size\), 1em\)\)/)
    expect(word).toContain(
      "--caption-reveal: max(var(--scene-lit, 1), var(--title-hold));"
    )
    expect(word).not.toMatch(/font-size|width|height|margin/)
  })

  it("clears the flying dots from round the big title with a halo that fades as it docks", () => {
    const word = readUtility(readStylesheet(), "section-title-word")

    expect(word).toMatch(
      /--title-halo: color-mix\(\s*in oklab,\s*var\(--background\) calc\(var\(--title-grow\) \* 100%\),\s*transparent\s*\)/
    )
    expect(word).toMatch(/text-shadow:[^;]*var\(--title-halo\)/)
  })

  it("lights every scene from its dots' own reveal, and fully while it holds focus", () => {
    const css = readStylesheet()
    const scene = readBlock(css, "[data-dot-scene]")

    expect(scene).toContain(
      `--scene-lit: min(var(${SCENE_REVEAL_PROPERTY}, 1), var(--title-gate));`
    )
    expect(scene).toContain("--caption-reveal: var(--scene-lit);")
    expect(readBlock(css, "[data-dot-scene]:has(:focus-visible)")).toMatch(
      /--scene-lit:\s*1;/
    )
  })

  it("holds a section's copy back until its big title has nearly docked", () => {
    const css = readStylesheet()
    const scene = readBlock(css, "[data-dot-scene]")
    const stepReveals =
      css.match(/--caption-reveal: min\(var\(--reveal-/g) ?? []
    const ungatedReveals = css.match(/--caption-reveal: var\(--reveal-/g) ?? []

    expect(scene).toContain(
      "--title-gate: clamp(0, 1 - var(--title-grow) * 3, 1);"
    )
    expect(stepReveals).toHaveLength(PROJECTS_MAX + 3 + 5)
    expect(ungatedReveals).toHaveLength(0)
    expect(css).toMatch(
      /\[data-caption="branding"\],\s*\[data-position="branding"\] \{\s*--caption-reveal: min\(var\(--reveal-branding\), var\(--title-gate, 1\)\);/
    )
  })

  it("staggers each line up to the scene's last and never clips a focused one", () => {
    const line = readUtility(readStylesheet(), "caption-line")

    expect(line).toContain("var(--caption-last, 2)")
    expect(line).toMatch(
      /&:focus-visible,\s*&:has\(:focus-visible\)\s*\{\s*clip-path:\s*none;\s*translate:\s*none;/
    )
  })
})

describe("the stats", () => {
  it("counts a whole number up on its line's reveal and pins the suffix to the value's end", () => {
    const css = readStylesheet()
    const property = readBlock(css, "@property --stat-count")
    const count = readUtility(css, "stat-count")

    expect(property).toMatch(/syntax:\s*"<integer>";/)
    expect(property).toMatch(/inherits:\s*false;/)
    expect(property).toMatch(/initial-value:\s*0;/)
    expect(count).toContain(
      "--stat-count: calc(var(--stat-value) * var(--line-reveal, 1));"
    )
    expect(count).toContain("counter-reset: stat-count var(--stat-count);")
    expect(count).toMatch(
      /&::before\s*\{\s*content:\s*counter\(stat-count\);\s*\}/
    )
    expect(count).toMatch(
      /&::after\s*\{\s*content:\s*attr\(data-suffix\);\s*position:\s*absolute;\s*inset-inline-end:\s*0;\s*\}/
    )
  })
})

describe("the parallax", () => {
  it("drifts the copy by the fixed distance", () => {
    expect(buildCopyDriftStyle()).toEqual({
      "--copy-drift": `${COPY_DRIFT_PX}px`,
    })
  })

  it("names each screen's view timeline with the longhands, under the header", () => {
    const timeline = readUtility(readStylesheet(), SCREEN_TIMELINE_CLASS)

    expect(timeline).toMatch(/view-timeline-name:\s*--screen;/)
    expect(timeline).toMatch(/view-timeline-inset:\s*4\.5rem 0;/)
    expect(timeline).not.toMatch(/view-timeline:/)
  })

  it("drifts the column's children on the screen, wide and with motion only", () => {
    const drift = readUtility(readStylesheet(), COPY_DRIFT_CLASS)

    expect(drift).toContain("@supports (animation-timeline: view())")
    expect(drift).toContain("prefers-reduced-motion: no-preference")
    expect(drift).toContain("min-width: 48rem")
    expect(drift).toContain('&:not([data-motion="paused"] *) > *')
    expect(drift).toMatch(/animation-timeline:\s*--screen;/)
    expect(drift).toMatch(/animation-range:\s*cover;/)
    expect(drift).not.toMatch(/animation:/)
  })

  it("contains the column's layout in every mode, so the drift never reaches a fit box", () => {
    const drift = readUtility(readStylesheet(), COPY_DRIFT_CLASS)
    const containment = drift.search(/contain:\s*layout;/)

    expect(containment).toBeGreaterThan(-1)
    expect(containment).toBeLessThan(drift.indexOf("@supports"))
  })

  it("moves the copy by transform and holds it still between entry and exit", () => {
    const keyframes = readBlock(readStylesheet(), "@keyframes copy-drift")

    expect(keyframes).toMatch(
      /entry 0%\s*\{\s*transform:\s*translateY\(var\(--copy-drift\)\);/
    )
    expect(keyframes).toMatch(/entry 100%,\s*exit 0%\s*\{\s*transform:\s*none;/)
    expect(keyframes).toMatch(
      /exit 100%\s*\{\s*transform:\s*translateY\(calc\(-1 \* var\(--copy-drift\)\)\);/
    )
    expect(keyframes).not.toMatch(/(^|\s)translate:/m)
  })
})

describe("the signal ease", () => {
  it("gives every CSS transition the one signal ease token, the same curve as Motion's", () => {
    const theme = readBlock(readStylesheet(), "@theme inline")
    const transitions = [
      MOBILE_MENU_WIPE_CLASS,
      CONTACT_ACKNOWLEDGEMENT_CLASS,
      FAQ_DISCLOSURE_CLASS,
      FAQ_PLUS_TURN_CLASS,
    ]

    expect(theme).toContain(
      `--ease-signal: cubic-bezier(${SIGNAL_EASE.join(", ")});`
    )

    for (const classes of transitions) {
      expect(classes).toContain("ease-signal")
      expect(classes).not.toContain("ease-[")
    }
  })
})

describe("the scroll progress", () => {
  it("scales the hairline on the root scroll with longhands, where supported", () => {
    const css = readStylesheet()
    const progress = readUtility(css, "scroll-progress")
    const keyframes = readBlock(css, "@keyframes scroll-progress")

    expect(progress).toContain("@supports (animation-timeline: scroll())")
    expect(progress).toMatch(/animation-name:\s*scroll-progress;/)
    expect(progress).toMatch(/animation-duration:\s*auto;/)
    expect(progress).toMatch(/animation-timeline:\s*scroll\(root\);/)
    expect(progress).not.toMatch(/animation:/)
    expect(keyframes).toMatch(/from\s*\{\s*scale:\s*0 1;/)
    expect(keyframes).toMatch(/to\s*\{\s*scale:\s*1 1;/)
  })
})

describe("without scripting", () => {
  it("shows every Motion element at rest", () => {
    const reset = readBlock(readStylesheet(), "@media (scripting: none)")

    expect(reset).toContain("[data-reveal]")
    expect(reset).toContain("opacity: 1 !important;")
    expect(reset).toContain("clip-path: none !important;")
    expect(reset).toContain("transform: none !important;")
  })
})

describe("the native cursor", () => {
  it("hides only while the custom cursor is on, never in forced colours", () => {
    const css = readStylesheet()
    const cursor = readBlock(css, "@media (forced-colors: none)")

    expect(cursor).toMatch(
      /html\[data-cursor="on"\],\s*html\[data-cursor="on"\] \*\s*\{\s*cursor:\s*none;/
    )
    expect(cursor).toMatch(
      /html\[data-cursor="on"\] :is\(input, textarea, select\)\s*\{\s*cursor:\s*auto;/
    )
    expect(css.match(/cursor:\s*none/g)).toHaveLength(1)
  })
})
