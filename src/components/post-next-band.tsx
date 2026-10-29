import Link from "next/link"
import { Fragment } from "react"

import { buttonVariants } from "@/components/ui/button"
import { ALL_POSTS_LINK, BLOG } from "@/data/blog.data"
import { cn } from "@/lib/utils"
import type { Post } from "@/type/post.type"

const linkClassName = cn(
  buttonVariants({ variant: "link", size: "link" }),
  "post-link"
)

const RISE_PX = 150
const HEADING_FROM_PX = 180
const HEADING_STEP_PX = 40
const LINK_FROM_PX = 120
const LINK_AFTER_HEADING_PX = 120
const LINK_STEP_PX = 40

function riseRange(startPx: number): React.CSSProperties {
  return { animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px` }
}

function headingWords(title: string) {
  return title.split(" ").map((word, index) => (
    <Fragment key={index}>
      {" "}
      <span className="inline-block hero-mask">
        <span
          className="inline-block post-rise"
          style={riseRange(HEADING_FROM_PX + index * HEADING_STEP_PX)}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ))
}

export function PostNextBand({ next }: { next: Post | null }) {
  let heading = null
  let nextLink = null
  let linkFromPx = LINK_FROM_PX
  if (next !== null) {
    const wordCount = next.title.split(" ").length
    linkFromPx =
      HEADING_FROM_PX + wordCount * HEADING_STEP_PX + LINK_AFTER_HEADING_PX
    heading = (
      <h2 className="font-heading text-heading-h1 text-balance text-paper xl:w-225">
        {headingWords(next.title)}
      </h2>
    )
    nextLink = (
      <div className="-m-1 flex overflow-clip p-1">
        <Link
          href={`/blog/${next.slug}`}
          className={linkClassName}
          style={riseRange(linkFromPx)}
        >
          {BLOG.readNextPost}
        </Link>
      </div>
    )
    linkFromPx += LINK_STEP_PX
  }

  return (
    <section className="border-t border-graphite bg-black post-timeline">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-4 py-20 md:px-8 md:py-24 xl:flex-row xl:items-center xl:justify-between xl:px-10 xl:py-20">
        {heading}
        <div className="flex gap-6 xl:shrink-0">
          {nextLink}
          <div className="-m-1 flex overflow-clip p-1">
            <Link
              href={ALL_POSTS_LINK.href}
              className={linkClassName}
              style={riseRange(linkFromPx)}
            >
              {ALL_POSTS_LINK.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
