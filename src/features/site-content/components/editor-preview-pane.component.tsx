"use client"

import { EDITOR_PREVIEW_PATH, PREVIEW_WIDTHS } from "@/data/site-content.data"
import {
  useEditorUiActions,
  usePreviewWidth,
} from "@/features/site-content/hooks/use-editor-ui.hook"
import { readPreviewWidthValue } from "@/features/site-content/site-content.rules"
import { cn } from "@/lib/utils"

export function EditorPreviewPane({
  frameRef,
  onFrameLoad,
}: Readonly<{
  frameRef: React.RefObject<HTMLIFrameElement | null>
  onFrameLoad: () => void
}>) {
  const previewWidth = usePreviewWidth()
  const { selectPreviewWidth } = useEditorUiActions()

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-muted/40">
      <div
        role="group"
        aria-label="Preview width"
        className="flex shrink-0 items-center justify-center gap-1 border-b bg-background p-2"
      >
        {PREVIEW_WIDTHS.map(function renderOption(option) {
          const isActive = option.id === previewWidth

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={function handleClick() {
                selectPreviewWidth(option.id)
              }}
              className={cn(
                "rounded-md px-3 py-1 text-xs transition-colors",
                isActive
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 p-4">
        <iframe
          ref={frameRef}
          src={EDITOR_PREVIEW_PATH}
          title="Site preview"
          data-preview-width={previewWidth}
          onLoad={onFrameLoad}
          style={{ width: readPreviewWidthValue(previewWidth) }}
          className="mx-auto h-full rounded-lg border bg-background shadow-sm transition-[width] duration-300"
        />
      </div>
    </div>
  )
}
