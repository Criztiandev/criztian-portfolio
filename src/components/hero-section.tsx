import Image from "next/image"
import { Fragment } from "react"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowDown } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { HERO_TEXT_START_MS } from "@/config/motion.config"
import { HERO } from "@/data/home.data"
import { cn } from "@/lib/utils"
import type { Home } from "@/type/home.type"

const LETTER_STEP_MS = 60
const LIGHTS_ON_MS = 1100
const LIGHT_STEP_MS = 120
const HEADING_START_MS = HERO_TEXT_START_MS
const WORD_STEP_MS = 90
const COPY_START_MS = HERO_TEXT_START_MS + 400
const COPY_STEP_MS = 150

const WORD_EXIT_STEP_PX = 30
const WORD_EXIT_PX = 150
const COPY_EXIT_FROM_PX = 60
const COPY_EXIT_STEP_PX = 100
const COPY_EXIT_PX = 200

const NAME_CENTER = (HERO.nameStart.length + HERO.nameEnd.length - 1) / 2

function exitRange(fromPx: number, toPx: number): React.CSSProperties {
  return { animationRange: `exit ${fromPx}px exit ${toPx}px` }
}

function copyExit(index: number) {
  const start = COPY_EXIT_FROM_PX + index * COPY_EXIT_STEP_PX
  return exitRange(start, start + COPY_EXIT_PX)
}

function nameLetters(word: string, firstPosition: number) {
  return Array.from(word).map((letter, index) => {
    const position = firstPosition + index
    const distanceFromCenter = Math.floor(Math.abs(position - NAME_CENTER))
    return (
      <span
        key={index}
        className="inline-block transition-opacity duration-900 ease-in-out motion-safe:animate-hero-name-letter motion-safe:hover:opacity-20 motion-safe:hover:duration-(--motion-base) motion-safe:hover:ease-out"
        style={{
          animationDelay: `${position * LETTER_STEP_MS}ms, ${LIGHTS_ON_MS + distanceFromCenter * LIGHT_STEP_MS}ms`,
        }}
      >
        {letter}
      </span>
    )
  })
}

function headingWords(heading: string) {
  return heading.split(" ").map((word, index) => (
    <Fragment key={index}>
      {" "}
      <span className="hero-mask inline-block">
        <span
          className="inline-block hero-exit-rise"
          style={exitRange(
            index * WORD_EXIT_STEP_PX,
            index * WORD_EXIT_STEP_PX + WORD_EXIT_PX
          )}
        >
          <span
            className="inline-block motion-safe:animate-hero-word-rise"
            style={{
              animationDelay: `${HEADING_START_MS + index * WORD_STEP_MS}ms`,
            }}
          >
            {word}
          </span>
        </span>
      </span>
    </Fragment>
  ))
}

function copyDelay(index: number): React.CSSProperties {
  return { animationDelay: `${COPY_START_MS + index * COPY_STEP_MS}ms` }
}

export function HeroSection({ home }: { home: Home }) {
  return (
    <section
      data-cms-card="Hero"
      className="-mt-16 min-h-svh overflow-hidden bg-black hero-timeline xl:-mt-20"
    >
      <div className="relative mx-auto max-w-page md:flex md:h-svh md:min-h-150 md:flex-col xl:block">
        <div className="relative h-130 overflow-hidden md:h-auto md:max-h-190 md:min-h-0 md:flex-1 xl:absolute xl:inset-0 xl:max-h-none">
          <p
            aria-hidden="true"
            className="absolute inset-x-0 top-20 text-center font-heading whitespace-nowrap text-display-giant-phone text-paper hero-exit-slide md:top-1/2 md:-mt-1.5 md:-translate-y-1/2 md:text-display-giant-tablet xl:-mt-6 xl:text-display-giant-desktop"
          >
            <span className="hero-mask block md:inline-block">
              {nameLetters(HERO.nameStart, 0)}
            </span>
            <span className="hero-mask block md:inline-block">
              {nameLetters(HERO.nameEnd, HERO.nameStart.length)}
            </span>
          </p>
          <div className="absolute top-57.5 left-1/2 h-112.5 w-75 -translate-x-1/2 hero-exit-sink md:top-25 md:bottom-0 md:aspect-2/3 md:h-auto md:w-auto xl:top-0">
            <div
              className="absolute inset-0 motion-safe:animate-hero-portrait"
              style={{ animationDelay: `0ms, ${LIGHTS_ON_MS}ms` }}
            >
              <Image
                src={HERO.portrait.src}
                alt={HERO.portrait.alt}
                fill
                sizes="(min-width: 1280px) 600px, (min-width: 768px) 440px, 300px"
                loading="eager"
                fetchPriority="high"
                className="object-cover grayscale transition duration-(--motion-slow) ease-out hover:grayscale-0 motion-reduce:transition-none"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-15 w-75 -translate-x-1/2 bg-linear-to-b from-black/0 to-black md:aspect-5/2 md:h-4/17 md:w-auto xl:h-4/15" />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-8 pb-12 md:flex-row md:gap-8 md:px-8 xl:absolute xl:inset-x-0 xl:bottom-10 xl:items-end xl:justify-between xl:px-10 xl:py-0">
          <h1
            data-cms-field="heroHeading"
            className="font-heading text-heading-h2 text-paper md:flex-1 xl:w-99.5 xl:flex-none"
          >
            {headingWords(home.heroHeading)}
          </h1>
          <div className="flex flex-col gap-6 md:flex-1 xl:max-w-120 xl:flex-none">
            <div className="hero-exit-copy" style={copyExit(0)}>
              <p
                data-cms-field="heroText"
                className="text-body-base text-smoke motion-safe:animate-hero-copy-up"
                style={copyDelay(0)}
              >
                {home.heroText}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="hero-exit-copy" style={copyExit(1)}>
                <div
                  className="flex items-center gap-8 motion-safe:animate-hero-copy-up"
                  style={copyDelay(1)}
                >
                  <BookCallLink />
                  <a
                    href={HERO.workLink.href}
                    className={cn(
                      buttonVariants({ variant: "link", size: "link" })
                    )}
                  >
                    {HERO.workLink.label}
                    <IconArrowDown />
                  </a>
                </div>
              </div>
              <div className="hero-exit-copy" style={copyExit(2)}>
                <p
                  className="text-body-base text-smoke motion-safe:animate-hero-copy-up md:whitespace-nowrap"
                  style={copyDelay(2)}
                >
                  {HERO.callNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
