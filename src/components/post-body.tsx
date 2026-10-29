import { memo } from "react"
import Markdown from "react-markdown"

import { flatMarkdownOptions, markdownOptions } from "@/lib/react-markdown"

export const PostBody = memo(function PostBody({ body }: { body: string }) {
  return <Markdown {...markdownOptions}>{body}</Markdown>
})

export function PostSummary({ summary }: { summary: string }) {
  return <Markdown {...flatMarkdownOptions}>{summary}</Markdown>
}
