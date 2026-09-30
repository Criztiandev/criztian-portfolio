import {
  BODY_CLASS,
  ITEM_CLASS,
  SCREEN_INSET_CLASS,
  SCREEN_LABEL_BOX_CLASS,
  SCREEN_LABEL_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SERVICES_SCENE,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  STEP_NUMBER_DIGITS,
  SWEPT_LABEL_CLASS,
} from "@/data/page-sections.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import { formatSectionPosition } from "@/features/portfolio/section-label.rules"
import {
  buildLineStyle,
  buildStepSceneStyle,
  buildThreadCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { ServiceStep } from "@/types/page-sections.type"

export function ServicesSection() {
  const { id, headingId, heading, sceneId, shapes, steps } = SERVICES_SCENE
  const shapeIds = shapes.split(" ")
  const sceneStyle = {
    ...buildStepSceneStyle(steps.length),
    ...buildThreadCaptionStyle(),
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

  function renderItem(item: string, itemIndex: number) {
    const number = String(itemIndex + 1).padStart(STEP_NUMBER_DIGITS, "0")

    return (
      <li
        key={item}
        className={cn(
          "flex gap-4 border-b border-rule py-2.5 short:py-1 [@media(38rem<height<=44rem)]:py-1.5",
          "split:py-3 [@media(38rem<height<=44rem)]:split:py-3"
        )}
      >
        <span aria-hidden="true" className="text-muted-foreground tabular-nums">
          {number}
        </span>
        {item}
      </li>
    )
  }

  function renderCaption(step: ServiceStep, stepIndex: number) {
    return (
      <li
        key={step.title}
        data-fit-box=""
        data-caption={shapeIds[stepIndex]}
        className={cn(
          "sticky top-[calc(4.5rem_+_var(--caption-top))] flex h-[var(--caption)] flex-col bg-background pb-[var(--screen-bottom)]",
          "not-first:mt-[calc(var(--pitch)_-_var(--caption))]",
          "staged:static staged:mt-0 staged:h-auto staged:bg-transparent staged:pb-0 staged:[grid-area:1/1]",
          "unpinned:static unpinned:mt-0 unpinned:h-auto unpinned:py-10"
        )}
      >
        <div className="@container w-full split:my-auto">
          <h3
            data-caption-line=""
            style={buildLineStyle(0) as React.CSSProperties}
            className={cn(
              STATEMENT_CLASS,
              STATEMENT_SIZE_CLASSES[step.size],
              "staged:caption-line"
            )}
          >
            {step.title}
          </h3>

          <p
            data-caption-line=""
            style={buildLineStyle(1) as React.CSSProperties}
            className={cn(
              BODY_CLASS,
              "mt-3 split:mt-[min(2rem,3.5svh)] short:mt-2 staged:caption-line"
            )}
          >
            {step.body}
          </p>

          <ol
            data-caption-line=""
            style={buildLineStyle(2) as React.CSSProperties}
            className={cn(
              ITEM_CLASS,
              "mt-5 grid split:mt-[min(2.5rem,4svh)] short:mt-3",
              "@min-[30rem]:grid-flow-col @min-[30rem]:grid-cols-2 @min-[30rem]:grid-rows-3 @min-[30rem]:gap-x-8",
              "staged:caption-line"
            )}
          >
            {step.items.map(renderItem)}
          </ol>
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
        SECTION_FRAME_CLASS,
        SCREEN_INSET_CLASS,
        "grid text-foreground split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:gap-x-10 unpinned:block",
        "[--pitch:calc((100svh_-_4.5rem)_*_1.2)]",
        "[--caption-stacked:25.5rem] short:[--caption-stacked:18.25rem] [@media(38rem<height<=44rem)]:[--caption-stacked:21.75rem]",
        "[--caption-top:calc(100svh_-_4.5rem_-_var(--caption))] [--caption:var(--caption-stacked)]",
        "split:[--caption-top:calc(var(--screen-top)_+_2rem)]",
        "split:[--caption:calc(100svh_-_4.5rem_-_var(--caption-top))]",
        "h-[calc(100svh_-_4.5rem_+_(var(--steps)_-_1)_*_var(--pitch))] unpinned:h-auto"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col self-start pt-[var(--screen-top)] pb-[var(--screen-bottom)] [grid-area:1/1/2/-1]",
          "split:grid split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:grid-rows-[auto_1fr] split:gap-x-10 split:gap-y-4",
          "unpinned:static unpinned:h-auto unpinned:pb-0"
        )}
      >
        <h2
          id={headingId}
          className={cn(
            SECTION_LABEL_CLASS,
            SCREEN_LABEL_CLASS,
            SCREEN_LABEL_BOX_CLASS
          )}
        >
          <span
            style={buildLineStyle(0) as React.CSSProperties}
            className={SWEPT_LABEL_CLASS}
          >
            {heading}
          </span>
          <span aria-hidden="true" className="hidden staged:inline-grid">
            {shapeIds.map(renderPosition)}
          </span>
        </h2>

        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "mx-auto min-h-0 w-full max-w-[17.5rem] flex-1 touch-pan-y touch-pinch-zoom",
            "split:col-start-2 split:row-span-2 split:row-start-1 split:aspect-[5/4] split:max-h-full split:max-w-none split:flex-none split:self-center",
            "unpinned:hidden"
          )}
        />

        <div className="h-[calc(var(--caption)_-_var(--screen-bottom))] shrink-0 split:hidden unpinned:hidden" />
      </div>

      <ul
        data-fit-box=""
        className={cn(
          "pt-[var(--caption-top)] [grid-area:1/1]",
          "staged:sticky staged:top-[calc(4.5rem_+_var(--caption-top))] staged:mt-[var(--caption-top)] staged:pb-[var(--screen-bottom)]",
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
