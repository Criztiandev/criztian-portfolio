import Link from "next/link"
import type { ReactNode } from "react"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowUpRight } from "@/components/icons"
import { Shot } from "@/components/shot"
import { buttonVariants } from "@/components/ui/button"
import { WORK } from "@/data/home.data"
import { cn } from "@/lib/utils"
import type { WorkRow, WorkScreens } from "@/type/home.type"

function WorkLink({
  href,
  className,
  duplicate,
  children,
}: {
  href: string
  className: string
  duplicate?: boolean
  children: ReactNode
}) {
  let duplicateProps = {}
  if (duplicate === true) {
    duplicateProps = { tabIndex: -1, "aria-hidden": true }
  }
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...duplicateProps}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...duplicateProps}>
      {children}
    </Link>
  )
}

function Screens({
  screens,
  href,
  className,
}: {
  screens: WorkScreens
  href?: string
  className: string
}) {
  const rootClassName = cn("flex-col gap-4 md:flex-row", className)
  const shots = (
    <>
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
    </>
  )

  if (href === undefined) {
    return <div className={rootClassName}>{shots}</div>
  }
  return (
    <WorkLink href={href} duplicate className={rootClassName}>
      {shots}
    </WorkLink>
  )
}

function Row({ row, active }: { row: WorkRow; active: boolean }) {
  let nameClassName = "text-paper"
  let detailClassName = ""
  if (!active) {
    nameClassName = "text-paper xl:text-smoke"
    detailClassName = "xl:hidden"
  }

  let href: string | undefined
  if (row.link !== undefined) {
    href = row.link.href
  }

  let name: ReactNode = row.name
  if (href !== undefined) {
    name = (
      <WorkLink
        href={href}
        className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-paper"
      >
        {row.name}
      </WorkLink>
    )
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
    let icon = null
    if (row.link.href.startsWith("http")) {
      icon = <IconArrowUpRight />
    }
    link = (
      <WorkLink
        href={row.link.href}
        className={cn(
          buttonVariants({ variant: "link", size: "link" }),
          "self-start",
          detailClassName
        )}
      >
        {row.link.label}
        {icon}
      </WorkLink>
    )
  }

  let screens = null
  if (row.screens !== undefined) {
    screens = (
      <Screens
        screens={row.screens}
        href={href}
        className="mt-6 flex xl:hidden"
      />
    )
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
          {name}
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
          href={WORK.stageHref}
          className="hidden xl:col-span-2 xl:flex"
        />
      </div>
    </section>
  )
}
