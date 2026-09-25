"use client"

import { ArrowDownRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Transition, Variants } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { HERO_INTRO_TIMING, HERO_SCROLL_LABEL } from "@/data/hero.data"
import { useDotField } from "@/features/portfolio/hooks/use-dot-field.hook"
import { renderRichTextHtml } from "@/features/site-content/services/rich-text-renderer.service"
import { cn } from "@/lib/utils"
import type { HeroWordmarkMode } from "@/types/hero.type"
import type { SiteContent } from "@/types/site-content.type"

const WORDMARK_TEXT_CLASS = cn(
  "block text-center leading-none font-bold uppercase",
  "text-[min(25vw,40svh)] md:text-[clamp(3rem,18vw,16rem)]"
)

const WORDMARK_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    scale: HERO_INTRO_TIMING.smallScale,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

const WORDMARK_TRANSITION: Transition = {
  opacity: {
    duration: HERO_INTRO_TIMING.sweepDelaySeconds,
    ease: "easeOut",
  },
  scale: {
    delay: HERO_INTRO_TIMING.growDelaySeconds,
    duration: HERO_INTRO_TIMING.growDurationSeconds,
    ease: [0.65, 0, 0.35, 1],
  },
}

const SWEEP_VARIANTS: Variants = {
  hidden: {
    clipPath: "inset(0% 100% 0% 0%)",
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
  },
}

const SWEEP_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.sweepDelaySeconds,
  duration: HERO_INTRO_TIMING.sweepDurationSeconds,
  ease: [0.65, 0, 0.35, 1],
}

const LIFT_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: HERO_INTRO_TIMING.liftPixels,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const TAGLINE_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.taglineDelayAfterSettleSeconds,
  duration: HERO_INTRO_TIMING.taglineDurationSeconds,
  ease: "easeOut",
}

const SCROLL_CUE_TRANSITION: Transition = {
  delay: HERO_INTRO_TIMING.scrollCueDelayAfterSettleSeconds,
  duration: HERO_INTRO_TIMING.scrollCueDurationSeconds,
  ease: "easeOut",
}

const INSTANT_TRANSITION: Transition = {
  duration: 0,
}

const TEXT_SETTLE_MS =
  (HERO_INTRO_TIMING.growDelaySeconds + HERO_INTRO_TIMING.growDurationSeconds) *
  1000

export function Hero({
  content,
  displayFontFamily,
}: Readonly<{ content: SiteContent; displayFontFamily: string }>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasIntroSettled, setHasIntroSettled] = useState(false)
  const [isDotFieldUnsupported, setIsDotFieldUnsupported] = useState(false)
  const shouldReduceMotion = useReducedMotion() === true

  const markIntroSettled = useCallback(function markSettled() {
    setHasIntroSettled(true)
  }, [])

  const markDotFieldUnsupported = useCallback(function markUnsupported() {
    setIsDotFieldUnsupported(true)
  }, [])

  const wordmarkMode: HeroWordmarkMode = isDotFieldUnsupported ? "text" : "dots"

  useDotField({
    containerRef,
    canvasRef,
    text: content.hero.name,
    fontFamily: displayFontFamily,
    dotColor: content.theme.heroDot,
    mode: wordmarkMode,
    onIntroSettled: markIntroSettled,
    onUnsupported: markDotFieldUnsupported,
  })

  const isTextWordmark = wordmarkMode === "text"

  useEffect(
    function settleTextWordmarkOnSchedule() {
      if (!isTextWordmark) {
        return
      }

      const settleMs = shouldReduceMotion ? 0 : TEXT_SETTLE_MS
      const handle = window.setTimeout(markIntroSettled, settleMs)

      return function cancelSettle() {
        window.clearTimeout(handle)
      }
    },
    [isTextWordmark, shouldReduceMotion, markIntroSettled]
  )

  const taglineHtml = renderRichTextHtml(content.hero.tagline)
  const wordmarkTarget = isTextWordmark ? "visible" : "hidden"
  const introTarget = hasIntroSettled ? "visible" : "hidden"

  function resolveTransition(transition: Transition): Transition {
    if (shouldReduceMotion) {
      return INSTANT_TRANSITION
    }

    return transition
  }

  return (
    <section
      id="home"
      className={cn(
        "relative isolate flex h-svh w-full flex-col items-center justify-center",
        "overflow-hidden bg-black text-white"
      )}
    >
      <div className="flex w-full flex-col items-center">
        <div
          className={cn(
            "relative h-[min(40vw,45svh)] w-full",
            "md:h-[min(clamp(380px,23.4vw_+_200px,500px),70svh)]"
          )}
        >
          <motion.div
            initial="hidden"
            animate={wordmarkTarget}
            variants={WORDMARK_VARIANTS}
            transition={resolveTransition(WORDMARK_TRANSITION)}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="relative max-w-full">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[22%] right-0 translate-x-[60%]",
                  "text-white/45",
                  "text-[clamp(0.6rem,2.6vw,0.8rem)] md:text-[1.35rem]"
                )}
              >
                ©
              </span>

              <span
                aria-hidden="true"
                style={{
                  fontFamily: displayFontFamily,
                  opacity: HERO_INTRO_TIMING.dimAlpha,
                }}
                className={WORDMARK_TEXT_CLASS}
              >
                {content.hero.name}
              </span>

              <motion.h1
                variants={SWEEP_VARIANTS}
                transition={resolveTransition(SWEEP_TRANSITION)}
                style={{ fontFamily: displayFontFamily }}
                className={cn(WORDMARK_TEXT_CLASS, "absolute inset-0")}
              >
                {content.hero.name}
              </motion.h1>
            </div>
          </motion.div>

          <div
            ref={containerRef}
            data-status="idle"
            className="group absolute inset-x-0 -inset-y-1/4 touch-pan-y touch-pinch-zoom"
          >
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              data-point-count="0"
              className={cn(
                "absolute inset-0 h-full w-full opacity-0",
                "transition-opacity duration-500 group-data-[status=running]:opacity-100"
              )}
            />
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate={introTarget}
          variants={LIFT_VARIANTS}
          transition={resolveTransition(TAGLINE_TRANSITION)}
          className={cn(
            "relative max-w-[21rem] px-5 md:max-w-[34rem] md:px-6",
            "text-center uppercase",
            "text-[0.8125rem] leading-[1.7] tracking-[0.05em] text-white/70",
            "md:text-sm md:leading-relaxed md:tracking-[0.14em] md:text-white/75"
          )}
          dangerouslySetInnerHTML={{ __html: taglineHtml }}
        />

        <motion.div
          initial="hidden"
          animate={introTarget}
          variants={LIFT_VARIANTS}
          transition={resolveTransition(SCROLL_CUE_TRANSITION)}
          className={cn(
            "absolute inset-x-0 bottom-10 flex items-center justify-center gap-2",
            "text-white/60 uppercase [@media(max-height:30rem)]:hidden",
            "text-[0.75rem] tracking-[0.12em]",
            "md:text-[0.6875rem] md:tracking-[0.22em]"
          )}
        >
          <span>{HERO_SCROLL_LABEL}</span>
          <ArrowDownRight aria-hidden="true" className="size-3.5" />
        </motion.div>
      </div>
    </section>
  )
}
