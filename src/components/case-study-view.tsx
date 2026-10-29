import Link from "next/link"

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

function BandHeader({ heading, intro }: { heading: string; intro: string }) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <h2 className="font-heading text-display-l md:text-display-xl">
        {heading}
      </h2>
      <p className="text-body-base xl:w-85">{intro}</p>
    </div>
  )
}

function Change({ change }: { change: CaseStudyChange }) {
  return (
    <article className="flex flex-col gap-6 border-t border-graphite py-10 xl:flex-row xl:gap-10">
      <div className="flex flex-col gap-4 xl:w-110 xl:shrink-0">
        <h3 className="font-heading text-heading-h2 text-balance">
          {change.title}
        </h3>
        <p className="text-body-base">{change.body}</p>
      </div>
      <Shot image={change.phoneScreen} sizes="100vw" className="md:hidden" />
      <Shot
        image={change.screen}
        sizes="(min-width: 1440px) 880px, (min-width: 1280px) 62vw, 100vw"
        className="hidden md:block xl:min-w-0 xl:flex-1"
      />
    </article>
  )
}

function NextBand({ next }: { next: CaseStudyNext | undefined }) {
  let heading = null
  let nextLink = null
  if (next !== undefined) {
    heading = (
      <h2 className="font-heading text-heading-h1 text-balance text-paper">
        {next.heading}
      </h2>
    )
    nextLink = (
      <Link href={next.link.href} className={linkClassName}>
        {next.link.label}
      </Link>
    )
  }

  return (
    <section className="border-t border-graphite bg-black">
      <div
        className={cn(
          containerClassName,
          "flex flex-col gap-6 py-20 xl:flex-row xl:items-center xl:justify-between"
        )}
      >
        {heading}
        <div className="flex gap-6">
          {nextLink}
          <Link href={ALL_WORK_LINK.href} className={linkClassName}>
            {ALL_WORK_LINK.label}
          </Link>
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
              {study.title}
            </h1>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <p className="text-body-large text-paper xl:max-w-160">
                {study.sub}
              </p>
              <p className="text-label text-smoke uppercase xl:w-115">
                {study.meta}
              </p>
            </div>
          </div>
          <Shot
            image={study.image}
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="mt-20"
          />
        </div>
      </header>

      <section className="bg-black">
        <div
          className={cn(
            containerClassName,
            "py-20 text-paper md:py-24 xl:flex xl:justify-between xl:py-30"
          )}
        >
          <h2 className="font-heading text-heading-h1 text-balance xl:w-140">
            {study.business.heading}
          </h2>
          <div className="mt-6 flex flex-col gap-6 text-body-base xl:mt-0 xl:w-160">
            {study.business.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
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
            {study.before.shots.map((shot) => (
              <figure
                key={shot.image.src}
                className="flex flex-col gap-4 xl:flex-1"
              >
                <Shot
                  image={shot.image}
                  sizes="(min-width: 1440px) 660px, (min-width: 1280px) 46vw, 100vw"
                />
                <figcaption className="text-body-base">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-col gap-6 xl:flex-row xl:gap-10">
            {study.before.notes.map((note) => (
              <article
                key={note.title}
                className="flex flex-col gap-4 border-t border-graphite pt-6 xl:flex-1"
              >
                <h3 className="font-heading text-heading-h2 text-balance">
                  {note.title}
                </h3>
                <p className="text-body-base">{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black">
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

      <section className="bg-black">
        <div
          className={cn(
            containerClassName,
            "py-20 text-paper md:py-24 xl:flex xl:justify-between xl:py-30"
          )}
        >
          <div className="flex flex-col gap-6 xl:w-140">
            <h2 className="font-heading text-heading-h1 text-balance">
              {study.measure.heading}
            </h2>
            <p className="text-body-base">{study.measure.intro}</p>
          </div>
          <ul className="mt-10 xl:mt-0 xl:w-160">
            {study.measure.items.map((item) => (
              <li
                key={item}
                className="border-t border-graphite py-6 font-heading text-heading-h2"
              >
                {item}
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
