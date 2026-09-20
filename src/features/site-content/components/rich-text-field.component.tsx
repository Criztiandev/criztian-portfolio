"use client"

import { EditorContent, useEditor } from "@tiptap/react"

import { RICH_TEXT_EXTENSIONS } from "@/features/site-content/rich-text.extensions"
import { cn } from "@/lib/utils"
import type { RichTextDocument } from "@/types/site-content.type"

const TOOLBAR_BUTTONS = [
  { id: "bold", label: "Bold", glyph: "B", className: "font-bold" },
  { id: "italic", label: "Italic", glyph: "I", className: "italic" },
] as const

export function RichTextField({
  id,
  initialValue,
  onChange,
}: Readonly<{
  id: string
  initialValue: RichTextDocument
  onChange: (document: RichTextDocument) => void
}>) {
  const editor = useEditor({
    extensions: RICH_TEXT_EXTENSIONS,
    content: initialValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        class:
          "min-h-24 w-full px-3 py-2 text-sm outline-none [&_p]:m-0 [&_p+p]:mt-2",
      },
    },
    onUpdate: function handleUpdate({ editor: instance }) {
      onChange(instance.getJSON() as RichTextDocument)
    },
  })

  return (
    <div className="rounded-md border bg-transparent shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      <div
        role="group"
        aria-label="Formatting"
        className="flex items-center gap-1 border-b px-2 py-1"
      >
        {TOOLBAR_BUTTONS.map(function renderButton(button) {
          const isActive = editor?.isActive(button.id) === true

          return (
            <button
              key={button.id}
              type="button"
              aria-label={button.label}
              aria-pressed={isActive}
              disabled={editor === null}
              onClick={function handleClick() {
                if (editor === null) {
                  return
                }

                if (button.id === "bold") {
                  editor.chain().focus().toggleBold().run()
                  return
                }

                editor.chain().focus().toggleItalic().run()
              }}
              className={cn(
                "size-7 rounded text-xs transition-colors",
                button.className,
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {button.glyph}
            </button>
          )
        })}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
