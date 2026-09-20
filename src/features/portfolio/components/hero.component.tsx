"use client"

import { motion } from "motion/react"
import { useRef } from "react"

import { useDotField } from "@/features/portfolio/hooks/use-dot-field.hook"
import { readRichTextPlainText } from "@/features/site-content/site-content.rules"
import { cn } from "@/lib/utils"
import type { SiteContent } from "@/types/site-content.type"

const STAGE_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 120,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delayChildren: 0.35,
      staggerChildren: 0.12,
    },
  },
}

const ITEM_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function Hero({
  content,
  displayFontFamily,
}: Readonly<{ content: SiteContent; displayFontFamily: string }>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useDotField({
    containerRef,
    canvasRef,
    text: content.hero.name,
    fontFamily: displayFontFamily,
    dotColor: content.theme.heroDot,
  })

  const tagline = readRichTextPlainText(content.hero.tagline).trim()

  return (
    <section
      id="home"
      className="relative isolate flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-black text-white"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGE_VARIANTS}
        className="flex w-full flex-col items-center"
      >
        <div
          ref={containerRef}
          data-status="idle"
          className="group relative h-[42vh] w-full"
        >
          <h1
            style={{ fontFamily: displayFontFamily }}
            className={cn(
              "absolute inset-0 flex items-center justify-center px-4",
              "text-center text-[clamp(3rem,18vw,16rem)] leading-none font-bold uppercase",
              "transition-opacity duration-500 group-data-[status=running]:opacity-0"
            )}
          >
            {content.hero.name}
          </h1>

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

        <motion.p
          variants={ITEM_VARIANTS}
          className="mt-16 max-w-md px-6 text-center text-base text-white/80"
        >
          {tagline}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGE_VARIANTS}
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-8 text-xs tracking-wide uppercase md:px-10"
      >
        <motion.span
          variants={ITEM_VARIANTS}
          className="flex items-center gap-2 text-white/60"
        >
          {content.hero.scrollLabel}
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="block"
          >
            &darr;
          </motion.span>
        </motion.span>

        <motion.span
          variants={ITEM_VARIANTS}
          className="hidden flex-col items-center gap-1 text-white/25 md:flex"
        >
          {content.hero.disciplines.map(function renderDiscipline(discipline) {
            return <span key={discipline}>{discipline}</span>
          })}
        </motion.span>

        <motion.span variants={ITEM_VARIANTS} className="text-white/60">
          {content.hero.worksLabel}
        </motion.span>
      </motion.div>
    </section>
  )
}
