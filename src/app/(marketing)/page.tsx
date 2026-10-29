import { HomeView } from "@/components/home-view"
import { hasSupabaseEnv } from "@/config/env.config"
import { createPublicSupabase } from "@/lib/supabase/public"
import { homeSchema } from "@/model/home.model"
import { listLiveEntriesIfReachable } from "@/service/cms.service"
import { listVisiblePosts } from "@/service/post.service"
import type { Home } from "@/type/home.type"
import type { Post } from "@/type/post.type"

export const revalidate = 3600

async function loadHome(): Promise<Home> {
  if (!hasSupabaseEnv()) {
    return homeSchema.parse({})
  }
  const entries = await listLiveEntriesIfReachable(
    createPublicSupabase(),
    "home"
  )
  if (entries.length === 0) {
    return homeSchema.parse({})
  }
  return homeSchema.parse(entries[0].values)
}

async function loadPosts(): Promise<Post[]> {
  if (!hasSupabaseEnv()) {
    return []
  }
  return listVisiblePosts(createPublicSupabase())
}

export default async function HomePage() {
  const [home, posts] = await Promise.all([loadHome(), loadPosts()])
  return <HomeView home={home} posts={posts} />
}
