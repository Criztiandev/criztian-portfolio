import Link from "next/link"
import { Fragment } from "react"

import { Shot } from "@/components/shot"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { ALL_WORK_LINK } from "@/data/case-study.data"
import { cn } from "@/lib/utils"
import type {
  CaseStudy,
  CaseStudyChange,
  CaseStudyNext,
} from "@/type/case-study.type"

const containerClassName = "mx-auto max-w-page px-4 md:px-8 xl:px-10"

const linkClassName = cn(buttonVariants({ variant: "link", size: "link" }))

const TITLE_FROM_MS = 200
const TITLE_STEP_MS = 90
const COPY_FROM_MS = 900
const COPY_STEP_MS = 150

const RISE_PX = 150
const HEADING_FROM_PX = 180
const HEADING_STEP_PX = 40
const CAPTION_FROM_PX = 100
const NOTE_TITLE_FROM_PX = 150
const NOTE_BODY_FROM_PX = 240
const CHANGE_TITLE_FROM_PX = 250
const CHANGE_TITLE_STEP_PX = 30
const ITEM_FROM_PX = 400
const ITEM_STEP_PX = 120
const LINK_FROM_PX = 120
const LINK_AFTER_HEADING_PX = 300
const LINK_STEP_PX = 40

function riseRange(startPx: number): React.CSSProperties {
  return { animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px` }
}

function delayedRange(startPx: number): React.CSSProperties {
  const start = `calc(${startPx}px + var(--case-delay))`
  const end = `calc(${startPx + RISE_PX}px + var(--case-delay))`
  return { animationRange: `cover ${start} cover ${end}` }
}

function maskedWords(
  text: string,
  className: string,
  wordStyle: (wordIndex: number) => React.CSSProperties
) {
  return text.split(" ").map((word, wordIndex) => (
    <Fragment key={wordIndex}>
      {" "}
      <span className="hero-mask inline-block">
        <span
          className={cn("inline-block", className)}
          style={wordStyle(wordIndex)}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ))
}

function headingWords(heading: string) {
  return maskedWords(heading, "case-rise", (wordIndex) =>
    riseRange(HEADING_FROM_PX + wordIndex * HEADING_STEP_PX)
  )
}

function headingLetters(heading: string) {
  const words: React.ReactNode[] = []
  let letterIndex = 0
  heading.split(" ").forEach((word, wordIndex) => {
    const letters: React.ReactNode[] = []
    for (const letter of Array.from(word)) {
      letters.push(
        <span
          key={letterIndex}
          className="inline-block case-rise-desktop"
          style={riseRange(HEADING_FROM_PX + letterIndex * HEADING_STEP_PX)}
        >
          {letter}
        </span>
      )
      letterIndex += 1
    }
    words.push(
      <Fragment key={wordIndex}>
        {" "}
        <span className="hero-mask inline-block">
          <span
            className="inline-block case-rise-touch"
            style={riseRange(HEADING_FROM_PX + wordIndex * HEADING_STEP_PX)}
          >
            {letters}
          </span>
        </span>
      </Fragment>
    )
  })
  return words
}

function BandHeader({ heading, intro }: { heading: string; intro: string }) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <h2
        aria-label={heading}
        className="font-heading text-display-l md:text-display-xl"
      >
        <span aria-hidden="true">{headingLetters(heading)}</span>
      </h2>
      <p className="text-body-base case-body xl:w-85">{intro}</p>
    </div>
  )
}

function Change({ change }: { change: CaseStudyChange }) {
  return (
    <article className="flex flex-col gap-6 border-t border-graphite py-10 case-timeline xl:flex-row xl:gap-10">
      <div className="flex flex-col gap-4 xl:w-110 xl:shrink-0">
        <h3 className="font-heading text-heading-h2 text-balance">
          {maskedWords(change.title, "case-rise-desktop", (wordIndex) =>
            riseRange(CHANGE_TITLE_FROM_PX + wordIndex * CHANGE_TITLE_STEP_PX)
          )}
        </h3>
        <p className="text-body-base case-body">{change.body}</p>
      </div>
      <Shot
        image={change.phoneScreen}
        sizes="100vw"
        className="case-shot md:hidden"
      />
      <Shot
        image={change.screen}
        sizes="(min-width: 1920px) 1360px, (min-width: 1280px) 62vw, 100vw"
        className="hidden case-shot md:block xl:min-w-0 xl:flex-1"
      />
    </article>
  )
}

function NextBand({ next }: { next: CaseStudyNext | undefined }) {
  let heading = null
  let nextLink = null
  let linkFromPx = LINK_FROM_PX
  if (next !== undefined) {
    linkFromPx = LINK_AFTER_HEADING_PX
    heading = (
      <h2 className="font-heading text-heading-h1 text-balance text-paper">
        {headingWords(next.heading)}
      </h2>
    )
    nextLink = (
      <div className="-m-1 flex overflow-clip p-1">
        <Link
          href={next.link.href}
          className={cn(linkClassName, "case-link")}
          style={riseRange(linkFromPx)}
        >
          {next.link.label}
        </Link>
      </div>
    )
    linkFromPx += LINK_STEP_PX
  }

  return (
    <section className="border-t border-graphite bg-black case-timeline">
      <div
        className={cn(
          containerClassName,
          "flex flex-col gap-6 py-20 xl:flex-row xl:items-center xl:justify-between"
        )}
      >
        {heading}
        <div className="flex gap-6">
          {nextLink}
          <div className="-m-1 flex overflow-clip p-1">
            <Link
              href={ALL_WORK_LINK.href}
              className={cn(linkClassName, "case-link")}
              style={riseRange(linkFromPx)}
            >
              {ALL_WORK_LINK.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CaseStudyView({ study }: { study: CaseStudy }) {
  return (
    <>
      <header className="bg-black">
        <div
          className={cn(
            containerClassName,
            "pt-8 pb-20 md:pt-14 md:pb-24 xl:pt-20 xl:pb-30"
          )}
        >
          <div className="flex flex-col gap-10">
            <h1 className="font-heading text-heading-h1 text-balance text-paper md:text-display-l xl:max-w-275">
              {maskedWords(
                study.title,
                "motion-safe:animate-case-title-word",
                (wordIndex) => ({
                  animationDelay: `${TITLE_FROM_MS + wordIndex * TITLE_STEP_MS}ms`,
                })
              )}
            </h1>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <p
                className="text-body-large text-paper motion-safe:animate-hero-copy-up xl:max-w-160"
                style={{ animationDelay: `${COPY_FROM_MS}ms` }}
              >
                {study.sub}
              </p>
              <p
                className="text-label text-smoke uppercase motion-safe:animate-hero-copy-up xl:w-115"
                style={{ animationDelay: `${COPY_FROM_MS + COPY_STEP_MS}ms` }}
              >
                {study.meta}
              </p>
            </div>
          </div>
          <Shot
            image={study.image}
            sizes="(min-width: 1920px) 1840px, 100vw"
            className="mt-20 motion-safe:animate-case-shot"
          />
        </div>
      </header>

      <section className="bg-black case-timeline">
        <div
          className={cn(
            containerClassName,
            "py-20 text-paper md:py-24 xl:flex xl:justify-between xl:py-30"
          )}
        >
          <h2 className="font-heading text-heading-h1 text-balance xl:w-140">
            {headingWords(study.business.heading)}
          </h2>
          <div className="mt-6 flex flex-col gap-6 text-body-base xl:mt-0 xl:w-160">
            {study.business.paragraphs.map((paragraph) => (
              <p key={paragraph} className="case-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper case-timeline">
        <div
          className={cn(
            containerClassName,
            "flex flex-col gap-16 py-20 text-black md:py-24 xl:py-30"
          )}
        >
          <BandHeader
            heading={study.before.heading}
            intro={study.before.intro}
          />
          <div className="flex flex-col gap-10 xl:flex-row">
            {study.before.shots.map((shot, index) => (
              <figure
                key={shot.image.src}
                data-shot={index + 1}
                className="flex flex-col gap-4 case-figure xl:flex-1"
              >
                <Shot
                  image={shot.image}
                  sizes="(min-width: 1920px) 900px, (min-width: 1280px) 46vw, 100vw"
                  className="case-shot"
                />
                <figcaption
                  className="max-w-180 text-body-base case-timeline case-light-desktop"
                  style={delayedRange(CAPTION_FROM_PX)}
                >
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-col gap-6 xl:flex-row xl:gap-10">
            {study.before.notes.map((note, index) => (
              <article
                key={note.title}
                data-note={index + 1}
                className="flex flex-col gap-4 border-t border-graphite pt-6 case-note xl:flex-1"
              >
                <h3
                  className="font-heading text-heading-h2 text-balance case-light-desktop"
                  style={delayedRange(NOTE_TITLE_FROM_PX)}
                >
                  {note.title}
                </h3>
                <p
                  className="text-body-base case-light-desktop"
                  style={delayedRange(NOTE_BODY_FROM_PX)}
                >
                  {note.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black case-timeline">
        <div
          className={cn(
            containerClassName,
            "flex flex-col gap-16 py-20 text-paper md:py-24 xl:py-30"
          )}
        >
          <BandHeader heading={study.after.heading} intro={study.after.intro} />
          <div className="flex flex-col">
            {study.after.changes.map((change) => (
              <Change key={change.title} change={change} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black case-timeline">
        <div
          className={cn(
            containerClassName,
            "py-20 text-paper md:py-24 xl:flex xl:justify-between xl:py-30"
          )}
        >
          <div className="flex flex-col gap-6 xl:w-140">
            <h2 className="font-heading text-heading-h1 text-balance">
              {headingWords(study.measure.heading)}
            </h2>
            <p className="text-body-base case-body">{study.measure.intro}</p>
          </div>
          <ul className="mt-10 xl:mt-0 xl:w-160">
            {study.measure.items.map((item, index) => (
              <li
                key={item}
                className="border-t border-graphite py-6 font-heading text-heading-h2"
              >
                <span className="hero-mask block">
                  <span
                    className="block case-rise"
                    style={riseRange(ITEM_FROM_PX + index * ITEM_STEP_PX)}
                  >
                    {item}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextBand next={study.next} />
      <SiteFooter />
    </>
  )
}
