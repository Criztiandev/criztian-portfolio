import Image from "next/image"
import { Fragment } from "react"

import { ABOUT } from "@/data/home.data"

const PHOTO_SIZES =
  "(min-width: 1536px) 588px, (min-width: 1280px) 434px, (min-width: 768px) 50vw, 100vw"
const RISE_PX = 150
const WORD_FROM_PX = 180
const WORD_STEP_PX = 40
const LETTER_STEP_PX = 30

function riseRange(startPx: number): React.CSSProperties {
  return { animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px` }
}

function nameLetters(name: string, startPx: number) {
  return Array.from(name).map((letter, index) => (
    <span
      key={index}
      className="inline-block about-rise"
      style={riseRange(startPx + index * LETTER_STEP_PX)}
    >
      {letter}
    </span>
  ))
}

function headingParts(heading: string) {
  const words = heading.split(" ")
  const nameIndex = words.length - 1
  return words.map((word, index) => {
    const start = WORD_FROM_PX + index * WORD_STEP_PX
    if (index === nameIndex) {
      return (
        <span key={index} className="hero-mask inline-block">
          {nameLetters(word, start)}
        </span>
      )
    }
    return (
      <Fragment key={index}>
        <span className="hero-mask inline-block">
          <span className="inline-block about-rise" style={riseRange(start)}>
            {word}
          </span>
        </span>{" "}
      </Fragment>
    )
  })
}

export function AboutSection() {
  return (
    <section className="bg-black about-timeline">
      <div className="mx-auto flex max-w-page flex-col gap-12 px-4 py-20 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-0 md:px-8 md:py-24 xl:grid-cols-3 xl:grid-rows-[auto_auto_1fr] xl:gap-x-10 xl:px-10 xl:py-30">
        <h2
          aria-label={ABOUT.heading}
          className="font-heading text-heading-h1 text-paper md:col-start-2 md:row-start-1 md:text-display-l xl:col-span-2 xl:col-start-2"
        >
          <span aria-hidden="true">{headingParts(ABOUT.heading)}</span>
        </h2>
        <div className="group relative aspect-4/5 overflow-clip md:col-start-1 md:row-span-2 md:row-start-1 md:self-start xl:row-span-3 xl:row-start-1">
          <div className="absolute inset-0 about-photo">
            <Image
              src={ABOUT.photos.desk.src}
              alt={ABOUT.photos.desk.alt}
              fill
              sizes={PHOTO_SIZES}
              className="object-cover"
            />
            <Image
              src={ABOUT.photos.client.src}
              alt={ABOUT.photos.client.alt}
              fill
              sizes={PHOTO_SIZES}
              className="object-cover opacity-0 transition-opacity duration-(--motion-slow) ease-out group-hover:opacity-100 motion-reduce:transition-none"
            />
          </div>
        </div>
        <div className="about-body-timeline md:col-start-2 md:row-start-2 md:mt-6 xl:col-span-2 xl:col-start-2 xl:mt-8 xl:w-160">
          <p className="text-body-large text-paper about-body">{ABOUT.body}</p>
        </div>
        <ul className="flex flex-col md:col-span-2 md:mt-12 md:grid md:grid-cols-3 md:gap-8 xl:col-start-2 xl:row-start-3 xl:mt-0 xl:gap-10 xl:self-end">
          {ABOUT.stats.map((stat, index) => (
            <li
              key={stat.value}
              data-stat={index + 1}
              className="grid grid-cols-2 items-center gap-4 border-t border-graphite pt-6 pb-4 about-stat md:flex md:flex-col md:items-start md:gap-2 md:pb-0"
            >
              <p className="hero-mask font-heading text-heading-h1 text-red xl:text-display-l">
                <span className="inline-block about-stat-number">
                  {stat.value}
                </span>
              </p>
              <p className="text-body-small text-smoke about-stat-label">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
