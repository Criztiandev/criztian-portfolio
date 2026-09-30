import { Plus } from "lucide-react"

import {
  BODY_CLASS,
  COPY_DRIFT_CLASS,
  FAQ_DISCLOSURE_CLASS,
  FAQ_PLUS_TURN_CLASS,
  FAQ_SECTION,
  FOCUS_RING_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_HEIGHT_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SCREEN_TIMELINE_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
  SWEPT_LABEL_CLASS,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import {
  buildCopyDriftStyle,
  buildLineStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"

export function FaqSection() {
  return (
    <section
      id={FAQ_SECTION.id}
      aria-labelledby={FAQ_SECTION.headingId}
      style={buildCopyDriftStyle() as React.CSSProperties}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_CLASS,
        SCREEN_HEIGHT_CLASS,
        SCREEN_TIMELINE_CLASS,
        "text-foreground"
      )}
    >
      <h2
        id={FAQ_SECTION.headingId}
        className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
      >
        <span
          style={buildLineStyle(0) as React.CSSProperties}
          className={SWEPT_LABEL_CLASS}
        >
          {FAQ_SECTION.heading}
        </span>
      </h2>

      <div
        className={cn(SCREEN_COPY_CLASS, "mt-2 split:mt-0", COPY_DRIFT_CLASS)}
      >
        <p
          aria-hidden="true"
          style={buildLineStyle(1) as React.CSSProperties}
          className={cn(
            STATEMENT_CLASS,
            STATEMENT_SIZE_CLASSES.faq,
            SWEPT_LINE_CLASS
          )}
        >
          {FAQ_SECTION.heading}
        </p>
      </div>

      <div
        className={cn(
          SCREEN_OBJECT_CLASS,
          "mt-4 w-full split:mt-0 split:justify-self-stretch"
        )}
      >
        {FAQ_SECTION.items.map(function renderItem(item, itemIndex) {
          return (
            <details
              key={item.question}
              style={buildLineStyle(itemIndex + 2) as React.CSSProperties}
              className={cn(
                "group/faq border-t border-rule last:border-b",
                FAQ_DISCLOSURE_CLASS,
                SWEPT_LINE_CLASS
              )}
            >
              <summary
                className={cn(
                  "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3",
                  "py-1 text-left [&::-webkit-details-marker]:hidden",
                  "md:min-h-14 md:gap-6",
                  FOCUS_RING_CLASS
                )}
              >
                <span className="text-[0.9375rem] leading-5 font-medium text-foreground md:text-[1.0625rem] md:leading-[1.375rem]">
                  {item.question}
                </span>

                <Plus
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 shrink-0 text-foreground/75",
                    "group-open/faq:rotate-45",
                    FAQ_PLUS_TURN_CLASS
                  )}
                />
              </summary>

              <p className={cn(BODY_CLASS, "pr-6.5 pb-3.5 md:pr-0 md:pb-5")}>
                {item.answer}
              </p>
            </details>
          )
        })}
      </div>
    </section>
  )
}
