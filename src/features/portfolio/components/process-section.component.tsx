import type { ReactNode } from "react"

import { ORBIT_RING_PATH_LENGTH } from "@/data/motion.data"
import {
  ORBIT_CIRCLE_CLASS,
  PROCESS_SCENE,
  SECTION_BODY_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_TITLE_CLASS,
  STEP_NUMBER_DIGITS,
} from "@/data/page-sections.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import {
  buildAssembleStyle,
  buildDigitStyle,
  buildOrbitStyle,
  buildStepSceneStyle,
  buildTravelStyle,
  resolveAssembleHandover,
  resolveSceneHandovers,
  resolveSceneShare,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { SceneStep, StepMotionStyle } from "@/types/page-sections.type"

export function ProcessSection() {
  const { id, headingId, heading, sceneId, shapes, steps } = PROCESS_SCENE
  const shapeIds = shapes.split(" ")
  const handovers = resolveSceneHandovers(
    steps.length,
    resolveSceneShare(sceneId)
  )
  const sceneStyle = {
    ...buildStepSceneStyle(steps.length),
    ...buildOrbitStyle(),
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
          "pointer-events-auto relative -top-[0.078em] block shrink-0 font-display text-[length:var(--orbit-numeral)] leading-[0.86] font-bold whitespace-nowrap text-background [contain:layout]",
          "[-webkit-text-stroke:2px_color-mix(in_oklab,var(--foreground)_75%,transparent)]",
          "forced-colors:hidden",
          "unpinned:top-0 unpinned:text-[length:clamp(1.5rem,1rem_+_1.5vw,2.25rem)] unpinned:text-muted-foreground unpinned:[-webkit-text-stroke:0]"
        )}
      >
        {digits}
      </span>
    )
  }

  function renderStep(step: SceneStep, stepIndex: number) {
    const assemble = resolveAssembleHandover(stepIndex, handovers)

    if (assemble === undefined) {
      return null
    }

    const stepStyle: StepMotionStyle = {
      "--orbit-index": stepIndex,
      ...buildAssembleStyle(assemble),
    }

    return (
      <li
        key={step.title}
        data-fit-box=""
        data-orbit-step={shapeIds[stepIndex]}
        style={stepStyle as React.CSSProperties}
        className={cn(
          "sticky top-[calc(4.5rem_+_var(--orbit-step-top))] mx-auto flex h-[var(--orbit-step-height)] w-[min(100%_-_3rem,34rem)] flex-col items-center bg-background text-center",
          "pointer-events-auto not-first:mt-[calc(var(--pitch)_-_var(--orbit-step-height))]",
          "staged:pointer-events-none staged:absolute staged:inset-x-0 staged:top-[var(--orbit-step-top)] staged:mt-0 staged:bg-transparent",
          "staged:[rotate:calc(var(--orbit-index)_*_var(--orbit-step-angle))]",
          "staged:[transform-origin:50%_calc(0.43_*_var(--orbit-numeral)_+_var(--orbit-radius))]",
          "unpinned:static unpinned:mt-0 unpinned:h-auto unpinned:py-10"
        )}
      >
        {renderNumeral(stepIndex)}

        <h3
          className={cn(
            SECTION_TITLE_CLASS,
            "pointer-events-auto mt-3 inline-flex items-center gap-3 bg-foreground px-5 py-3 text-balance text-background",
            "forced-colors:border short:mt-2 staged:orbit-reveal"
          )}
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-background"
          />
          {step.title}
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-background"
          />
        </h3>

        <p
          className={cn(
            SECTION_BODY_CLASS,
            "pointer-events-auto mt-3 max-w-[30ch] text-balance split:text-[clamp(1rem,0.75rem_+_0.6vw,1.25rem)]",
            "short:mt-2 short:text-sm staged:orbit-reveal"
          )}
        >
          {step.body}
        </p>
      </li>
    )
  }

  let route: ReactNode = <ol>{steps.map(renderStep)}</ol>

  for (let stepIndex = steps.length - 1; stepIndex >= 1; stepIndex -= 1) {
    const handover = handovers[stepIndex]

    if (handover === undefined) {
      continue
    }

    route = (
      <div
        style={buildTravelStyle(handover) as React.CSSProperties}
        className={cn(
          "staged:absolute staged:inset-0 staged:orbit-turn",
          "staged:[transform-origin:50%_calc(var(--orbit-ring-y)_+_var(--orbit-radius))]"
        )}
      >
        {route}
      </div>
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
        "grid w-full scroll-mt-18",
        "[view-timeline-inset:4.5rem_0] [view-timeline-name:--step-scene]",
        "[--band:calc(3.5rem_+_26svh)]",
        "[@media(38rem<height<=44rem)]:[--band:calc(3.5rem_+_20svh)]",
        "short:[--band:calc(3.5rem_+_17svh)]",
        "[--pitch:calc(100svh_-_4.5rem_-_var(--band))] split:[--pitch:calc(100svh_-_4.5rem)]",
        "[--orbit-numeral:clamp(4.5rem,14svh,7.5rem)] split:[--orbit-numeral:clamp(6rem,min(50svh_-_8rem,22vw),22rem)]",
        "[--orbit-radius-vw:260] split:[--orbit-radius-vw:210]",
        "[--orbit-spacing-vw:115] split:[--orbit-spacing-vw:52]",
        "[--orbit-period:8] split:[--orbit-period:2.5]",
        "split:[--orbit-slot:min(var(--orbit-numeral),22vw)]",
        "[--orbit-step-top:calc(var(--band)_+_0.75rem)]",
        "split:[--orbit-step-top:max(max(2rem,10svh)_+_1.05_*_clamp(1.75rem,1rem_+_3vw,3.5rem)_+_1rem,1rem_+_var(--orbit-slot)_+_4px)]",
        "[--orbit-radius:calc(var(--orbit-radius-vw)_*_1vw)]",
        "[--orbit-step-angle:calc(var(--orbit-spacing-vw)_/_var(--orbit-radius-vw)_*_1rad)]",
        "[--orbit-ring-y:calc(var(--orbit-step-top)_+_0.43_*_var(--orbit-numeral))]",
        "[--orbit-step-height:calc(100svh_-_4.5rem_-_var(--orbit-step-top))]",
        "[--orbit-spin:calc(var(--orbit-spin-ratio)_*_(var(--steps)_-_1)_*_var(--orbit-spacing-vw)_/_var(--orbit-radius-vw)_*_var(--orbit-units-per-radian))]",
        "h-[calc(100svh_-_4.5rem_+_(var(--steps)_-_1)_*_var(--pitch))] unpinned:h-auto"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col self-start [grid-area:1/1]",
          "unpinned:static unpinned:h-auto"
        )}
      >
        <div
          data-fit-box=""
          className="h-14 shrink-0 split:h-[var(--orbit-step-top)] unpinned:h-auto"
        >
          <h2
            id={headingId}
            className={cn(
              SECTION_HEADLINE_CLASS,
              "mx-auto flex min-h-14 w-full max-w-[80rem] items-center px-6 md:px-10",
              "split:block split:pt-[max(2rem,10svh)]"
            )}
          >
            {heading}
          </h2>
        </div>

        <svg
          aria-hidden="true"
          focusable="false"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-[calc(var(--orbit-ring-y)_-_6px)] hidden w-full overflow-hidden text-foreground/40",
            "h-[calc(4.9vw_+_1rem)] split:h-[calc(6.1vw_+_1rem)]",
            "forced-colors:hidden! staged:block"
          )}
        >
          <circle
            pathLength={ORBIT_RING_PATH_LENGTH}
            className={cn(
              ORBIT_CIRCLE_CLASS,
              "[stroke-width:1px] [--orbit-dash-from:0]",
              "[stroke-dasharray:calc(var(--orbit-period)_*_0.3)_calc(var(--orbit-period)_*_0.7)]"
            )}
          />
          <circle
            pathLength={ORBIT_RING_PATH_LENGTH}
            className={cn(
              ORBIT_CIRCLE_CLASS,
              "[stroke-width:8px] [--orbit-dash-from:calc(var(--orbit-period)_*_-0.56)] split:[stroke-width:10px]",
              "[stroke-dasharray:calc(var(--orbit-period)_*_0.12)_calc(var(--orbit-period)_*_0.88)]"
            )}
          />
        </svg>

        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "order-first h-[calc(var(--band)_-_3.5rem)] w-full shrink-0",
            "touch-pan-y touch-pinch-zoom",
            "split:absolute split:top-[calc(var(--orbit-step-top)_-_4px_-_var(--orbit-slot))]",
            "split:left-[calc(50%_+_0.5_*_var(--orbit-numeral)_+_1.5rem)]",
            "split:order-none split:size-[var(--orbit-slot)]",
            "unpinned:hidden"
          )}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none pt-[var(--orbit-step-top)] [grid-area:1/1]",
          "staged:sticky staged:top-18 staged:h-[calc(100svh_-_4.5rem)] staged:self-start staged:overflow-clip staged:pt-0",
          "unpinned:pt-0 unpinned:[grid-area:auto]"
        )}
      >
        {route}
      </div>

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
