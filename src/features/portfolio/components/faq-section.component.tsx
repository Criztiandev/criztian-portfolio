import { Plus } from "lucide-react"

import {
  DUST_SECTION_SPACING_CLASS,
  FAQ_SECTION,
  FOCUS_RING_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_HEADLINE_CLASS,
} from "@/data/page-sections.data"
import { cn } from "@/lib/utils"

export function FaqSection() {
  return (
    <section
      id={FAQ_SECTION.id}
      aria-labelledby={FAQ_SECTION.headingId}
      className={cn(
        SECTION_FRAME_CLASS,
        DUST_SECTION_SPACING_CLASS,
        "grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16"
      )}
    >
      <h2 id={FAQ_SECTION.headingId} className={SECTION_HEADLINE_CLASS}>
        {FAQ_SECTION.heading}
      </h2>

      <div>
        {FAQ_SECTION.items.map(function renderItem(item) {
          return (
            <details
              key={item.question}
              className="group/faq border-t border-border last:border-b"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start justify-between gap-6",
                  "py-5 text-left [&::-webkit-details-marker]:hidden",
                  FOCUS_RING_CLASS
                )}
              >
                <span className="text-base font-medium text-foreground md:text-lg">
                  {item.question}
                </span>

                <Plus
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 size-5 shrink-0 text-muted-foreground md:mt-1",
                    "group-open/faq:rotate-45"
                  )}
                />
              </summary>

              <p className="max-w-[60ch] pr-10 pb-6 text-foreground/75">
                {item.answer}
              </p>
            </details>
          )
        })}
      </div>
    </section>
  )
}
