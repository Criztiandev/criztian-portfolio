"use client"

import { useEffect, useState } from "react"

import {
  PREVIEW_CONTENT_MESSAGE,
  PREVIEW_SCROLL_MESSAGE,
} from "@/data/site-content.data"
import { SitePage } from "@/features/portfolio/components/site-page.component"
import { readPreviewMessage } from "@/features/site-content/site-content.rules"
import type { SiteContent } from "@/types/site-content.type"

const NON_INTERACTIVE_STYLES = `
[data-preview-root] a,
[data-preview-root] button,
[data-preview-root] input,
[data-preview-root] textarea,
[data-preview-root] select {
  pointer-events: none;
}
`

export function SitePreview({
  initialContent,
  displayFontFamily,
}: Readonly<{ initialContent: SiteContent; displayFontFamily: string }>) {
  const [content, setContent] = useState(initialContent)

  useEffect(function subscribeToEditorMessages() {
    function handleMessage(event: MessageEvent) {
      const message = readPreviewMessage(
        event.origin,
        window.location.origin,
        event.data
      )

      if (message === null) {
        return
      }

      if (message.type === PREVIEW_CONTENT_MESSAGE) {
        setContent(message.payload)
        return
      }

      if (message.type === PREVIEW_SCROLL_MESSAGE) {
        const target = document.getElementById(message.sectionId)

        if (target === null) {
          return
        }

        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    window.addEventListener("message", handleMessage)

    return function unsubscribe() {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div data-preview-root data-preview-ready="true">
      <style>{NON_INTERACTIVE_STYLES}</style>

      <SitePage content={content} displayFontFamily={displayFontFamily} />
    </div>
  )
}
