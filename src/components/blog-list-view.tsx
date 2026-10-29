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

const postLinkClassName =
  "outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-paper"

function PostMeta({ post }: { post: Post }) {
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
    <li className="group relative flex flex-col gap-6 border-t border-graphite pt-10 pb-16">
      <h2 className="font-heading text-heading-h1 text-balance md:text-display-l xl:w-275">
        <Link href={`/blog/${post.slug}`} className={postLinkClassName}>
          {post.title}
        </Link>
      </h2>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="text-body-large xl:w-160">
          <PostSummary summary={post.summary} />
        </div>
        <div className="xl:w-85">
          <PostMeta post={post} />
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          buttonVariants({ variant: "link", size: "link" }),
          "self-start group-hover:underline"
        )}
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
    <li className="group relative flex flex-col gap-4 border-t border-graphite py-10 xl:flex-row xl:justify-between">
      <div className="flex flex-col gap-3 xl:w-190">
        <Title className="font-heading text-heading-h2 text-balance">
          <Link href={`/blog/${post.slug}`} className={postLinkClassName}>
            {post.title}
          </Link>
        </Title>
        <PostMeta post={post} />
      </div>
      <div className="text-body-base xl:w-85">
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
          <h1 className="font-heading text-display-l uppercase md:text-display-xl">
            {BLOG.title}
          </h1>
          <p className="text-body-base xl:w-85">{BLOG.intro}</p>
        </header>
        <div className={cn(containerClassName, "pt-4 pb-20 md:pb-24 xl:pb-30")}>
          <PostList posts={posts} />
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
