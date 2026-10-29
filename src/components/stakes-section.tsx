import type { Home } from "@/type/home.type"

export function StakesSection({ home }: { home: Home }) {
  return (
    <section data-cms-card="Stakes" className="bg-paper text-black">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 py-20 md:px-8 md:py-24 xl:flex-row xl:items-end xl:justify-between xl:px-10 xl:py-30">
        <h2
          data-cms-field="stakesHeading"
          className="font-heading text-heading-h1 md:text-display-l xl:w-215"
        >
          {home.stakesHeading}
        </h2>
        <p
          data-cms-field="stakesText"
          className="text-body-large md:w-140 xl:w-85"
        >
          {home.stakesText}
        </p>
      </div>
    </section>
  )
}
