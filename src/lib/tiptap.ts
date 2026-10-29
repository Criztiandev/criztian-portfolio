import { OrderedList } from "@tiptap/extension-list"
import { Paragraph } from "@tiptap/extension-paragraph"
import { TableCell, TableHeader, TableKit } from "@tiptap/extension-table"
import { Placeholder } from "@tiptap/extensions"
import { Markdown } from "@tiptap/markdown"
import { StarterKit } from "@tiptap/starter-kit"

function escapeBlockStarts(markdown: string): string {
  return markdown
    .replace(/^( {0,3})([-+#=])/gm, "$1\\$2")
    .replace(/^( {0,3})(\d+)([.)])/gm, "$1$2\\$3")
}

export const editorExtensions = [
  StarterKit.configure({
    underline: false,
    orderedList: false,
    paragraph: false,
    link: { openOnClick: false },
  }),
  Paragraph.extend({
    renderMarkdown(node, helpers, context) {
      if (this.parent === undefined) {
        return ""
      }
      return escapeBlockStarts(this.parent(node, helpers, context))
    },
  }),
  OrderedList.extend({
    markdownTokenizer: {
      name: "orderedList",
      level: "block",
      start: () => -1,
      tokenize: () => undefined,
    },
  }),
  TableKit.configure({ tableCell: false, tableHeader: false }),
  TableCell.extend({ content: "paragraph+" }),
  TableHeader.extend({ content: "paragraph+" }),
  Markdown,
]

export function buildEditorExtensions(placeholder: string | undefined) {
  if (placeholder === undefined) {
    return editorExtensions
  }
  return [...editorExtensions, Placeholder.configure({ placeholder })]
}
