"use client"

import { motion, useReducedMotion } from "motion/react"

import {
  LIFT_VARIANTS,
  QUOTE_AUTHOR_TRANSITION,
  QUOTE_REVEAL_TRANSITION,
  QUOTE_REVEAL_VARIANTS,
  QUOTE_VIEWPORT,
} from "@/data/hero.data"
import {
  CUE_CLASS,
  PIN_SPACER_CLASS,
  SECTION_FRAME_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
} from "@/data/page-sections.data"
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
      className={cn(SECTION_FRAME_CLASS, "text-foreground")}
    >
      <div
        className={cn(
          "sticky top-18 flex min-h-[calc(100svh_-_4.5rem)] flex-col justify-center-safe gap-8",
          "pt-7 pb-6 short:gap-4 short:pt-4 short:pb-4",
          "split:grid split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:items-center",
          "split:gap-x-10 split:pt-14 split:pb-16"
        )}
      >
        <div
          data-dot-slot=""
          aria-hidden="true"
          className={cn(
            "size-[min(74vw,40svh)] shrink-0 touch-pan-y touch-pinch-zoom self-center",
            "short:size-[min(74vw,34svh)]",
            "split:col-start-2 split:row-start-1 split:size-[min(32vw,56svh)]",
            "split:justify-self-center",
            "group-data-[status=unsupported]/stage:hidden"
          )}
        />

        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={QUOTE_VIEWPORT}
          className="@container split:col-start-1 split:row-start-1"
        >
          <blockquote>
            <motion.p
              variants={QUOTE_REVEAL_VARIANTS}
              transition={resolveMotionTransition(
                QUOTE_REVEAL_TRANSITION,
                shouldReduceMotion
              )}
              className={cn(
                STATEMENT_CLASS,
                STATEMENT_SIZE_CLASSES.belief,
                "max-w-[11ch]"
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
            className={cn(CUE_CLASS, "mt-6")}
          >
            <span aria-hidden="true">— </span>
            {quote.author}
          </motion.figcaption>
        </motion.figure>
      </div>

      <div className={cn(PIN_SPACER_CLASS, "h-[60svh]")} />
    </section>
  )
}
