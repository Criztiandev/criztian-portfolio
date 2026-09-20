import { generateHTML } from "@tiptap/html"

import { RICH_TEXT_EXTENSIONS } from "@/features/site-content/rich-text.extensions"
import { readRichTextPlainText } from "@/features/site-content/site-content.rules"
import { escapeHtml } from "@/lib/html/escape-html.util"
import type { RichTextDocument } from "@/types/site-content.type"

export function renderRichTextHtml(document: RichTextDocument): string {
  try {
    return generateHTML(document, RICH_TEXT_EXTENSIONS)
  } catch {
    return `<p>${escapeHtml(readRichTextPlainText(document).trim())}</p>`
  }
}
