import Link from "next/link"
import { Fragment } from "react"

import {
  PostMeta,
  lineDelay,
  postLinkClassName,
} from "@/components/blog-list-view"
import { PostSummary } from "@/components/post-body"
import { buttonVariants } from "@/components/ui/button"
import { ALL_POSTS_LINK, BLOG, LATEST_POST_COUNT } from "@/data/blog.data"
import { cn } from "@/lib/utils"
import type { Post } from "@/type/post.type"

const RISE_PX = 150
const COPY_PX = 200
const HEADING_FROM_PX = 180
const HEADING_STEP_PX = 40
const LETTER_FROM_PX = 120
const LETTER_STEP_PX = 6
const SUMMARY_AFTER_PX = 60

function scrollRange(startPx: number, lengthPx: number): React.CSSProperties {
  return {
    animationRange: `cover ${startPx}px cover ${startPx + lengthPx}px`,
  }
}

function headingLetters(title: string) {
  return Array.from(title).map((letter, index) => (
    <span
      key={index}
      className="inline-block blog-rise"
      style={scrollRange(HEADING_FROM_PX + index * HEADING_STEP_PX, RISE_PX)}
    >
      {letter}
    </span>
  ))
}

function titleLetters(title: string) {
  const words: React.ReactNode[] = []
  let letterCount = 0
  const titleWords = title.split(" ")
  titleWords.forEach((word, wordIndex) => {
    const wordFromPx = LETTER_FROM_PX + letterCount * LETTER_STEP_PX
    const letters = Array.from(word).map((letter, index) => (
      <span
        key={index}
        className="inline-block blog-letter"
        style={scrollRange(wordFromPx + index * LETTER_STEP_PX, RISE_PX)}
      >
        {letter}
      </span>
    ))
    letterCount += letters.length
    words.push(
      <Fragment key={wordIndex}>
        {" "}
        <span
          className="link-line inline-block"
          style={lineDelay(wordIndex, titleWords.length)}
        >
          <span className="inline-block hero-mask">
            <span
              className="inline-block blog-word"
              style={scrollRange(wordFromPx, RISE_PX)}
            >
              {letters}
            </span>
          </span>
        </span>
      </Fragment>
    )
  })
  return { words, letterCount }
}

function HomePostRow({ post }: { post: Post }) {
  const { words, letterCount } = titleLetters(post.title)
  const metaFromPx = LETTER_FROM_PX + letterCount * LETTER_STEP_PX

  return (
    <li className="group relative flex blog-row flex-col gap-4 border-t border-graphite py-10 xl:flex-row xl:justify-between">
      <div className="flex flex-col gap-3 xl:w-190">
        <h3 className="font-heading text-heading-h2 text-balance">
          <Link href={`/blog/${post.slug}`} className={postLinkClassName}>
            <span className="sr-only">{post.title}</span>
            <span aria-hidden="true">{words}</span>
          </Link>
        </h3>
        <div className="blog-copy" style={scrollRange(metaFromPx, COPY_PX)}>
          <PostMeta post={post} />
        </div>
      </div>
      <div
        className="text-body-base blog-copy xl:w-85"
        style={scrollRange(metaFromPx + SUMMARY_AFTER_PX, COPY_PX)}
      >
        <PostSummary summary={post.summary} />
      </div>
    </li>
  )
}

export function HomeBlogSection({ posts }: { posts: Post[] }) {
  if (posts.length < LATEST_POST_COUNT) {
    return null
  }
  const latestPosts = posts.slice(0, LATEST_POST_COUNT)

  return (
    <section className="bg-black text-paper blog-timeline">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-4 py-20 md:px-8 md:py-24 xl:gap-16 xl:px-10 xl:py-30">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <h2
            aria-label={BLOG.title}
            className="font-heading text-heading-h1 md:text-display-l"
          >
            <span aria-hidden="true" className="inline-block hero-mask">
              {headingLetters(BLOG.title)}
            </span>
          </h2>
          <p className="text-body-base blog-intro xl:w-85">{BLOG.intro}</p>
        </div>
        <ul>
          {latestPosts.map((post) => (
            <HomePostRow key={post.slug} post={post} />
          ))}
        </ul>
        <div className="-m-1 self-start overflow-clip p-1 blog-link-timeline">
          <Link
            href={ALL_POSTS_LINK.href}
            className={cn(
              buttonVariants({ variant: "link", size: "link" }),
              "blog-link"
            )}
          >
            {ALL_POSTS_LINK.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
