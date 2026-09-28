import type { Metadata } from "next"

import { ContentEditor } from "@/features/site-content/components/content-editor.component"
import { caller } from "@/server/trpc/trpc.server"

export const metadata: Metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
}

export default async function EditorPage() {
  const draft = await caller.siteContent.getDraft()

  return (
    <ContentEditor
      initialContent={draft.content}
      hasUnpublishedChanges={draft.hasUnpublishedChanges}
    />
  )
}
