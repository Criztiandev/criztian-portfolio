import {
  BLOG_SECTION,
  CUE_CLASS,
  DUST_SECTION_SPACING_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_HEADLINE_CLASS,
} from "@/data/page-sections.data"
import { cn } from "@/lib/utils"

export function BlogSection() {
  return (
    <section
      id={BLOG_SECTION.id}
      aria-labelledby={BLOG_SECTION.headingId}
      className={cn(SECTION_FRAME_CLASS, DUST_SECTION_SPACING_CLASS)}
    >
      <h2
        id={BLOG_SECTION.headingId}
        className={cn(SECTION_HEADLINE_CLASS, "max-w-[20ch]")}
      >
        {BLOG_SECTION.heading}
      </h2>

      <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
        {BLOG_SECTION.placeholders.map(
          function renderPlaceholder(placeholder, index) {
            return (
              <li
                key={index}
                className="relative aspect-[4/3] border border-border"
              >
                <span className={cn("absolute top-4 left-4", CUE_CLASS)}>
                  {placeholder}
                </span>
              </li>
            )
          }
        )}
      </ul>
    </section>
  )
}
