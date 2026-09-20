import { StarterKit } from "@tiptap/starter-kit"

export const RICH_TEXT_EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    blockquote: false,
    codeBlock: false,
    code: false,
    horizontalRule: false,
    strike: false,
    link: false,
    underline: false,
  }),
]
