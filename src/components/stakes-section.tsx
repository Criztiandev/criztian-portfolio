import { Fragment } from "react"

import type { Home } from "@/type/home.type"

const INK_FROM_PX = 250
const INK_TO_PX = 660
const WORD_INK_PX = 150
const TEXT_FROM_PX = 600
const TEXT_TO_PX = 800

function inkStep(wordCount: number) {
  if (wordCount < 2) {
    return 0
  }
  return (INK_TO_PX - INK_FROM_PX - WORD_INK_PX) / (wordCount - 1)
}

function scrollRange(fromPx: number, toPx: number): React.CSSProperties {
  return { animationRange: `cover ${fromPx}px cover ${toPx}px` }
}

function inkWords(heading: string) {
  const words = heading.split(" ")
  const step = inkStep(words.length)
  return words.map((word, index) => {
    const start = INK_FROM_PX + index * step
    return (
      <Fragment key={index}>
        {" "}
        <span
          className="stakes-ink"
          style={scrollRange(start, start + WORD_INK_PX)}
        >
          {word}
        </span>
      </Fragment>
    )
  })
}

export function StakesSection({ home }: { home: Home }) {
  return (
    <section
      data-cms-card="Stakes"
      className="bg-paper text-black stakes-timeline"
    >
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 py-20 md:px-8 md:py-24 xl:flex-row xl:items-end xl:justify-between xl:px-10 xl:py-30">
        <h2
          data-cms-field="stakesHeading"
          className="font-heading text-heading-h1 md:text-display-l xl:w-215"
        >
          {inkWords(home.stakesHeading)}
        </h2>
        <p
          data-cms-field="stakesText"
          className="text-body-large stakes-rise md:w-140 xl:w-85"
          style={scrollRange(TEXT_FROM_PX, TEXT_TO_PX)}
        >
          {home.stakesText}
        </p>
      </div>
    </section>
  )
}
