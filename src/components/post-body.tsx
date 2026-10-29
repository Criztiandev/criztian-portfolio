import { Fragment, memo } from "react"
import type { ComponentProps } from "react"
import Markdown from "react-markdown"
import type { Components } from "react-markdown"

import { flatMarkdownOptions, markdownOptions } from "@/lib/react-markdown"
import { cn } from "@/lib/utils"

const cellClassName = "align-top md:py-4 md:pr-6 md:last:pr-0"

const RISE_PX = 150
const HEADING_STEP_PX = 25

function SectionHeading({ children }: ComponentProps<"h2">) {
  let content = children
  if (typeof children === "string") {
    content = children.split(" ").map((word, index) => {
      const startPx = index * HEADING_STEP_PX
      return (
        <Fragment key={index}>
          {" "}
          <span className="inline-block hero-mask">
            <span
              className="inline-block post-rise"
              style={{
                animationRange: `cover ${startPx}px cover ${startPx + RISE_PX}px`,
              }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      )
    })
  }
  return (
    <h2 className="pt-6 font-heading text-heading-h2 text-balance post-timeline">
      {content}
    </h2>
  )
}

function MinorHeading({ children }: ComponentProps<"h3">) {
  return (
    <h3 className="text-body-large font-semibold text-balance">{children}</h3>
  )
}

const postBodyComponents: Components = {
  h1: SectionHeading,
  h2: SectionHeading,
  h3: MinorHeading,
  h4: MinorHeading,
  h5: MinorHeading,
  h6: MinorHeading,
  a({ children, href, title }) {
    return (
      <a
        href={href}
        title={title}
        className="underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-paper"
      >
        {children}
      </a>
    )
  },
  ul({ children }) {
    return (
      <ul className="flex flex-col gap-3 *:relative *:pl-5.5 *:before:absolute *:before:top-3 *:before:left-0 *:before:size-1.5 *:before:bg-paper">
        {children}
      </ul>
    )
  },
  ol({ children, start }) {
    return (
      <ol start={start} className="list-decimal space-y-3 pl-6 *:pl-4">
        {children}
      </ol>
    )
  },
  blockquote({ children }) {
    return (
      <blockquote className="flex flex-col gap-6 py-10 font-heading text-heading-h1 text-balance md:py-6">
        {children}
      </blockquote>
    )
  },
  table({ children }) {
    return (
      <table className="block w-full md:table md:table-fixed">{children}</table>
    )
  },
  thead({ children }) {
    return <thead className="hidden md:table-header-group">{children}</thead>
  },
  tbody({ children }) {
    return <tbody className="block md:table-row-group">{children}</tbody>
  },
  tr({ children }) {
    return (
      <tr className="flex flex-col gap-2 border-t border-graphite py-4 md:table-row md:py-0">
        {children}
      </tr>
    )
  },
  th({ children }) {
    return (
      <th
        className={cn(
          cellClassName,
          "text-left text-label text-smoke uppercase"
        )}
      >
        {children}
      </th>
    )
  },
  td({ children }) {
    return <td className={cellClassName}>{children}</td>
  },
  code({ children }) {
    return (
      <code className="bg-graphite px-1 font-mono text-body-small">
        {children}
      </code>
    )
  },
  pre({ children }) {
    return (
      <pre className="overflow-x-auto bg-graphite p-4 text-body-small">
        {children}
      </pre>
    )
  },
  hr() {
    return <hr className="border-graphite" />
  },
}

export const PostBody = memo(function PostBody({ body }: { body: string }) {
  return (
    <Markdown {...markdownOptions} components={postBodyComponents}>
      {body}
    </Markdown>
  )
})

export function PostSummary({ summary }: { summary: string }) {
  return <Markdown {...flatMarkdownOptions}>{summary}</Markdown>
}
