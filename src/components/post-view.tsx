import { PostBody } from "@/components/post-body"
import type { Post } from "@/type/post.type"

export function PostView({ post }: { post: Post }) {
  return (
    <article data-cms-card="Content" data-cms-field="body" className="prose">
      <h1 data-cms-field="title">{post.title}</h1>
      <time
        dateTime={post.publishDate}
        data-cms-field="publishDate"
        className="text-sm"
      >
        {post.publishDate}
      </time>
      <PostBody body={post.body} />
    </article>
  )
}
