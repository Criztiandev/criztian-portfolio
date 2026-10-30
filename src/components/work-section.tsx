import Link from "next/link"
import type { ReactNode } from "react"

import { BookCallLink } from "@/components/book-call-link"
import { IconArrowUpRight } from "@/components/icons"
import { Shot } from "@/components/shot"
import { buttonVariants } from "@/components/ui/button"
import { WORK } from "@/data/home.data"
import { cn } from "@/lib/utils"
import type { HomeImage, WorkRow, WorkScreens } from "@/type/home.type"

const LETTER_FROM_PX = 120
const LETTER_STEP_PX = 40
const LETTER_PX = 200

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

function RiseShot({
  image,
  sizes,
  className,
}: {
  image: HomeImage
  sizes: string
  className: string
}) {
  return (
    <div className={cn("overflow-clip work-rise", className)}>
      <Shot image={image} sizes={sizes} className="size-full work-rise-shot" />
    </div>
  )
}

function Screens({ screens, href }: { screens: WorkScreens; href?: string }) {
  const className = "mt-6 flex flex-col gap-4 md:flex-row work-hold:hidden"
  const shots = (
    <>
      <div className="flex flex-col gap-4 md:w-3/5">
        <RiseShot
          image={screens.desktop}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="aspect-16/10"
        />
        <RiseShot
          image={screens.detail}
          sizes="60vw"
          className="hidden aspect-4/3 md:block"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-1">
        <RiseShot
          image={screens.phone}
          sizes="(min-width: 768px) 40vw, 50vw"
          className="aspect-6/13 md:aspect-auto md:flex-1"
        />
        <RiseShot
          image={screens.phoneDetail}
          sizes="50vw"
          className="aspect-6/13 md:hidden"
        />
      </div>
    </>
  )

  if (href === undefined) {
    return <div className={className}>{shots}</div>
  }
  return (
    <WorkLink href={href} duplicate className={className}>
      {shots}
    </WorkLink>
  )
}

function StageShot({
  shot,
  children,
}: {
  shot: "desktop" | "detail" | "phone"
  children: ReactNode
}) {
  return (
    <div data-shot={shot} className="absolute work-shot overflow-clip">
      <div className="absolute inset-0 work-shot-inner">{children}</div>
    </div>
  )
}

function YourSiteFrame() {
  return (
    <div className="flex size-full items-center justify-center border border-dashed border-smoke work-draw">
      <p className="text-body-small text-smoke">{WORK.yourSite}</p>
    </div>
  )
}

function StageSet({ row, set }: { row: WorkRow; set: number }) {
  if (row.screens === undefined) {
    return (
      <div
        data-set={set}
        aria-hidden="true"
        className="absolute inset-0 work-set"
      >
        <StageShot shot="desktop">
          <YourSiteFrame />
        </StageShot>
        <StageShot shot="detail">
          <YourSiteFrame />
        </StageShot>
        <StageShot shot="phone">
          <YourSiteFrame />
        </StageShot>
      </div>
    )
  }

  const shots = (
    <>
      <StageShot shot="desktop">
        <Shot
          image={row.screens.desktop}
          sizes="(min-width: 1536px) 588px, 536px"
          className="size-full"
        />
      </StageShot>
      <StageShot shot="detail">
        <Shot
          image={row.screens.detail}
          sizes="(min-width: 1536px) 588px, 536px"
          className="size-full"
        />
      </StageShot>
      <StageShot shot="phone">
        <Shot
          image={row.screens.phone}
          sizes="(min-width: 1536px) 380px, 342px"
          className="size-full"
        />
      </StageShot>
    </>
  )

  let body = shots
  if (row.link !== undefined) {
    body = (
      <WorkLink
        href={row.link.href}
        duplicate
        className="absolute inset-0 block"
      >
        {shots}
      </WorkLink>
    )
  }
  return (
    <div data-set={set} className="absolute inset-0 work-set">
      {body}
    </div>
  )
}

function Row({ row, index }: { row: WorkRow; index: number }) {
  let href: string | undefined
  if (row.link !== undefined) {
    href = row.link.href
  }

  let name: ReactNode = row.name
  if (href !== undefined) {
    name = (
      <WorkLink
        href={href}
        className="link-line inline-block press outline-none link-line-below focus-visible:ring-2 focus-visible:ring-paper"
      >
        {row.name}
      </WorkLink>
    )
  }

  let tag = null
  if (row.tag !== undefined) {
    tag = <p className="text-label text-smoke uppercase">{row.tag}</p>
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
          "self-start"
        )}
      >
        {row.link.label}
        {icon}
      </WorkLink>
    )
  }

  let screens = null
  if (row.screens !== undefined) {
    screens = <Screens screens={row.screens} href={href} />
  }

  let bookCall = null
  if (row.bookCall === true) {
    bookCall = (
      <div className="mt-3 work-call">
        <BookCallLink className="w-full md:w-auto" />
      </div>
    )
  }

  return (
    <article
      data-row={index + 1}
      className="border-t border-graphite pt-8 work-row work-hold:relative work-hold:py-(--work-row-pad)"
    >
      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-heading-h2 text-paper work-row-name">
          {name}
        </h3>
        <p className="text-label text-smoke uppercase">{row.meta}</p>
      </div>
      <div className="work-row-detail mt-3 flex flex-col gap-3 work-hold:absolute work-hold:inset-x-0 work-hold:mt-0">
        <p className="max-w-180 text-body-base text-paper">{row.line}</p>
        {tag}
        {link}
        {bookCall}
      </div>
      {screens}
    </article>
  )
}

function headingLetters(heading: string) {
  return Array.from(heading).map((letter, index) => {
    const start = LETTER_FROM_PX + index * LETTER_STEP_PX
    return (
      <span
        key={index}
        className="inline-block work-letter"
        style={{
          animationRange: `entry ${start}px entry ${start + LETTER_PX}px`,
        }}
      >
        {letter}
      </span>
    )
  })
}

export function WorkSection() {
  return (
    <section
      id="work"
      className="work-track scroll-mt-16 bg-black xl:scroll-mt-20 work-hold:scroll-mt-0"
    >
      <div className="mx-auto max-w-page px-4 py-20 md:px-8 md:py-24 xl:px-10 work-hold:sticky work-hold:top-0 work-hold:grid work-hold:h-svh work-hold:grid-cols-3 work-hold:gap-x-10 work-hold:py-20 work-hold:2xl:grid-cols-[minmax(0,1fr)_61.5rem] work-hold:2xl:gap-x-0 work-hold-short:py-10">
        <div className="flex flex-col gap-16 work-hold:min-h-0 work-hold:justify-between work-hold:gap-0">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-display-l text-paper md:text-display-xl work-hold-short:text-display-l">
              <span className="inline-block hero-mask">
                {headingLetters(WORK.heading)}
              </span>
            </h2>
            <p className="max-w-180 text-body-base text-smoke work-label">
              {WORK.label}
            </p>
          </div>
          <div className="flex flex-col gap-16 work-hold:gap-0 work-hold:pb-(--work-detail)">
            {WORK.rows.map((row, index) => (
              <Row key={row.name} row={row} index={index} />
            ))}
          </div>
        </div>
        <div className="work-stage-area hidden work-hold:col-span-2 work-hold:flex work-hold:min-h-0 work-hold:items-start work-hold:justify-end work-hold:2xl:col-span-1">
          <div className="relative work-stage">
            {WORK.rows.map((row, index) => (
              <StageSet key={row.name} row={row} set={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
