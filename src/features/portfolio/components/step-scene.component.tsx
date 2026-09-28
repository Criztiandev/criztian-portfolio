import {
  SECTION_BODY_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_TITLE_CLASS,
  STEP_NUMBER_DIGITS,
} from "@/data/page-sections.data"
import { SceneFitGate } from "@/features/portfolio/components/scene-fit-gate.component"
import { cn } from "@/lib/utils"
import type { SceneStep, StepSceneContent } from "@/types/page-sections.type"

export function StepScene({
  id,
  headingId,
  heading,
  sceneId,
  shapes,
  isNumbered,
  steps,
}: Readonly<StepSceneContent>) {
  const StepList = isNumbered ? "ol" : "ul"
  const bodyClass = cn(
    SECTION_BODY_CLASS,
    "mt-2 max-w-[60ch] short:text-sm [@media(min-height:44rem)]:mt-4"
  )

  function renderServiceStep(step: SceneStep) {
    return (
      <>
        <h3 className={cn(SECTION_TITLE_CLASS, "text-foreground")}>
          {step.title}
        </h3>

        <p className={bodyClass}>{step.body}</p>

        <ul className="mt-4 grid grid-cols-2 gap-x-6 short:mt-3">
          {step.items.map(function renderItem(item) {
            return (
              <li
                key={item}
                className={cn(
                  SECTION_LABEL_CLASS,
                  "border-t border-border py-2 text-foreground/75 short:py-1"
                )}
              >
                {item}
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  function renderNumberedStep(step: SceneStep, index: number) {
    const number = String(index + 1).padStart(STEP_NUMBER_DIGITS, "0")

    return (
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6">
        <span
          aria-hidden="true"
          className={cn(
            SECTION_TITLE_CLASS,
            "min-w-[1em] text-muted-foreground tabular-nums"
          )}
        >
          {number}
        </span>

        <div>
          <h3 className={cn(SECTION_TITLE_CLASS, "text-foreground")}>
            {step.title}
          </h3>

          <p className={bodyClass}>{step.body}</p>
        </div>
      </div>
    )
  }

  function renderStep(step: SceneStep, index: number) {
    return (
      <li
        key={step.title}
        data-fit-box=""
        className={cn(
          "sticky top-[calc(4.5rem_+_var(--band))] h-[calc(100svh_-_4.5rem_-_var(--band))]",
          "bg-background pt-4",
          "split:static split:flex split:h-auto split:min-h-[calc(100svh_-_4.5rem)]",
          "split:flex-col split:justify-center split:bg-transparent split:py-0",
          "unpinned:static unpinned:h-auto unpinned:min-h-0 unpinned:py-10"
        )}
      >
        {isNumbered ? renderNumberedStep(step, index) : renderServiceStep(step)}
      </li>
    )
  }

  return (
    <section
      id={id}
      data-dot-scene={sceneId}
      data-dot-shapes={shapes}
      aria-labelledby={headingId}
      className={cn(
        "mx-auto grid max-w-[80rem] scroll-mt-18 px-6 md:px-10",
        "[--band:calc(3.5rem_+_26svh)]",
        "[@media(38rem<height<=44rem)]:[--band:calc(3.5rem_+_20svh)]",
        "short:[--band:calc(3.5rem_+_17svh)]",
        "split:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] split:gap-x-16"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col self-start",
          "[grid-area:1/1] split:col-start-1 split:row-start-1",
          "unpinned:static unpinned:h-auto"
        )}
      >
        <h2
          id={headingId}
          className={cn(
            SECTION_HEADLINE_CLASS,
            "flex h-14 shrink-0 items-center",
            "split:block split:h-auto split:pt-[max(2rem,10svh)]",
            "unpinned:h-auto unpinned:min-h-14"
          )}
        >
          {heading}
        </h2>

        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "order-first h-[calc(var(--band)_-_3.5rem)] w-full shrink-0",
            "touch-pan-y touch-pinch-zoom",
            "split:order-none split:my-auto split:aspect-square split:h-auto",
            "split:max-w-[min(100%,34rem,56svh,calc(100svh_-_8rem_-_max(2rem,10svh)))]",
            "split:self-center",
            "unpinned:hidden"
          )}
        />
      </div>

      <StepList
        className={cn(
          "pt-[var(--band)] [grid-area:1/1]",
          "split:col-start-2 split:row-start-1 split:pt-0",
          "unpinned:pt-0 unpinned:[grid-area:auto]"
        )}
      >
        {steps.map(renderStep)}
      </StepList>

      <SceneFitGate shapes={shapes} />
    </section>
  )
}
