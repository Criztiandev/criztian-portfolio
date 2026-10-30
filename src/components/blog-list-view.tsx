import Link from "next/link"

import { PostSummary } from "@/components/post-body"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { BLOG } from "@/data/blog.data"
import { markdownToText } from "@/lib/react-markdown"
import { cn } from "@/lib/utils"
import type { Post } from "@/type/post.type"
import { formatPostDate, readingMinutes } from "@/util/post.util"

const containerClassName = "mx-auto max-w-page px-4 md:px-8 xl:px-10"

const TITLE_FROM_MS = 200
const TITLE_STEP_MS = 90
const INTRO_MS = 900
const FEATURED_OPEN_MS = 500
const FEATURED_TITLE_LIGHT_MS = 500
const FEATURED_SUMMARY_LIGHT_MS = 750
const FEATURED_META_LIGHT_MS = 800
const FEATURED_LINK_LIGHT_MS = 1000

const RISE_PX = 150
const ROW_TITLE_LIGHT_PX = 160
const ROW_SUMMARY_LIGHT_PX = 180
const ROW_META_LIGHT_PX = 240

export const postLinkClassName =
  "outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-paper"

function loadDelay(delayMs: number): React.CSSProperties {
  return { animationDelay: `${delayMs}ms` }
}

function rowLightRange(startPx: number): React.CSSProperties {
  return { animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px` }
}

export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-body-base text-smoke">
      <time dateTime={post.publishDate}>
        {formatPostDate(post.publishDate)}
      </time>
      {" · "}
      {readingMinutes(markdownToText(post.body))} {BLOG.minRead}
    </p>
  )
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <li
      className="group relative flex blog-row flex-col gap-6 border-t border-graphite pt-10 pb-16 motion-safe:animate-blog-open"
      style={loadDelay(FEATURED_OPEN_MS)}
    >
      <h2
        className="font-heading text-heading-h1 text-balance motion-safe:animate-blog-light md:text-display-l xl:w-275"
        style={loadDelay(FEATURED_TITLE_LIGHT_MS)}
      >
        <Link
          href={`/blog/${post.slug}`}
          className={cn(postLinkClassName, "group-hover:underline")}
        >
          {post.title}
        </Link>
      </h2>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div
          className="text-body-large motion-safe:animate-blog-light xl:w-160"
          style={loadDelay(FEATURED_SUMMARY_LIGHT_MS)}
        >
          <PostSummary summary={post.summary} />
        </div>
        <div
          className="motion-safe:animate-blog-light xl:w-85"
          style={loadDelay(FEATURED_META_LIGHT_MS)}
        >
          <PostMeta post={post} />
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          buttonVariants({ variant: "link", size: "link" }),
          "self-start motion-safe:animate-blog-light"
        )}
        style={loadDelay(FEATURED_LINK_LIGHT_MS)}
      >
        {BLOG.readPost}
      </span>
    </li>
  )
}

export function PostRow({
  post,
  titleTag,
}: {
  post: Post
  titleTag: "h2" | "h3"
}) {
  const Title = titleTag
  return (
    <li className="group relative flex blog-row flex-col gap-4 border-t border-graphite py-10 blog-list-open xl:flex-row xl:justify-between">
      <div className="flex flex-col gap-3 xl:w-190">
        <Title
          className="font-heading text-heading-h2 text-balance blog-list-light"
          style={rowLightRange(ROW_TITLE_LIGHT_PX)}
        >
          <Link
            href={`/blog/${post.slug}`}
            className={cn(postLinkClassName, "group-hover:underline")}
          >
            {post.title}
          </Link>
        </Title>
        <div
          className="blog-list-light"
          style={rowLightRange(ROW_META_LIGHT_PX)}
        >
          <PostMeta post={post} />
        </div>
      </div>
      <div
        className="text-body-base blog-list-light xl:w-85"
        style={rowLightRange(ROW_SUMMARY_LIGHT_PX)}
      >
        <PostSummary summary={post.summary} />
      </div>
    </li>
  )
}

function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="border-t border-graphite pt-10 text-body-base text-smoke">
        {BLOG.empty}
      </p>
    )
  }
  return (
    <ul>
      {posts.map((post, index) => {
        if (index === 0) {
          return <FeaturedPost key={post.slug} post={post} />
        }
        return <PostRow key={post.slug} post={post} titleTag="h2" />
      })}
    </ul>
  )
}

function titleLetters(title: string) {
  return Array.from(title).map((letter, index) => (
    <span
      key={index}
      className="inline-block motion-safe:animate-case-title-word"
      style={loadDelay(TITLE_FROM_MS + index * TITLE_STEP_MS)}
    >
      {letter}
    </span>
  ))
}

export function BlogListView({ posts }: { posts: Post[] }) {
  return (
    <>
      <div className="bg-black text-paper">
        <header
          className={cn(
            containerClassName,
            "flex flex-col gap-6 pt-8 pb-20 md:pt-14 md:pb-24 xl:flex-row xl:items-end xl:justify-between xl:pt-20 xl:pb-20"
          )}
        >
          <h1
            aria-label={BLOG.title}
            className="font-heading text-display-l uppercase md:text-display-xl"
          >
            <span aria-hidden="true" className="inline-block hero-mask">
              {titleLetters(BLOG.title)}
            </span>
          </h1>
          <p
            className="text-body-base motion-safe:animate-hero-copy-up xl:w-85"
            style={loadDelay(INTRO_MS)}
          >
            {BLOG.intro}
          </p>
        </header>
        <div className={cn(containerClassName, "pt-4 pb-20 md:pb-24 xl:pb-30")}>
          <PostList posts={posts} />
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
