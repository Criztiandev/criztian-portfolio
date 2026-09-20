import { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import type {
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
