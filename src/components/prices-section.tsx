import { BookCallLink } from "@/components/book-call-link"
import { PRICES } from "@/data/home.data"

const RISE_PX = 150
const COPY_PX = 200
const HEADING_FROM_PX = 180
const HEADING_STEP_PX = 40
const NOTE_FROM_PX = 100
const NOTE_STEP_PX = 100
const NAME_AT = 0.05
const SUMMARY_AT = 0.4
const ROW_AT = 0.47
const ROW_STEP = 0.08
const PRICE_AT = 0.83

function scrollRange(startPx: number, lengthPx: number): React.CSSProperties {
  return {
    animationRange: `cover ${startPx}px cover ${startPx + lengthPx}px`,
  }
}

function afterOpen(share: number): React.CSSProperties {
  const start = `calc(var(--prices-from) + var(--prices-open) * ${share})`
  return {
    animationRange: `cover ${start} cover calc(${start} + ${RISE_PX}px)`,
  }
}

function headingLetters(heading: string) {
  return Array.from(heading).map((letter, index) => (
    <span
      key={index}
      className="inline-block prices-rise"
      style={scrollRange(HEADING_FROM_PX + index * HEADING_STEP_PX, RISE_PX)}
    >
      {letter}
    </span>
  ))
}

export function PricesSection() {
  return (
    <section
      id="prices"
      className="scroll-mt-16 bg-black prices-timeline xl:scroll-mt-20"
    >
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:px-10 xl:py-30">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <h2
            aria-label={PRICES.heading}
            className="font-heading text-display-l text-paper md:text-display-xl"
          >
            <span aria-hidden="true" className="hero-mask inline-block">
              {headingLetters(PRICES.heading)}
            </span>
          </h2>
          <p className="text-body-base text-smoke prices-sub xl:w-85">
            {PRICES.sub}
          </p>
        </div>
        <ul className="mt-12 flex flex-col gap-4 xl:mt-16 xl:grid xl:grid-cols-3">
          {PRICES.packages.map((pricePackage, index) => (
            <li
              key={pricePackage.name}
              data-card={index + 1}
              className="flex flex-col gap-6 border border-graphite p-6 prices-card md:p-10 xl:gap-8"
            >
              <h3
                className="font-heading text-heading-h2 text-paper prices-light"
                style={afterOpen(NAME_AT)}
              >
                {pricePackage.name}
              </h3>
              <p className="flex items-baseline gap-3">
                <span
                  className="text-body-base text-smoke prices-light"
                  style={afterOpen(PRICE_AT)}
                >
                  {PRICES.from}
                </span>
                <span className="hero-mask inline-block font-heading text-heading-h1 text-paper md:text-display-l">
                  <span
                    className="inline-block prices-price"
                    style={afterOpen(PRICE_AT)}
                  >
                    {pricePackage.price}
                  </span>
                </span>
              </p>
              <p
                className="text-body-base text-paper prices-light"
                style={afterOpen(SUMMARY_AT)}
              >
                {pricePackage.summary}
              </p>
              <ul>
                {pricePackage.includes.map((item, itemIndex) => (
                  <li
                    key={item}
                    className="border-t border-graphite py-3 text-body-base text-paper prices-light"
                    style={afterOpen(ROW_AT + itemIndex * ROW_STEP)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col gap-6 prices-tail-timeline xl:mt-16 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-6 text-body-base xl:w-160 xl:gap-2">
            <p
              className="text-paper prices-note"
              style={scrollRange(NOTE_FROM_PX, COPY_PX)}
            >
              {PRICES.note}
            </p>
            {PRICES.smallNotes.map((note, index) => (
              <p
                key={note}
                className="text-smoke prices-note"
                style={scrollRange(
                  NOTE_FROM_PX + (index + 1) * NOTE_STEP_PX,
                  COPY_PX
                )}
              >
                {note}
              </p>
            ))}
          </div>
          <div className="-m-1 overflow-clip p-1">
            <BookCallLink className="w-full prices-call xl:w-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
