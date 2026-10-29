import { Fragment } from "react"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowUpRight } from "@/components/icons"
import { SiteFooterBar } from "@/components/site-footer-bar"
import { buttonVariants } from "@/components/ui/button"
import { FOOTER } from "@/data/home.data"
import { cn } from "@/lib/utils"

const RISE_PX = 150
const HEADING_FROM_PX = 170
const LETTER_SHARE = 3.5
const WORD_SHARE = 15
const LEAD_FROM_PX = 30
const LEAD_STEP_PX = 20
const SOCIAL_FROM_PX = 75
const SOCIAL_STEP_PX = 20

const quietLinkClassName =
  "outline-none hover:underline focus-visible:ring-2 focus-visible:ring-paper"

function headingRange(sharePercent: number): React.CSSProperties {
  const start = `calc(${sharePercent}% + ${HEADING_FROM_PX}px)`
  const end = `calc(${sharePercent}% + ${HEADING_FROM_PX + RISE_PX}px)`
  return { animationRange: `entry ${start} entry ${end}` }
}

function tailRange(startPx: number): React.CSSProperties {
  return {
    animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px`,
  }
}

function headingWords(heading: string) {
  const words: React.ReactNode[] = []
  let letterIndex = 0
  heading.split(" ").forEach((word, wordIndex) => {
    const letters: React.ReactNode[] = []
    for (const letter of Array.from(word)) {
      letters.push(
        <span
          key={letterIndex}
          className="inline-block footer-letter"
          style={headingRange(letterIndex * LETTER_SHARE)}
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
            className="inline-block footer-word"
            style={headingRange(wordIndex * WORD_SHARE)}
          >
            {letters}
          </span>
        </span>
      </Fragment>
    )
  })
  return words
}

export function SiteFooter() {
  const leadWords = FOOTER.emailLead.split(" ")
  return (
    <footer className="overflow-clip bg-black">
      <div className="mx-auto max-w-page px-4 pt-20 pb-6 md:px-8 md:pt-24 md:pb-8 xl:px-10 xl:pt-30 xl:pb-10">
        <h2
          aria-label={FOOTER.heading}
          className="font-heading text-heading-h1 text-paper footer-head-timeline md:text-display-xl xl:w-275"
        >
          <span aria-hidden="true">{headingWords(FOOTER.heading)}</span>
        </h2>
        <div className="mt-12 flex flex-col gap-8 footer-tail-timeline md:mt-20 xl:mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <div className="-m-1 overflow-clip p-1">
              <BookCallLink className="w-full footer-call md:w-auto" />
            </div>
            <p className="text-body-base text-smoke">
              {leadWords.map((word, index) => (
                <Fragment key={word}>
                  <span className="hero-mask inline-block">
                    <span
                      className="inline-block footer-lead"
                      style={tailRange(LEAD_FROM_PX + index * LEAD_STEP_PX)}
                    >
                      {word}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
              <span className="-m-1 inline-block overflow-clip p-1">
                <a
                  href={`mailto:${FOOTER.email}`}
                  className={cn(quietLinkClassName, "inline-block footer-link")}
                  style={tailRange(
                    LEAD_FROM_PX + leadWords.length * LEAD_STEP_PX
                  )}
                >
                  {FOOTER.email}
                </a>
              </span>
            </p>
          </div>
          <ul className="flex flex-col items-start gap-4 md:flex-row md:gap-8">
            {FOOTER.socials.map((social, index) => (
              <li key={social.label} className="-m-1 overflow-clip p-1">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "link", size: "link" }),
                    "text-smoke footer-link"
                  )}
                  style={tailRange(SOCIAL_FROM_PX + index * SOCIAL_STEP_PX)}
                >
                  {social.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <IconArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <SiteFooterBar className="mt-12 md:mt-20 xl:mt-24" />
      </div>
    </footer>
  )
}
