import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { ALL_POSTS_LINK, BLOG } from "@/data/blog.data"
import type { Post } from "@/type/post.type"

const linkClassName = buttonVariants({ variant: "link", size: "link" })

export function PostNextBand({ next }: { next: Post | null }) {
  let heading = null
  let nextLink = null
  if (next !== null) {
    heading = (
      <h2 className="font-heading text-heading-h1 text-balance text-paper xl:w-225">
        {next.title}
      </h2>
    )
    nextLink = (
      <Link href={`/blog/${next.slug}`} className={linkClassName}>
        {BLOG.readNextPost}
      </Link>
    )
  }

  return (
    <section className="border-t border-graphite bg-black">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-4 py-20 md:px-8 md:py-24 xl:flex-row xl:items-center xl:justify-between xl:px-10 xl:py-20">
        {heading}
        <div className="flex gap-6 xl:shrink-0">
          {nextLink}
          <Link href={ALL_POSTS_LINK.href} className={linkClassName}>
            {ALL_POSTS_LINK.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
