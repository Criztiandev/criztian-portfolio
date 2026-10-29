import { BookCallLink } from "@/components/book-call-link"
import { PRICES } from "@/data/home.data"

export function PricesSection() {
  return (
    <section id="prices" className="scroll-mt-16 bg-black xl:scroll-mt-20">
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:px-10 xl:py-30">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="font-heading text-display-l text-paper md:text-display-xl">
            {PRICES.heading}
          </h2>
          <p className="text-body-base text-smoke xl:w-85">{PRICES.sub}</p>
        </div>
        <ul className="mt-12 flex flex-col gap-4 xl:mt-16 xl:grid xl:grid-cols-3">
          {PRICES.packages.map((pricePackage) => (
            <li
              key={pricePackage.name}
              className="flex flex-col gap-6 border border-graphite p-6 md:p-10 xl:gap-8"
            >
              <h3 className="font-heading text-heading-h2 text-paper">
                {pricePackage.name}
              </h3>
              <p className="flex items-baseline gap-3">
                <span className="text-body-base text-smoke">{PRICES.from}</span>
                <span className="font-heading text-heading-h1 text-paper md:text-display-l">
                  {pricePackage.price}
                </span>
              </p>
              <p className="text-body-base text-paper">
                {pricePackage.summary}
              </p>
              <ul>
                {pricePackage.includes.map((item) => (
                  <li
                    key={item}
                    className="border-t border-graphite py-3 text-body-base text-paper"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col gap-6 xl:mt-16 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-6 text-body-base xl:w-160 xl:gap-2">
            <p className="text-paper">{PRICES.note}</p>
            {PRICES.smallNotes.map((note) => (
              <p key={note} className="text-smoke">
                {note}
              </p>
            ))}
          </div>
          <BookCallLink className="w-full md:w-auto" />
        </div>
      </div>
    </section>
  )
}
