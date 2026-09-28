import {
  DUST_SECTION_SPACING_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_LEDE_CLASS,
  TESTIMONIALS_SECTION,
} from "@/data/page-sections.data"
import { cn } from "@/lib/utils"

export function TestimonialsSection() {
  return (
    <section
      id={TESTIMONIALS_SECTION.id}
      aria-labelledby={TESTIMONIALS_SECTION.headingId}
      className={cn(SECTION_FRAME_CLASS, DUST_SECTION_SPACING_CLASS)}
    >
      <h2
        id={TESTIMONIALS_SECTION.headingId}
        className={cn(SECTION_HEADLINE_CLASS, "max-w-[20ch]")}
      >
        {TESTIMONIALS_SECTION.heading}
      </h2>

      <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
        {TESTIMONIALS_SECTION.placeholders.map(
          function renderPlaceholder(placeholder, index) {
            return (
              <li
                key={index}
                className="flex min-h-40 items-end border-t border-border pt-6"
              >
                <p className={cn(SECTION_LEDE_CLASS, "text-muted-foreground")}>
                  {placeholder}
                </p>
              </li>
            )
          }
        )}
      </ul>
    </section>
  )
}
