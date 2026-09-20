import type { Metadata } from "next"

import { fontDisplay } from "@/config/fonts.config"
import { SitePreview } from "@/features/site-content/components/site-preview.component"
import { caller } from "@/server/trpc/trpc.server"

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
}

export default async function EditorPreviewPage() {
  const draft = await caller.siteContent.getDraft()

  return (
    <SitePreview
      initialContent={draft.content}
      displayFontFamily={fontDisplay.style.fontFamily}
    />
  )
}
