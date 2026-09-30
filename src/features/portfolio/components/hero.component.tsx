"use client"

import { ArrowDownRight } from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  HERO_COPY_FADE_OPACITY,
  HERO_COPY_FADE_PROGRESS,
  HERO_COPY_FADE_SCROLL,
  HERO_INTRO_TIMING,
  HERO_SCROLL_CUE_TRANSITION,
  HERO_SCROLL_LABEL,
  HERO_SWEEP_TRANSITION,
  HERO_SWEEP_VARIANTS,
  HERO_TAGLINE_TRANSITION,
  HERO_TEXT_SETTLE_MS,
  HERO_WORDMARK_TEXT_CLASS,
  HERO_WORDMARK_TRANSITION,
  HERO_WORDMARK_VARIANTS,
  LIFT_VARIANTS,
} from "@/data/hero.data"
import { useDotField } from "@/features/portfolio/hooks/use-dot-field.hook"
import { usePrefersReducedMotion } from "@/features/portfolio/hooks/use-motion-preference.hook"
import { resolveMotionTransition } from "@/features/portfolio/motion.rules"
import { cn } from "@/lib/utils"
import type { HeroWordmarkMode } from "@/types/hero.type"
import type { SiteContent } from "@/types/site-content.type"

export function Hero({
  content,
  displayFontFamily,
  taglineHtml,
}: Readonly<{
  content: SiteContent
  displayFontFamily: string
  taglineHtml: string
}>) {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const wordmarkRef = useRef<HTMLDivElement | null>(null)
  const taglineRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasIntroSettled, setHasIntroSettled] = useState(false)
  const [isDotFieldUnsupported, setIsDotFieldUnsupported] = useState(false)
  const shouldReduceMotion = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    ...HERO_COPY_FADE_SCROLL,
    target: sceneRef,
  })
  const copyOpacity = useTransform(
    scrollYProgress,
    HERO_COPY_FADE_PROGRESS,
    HERO_COPY_FADE_OPACITY
  )

  const markIntroSettled = useCallback(function markSettled() {
    setHasIntroSettled(true)
  }, [])

  const markDotFieldUnsupported = useCallback(function markUnsupported() {
    setIsDotFieldUnsupported(true)
  }, [])

  const wordmarkMode: HeroWordmarkMode = isDotFieldUnsupported ? "text" : "dots"

  useDotField({
    wordmarkRef,
    taglineRef,
    canvasRef,
    text: content.hero.name,
    fontFamily: displayFontFamily,
    dotColor: content.theme.heroDot,
    backgroundColor: content.theme.pageBackground,
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

      const settleMs = shouldReduceMotion ? 0 : HERO_TEXT_SETTLE_MS
      const handle = window.setTimeout(markIntroSettled, settleMs)

      return function cancelSettle() {
        window.clearTimeout(handle)
      }
    },
    [isTextWordmark, shouldReduceMotion, markIntroSettled]
  )

  const wordmarkTarget = isTextWordmark ? "visible" : "hidden"
  const introTarget = hasIntroSettled ? "visible" : "hidden"
  const copyFadeOpacity = isDotFieldUnsupported ? 1 : copyOpacity

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh forced-colors:invisible">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-point-count="0"
          className={cn(
            "absolute top-0 left-0 opacity-0 transition-opacity duration-500",
            "group-data-[status=running]/stage:opacity-100"
          )}
        />
      </div>

      <div
        ref={sceneRef}
        data-dot-scene="name"
        data-dot-shapes="name"
        className="h-[110svh] text-foreground group-data-[status=unsupported]/stage:h-auto"
      >
        <section
          id="home"
          className={cn(
            "sticky top-0 flex h-svh w-full flex-col items-center justify-center",
            "overflow-hidden"
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
                variants={HERO_WORDMARK_VARIANTS}
                transition={resolveMotionTransition(
                  HERO_WORDMARK_TRANSITION,
                  shouldReduceMotion
                )}
                data-reveal=""
                className="absolute inset-0 flex items-center justify-center px-4 forced-colors:transform-none! forced-colors:opacity-100!"
              >
                <div className="relative max-w-full">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[22%] right-0 translate-x-[60%]",
                      "text-foreground/45",
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
                    className={HERO_WORDMARK_TEXT_CLASS}
                  >
                    {content.hero.name}
                  </span>

                  <motion.h1
                    variants={HERO_SWEEP_VARIANTS}
                    transition={resolveMotionTransition(
                      HERO_SWEEP_TRANSITION,
                      shouldReduceMotion
                    )}
                    data-reveal=""
                    style={{ fontFamily: displayFontFamily }}
                    className={cn(
                      HERO_WORDMARK_TEXT_CLASS,
                      "absolute inset-0 forced-colors:[clip-path:none]!"
                    )}
                  >
                    {content.hero.name}
                  </motion.h1>
                </div>
              </motion.div>

              <div
                ref={wordmarkRef}
                data-dot-slot=""
                className="absolute inset-x-0 -inset-y-1/4 touch-pan-y touch-pinch-zoom"
              />
            </div>

            <motion.div style={{ opacity: copyFadeOpacity }}>
              <motion.div
                ref={taglineRef}
                initial="hidden"
                animate={introTarget}
                variants={LIFT_VARIANTS}
                transition={resolveMotionTransition(
                  HERO_TAGLINE_TRANSITION,
                  shouldReduceMotion
                )}
                data-reveal=""
                className={cn(
                  "relative max-w-[21rem] px-5 md:max-w-[35rem] md:px-6",
                  "text-center uppercase",
                  "text-[0.8125rem] leading-[1.7] tracking-[0.05em] text-foreground/70",
                  "md:text-sm md:leading-relaxed md:tracking-[0.14em] md:text-foreground/75"
                )}
                dangerouslySetInnerHTML={{ __html: taglineHtml }}
              />
            </motion.div>

            <motion.div
              style={{ opacity: copyFadeOpacity }}
              className="absolute inset-x-0 bottom-10 [@media(max-height:30rem)]:hidden"
            >
              <motion.div
                initial="hidden"
                animate={introTarget}
                variants={LIFT_VARIANTS}
                transition={resolveMotionTransition(
                  HERO_SCROLL_CUE_TRANSITION,
                  shouldReduceMotion
                )}
                data-reveal=""
                className={cn(
                  "flex items-center justify-center gap-2",
                  "text-[0.6875rem] tracking-[0.22em] text-muted-foreground uppercase"
                )}
              >
                <span>{HERO_SCROLL_LABEL}</span>
                <ArrowDownRight aria-hidden="true" className="size-3.5" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
