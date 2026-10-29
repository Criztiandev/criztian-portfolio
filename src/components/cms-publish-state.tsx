import { cn } from "@/lib/utils"
import type { CmsPublishState } from "@/type/cms.type"

const labels: Record<CmsPublishState, string> = {
  draft: "Draft",
  changed: "Changes not published",
  published: "Published",
}

const dotClasses: Record<CmsPublishState, string> = {
  draft: "bg-muted-foreground",
  changed: "bg-warning",
  published: "bg-success",
}

export function CmsPublishStateLabel({ state }: { state: CmsPublishState }) {
  return (
    <span className="flex items-center gap-2 text-xs font-medium whitespace-nowrap">
      <span
        aria-hidden
        className={cn("size-2 shrink-0 rounded-full", dotClasses[state])}
      />
      {labels[state]}
    </span>
  )
}
