import Link from "next/link"
import { Fragment } from "react"

import { BookCallLink } from "@/components/book-call-link"
import { buttonVariants } from "@/components/ui/button"
import { NOT_FOUND } from "@/data/not-found.data"
import { cn } from "@/lib/utils"

const DIGIT_FROM_MS = 200
const DIGIT_STEP_MS = 120
const DIGIT_LIGHT_AFTER_MS = 600
const WORD_FROM_MS = 1200
const WORD_LIGHT_MS = 1600
const HOME_RISE_MS = 1500
const HOME_LIGHT_MS = 1800
const CALL_RISE_MS = 1650
const CALL_LIGHT_MS = 2300
const WORD_DEEPEST_STEP = 4

function stairDelay(riseMs: number, lightMs: number): React.CSSProperties {
  return { animationDelay: `${riseMs}ms, ${lightMs}ms` }
}

function codeDigits() {
  return Array.from(NOT_FOUND.code).map((digit, index) => {
    const riseMs = DIGIT_FROM_MS + index * DIGIT_STEP_MS
    return (
      <span
        key={index}
        data-step={index + 1}
        className="inline-block not-found-depth not-found-digit"
        style={stairDelay(riseMs, riseMs + DIGIT_LIGHT_AFTER_MS)}
      >
        {digit}
      </span>
    )
  })
}

function messageWords() {
  return NOT_FOUND.message.split(" ").map((word, index) => (
    <Fragment key={index}>
      {" "}
      <span className="hero-mask inline-block">
        <span
          data-step={Math.min(index + 1, WORD_DEEPEST_STEP)}
          className="inline-block not-found-depth not-found-word"
          style={stairDelay(WORD_FROM_MS, WORD_LIGHT_MS)}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ))
}

export function NotFoundView() {
  return (
    <section className="bg-black">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-page flex-col justify-end gap-10 px-4 pt-10 pb-6 md:px-8 md:pb-8 xl:min-h-[calc(100svh-5rem)] xl:px-10 xl:pb-10">
        <p className="font-heading text-display-giant-phone text-paper md:text-display-giant-tablet xl:text-display-giant-desktop">
          <span className="sr-only">{NOT_FOUND.code}</span>
          <span aria-hidden="true" className="block hero-mask">
            {codeDigits()}
          </span>
        </p>
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <h1 className="font-heading text-heading-h2 text-paper md:text-heading-h1">
            {messageWords()}
          </h1>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <div className="-m-1 w-full overflow-clip p-1 md:w-auto">
              <div
                data-step={4}
                className="not-found-depth not-found-call"
                style={stairDelay(CALL_RISE_MS, CALL_LIGHT_MS)}
              >
                <BookCallLink className="w-full md:w-auto" />
              </div>
            </div>
            <div className="-m-1 overflow-clip p-1">
              <Link
                href={NOT_FOUND.home.href}
                data-step={3}
                className={cn(
                  buttonVariants({ variant: "link", size: "link" }),
                  "not-found-depth not-found-word"
                )}
                style={stairDelay(HOME_RISE_MS, HOME_LIGHT_MS)}
              >
                {NOT_FOUND.home.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
