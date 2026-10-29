import { Toolbar } from "@base-ui/react/toolbar"
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconCode,
  IconColumnInsertRight,
  IconColumnRemove,
  IconH2,
  IconH3,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconRowInsertBottom,
  IconRowRemove,
  IconSourceCode,
  IconTableOff,
  IconTablePlus,
} from "@tabler/icons-react"
import type { Editor } from "@tiptap/react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import { useImperativeHandle, useMemo, useState } from "react"
import type { KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import { buildEditorExtensions } from "@/lib/tiptap"
import { cn } from "@/lib/utils"
import { cmsLinkSchema } from "@/model/cms.model"
import type {
  EditorCommand,
  EditorFormat,
  MarkdownEditorProps,
} from "@/type/markdown-editor.type"

const historyCommands: EditorCommand[] = [
  { label: "Undo", icon: IconArrowBackUp, command: (chain) => chain.undo() },
  { label: "Redo", icon: IconArrowForwardUp, command: (chain) => chain.redo() },
]

const formats: EditorFormat[] = [
  {
    label: "Heading 2",
    icon: IconH2,
    command: (chain) => chain.toggleHeading({ level: 2 }),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    label: "Heading 3",
    icon: IconH3,
    command: (chain) => chain.toggleHeading({ level: 3 }),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    label: "Bold",
    icon: IconBold,
    command: (chain) => chain.toggleBold(),
    isActive: (editor) => editor.isActive("bold"),
  },
  {
    label: "Italic",
    icon: IconItalic,
    command: (chain) => chain.toggleItalic(),
    isActive: (editor) => editor.isActive("italic"),
  },
  {
    label: "Inline code",
    icon: IconCode,
    command: (chain) => chain.toggleCode(),
    isActive: (editor) => editor.isActive("code"),
  },
  {
    label: "Bullet list",
    icon: IconList,
    command: (chain) => chain.toggleBulletList(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    label: "Numbered list",
    icon: IconListNumbers,
    command: (chain) => chain.toggleOrderedList(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    label: "Quote",
    icon: IconBlockquote,
    command: (chain) => chain.toggleBlockquote(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    label: "Code block",
    icon: IconSourceCode,
    command: (chain) => chain.toggleCodeBlock(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
]

const insertTable: EditorCommand = {
  label: "Insert table",
  icon: IconTablePlus,
  command: (chain) =>
    chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
}

const tableCommands: EditorCommand[] = [
  {
    label: "Add row",
    icon: IconRowInsertBottom,
    command: (chain) => chain.addRowAfter(),
  },
  {
    label: "Add column",
    icon: IconColumnInsertRight,
    command: (chain) => chain.addColumnAfter(),
  },
  {
    label: "Delete row",
    icon: IconRowRemove,
    command: (chain) => chain.deleteRow(),
  },
  {
    label: "Delete column",
    icon: IconColumnRemove,
    command: (chain) => chain.deleteColumn(),
  },
  {
    label: "Delete table",
    icon: IconTableOff,
    command: (chain) => chain.deleteTable(),
  },
]

const separatorClass = "mx-1 h-5 w-px bg-border"

function canRun(editor: Editor, item: EditorCommand): boolean {
  return item.command(editor.can().chain()).run()
}

function canEditLink(editor: Editor): boolean {
  if (editor.isActive("link")) {
    return true
  }
  if (editor.state.selection.empty) {
    return false
  }
  return editor.can().setLink({ href: "https://example.com" })
}

function readToolbarState({ editor }: { editor: Editor }) {
  const inTable = editor.isActive("table")
  return {
    history: historyCommands.map((item) => canRun(editor, item)),
    formats: formats.map((format) => ({
      active: format.isActive(editor),
      enabled: canRun(editor, format),
    })),
    canInsertTable: !inTable && canRun(editor, insertTable),
    table: tableCommands.map((item) => canRun(editor, item)),
    inTable,
    link: editor.isActive("link"),
    canLink: canEditLink(editor),
  }
}

function ToolbarCommand({
  editor,
  item,
  enabled,
}: {
  editor: Editor
  item: EditorCommand
  enabled: boolean
}) {
  return (
    <Toolbar.Button
      aria-label={item.label}
      title={item.label}
      disabled={!enabled}
      onClick={() => {
        item.command(editor.chain().focus()).run()
      }}
      render={<Button type="button" variant="ghost" size="icon-sm" />}
    >
      <item.icon aria-hidden="true" />
    </Toolbar.Button>
  )
}

function LinkPopover({
  editor,
  active,
  enabled,
  hidden,
}: {
  editor: Editor
  active: boolean
  enabled: boolean
  hidden: boolean
}) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  if (hidden && open) {
    setOpen(false)
  }

  function onOpenChange(next: boolean) {
    if (next) {
      const href: unknown = editor.getAttributes("link").href
      let current = ""
      if (typeof href === "string") {
        current = href
      }
      setUrl(current)
      setError("")
    }
    setOpen(next)
  }

  function apply() {
    const parsed = cmsLinkSchema.safeParse(url.trim())
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: parsed.data })
      .run()
    setOpen(false)
  }

  function remove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setOpen(false)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      apply()
    }
  }

  let triggerClass = ""
  if (active) {
    triggerClass =
      "bg-foreground text-background hover:bg-foreground hover:text-background dark:hover:bg-foreground"
  }
  let errorText = null
  if (error !== "") {
    errorText = (
      <p id="post-link-error" role="alert" className="text-sm text-destructive">
        {error}
      </p>
    )
  }
  let removeButton = null
  if (active) {
    removeButton = (
      <Button type="button" variant="outline" size="sm" onClick={remove}>
        Remove
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        aria-label="Link"
        title="Link"
        disabled={!enabled}
        render={
          <Toolbar.Button
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={triggerClass}
              />
            }
          />
        }
      >
        <IconLink aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent aria-label="Link" align="start" className="w-80">
        <div className="flex flex-col gap-2">
          <Label htmlFor="post-link-url">Link address</Label>
          <Input
            id="post-link-url"
            value={url}
            placeholder="https://example.com"
            aria-invalid={error !== ""}
            aria-describedby="post-link-error"
            onChange={(event) => {
              setUrl(event.target.value)
            }}
            onKeyDown={onKeyDown}
          />
          {errorText}
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={apply}>
              Apply
            </Button>
            {removeButton}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function EditorToolbar({
  editor,
  hidden,
}: {
  editor: Editor
  hidden: boolean
}) {
  const state = useEditorState({ editor, selector: readToolbarState })

  let tableGroup = null
  if (state.inTable) {
    tableGroup = (
      <>
        <Toolbar.Separator className={separatorClass} />
        <Toolbar.Group aria-label="Table" className="flex items-center gap-1">
          {tableCommands.map((item, index) => (
            <ToolbarCommand
              key={item.label}
              editor={editor}
              item={item}
              enabled={state.table[index]}
            />
          ))}
        </Toolbar.Group>
      </>
    )
  }

  return (
    <Toolbar.Root
      aria-label="Formatting"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-background p-1 [&_[aria-disabled=true]]:pointer-events-none [&_[aria-disabled=true]]:opacity-50"
    >
      {historyCommands.map((item, index) => (
        <ToolbarCommand
          key={item.label}
          editor={editor}
          item={item}
          enabled={state.history[index]}
        />
      ))}
      <Toolbar.Separator className={separatorClass} />
      {formats.map((format, index) => (
        <Toolbar.Button
          key={format.label}
          aria-label={format.label}
          title={format.label}
          disabled={!state.formats[index].enabled}
          render={
            <Toggle
              size="sm"
              className="aria-pressed:bg-foreground aria-pressed:text-background"
              pressed={state.formats[index].active}
              onPressedChange={() => {
                format.command(editor.chain().focus()).run()
              }}
            />
          }
        >
          <format.icon aria-hidden="true" />
        </Toolbar.Button>
      ))}
      <LinkPopover
        editor={editor}
        active={state.link}
        enabled={state.canLink}
        hidden={hidden}
      />
      <Toolbar.Separator className={separatorClass} />
      <ToolbarCommand
        editor={editor}
        item={insertTable}
        enabled={state.canInsertTable}
      />
      {tableGroup}
    </Toolbar.Root>
  )
}

const contentClass =
  "prose max-w-none px-3 py-2 outline-none [&_.tableWrapper]:overflow-x-auto [&_:is(td,th)]:border [&_:is(td,th)]:border-muted-foreground [&_:is(td,th)]:px-2 [&_.selectedCell]:bg-[color:Highlight] [&_.selectedCell]:text-[color:HighlightText] [&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:h-0 [&_.is-editor-empty:first-child]:before:text-muted-foreground [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"

export function MarkdownEditor({
  ref,
  defaultValue,
  labelId,
  describedBy,
  hidden,
  placeholder,
  compact,
  invalid,
  onChange,
  onBlur,
}: MarkdownEditorProps) {
  let heightClass = "min-h-64"
  let emptyClass = "min-h-75"
  if (compact === true) {
    heightClass = "min-h-24"
    emptyClass = "min-h-35"
  }
  const editorProps = useMemo(() => {
    const attributes: Record<string, string> = {
      "aria-labelledby": labelId,
      "aria-multiline": "true",
      "aria-invalid": String(invalid),
      class: `${contentClass} ${heightClass}`,
    }
    if (describedBy !== undefined) {
      attributes["aria-describedby"] = describedBy
    }
    if (placeholder !== undefined) {
      attributes["aria-placeholder"] = placeholder
    }
    return { attributes }
  }, [labelId, describedBy, placeholder, heightClass, invalid])
  const [extensions] = useState(() => buildEditorExtensions(placeholder))
  const editor = useEditor({
    extensions,
    content: defaultValue,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps,
    onUpdate: ({ editor: current, transaction }) => {
      if (!transaction.docChanged) {
        return
      }
      if (current.isEmpty) {
        onChange("")
        return
      }
      onChange(current.getMarkdown())
    },
    onBlur: () => {
      onBlur()
    },
  })
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (editor !== null) {
          editor.commands.focus()
        }
      },
    }),
    [editor]
  )

  if (editor === null) {
    return <div className={cn("rounded-lg border border-input", emptyClass)} />
  }

  return (
    <div
      data-invalid={invalid}
      className="overflow-clip rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-[invalid=true]:border-destructive"
    >
      <EditorToolbar editor={editor} hidden={hidden === true} />
      <EditorContent editor={editor} />
    </div>
  )
}
