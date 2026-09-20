import type { z } from "zod"

import type { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import type { Database } from "@/types/database.type"

export type RichTextMark = {
  type: string
}

export type RichTextNode = {
  type: string
  text?: string
  marks?: RichTextMark[]
  content?: RichTextNode[]
}

export type RichTextDocument = {
  type: "doc"
  content?: RichTextNode[]
}

export type SiteContentInput = z.input<typeof siteContentSchema>

export type SiteContent = z.output<typeof siteContentSchema>

export type SiteContentThemeKey = keyof SiteContent["theme"]

export type SiteContentEntryId = "hero" | "theme"

export type SiteContentEntry = {
  id: SiteContentEntryId
  label: string
  sectionId: string | null
}

export type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"]

export type SiteContentUpdate =
  Database["public"]["Tables"]["site_content"]["Update"]

export type SiteContentDraftState = {
  content: SiteContent
  hasUnpublishedChanges: boolean
}

export type SiteContentParseResult = {
  content: SiteContent
  usedDefaults: boolean
}
