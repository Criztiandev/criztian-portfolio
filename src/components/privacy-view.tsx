import { Fragment, type ReactNode } from "react"

import { SiteFooterBar } from "@/components/site-footer-bar"
import { FOOTER } from "@/data/home.data"
import { PRIVACY } from "@/data/privacy.data"

const TITLE_FROM_MS = 200
const TITLE_STEP_MS = 90
const DATE_MS = 900
const COLUMN_MS = 1100

const WORD_FROM_PX = 30
const WORD_STEP_PX = 20
const RISE_PX = 150

function loadDelay(delayMs: number): React.CSSProperties {
  return { animationDelay: `${delayMs}ms` }
}

function titleLetters(title: string) {
  return Array.from(title).map((letter, index) => (
    <span
      key={index}
      className="inline-block motion-safe:animate-case-title-word"
      style={loadDelay(TITLE_FROM_MS + index * TITLE_STEP_MS)}
    >
      {letter}
    </span>
  ))
}

function headingWords(heading: string) {
  return heading.split(" ").map((word, index) => {
    const fromPx = WORD_FROM_PX + index * WORD_STEP_PX
    return (
      <Fragment key={index}>
        {" "}
        <span className="inline-block hero-mask">
          <span
            className="inline-block privacy-word"
            style={{
              animationRange: `cover ${fromPx}px cover ${fromPx + RISE_PX}px`,
            }}
          >
            {word}
          </span>
        </span>
      </Fragment>
    )
  })
}

function BodyWithEmailLink({ body }: { body: string }) {
  const nodes: ReactNode[] = []
  for (const [index, part] of body.split(FOOTER.email).entries()) {
    if (index > 0) {
      nodes.push(
        <a
          key={`email-${index}`}
          href={`mailto:${FOOTER.email}`}
          className="underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-paper"
        >
          {FOOTER.email}
        </a>
      )
    }
    nodes.push(part)
  }
  return nodes
}

export function PrivacyView() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-page px-4 pt-16 pb-6 md:px-8 md:pt-24 md:pb-8 xl:px-10 xl:pt-30 xl:pb-10">
        <header className="flex flex-col gap-4">
          <h1
            aria-label={PRIVACY.title}
            className="font-heading text-heading-h1 text-paper md:text-display-l"
          >
            <span aria-hidden="true" className="inline-block hero-mask">
              {titleLetters(PRIVACY.title)}
            </span>
          </h1>
          <p
            className="text-body-small text-smoke motion-safe:animate-hero-copy-up"
            style={loadDelay(DATE_MS)}
          >
            {PRIVACY.lastUpdated}
          </p>
        </header>
        <div
          className="mt-16 flex max-w-180 flex-col gap-12 motion-safe:animate-post-column md:mt-24 md:gap-16"
          style={loadDelay(COLUMN_MS)}
        >
          {PRIVACY.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-4 border-t border-graphite pt-6 text-paper privacy-section"
            >
              <h2 className="font-heading text-heading-h2">
                {headingWords(section.heading)}
              </h2>
              <p className="text-body-base privacy-light">
                <BodyWithEmailLink body={section.body} />
              </p>
            </section>
          ))}
        </div>
        <SiteFooterBar className="mt-16 md:mt-24" />
      </div>
    </div>
  )
}
