import Link from "next/link"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowUpRight } from "@/components/icons"
import { Shot } from "@/components/shot"
import { buttonVariants } from "@/components/ui/button"
import { WORK } from "@/data/home.data"
import { cn } from "@/lib/utils"
import type { WorkRow, WorkScreens } from "@/type/home.type"

function Screens({
  screens,
  className,
}: {
  screens: WorkScreens
  className: string
}) {
  return (
    <div className={cn("flex-col gap-4 md:flex-row", className)}>
      <div className="flex flex-col gap-4 md:w-3/5">
        <Shot
          image={screens.desktop}
          sizes="(min-width: 1280px) 536px, (min-width: 768px) 60vw, 100vw"
          className="aspect-16/10"
        />
        <Shot
          image={screens.detail}
          sizes="(min-width: 1280px) 536px, 60vw"
          className="hidden aspect-4/3 md:block"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-1">
        <Shot
          image={screens.phone}
          sizes="(min-width: 1280px) 342px, (min-width: 768px) 40vw, 50vw"
          className="aspect-6/13 md:aspect-auto md:flex-1"
        />
        <Shot
          image={screens.phoneDetail}
          sizes="50vw"
          className="aspect-6/13 md:hidden"
        />
      </div>
    </div>
  )
}

function Row({ row, active }: { row: WorkRow; active: boolean }) {
  let nameClassName = "text-paper"
  let detailClassName = ""
  if (!active) {
    nameClassName = "text-paper xl:text-smoke"
    detailClassName = "xl:hidden"
  }

  let tag = null
  if (row.tag !== undefined) {
    tag = (
      <p className={cn("text-label text-smoke uppercase", detailClassName)}>
        {row.tag}
      </p>
    )
  }

  let link = null
  if (row.link !== undefined) {
    const linkClassName = cn(
      buttonVariants({ variant: "link", size: "link" }),
      "self-start",
      detailClassName
    )
    if (row.link.href.startsWith("http")) {
      link = (
        <a
          href={row.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {row.link.label}
          <span className="sr-only"> (opens in a new tab)</span>
          <IconArrowUpRight />
        </a>
      )
    } else {
      link = (
        <Link href={row.link.href} className={linkClassName}>
          {row.link.label}
        </Link>
      )
    }
  }

  let screens = null
  if (row.screens !== undefined) {
    screens = <Screens screens={row.screens} className="mt-6 flex xl:hidden" />
  }

  let bookCall = null
  if (row.bookCall === true) {
    bookCall = (
      <BookCallLink className={cn("mt-6 w-full md:w-auto", detailClassName)} />
    )
  }

  return (
    <article className="border-t border-graphite pt-8 xl:py-6">
      <div className="flex flex-col gap-3">
        <h3 className={cn("font-heading text-heading-h2", nameClassName)}>
          {row.name}
        </h3>
        <p className="text-label text-smoke uppercase">{row.meta}</p>
        <p className={cn("text-body-base text-paper", detailClassName)}>
          {row.line}
        </p>
        {tag}
        {link}
      </div>
      {screens}
      {bookCall}
    </article>
  )
}

export function WorkSection() {
  return (
    <section id="work" className="scroll-mt-16 bg-black xl:scroll-mt-20">
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:grid xl:grid-cols-3 xl:gap-10 xl:px-10 xl:py-20">
        <div className="flex flex-col gap-16 xl:justify-between xl:gap-10">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-display-l text-paper md:text-display-xl">
              {WORK.heading}
            </h2>
            <p className="text-body-base text-smoke">{WORK.label}</p>
          </div>
          <div className="flex flex-col gap-16 xl:gap-0">
            {WORK.rows.map((row, index) => (
              <Row key={row.name} row={row} active={index === 0} />
            ))}
          </div>
        </div>
        <Screens
          screens={WORK.stage}
          className="hidden xl:col-span-2 xl:flex"
        />
      </div>
    </section>
  )
}
