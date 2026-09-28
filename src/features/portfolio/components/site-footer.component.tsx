import { ArrowUpRight } from "lucide-react"

import {
  PORTFOLIO_HOME_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
} from "@/data/navigation.data"
import {
  OWNER_EMAIL_ADDRESS,
  OWNER_EMAIL_HREF,
} from "@/data/page-sections.data"
import {
  FOOTER_BACK_TO_TOP_LABEL,
  FOOTER_LINK_CLASS,
  FOOTER_NAVIGATION_LABEL,
  FOOTER_YEAR,
  PROJECTS_CUE_CLASS,
} from "@/data/portfolio.data"
import { cn } from "@/lib/utils"
import type { SiteFooterProps } from "@/types/page-sections.type"

export function SiteFooter({ name }: Readonly<SiteFooterProps>) {
  return (
    <footer
      data-dot-scene="footer"
      data-dot-shapes="name"
      className={cn(
        "min-h-[calc(125svh_-_4.5rem)] scroll-mt-18 text-foreground",
        "group-data-[status=unsupported]/stage:min-h-0"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col items-center",
          "px-6 md:px-10"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "my-auto h-[min(40vw,45svh)] w-full shrink-0 touch-pan-y touch-pinch-zoom",
            "[@media(max-height:30rem)]:h-[min(40vw,34svh)]",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <p
          className={cn(
            "my-auto hidden max-w-full text-center font-display font-bold uppercase",
            "text-[min(18vw,30svh)] leading-none wrap-break-word",
            "group-data-[status=unsupported]/stage:block"
          )}
        >
          {name}
        </p>

        <div
          className={cn(
            "flex w-full shrink-0 flex-col items-center gap-2 border-t border-border",
            "py-6 text-center [@media(max-height:30rem)]:py-3",
            "lg:flex-row lg:justify-between lg:gap-8 lg:text-left",
            PROJECTS_CUE_CLASS
          )}
        >
          <p>
            © {FOOTER_YEAR} {name}
          </p>

          <nav aria-label={FOOTER_NAVIGATION_LABEL}>
            <ul className="flex flex-wrap justify-center gap-x-4">
              {PORTFOLIO_PRIMARY_NAVIGATION.map(function renderLink(item) {
                return (
                  <li key={item.id}>
                    <a href={item.href} className={FOOTER_LINK_CLASS}>
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <a href={OWNER_EMAIL_HREF} className={FOOTER_LINK_CLASS}>
            {OWNER_EMAIL_ADDRESS}
          </a>

          <a
            href={PORTFOLIO_HOME_NAVIGATION.href}
            className={FOOTER_LINK_CLASS}
          >
            {FOOTER_BACK_TO_TOP_LABEL}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
