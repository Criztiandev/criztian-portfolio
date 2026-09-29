import {
  SECTION_BODY_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_LEDE_CLASS,
  SERVICES_SCENE,
} from "@/data/page-sections.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import {
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { SceneStep, StepMotionStyle } from "@/types/page-sections.type"

export function ServicesSection() {
  const { id, headingId, heading, sceneId, shapes, steps } = SERVICES_SCENE
  const shapeIds = shapes.split(" ")
  const sceneStyle = {
    ...buildStepSceneStyle(steps.length),
    ...buildThreadCaptionStyle(),
  }

  function buildLineStyle(line: number): React.CSSProperties {
    const style: StepMotionStyle = { "--line": line }

    return style as React.CSSProperties
  }

  function renderItem(item: string) {
    return <li key={item}>{item}</li>
  }

  function renderCaption(step: SceneStep, stepIndex: number) {
    return (
      <li
        key={step.title}
        data-fit-box=""
        data-caption={shapeIds[stepIndex]}
        className={cn(
          "sticky top-[calc(100svh_-_var(--caption))] h-[var(--caption)] bg-background",
          "not-last:mb-[calc(var(--pitch)_-_var(--caption))]",
          "staged:static staged:mb-0 staged:h-auto staged:bg-transparent staged:[grid-area:1/1]",
          "unpinned:static unpinned:mb-0 unpinned:h-auto unpinned:py-10"
        )}
      >
        <div className="flex flex-col items-center pt-2 text-center">
          <h3
            data-caption-line=""
            style={buildLineStyle(0)}
            className={cn(SECTION_HEADLINE_CLASS, "staged:caption-line")}
          >
            {step.title}
          </h3>

          <p
            data-caption-line=""
            style={buildLineStyle(1)}
            className={cn(
              SECTION_BODY_CLASS,
              "mt-3 max-w-[52ch] text-sm split:text-base staged:caption-line"
            )}
          >
            {step.body}
          </p>

          <ul
            data-caption-line=""
            style={buildLineStyle(2)}
            className={cn(
              SECTION_LABEL_CLASS,
              "mt-4 flex max-w-[60ch] flex-wrap justify-center gap-x-5 gap-y-1",
              "text-muted-foreground short:mt-3 staged:caption-line"
            )}
          >
            {step.items.map(renderItem)}
          </ul>
        </div>
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
        "mx-auto grid max-w-[80rem] scroll-mt-18 px-6 md:px-10",
        "[--pitch:calc((100svh_-_4.5rem)_*_1.2)]",
        "[--caption:18rem] split:[--caption:15rem] short:[--caption:17.75rem]",
        "h-[calc(100svh_-_4.5rem_+_(var(--steps)_-_1)_*_var(--pitch))] unpinned:h-auto"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col items-center self-start",
          "[grid-area:1/1] unpinned:static unpinned:h-auto"
        )}
      >
        <h2
          id={headingId}
          className={cn(
            SECTION_LEDE_CLASS,
            "shrink-0 scroll-mt-18 pt-[max(1.5rem,4svh)] text-foreground/75",
            "unpinned:self-start unpinned:pt-0"
          )}
        >
          {heading}
        </h2>

        <div
          data-dot-slot=""
          aria-hidden="true"
          className="min-h-0 w-full flex-1 touch-pan-y touch-pinch-zoom unpinned:hidden"
        />

        <div className="h-[var(--caption)] shrink-0 unpinned:hidden" />
      </div>

      <ul
        data-fit-box=""
        className={cn(
          "pt-[calc(100svh_-_4.5rem_-_var(--caption))] [grid-area:1/1]",
          "staged:sticky staged:top-[calc(100svh_-_var(--caption))] staged:mt-[calc(100svh_-_4.5rem_-_var(--caption))]",
          "staged:grid staged:h-[var(--caption)] staged:self-start staged:pt-0",
          "unpinned:pt-0 unpinned:[grid-area:auto]"
        )}
      >
        {steps.map(renderCaption)}
      </ul>

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
