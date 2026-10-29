import { STEPS } from "@/data/home.data"

export function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-black xl:scroll-mt-20"
    >
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:px-10 xl:py-30">
        <h2 className="font-heading text-heading-h1 text-paper md:text-display-l">
          {STEPS.heading}
        </h2>
        <ol className="mt-12 flex flex-col xl:mt-16 xl:grid xl:grid-cols-3 xl:gap-10">
          {STEPS.steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-3 border-t border-graphite py-8 md:flex-row md:gap-8 xl:flex-col xl:gap-4 xl:pb-0"
            >
              <p
                aria-hidden="true"
                className="font-heading text-heading-h1 text-smoke md:w-24 md:shrink-0 md:text-display-l xl:w-auto"
              >
                {step.number}
              </p>
              <div className="flex flex-col gap-3 xl:gap-4">
                <h3 className="font-heading text-heading-h2 text-paper">
                  {step.title}
                </h3>
                <p className="text-body-base text-paper">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
