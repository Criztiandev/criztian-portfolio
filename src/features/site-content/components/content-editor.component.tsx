"use client"

import { useEffect, useRef } from "react"

import {
  PREVIEW_CONTENT_MESSAGE,
  PREVIEW_SCROLL_MESSAGE,
} from "@/data/site-content.data"
import { EditorConfigPanel } from "@/features/site-content/components/editor-config-panel.component"
import { EditorPreviewPane } from "@/features/site-content/components/editor-preview-pane.component"
import { EditorSectionList } from "@/features/site-content/components/editor-section-list.component"
import { postPreviewMessage } from "@/features/site-content/services/preview-messenger.service"
import { isPreviewReadyMessage } from "@/features/site-content/site-content.rules"
import { EditorStoreProvider } from "@/providers/editor-store.provider"
import type { SiteContent, SiteContentEntry } from "@/types/site-content.type"

function ContentEditorPanes({
  initialContent,
  hasUnpublishedChanges,
}: Readonly<{
  initialContent: SiteContent
  hasUnpublishedChanges: boolean
}>) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const pendingContentRef = useRef<SiteContent>(initialContent)

  useEffect(function subscribeToPreviewReady() {
    function handleMessage(event: MessageEvent) {
      const isReady = isPreviewReadyMessage(
        event.origin,
        window.location.origin,
        event.data
      )

      if (!isReady) {
        return
      }

      postPreviewMessage(frameRef.current, {
        type: PREVIEW_CONTENT_MESSAGE,
        payload: pendingContentRef.current,
      })
    }

    window.addEventListener("message", handleMessage)

    return function unsubscribe() {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  function handleSectionSelect(entry: SiteContentEntry) {
    if (entry.sectionId === null) {
      return
    }

    postPreviewMessage(frameRef.current, {
      type: PREVIEW_SCROLL_MESSAGE,
      sectionId: entry.sectionId,
    })
  }

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <EditorSectionList onSelect={handleSectionSelect} />

      <EditorPreviewPane frameRef={frameRef} />

      <EditorConfigPanel
        initialContent={initialContent}
        initialHasUnpublishedChanges={hasUnpublishedChanges}
        frameRef={frameRef}
        pendingContentRef={pendingContentRef}
      />
    </div>
  )
}

export function ContentEditor({
  initialContent,
  hasUnpublishedChanges,
}: Readonly<{
  initialContent: SiteContent
  hasUnpublishedChanges: boolean
}>) {
  return (
    <EditorStoreProvider>
      <ContentEditorPanes
        initialContent={initialContent}
        hasUnpublishedChanges={hasUnpublishedChanges}
      />
    </EditorStoreProvider>
  )
}
