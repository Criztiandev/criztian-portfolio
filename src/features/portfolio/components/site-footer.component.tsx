import { ArrowUpRight } from "lucide-react"

import { PORTFOLIO_HOME_NAVIGATION } from "@/data/navigation.data"
import {
  FOOTER_BACK_TO_TOP_LABEL,
  PROJECTS_CUE_CLASS,
} from "@/data/portfolio.data"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer
      data-dot-scene="footer"
      data-dot-shapes="name"
      className={cn(
        "h-[calc(125svh_-_4.5rem)] scroll-mt-18 text-white",
        "group-data-[status=unsupported]/stage:h-auto"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex h-[calc(100svh_-_4.5rem)] flex-col items-center",
          "justify-center gap-10 px-6 md:px-10"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "h-[min(40vw,45svh)] w-full touch-pan-y touch-pinch-zoom",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <a
          href={PORTFOLIO_HOME_NAVIGATION.href}
          className={cn(
            "inline-flex items-center gap-2 outline-none",
            "hover:text-white focus-visible:text-white",
            "focus-visible:ring-[3px] focus-visible:ring-white/50",
            PROJECTS_CUE_CLASS
          )}
        >
          {FOOTER_BACK_TO_TOP_LABEL}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </footer>
  )
}
