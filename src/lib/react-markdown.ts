import { Children, isValidElement } from "react"
import type { ReactNode } from "react"
import renderMarkdown from "react-markdown"
import type { Options } from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

export const markdownOptions: Options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeRaw, rehypeSanitize],
}

export const flatMarkdownOptions: Options = {
  ...markdownOptions,
  components: { h1: "p", h2: "p", h3: "p", h4: "p", h5: "p", h6: "p" },
}

const spacedTags = new Set(["br", "td", "th"])

function collectText(node: ReactNode, parts: string[]): void {
  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      parts.push(String(child))
      return
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      collectText(child.props.children, parts)
      if (typeof child.type === "string" && spacedTags.has(child.type)) {
        parts.push(" ")
      }
    }
  })
}

export function markdownToText(markdown: string): string {
  const parts: string[] = []
  collectText(renderMarkdown({ ...markdownOptions, children: markdown }), parts)
  return parts.join("").replace(/\s+/g, " ").trim()
}
