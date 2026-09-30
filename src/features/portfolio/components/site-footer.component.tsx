import { ArrowUpRight } from "lucide-react"

import {
  PORTFOLIO_HOME_NAVIGATION,
  PORTFOLIO_PRIMARY_NAVIGATION,
} from "@/data/navigation.data"
import {
  CUE_CLASS,
  OWNER_EMAIL_ADDRESS,
  PIN_SPACER_CLASS,
  OWNER_EMAIL_HREF,
  SWEPT_LINE_CLASS,
} from "@/data/page-sections.data"
import {
  FOOTER_BACK_TO_TOP_LABEL,
  FOOTER_LINK_CLASS,
  FOOTER_NAVIGATION_LABEL,
  FOOTER_YEAR,
} from "@/data/portfolio.data"
import {
  buildLineStyle,
  buildSceneCaptionStyle,
} from "@/features/portfolio/step-motion.rules"
import { cn } from "@/lib/utils"
import type { SiteFooterProps } from "@/types/page-sections.type"

export function SiteFooter({ name }: Readonly<SiteFooterProps>) {
  const emailLine = PORTFOLIO_PRIMARY_NAVIGATION.length + 1
  const backToTopLine = emailLine + 1

  return (
    <footer
      data-dot-scene="footer"
      data-dot-shapes="name"
      style={buildSceneCaptionStyle(backToTopLine) as React.CSSProperties}
      className="scroll-mt-18 text-foreground"
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
            "-mx-6 flex shrink-0 flex-col items-center gap-3 self-stretch border-t border-rule",
            "px-6 pt-4 pb-6 text-center md:-mx-10 md:px-10",
            "[@media(max-height:30rem)]:flex-row [@media(max-height:30rem)]:flex-wrap [@media(max-height:30rem)]:justify-center",
            "[@media(max-height:30rem)]:gap-x-4 [@media(max-height:30rem)]:gap-y-0 [@media(max-height:30rem)]:py-2",
            "lg:h-18 lg:flex-row lg:justify-between lg:gap-8 lg:py-0 lg:text-left",
            CUE_CLASS
          )}
        >
          <p
            style={buildLineStyle(0) as React.CSSProperties}
            className={cn(
              "flex min-h-11 items-center lg:min-h-0",
              SWEPT_LINE_CLASS
            )}
          >
            © {FOOTER_YEAR} {name}
          </p>

          <nav aria-label={FOOTER_NAVIGATION_LABEL}>
            <ul className="flex flex-wrap justify-center lg:gap-x-2">
              {PORTFOLIO_PRIMARY_NAVIGATION.map(
                function renderLink(item, itemIndex) {
                  return (
                    <li
                      key={item.id}
                      style={
                        buildLineStyle(itemIndex + 1) as React.CSSProperties
                      }
                      className={SWEPT_LINE_CLASS}
                    >
                      <a href={item.href} className={FOOTER_LINK_CLASS}>
                        {item.label}
                      </a>
                    </li>
                  )
                }
              )}
            </ul>
          </nav>

          <a
            href={OWNER_EMAIL_HREF}
            style={buildLineStyle(emailLine) as React.CSSProperties}
            className={cn(FOOTER_LINK_CLASS, SWEPT_LINE_CLASS)}
          >
            {OWNER_EMAIL_ADDRESS}
          </a>

          <a
            href={PORTFOLIO_HOME_NAVIGATION.href}
            style={buildLineStyle(backToTopLine) as React.CSSProperties}
            className={cn(FOOTER_LINK_CLASS, SWEPT_LINE_CLASS)}
          >
            {FOOTER_BACK_TO_TOP_LABEL}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>

      <div className={cn(PIN_SPACER_CLASS, "h-[25svh]")} />
    </footer>
  )
}
