"use client"

import { motion, useReducedMotion } from "motion/react"

import {
  LIFT_VARIANTS,
  QUOTE_AUTHOR_TRANSITION,
  QUOTE_REVEAL_TRANSITION,
  QUOTE_REVEAL_VARIANTS,
  QUOTE_VIEWPORT,
} from "@/data/hero.data"
import { resolveMotionTransition } from "@/features/portfolio/motion.rules"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/types/site-content.type"

export function QuoteSection({
  quote,
}: Readonly<{
  quote: SiteContent["quote"]
}>) {
  const shouldReduceMotion = useReducedMotion() === true

  return (
    <section
      id="quote"
      data-dot-scene="cube"
      data-dot-shapes="cube"
      className={cn(
        "min-h-[calc(160svh_-_4.5rem)] scroll-mt-18 text-foreground",
        "group-data-[status=unsupported]/stage:min-h-0"
      )}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col items-center",
          "px-5 pt-[max(1rem,12svh_-_4.5rem)] pb-4 md:px-6"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "size-[min(80vw,46svh,36rem)] shrink-0 touch-pan-y touch-pinch-zoom",
            "[@media(max-height:30rem)]:size-[min(80vw,34svh)]",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={QUOTE_VIEWPORT}
          className={cn(
            "mt-8 flex flex-col items-center md:mt-10",
            "[@media(max-height:30rem)]:mt-4"
          )}
        >
          <blockquote>
            <motion.p
              variants={QUOTE_REVEAL_VARIANTS}
              transition={resolveMotionTransition(
                QUOTE_REVEAL_TRANSITION,
                shouldReduceMotion
              )}
              className={cn(
                "max-w-[20ch] text-center font-display font-bold uppercase",
                "text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05] text-balance",
                "wrap-break-word"
              )}
            >
              {quote.text}
            </motion.p>
          </blockquote>

          <motion.figcaption
            hidden={quote.author === ""}
            variants={LIFT_VARIANTS}
            transition={resolveMotionTransition(
              QUOTE_AUTHOR_TRANSITION,
              shouldReduceMotion
            )}
            className={cn(
              "mt-6 text-muted-foreground uppercase",
              "text-[0.75rem] tracking-[0.12em]",
              "md:text-[0.6875rem] md:tracking-[0.22em]"
            )}
          >
            <span aria-hidden="true">— </span>
            {quote.author}
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
