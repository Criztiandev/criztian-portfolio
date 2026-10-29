import Image from "next/image"
import { Fragment } from "react"

import { PostBody, PostSummary } from "@/components/post-body"
import { BLOG } from "@/data/blog.data"
import { markdownToText } from "@/lib/react-markdown"
import { cn } from "@/lib/utils"
import type { Post } from "@/type/post.type"
import { formatPostDate, readingMinutes } from "@/util/post.util"

const containerClassName = "mx-auto max-w-page px-4 md:px-8 xl:px-10"

const TITLE_FROM_MS = 200
const TITLE_STEP_MS = 90
const RAIL_MS = 900
const LEAD_MS = 1000
const COLUMN_MS = 1100

const NOTE_LIGHT_FROM_PX = 80
const NOTE_LIGHT_PX = 150

function loadDelay(delayMs: number): React.CSSProperties {
  return { animationDelay: `${delayMs}ms` }
}

function titleWords(title: string) {
  return title.split(" ").map((word, index) => (
    <Fragment key={index}>
      {" "}
      <span className="inline-block hero-mask">
        <span
          className="inline-block motion-safe:animate-case-title-word"
          style={loadDelay(TITLE_FROM_MS + index * TITLE_STEP_MS)}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ))
}

export function PostView({ post }: { post: Post }) {
  return (
    <article
      data-cms-card="Content"
      data-cms-field="body"
      className="bg-black text-paper"
    >
      <header
        className={cn(
          containerClassName,
          "pt-8 pb-20 md:pt-14 md:pb-24 xl:pt-20 xl:pb-20"
        )}
      >
        <h1
          data-cms-field="title"
          className="font-heading text-heading-h1 text-balance md:text-display-l xl:w-275"
        >
          {titleWords(post.title)}
        </h1>
      </header>
      <div className="border-t border-graphite">
        <div
          className={cn(
            containerClassName,
            "flex flex-col gap-6 pt-10 pb-20 md:pb-24 xl:flex-row xl:gap-10 xl:pb-30"
          )}
        >
          <div
            className="flex flex-wrap gap-x-4 self-start text-body-base text-smoke motion-safe:animate-blog-open xl:w-80 xl:shrink-0 xl:flex-col xl:gap-2"
            style={loadDelay(RAIL_MS)}
          >
            <time dateTime={post.publishDate} data-cms-field="publishDate">
              {formatPostDate(post.publishDate)}
            </time>
            <span>
              {readingMinutes(markdownToText(post.body))} {BLOG.minRead}
            </span>
            <span>{BLOG.byline}</span>
          </div>
          <div className="flex min-w-0 flex-col gap-6 text-body-base xl:w-180">
            <div
              data-cms-field="summary"
              className="text-body-large motion-safe:animate-blog-open"
              style={loadDelay(LEAD_MS)}
            >
              <PostSummary summary={post.summary} />
            </div>
            <div
              className="flex flex-col gap-6 post-blocks motion-safe:animate-post-column"
              style={loadDelay(COLUMN_MS)}
            >
              <PostBody body={post.body} />
              <div className="flex gap-6 border-t border-graphite pt-10 post-timeline">
                <div className="relative h-25 w-20 shrink-0 post-photo">
                  <Image
                    src={BLOG.authorPhotoSrc}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <p
                  className="flex-1 post-light"
                  style={{
                    animationRange: `cover ${NOTE_LIGHT_FROM_PX}px cover ${NOTE_LIGHT_FROM_PX + NOTE_LIGHT_PX}px`,
                  }}
                >
                  {BLOG.authorNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
