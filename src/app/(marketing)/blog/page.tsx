import type { Metadata } from "next"
import Link from "next/link"

import { PostSummary } from "@/components/post-body"
import { hasSupabaseEnv } from "@/config/env.config"
import { createPublicSupabase } from "@/lib/supabase/public"
import { postSchema } from "@/model/post.model"
import { listLiveEntriesIfReachable } from "@/service/cms.service"
import type { Post } from "@/type/post.type"

export const revalidate = 3600

export const metadata: Metadata = { title: "Blog" }

async function loadPosts(): Promise<Post[]> {
  if (!hasSupabaseEnv()) {
    return []
  }
  const entries = await listLiveEntriesIfReachable(
    createPublicSupabase(),
    "posts"
  )
  const posts: Post[] = []
  for (const entry of entries) {
    const parsed = postSchema.safeParse(entry.values)
    if (parsed.success && parsed.data.visible) {
      posts.push(parsed.data)
    }
  }
  posts.sort((a, b) => b.publishDate.localeCompare(a.publishDate))
  return posts
}

export default async function BlogPage() {
  const posts = await loadPosts()
  let content = <p className="text-muted-foreground">No posts yet.</p>
  if (posts.length > 0) {
    content = (
      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <li key={post.slug} className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <time
              dateTime={post.publishDate}
              className="text-sm text-muted-foreground"
            >
              {post.publishDate}
            </time>
            <div className="prose max-w-prose">
              <PostSummary summary={post.summary} />
            </div>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      {content}
    </div>
  )
}
