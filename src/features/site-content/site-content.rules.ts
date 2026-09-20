import {
  FULL_PREVIEW_WIDTH,
  HERO_MAX_DISCIPLINES,
  PREVIEW_CONTENT_MESSAGE,
  PREVIEW_SCROLL_MESSAGE,
  PREVIEW_WIDTHS,
} from "@/data/site-content.data"
import { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import type {
  EditorPreviewWidthId,
  PreviewMessage,
  RichTextNode,
  SiteContent,
  SiteContentParseResult,
} from "@/types/site-content.type"

export function createDefaultSiteContent(): SiteContent {
  return siteContentSchema.parse({})
}

export function parseSiteContent(value: unknown): SiteContentParseResult {
  if (value === null || value === undefined) {
    return {
      content: createDefaultSiteContent(),
      usedDefaults: true,
    }
  }

  const result = siteContentSchema.safeParse(value)

  if (!result.success) {
    return {
      content: createDefaultSiteContent(),
      usedDefaults: true,
    }
  }

  return {
    content: result.data,
    usedDefaults: false,
  }
}

export function hasUnpublishedChanges(
  draftUpdatedAt: string,
  publishedAt: string | null
): boolean {
  if (publishedAt === null) {
    return true
  }

  return Date.parse(draftUpdatedAt) > Date.parse(publishedAt)
}

export function readRichTextPlainText(node: RichTextNode): string {
  if (typeof node.text === "string") {
    return node.text
  }

  if (node.content === undefined) {
    return ""
  }

  const parts: string[] = []

  for (const child of node.content) {
    parts.push(readRichTextPlainText(child))
  }

  if (node.type === "paragraph") {
    return parts.join("") + "\n"
  }

  return parts.join("")
}

export function buildThemeStyle(
  theme: SiteContent["theme"]
): Record<string, string> {
  return {
    "--background": theme.pageBackground,
    "--foreground": theme.bodyText,
    "--muted-foreground": theme.mutedText,
    "--primary": theme.accent,
    "--border": theme.border,
  }
}

export function readPreviewMessage(
  eventOrigin: string,
  expectedOrigin: string,
  data: unknown
): PreviewMessage | null {
  if (eventOrigin !== expectedOrigin) {
    return null
  }

  if (typeof data !== "object" || data === null) {
    return null
  }

  const message = data as Record<string, unknown>

  if (message.type === PREVIEW_SCROLL_MESSAGE) {
    if (typeof message.sectionId !== "string") {
      return null
    }

    return { type: PREVIEW_SCROLL_MESSAGE, sectionId: message.sectionId }
  }

  if (message.type === PREVIEW_CONTENT_MESSAGE) {
    const parsed = siteContentSchema.safeParse(message.payload)

    if (!parsed.success) {
      return null
    }

    return { type: PREVIEW_CONTENT_MESSAGE, payload: parsed.data }
  }

  return null
}

export function readPreviewWidthValue(
  previewWidth: EditorPreviewWidthId
): string {
  for (const option of PREVIEW_WIDTHS) {
    if (option.id === previewWidth) {
      return option.width
    }
  }

  return FULL_PREVIEW_WIDTH
}

export function padDisciplineSlots(disciplines: string[]): string[] {
  const slots: string[] = []

  for (let index = 0; index < HERO_MAX_DISCIPLINES; index += 1) {
    const discipline = disciplines[index]

    if (discipline === undefined) {
      slots.push("")
      continue
    }

    slots.push(discipline)
  }

  return slots
}

export function buildEditorFormValues(content: SiteContent): SiteContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      disciplines: padDisciplineSlots(content.hero.disciplines),
    },
  }
}
