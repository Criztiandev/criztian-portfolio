import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

import { PostView } from "@/components/post-view"
import { hasSupabaseEnv } from "@/config/env.config"
import { markdownToText } from "@/lib/react-markdown"
import { createPublicSupabase } from "@/lib/supabase/public"
import { cmsSlugSchema } from "@/model/cms.model"
import { postSchema } from "@/model/post.model"
import { getLiveEntryBySlugIfReachable } from "@/service/cms.service"
import type { Post } from "@/type/post.type"

export const revalidate = 3600

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return []
}

const loadPost = cache(async (slug: string): Promise<Post | null> => {
  if (!hasSupabaseEnv()) {
    return null
  }
  const parsedSlug = cmsSlugSchema.safeParse(slug)
  if (!parsedSlug.success) {
    return null
  }
  const entry = await getLiveEntryBySlugIfReachable(
    createPublicSupabase(),
    "posts",
    parsedSlug.data
  )
  if (entry === null) {
    return null
  }
  const parsed = postSchema.safeParse(entry.values)
  if (!parsed.success || !parsed.data.visible) {
    return null
  }
  return parsed.data
})

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const post = await loadPost(slug)
  if (post === null) {
    notFound()
  }
  return { title: post.title, description: markdownToText(post.summary) }
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (post === null) {
    notFound()
  }
  return <PostView post={post} />
}
