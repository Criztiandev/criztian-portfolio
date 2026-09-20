import type { Store } from "@tanstack/react-store"
import type { z } from "zod"

import type {
  RICH_TEXT_MARK_TYPES,
  RICH_TEXT_NODE_TYPES,
} from "@/data/site-content.data"
import type { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import type { Database } from "@/types/database.type"

export type RichTextMarkType = (typeof RICH_TEXT_MARK_TYPES)[number]

export type RichTextNodeType = (typeof RICH_TEXT_NODE_TYPES)[number]

export type RichTextMark = {
  type: RichTextMarkType
}

export type RichTextNode = {
  type: RichTextNodeType
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

export type SiteContentSaveResult = {
  draftUpdatedAt: string
  hasUnpublishedChanges: boolean
}

export type SiteContentPublishResult = {
  publishedAt: string
  hasUnpublishedChanges: boolean
}

export type PreviewContentMessage = {
  type: "content"
  payload: SiteContent
}

export type PreviewScrollMessage = {
  type: "scroll"
  sectionId: string
}

export type PreviewMessage = PreviewContentMessage | PreviewScrollMessage

export type PreviewReadyMessage = {
  type: "ready"
}

export type EditorSaveState = "idle" | "saving" | "saved" | "error"

export type EditorPreviewWidthId = "desktop" | "tablet" | "mobile"

export type EditorPreviewWidthOption = {
  id: EditorPreviewWidthId
  label: string
  width: string
}

export type EditorUiState = {
  selectedEntry: SiteContentEntryId
  previewWidth: EditorPreviewWidthId
  saveState: EditorSaveState
}

export type EditorUiActions = {
  selectEntry: (entry: SiteContentEntryId) => void
  selectPreviewWidth: (width: EditorPreviewWidthId) => void
  setSaveState: (state: EditorSaveState) => void
}

export type EditorUiStore = Store<EditorUiState, EditorUiActions>

export type HeroTextFieldKey = "name"

export type HeroTextField = {
  key: HeroTextFieldKey
  label: string
}

export type ThemeColorField = {
  key: SiteContentThemeKey
  label: string
}
