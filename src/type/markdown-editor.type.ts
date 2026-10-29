import type { TablerIcon } from "@tabler/icons-react"
import type { ChainedCommands, Editor } from "@tiptap/react"
import type { Ref } from "react"

export type MarkdownEditorHandle = {
  focus: () => void
}

export type MarkdownEditorProps = {
  ref?: Ref<MarkdownEditorHandle>
  defaultValue: string
  labelId: string
  describedBy?: string
  hidden?: boolean

  placeholder?: string
  compact?: boolean
  invalid: boolean
  onChange: (markdown: string) => void
  onBlur: () => void
}

export type EditorCommand = {
  label: string
  icon: TablerIcon
  command: (chain: ChainedCommands) => ChainedCommands
}

export type EditorFormat = EditorCommand & {
  isActive: (editor: Editor) => boolean
}
