import type { ReactNode } from "react"

import {
  BODY_CLASS,
  ORBIT_CIRCLE_CLASS,
  PROCESS_SCENE,
  SCREEN_INSET_CLASS,
  SCREEN_LABEL_BOX_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_TITLE_CLASS,
  SECTION_TITLE_COUNT_CLASS,
  STEP_NUMBER_DIGITS,
  SWEPT_LABEL_CLASS,
  TITLE_CLASS,
} from "@/data/page-sections.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import {
  buildDigitStyle,
  buildLineStyle,
  buildOrbitStepStyle,
  buildOrbitStyle,
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { SceneStep } from "@/types/page-sections.type"

export function ProcessSection() {
  const { id, headingId, heading, sceneId, shapes, steps } = PROCESS_SCENE
  const shapeIds = shapes.split(" ")
  const sceneStyle = {
    ...buildStepSceneStyle(steps.length),
    ...buildThreadCaptionStyle(),
    ...buildOrbitStyle(),
  }

  function renderPosition(shapeId: string, stepIndex: number) {
    return (
      <span
        key={shapeId}
        data-position={shapeId}
        style={buildLineStyle(0) as React.CSSProperties}
        className="whitespace-pre [grid-area:1/1] staged:caption-line"
      >
        {formatSectionPosition(stepIndex, steps.length)}
      </span>
    )
  }

  function renderNumeral(stepIndex: number) {
    const number = String(stepIndex + 1).padStart(STEP_NUMBER_DIGITS, "0")
    const digits: ReactNode[] = []

    for (let digitIndex = 0; digitIndex < number.length; digitIndex += 1) {
      const digitStyle = buildDigitStyle(
        stepIndex * STEP_NUMBER_DIGITS + digitIndex
      )

      digits.push(
        <span
          key={digitIndex}
          style={digitStyle as React.CSSProperties}
          className="inline-block origin-bottom staged:orbit-digit"
        >
          {number[digitIndex]}
        </span>
      )
    }

    return (
      <span
        aria-hidden="true"
        className={cn(
          "relative -top-[0.078em] block shrink-0 bg-background font-display text-[length:var(--orbit-numeral)] leading-[0.86] font-bold whitespace-nowrap text-transparent [contain:layout] staged:bg-transparent",
          "[-webkit-text-stroke:2px_color-mix(in_oklab,var(--foreground)_calc(40%_+_35%_*_var(--orbit-lit)),transparent)]",
          "forced-colors:hidden",
          "unpinned:top-0 unpinned:text-[length:clamp(1.5rem,1rem_+_1.5vw,2.25rem)] unpinned:text-muted-foreground unpinned:[-webkit-text-stroke:0]"
        )}
      >
        {digits}
      </span>
    )
  }

  function renderStep(step: SceneStep, stepIndex: number) {
    return (
      <li
        key={step.title}
        data-fit-box=""
        data-orbit-step={shapeIds[stepIndex]}
        style={buildOrbitStepStyle(stepIndex) as React.CSSProperties}
        className={cn(
          "sticky top-[calc(4.5rem_+_var(--orbit-step-top))] flex h-[var(--orbit-step-height)] w-full flex-col items-center bg-background text-center [--orbit-lit:1]",
          "pointer-events-auto not-first:mt-[calc(var(--pitch)_-_var(--orbit-step-height))]",
          "staged:pointer-events-none staged:absolute staged:inset-x-0 staged:top-[var(--orbit-step-top)] staged:mt-0 staged:orbit-step staged:bg-transparent",
          "staged:[transform-origin:50%_calc(0.43_*_var(--orbit-numeral)_+_var(--orbit-radius))]",
          "unpinned:static unpinned:mt-0 unpinned:h-auto unpinned:py-10"
        )}
      >
        {renderNumeral(stepIndex)}

        <h3
          style={buildLineStyle(0) as React.CSSProperties}
          className={cn(
            TITLE_CLASS,
            "pointer-events-auto mt-[calc(0.12_*_var(--orbit-numeral))] text-balance",
            "text-[color:color-mix(in_oklab,var(--foreground)_calc(60%_+_40%_*_var(--orbit-lit)),transparent)]",
            "short:text-[length:2rem] unpinned:mt-3",
            "staged:caption-line staged:[--caption-reveal:var(--orbit-assemble)]"
          )}
        >
          {step.title}
        </h3>

        <p
          style={buildLineStyle(1) as React.CSSProperties}
          className={cn(
            BODY_CLASS,
            "pointer-events-auto mt-4 text-balance short:mt-2 short:text-sm",
            "staged:caption-line staged:[--caption-reveal:var(--orbit-lit)]"
          )}
        >
          {step.body}
        </p>
      </li>
    )
  }

  return (
    <section
      id={id}
      data-dot-scene={sceneId}
      data-dot-shapes={shapes}
      aria-labelledby={headingId}
      style={sceneStyle as React.CSSProperties}
      className={cn(
        SCREEN_INSET_CLASS,
        "grid w-full scroll-mt-18",
        SCREEN_TIMELINE_CLASS,
        SECTION_TITLE_CLASS,
        "[--orbit-numeral:clamp(4.5rem,17.8svh,9.375rem)] split:[--orbit-numeral:clamp(6rem,45svh_-_9.5rem,20rem)]",
        "[--orbit-copy:10.625rem] split:[--orbit-copy:9.5rem] short:[--orbit-copy:6.5rem]",
        "[--orbit-step:calc(0.98_*_var(--orbit-numeral)_+_var(--orbit-copy))]",
        "[--orbit-lead:2.75rem] split:[--orbit-lead:2.5rem]",
        "[--orbit-slot-max:16.75rem] split:[--orbit-slot-max:26rem]",
        "[--orbit-slot:clamp(0px,100svh_-_4.5rem_-_var(--screen-top)_-_var(--screen-bottom)_-_var(--orbit-lead)_-_var(--orbit-step),var(--orbit-slot-max))]",
        "[--orbit-step-top:calc(var(--screen-top)_+_var(--orbit-lead)_+_var(--orbit-slot))]",
        "[--pitch:calc(100svh_-_4.5rem_-_var(--orbit-step-top)_+_0.75rem)] split:[--pitch:calc(100svh_-_4.5rem)]",
        "[--orbit-spacing:115vw] split:[--orbit-spacing:max(50vw,36rem)]",
        "[--orbit-curve:2.45] split:[--orbit-curve:4]",
        "[--orbit-radius:calc(var(--orbit-curve)_*_var(--orbit-spacing))]",
        "[--orbit-step-angle:calc(1rad_/_var(--orbit-curve))]",
        "[--orbit-ring-y:calc(var(--orbit-step-top)_+_0.43_*_var(--orbit-numeral))]",
        "[--orbit-step-height:calc(100svh_-_4.5rem_-_var(--orbit-step-top))]",
        "[--orbit-spin:calc(var(--orbit-spin-ratio)_*_(var(--steps)_-_1)_*_var(--orbit-spacing))]",
        "h-[calc(100svh_-_4.5rem_+_(var(--steps)_-_1)_*_var(--pitch))] unpinned:h-auto"
      )}
    >
      <div
        className={cn(
          "sticky top-18 h-[calc(100svh_-_4.5rem)] self-start [grid-area:1/1]",
          "unpinned:static unpinned:h-auto"
        )}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-[calc(var(--orbit-ring-y)_-_6px)] hidden h-[calc(100%_-_var(--orbit-ring-y)_+_6px)] w-full text-foreground/40",
            "forced-colors:hidden! staged:block"
          )}
        >
          <circle className={ORBIT_CIRCLE_CLASS} />
        </svg>

        <div
          className={cn(
            "mx-auto flex h-full w-full max-w-[105rem] flex-col px-6 pt-[var(--screen-top)] md:px-10",
            "unpinned:h-auto"
          )}
        >
          <h2
            id={headingId}
            className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_BOX_CLASS)}
          >
            <span
              style={buildLineStyle(0) as React.CSSProperties}
              className={SWEPT_LABEL_CLASS}
            >
              {heading}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "hidden staged:inline-grid",
                SECTION_TITLE_COUNT_CLASS
              )}
            >
              {shapeIds.map(renderPosition)}
            </span>
          </h2>

          <div
            data-dot-slot=""
            aria-hidden="true"
            className={cn(
              "mx-auto mt-[calc(var(--orbit-lead)_-_1.5rem)] h-[calc(var(--orbit-slot)_-_max(0px,0.078_*_var(--orbit-numeral)_-_0.5rem))] w-[min(100%,2_*_var(--orbit-slot))] shrink-0 touch-pan-y touch-pinch-zoom",
              "unpinned:hidden"
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none [grid-area:1/1]",
          "staged:sticky staged:top-18 staged:h-[calc(100svh_-_4.5rem)] staged:self-start staged:overflow-clip",
          "unpinned:[grid-area:auto]"
        )}
      >
        <div className="mx-auto grid h-full w-full max-w-[105rem] px-6 md:px-10 unpinned:block">
          <ol className="relative pt-[var(--orbit-step-top)] unpinned:static unpinned:pt-0 staged:pt-0">
            {steps.map(renderStep)}
          </ol>
        </div>
      </div>

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
