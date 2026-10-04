import {
  BODY_CLASS,
  COPY_DRIFT_CLASS,
  FAQ_DISCLOSURE_CLASS,
  FAQ_PLUS_PATH,
  FAQ_PLUS_TURN_CLASS,
  FAQ_SECTION,
  FAQ_SLOT_HEIGHT_CLASS,
  FOCUS_RING_CLASS,
  FAQ_HOLD_CLASS,
  SCREEN_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_TITLE_CLASS,
  SWEPT_LABEL_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import {
  formatFaqNumber,
  selectVisibleFaqItems,
} from "@/features/portfolio/faq.rules"
import {
  buildCopyDriftStyle,
  buildLineStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { FaqSectionProps } from "@/types/page-sections.type"
import type { FaqItem } from "@/types/site-content.type"

export function FaqSection({ faq }: Readonly<FaqSectionProps>) {
  const { id, headingId, heading, sceneId, shapes } = FAQ_SECTION
  const visibleItems = selectVisibleFaqItems(faq.items)
  const sceneStyle = {
    ...buildSceneCaptionStyle(visibleItems.length),
    ...buildCopyDriftStyle(),
  }

  function renderItem(item: FaqItem, itemIndex: number) {
    return (
      <li
        key={itemIndex}
        style={buildLineStyle(itemIndex + 1) as React.CSSProperties}
        className={cn("border-t border-rule last:border-b", SWEPT_LINE_CLASS)}
      >
        <details className={cn("group/faq", FAQ_DISCLOSURE_CLASS)}>
          <summary
            className={cn(
              "flex min-h-12 cursor-pointer list-none items-center gap-3.5 py-3 text-left",
              "md:min-h-14 md:gap-5 md:py-3.5 [&::-webkit-details-marker]:hidden",
              FOCUS_RING_CLASS
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "w-6.5 shrink-0 font-display text-base/none font-bold tracking-[0.04em]",
                "text-muted-foreground tabular-nums md:w-9 md:text-xl/none"
              )}
            >
              {formatFaqNumber(itemIndex)}
            </span>

            <span
              className={cn(
                "flex-1 font-display text-xl/[1.05] font-bold tracking-[0.02em]",
                "text-foreground/75 uppercase group-open/faq:text-foreground",
                "md:text-[1.625rem]/[1.05]"
              )}
            >
              {item.question}
            </span>

            <svg
              aria-hidden="true"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className={cn(
                "size-3.5 shrink-0 text-foreground/75 forced-colors:text-[CanvasText]",
                "group-open/faq:rotate-45",
                FAQ_PLUS_TURN_CLASS
              )}
            >
              <path d={FAQ_PLUS_PATH} />
            </svg>
          </summary>

          <p
            hidden={item.answer === ""}
            className={cn(
              BODY_CLASS,
              "max-w-[calc(40ch_+_2.5rem)] pb-4 pl-10",
              "md:max-w-[calc(40ch_+_3.5rem)] md:pb-5 md:pl-14"
            )}
          >
            {item.answer}
          </p>
        </details>
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
        SCREEN_TIMELINE_CLASS,
        SECTION_TITLE_CLASS,
        "grid text-foreground"
      )}
    >
      <div
        className={cn(
          SCREEN_CLASS,
          "sticky top-18 h-[calc(100svh_-_4.5rem)] self-start [grid-area:1/1]",
          "group-data-[status=unsupported]/stage:hidden"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "mt-8 w-full shrink-0 touch-pan-y touch-pinch-zoom",
            FAQ_SLOT_HEIGHT_CLASS,
            "split:col-start-2 split:row-span-2 split:row-start-1 split:mt-0 split:aspect-square split:h-auto",
            "split:w-[min(30rem,100%,calc(100svh_-_4.5rem_-_min(3.5rem,6svh)_-_min(4rem,7svh)))]",
            "split:self-center split:justify-self-center"
          )}
        />
      </div>

      <div
        className={cn(
          SCREEN_CLASS,
          "pointer-events-none relative [grid-area:1/1]",
          FAQ_HOLD_CLASS
        )}
      >
        <h2
          id={headingId}
          className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
        >
          <span
            style={buildLineStyle(0) as React.CSSProperties}
            className={SWEPT_LABEL_CLASS}
          >
            {heading}
          </span>
        </h2>

        <div
          className={cn(
            "mt-4 mb-6 shrink-0 split:hidden",
            FAQ_SLOT_HEIGHT_CLASS,
            "group-data-[status=unsupported]/stage:h-0 [@media(scripting:none)]:h-0"
          )}
        />

        <div
          className={cn(
            COPY_DRIFT_CLASS,
            "pointer-events-auto bg-background",
            "split:col-start-1 split:row-start-2 split:mt-6 split:self-start split:bg-transparent"
          )}
        >
          {visibleItems.length > 0 ? (
            <ol>{visibleItems.map(renderItem)}</ol>
          ) : null}
        </div>
      </div>
    </section>
  )
}
