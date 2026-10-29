import type { Metadata } from "next"

import { BlogListView } from "@/components/blog-list-view"
import { hasSupabaseEnv } from "@/config/env.config"
import { createPublicSupabase } from "@/lib/supabase/public"
import { listVisiblePosts } from "@/service/post.service"
import type { Post } from "@/type/post.type"

export const revalidate = 3600

export const metadata: Metadata = { title: "Blog" }

async function loadPosts(): Promise<Post[]> {
  if (!hasSupabaseEnv()) {
    return []
  }
  return listVisiblePosts(createPublicSupabase())
}

export default async function BlogPage() {
  const posts = await loadPosts()
  return <BlogListView posts={posts} />
}
