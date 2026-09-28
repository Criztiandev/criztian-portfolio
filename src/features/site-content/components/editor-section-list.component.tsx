"use client"

import { SITE_CONTENT_ENTRIES } from "@/data/site-content.data"
import {
  useEditorUiActions,
  useSelectedEntry,
} from "@/features/site-content/hooks/use-editor-ui.hook"
import { cn } from "@/lib/utils"
import type { SiteContentEntry } from "@/types/site-content.type"

export function EditorSectionList({
  onSelect,
}: Readonly<{ onSelect: (entry: SiteContentEntry) => void }>) {
  const selectedEntry = useSelectedEntry()
  const { selectEntry } = useEditorUiActions()

  return (
    <nav
      aria-label="Sections"
      className="flex w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r p-3"
    >
      <p className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Sections
      </p>

      {SITE_CONTENT_ENTRIES.map(function renderEntry(entry) {
        const isSelected = entry.id === selectedEntry

        return (
          <button
            key={entry.id}
            type="button"
            aria-current={isSelected ? "true" : undefined}
            onClick={function handleClick() {
              selectEntry(entry.id)
              onSelect(entry)
            }}
            className={cn(
              "rounded-md px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            {entry.label}
          </button>
        )
      })}
    </nav>
  )
}
