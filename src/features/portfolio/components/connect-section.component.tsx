import { ArrowUpRight } from "lucide-react"

import {
  CONNECT_SECTION,
  FOCUS_RING_CLASS,
  OWNER_EMAIL_ADDRESS,
  OWNER_EMAIL_HREF,
  SECTION_FRAME_CLASS,
  SECTION_HEADLINE_CLASS,
  SECTION_LABEL_CLASS,
} from "@/data/page-sections.data"
import { PROJECTS_CUE_CLASS } from "@/data/portfolio.data"
import { cn } from "@/lib/utils"

export function ConnectSection() {
  return (
    <section
      id={CONNECT_SECTION.id}
      aria-labelledby={CONNECT_SECTION.headingId}
      className={cn(
        SECTION_FRAME_CLASS,
        "flex min-h-[70svh] flex-col items-center justify-center",
        "py-[max(4rem,10svh)] text-center"
      )}
    >
      <h2 id={CONNECT_SECTION.headingId} className={SECTION_HEADLINE_CLASS}>
        {CONNECT_SECTION.heading}
      </h2>

      <a
        href={OWNER_EMAIL_HREF}
        className={cn(
          "mt-10 inline-flex h-12 items-center gap-2 px-6",
          "bg-foreground text-background transition-colors hover:bg-foreground/80",
          SECTION_LABEL_CLASS,
          FOCUS_RING_CLASS
        )}
      >
        {CONNECT_SECTION.actionLabel}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </a>

      <p className={cn("mt-4 select-all", PROJECTS_CUE_CLASS)}>
        {OWNER_EMAIL_ADDRESS}
      </p>
    </section>
  )
}
