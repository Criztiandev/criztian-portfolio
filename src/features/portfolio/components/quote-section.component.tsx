"use client"

import { motion, useReducedMotion } from "motion/react"
import type { Transition } from "motion/react"

import {
  INSTANT_TRANSITION,
  LIFT_VARIANTS,
  QUOTE_AUTHOR_TRANSITION,
  QUOTE_REVEAL_TRANSITION,
  QUOTE_REVEAL_VARIANTS,
  QUOTE_VIEWPORT,
} from "@/data/hero.data"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/types/site-content.type"

export function QuoteSection({
  quote,
  cubeRef,
}: Readonly<{
  quote: SiteContent["quote"]
  cubeRef: React.RefObject<HTMLDivElement | null>
}>) {
  const shouldReduceMotion = useReducedMotion() === true

  function resolveTransition(transition: Transition): Transition {
    if (shouldReduceMotion) {
      return INSTANT_TRANSITION
    }

    return transition
  }

  return (
    <section
      id="quote"
      className={cn(
        "flex min-h-svh flex-col items-center",
        "px-5 pt-[max(5.5rem,12svh)] pb-16 md:px-6"
      )}
    >
      <div
        ref={cubeRef}
        aria-hidden="true"
        className={cn(
          "size-[min(80vw,46svh,36rem)] shrink-0 touch-pan-y touch-pinch-zoom",
          "group-data-[status=unsupported]:hidden"
        )}
      />

      <motion.figure
        initial="hidden"
        whileInView="visible"
        viewport={QUOTE_VIEWPORT}
        className="mt-8 flex flex-col items-center md:mt-10"
      >
        <blockquote>
          <motion.p
            variants={QUOTE_REVEAL_VARIANTS}
            transition={resolveTransition(QUOTE_REVEAL_TRANSITION)}
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
          transition={resolveTransition(QUOTE_AUTHOR_TRANSITION)}
          className={cn(
            "mt-6 text-white/60 uppercase",
            "text-[0.75rem] tracking-[0.12em]",
            "md:text-[0.6875rem] md:tracking-[0.22em]"
          )}
        >
          <span aria-hidden="true">— </span>
          {quote.author}
        </motion.figcaption>
      </motion.figure>
    </section>
  )
}
