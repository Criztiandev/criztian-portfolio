import Link from "next/link"

import { PostRow } from "@/components/blog-list-view"
import { buttonVariants } from "@/components/ui/button"
import { ALL_POSTS_LINK, BLOG, LATEST_POST_COUNT } from "@/data/blog.data"
import { cn } from "@/lib/utils"
import type { Post } from "@/type/post.type"

export function HomeBlogSection({ posts }: { posts: Post[] }) {
  if (posts.length < LATEST_POST_COUNT) {
    return null
  }
  const latestPosts = posts.slice(0, LATEST_POST_COUNT)

  return (
    <section className="bg-black text-paper">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-4 py-20 md:px-8 md:py-24 xl:gap-16 xl:px-10 xl:py-30">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="font-heading text-heading-h1 md:text-display-l">
            {BLOG.title}
          </h2>
          <p className="text-body-base xl:w-85">{BLOG.intro}</p>
        </div>
        <ul>
          {latestPosts.map((post) => (
            <PostRow key={post.slug} post={post} titleTag="h3" />
          ))}
        </ul>
        <Link
          href={ALL_POSTS_LINK.href}
          className={cn(
            buttonVariants({ variant: "link", size: "link" }),
            "self-start"
          )}
        >
          {ALL_POSTS_LINK.label}
        </Link>
      </div>
    </section>
  )
}
