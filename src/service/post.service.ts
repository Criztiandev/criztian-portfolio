import { postSchema } from "@/model/post.model"
import { listLiveEntriesIfReachable } from "@/service/cms.service"
import type { Post } from "@/type/post.type"
import type { Db } from "@/type/supabase.type"

export async function listVisiblePosts(db: Db): Promise<Post[]> {
  const entries = await listLiveEntriesIfReachable(db, "posts")
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
