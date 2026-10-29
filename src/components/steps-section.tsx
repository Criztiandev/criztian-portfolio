import { Fragment } from "react"

import { STEPS } from "@/data/home.data"

const WORD_FROM_PX = 180
const WORD_STEP_PX = 40
const WORD_PX = 150

function headingWords(heading: string) {
  return heading.split(" ").map((word, index) => {
    const start = WORD_FROM_PX + index * WORD_STEP_PX
    return (
      <Fragment key={index}>
        {" "}
        <span className="hero-mask inline-block">
          <span
            className="inline-block steps-word"
            style={{
              animationRange: `cover ${start}px cover ${start + WORD_PX}px`,
            }}
          >
            {word}
          </span>
        </span>
      </Fragment>
    )
  })
}

export function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-black steps-timeline xl:scroll-mt-20"
    >
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:px-10 xl:py-30">
        <h2 className="font-heading text-heading-h1 text-paper md:text-display-l">
          {headingWords(STEPS.heading)}
        </h2>
        <ol className="mt-12 flex flex-col xl:mt-16 xl:grid xl:grid-cols-3 xl:gap-10">
          {STEPS.steps.map((step, index) => (
            <li
              key={step.number}
              data-step={index + 1}
              className="relative border-t border-graphite steps-step"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-px h-px bg-smoke steps-line"
              />
              <div className="flex flex-col gap-3 overflow-clip py-8 md:flex-row md:gap-8 xl:flex-col xl:gap-4 xl:pb-0">
                <p
                  aria-hidden="true"
                  className="font-heading text-heading-h1 text-smoke steps-rise steps-number md:w-24 md:shrink-0 md:text-display-l xl:w-auto"
                >
                  {step.number}
                </p>
                <div className="flex flex-col gap-3 xl:gap-4">
                  <h3 className="font-heading text-heading-h2 text-paper steps-rise steps-title">
                    {step.title}
                  </h3>
                  <p className="text-body-base text-paper steps-rise steps-body">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
