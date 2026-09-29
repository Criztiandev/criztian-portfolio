import { Plus } from "lucide-react"

import {
  BODY_CLASS,
  FAQ_SECTION,
  FOCUS_RING_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
} from "@/data/page-sections.data"
import { cn } from "@/lib/utils"

export function FaqSection() {
  return (
    <section
      id={FAQ_SECTION.id}
      aria-labelledby={FAQ_SECTION.headingId}
      className={cn(
        SECTION_FRAME_CLASS,
        SCREEN_CLASS,
        "text-foreground split:min-h-[calc(100svh_-_4.5rem)]"
      )}
    >
      <h2
        id={FAQ_SECTION.headingId}
        className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
      >
        {FAQ_SECTION.heading}
      </h2>

      <div className={cn(SCREEN_COPY_CLASS, "mt-2 split:mt-0")}>
        <p
          aria-hidden="true"
          className={cn(STATEMENT_CLASS, STATEMENT_SIZE_CLASSES.faq)}
        >
          {FAQ_SECTION.heading}
        </p>
      </div>

      <div
        className={cn(
          SCREEN_OBJECT_CLASS,
          "mt-4 w-full border-b border-rule split:mt-0 split:justify-self-stretch"
        )}
      >
        {FAQ_SECTION.items.map(function renderItem(item) {
          return (
            <details
              key={item.question}
              className="group/faq border-t border-rule"
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
                    "group-open/faq:rotate-45"
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
