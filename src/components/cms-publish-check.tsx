import { useMutation } from "@tanstack/react-query"
import { format, isValid, parseISO } from "date-fns"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useTRPC } from "@/lib/trpc/client"
import { cn } from "@/lib/utils"
import type {
  CmsChange,
  CmsFieldType,
  CmsPublishTarget,
  CmsValue,
} from "@/type/cms.type"
import { cmsValueText } from "@/util/cms.util"

const actionClass =
  "px-4 aria-disabled:pointer-events-none aria-disabled:opacity-50"
const valueClass = "block wrap-break-word whitespace-pre-wrap"

function changeText(type: CmsFieldType, value: CmsValue | null): string {
  const text = cmsValueText(value)
  if (type !== "date") {
    return text
  }
  const day = parseISO(text)
  if (!isValid(day)) {
    return text
  }
  return format(day, "MMM d, yyyy")
}

function CmsChangeRow({ change }: { change: CmsChange }) {
  const before = changeText(change.type, change.before)
  const after = changeText(change.type, change.after)
  let oldValue = null
  let emptyText = "Empty"
  if (before !== "") {
    emptyText = "Removed"
    oldValue = (
      <del className={cn(valueClass, "text-muted-foreground")}>
        <span className="sr-only">Before: </span>
        {before}
      </del>
    )
  }
  let newValue = <span className="text-muted-foreground">{emptyText}</span>
  if (after !== "") {
    newValue = (
      <ins className={cn(valueClass, "no-underline")}>
        <span className="sr-only">After: </span>
        {after}
      </ins>
    )
  }
  return (
    <li className="flex flex-col gap-1 border-b p-3 last:border-b-0">
      <span className="text-xs text-muted-foreground">{change.label}</span>
      {oldValue}
      {newValue}
    </li>
  )
}

export function CmsPublishCheck({
  noun,
  disabled,
  onCheck,
  onClosed,
  onPublished,
}: {
  noun: string
  disabled: boolean
  onCheck: () => Promise<CmsPublishTarget | null>
  onClosed: (id: number) => void
  onPublished: (id: number) => Promise<void>
}) {
  const trpc = useTRPC()
  const [checking, setChecking] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [target, setTarget] = useState<CmsPublishTarget | null>(null)
  const publish = useMutation(
    trpc.cms.publish.mutationOptions({
      onSuccess(_published, variables) {
        setChecking(false)
        toast.add({ title: "Published", type: "success" })
        return onPublished(variables.id)
      },
    })
  )

  async function check() {
    if (preparing) {
      return
    }
    publish.reset()
    setPreparing(true)
    const next = await onCheck()
    setPreparing(false)
    if (next === null) {
      return
    }
    setTarget(next)
    setChecking(true)
  }

  function changeOpen(open: boolean) {
    setChecking(open)
    if (!open && target !== null) {
      onClosed(target.id)
    }
  }

  function confirmPublish() {
    if (target !== null) {
      publish.mutate({ id: target.id })
    }
  }

  let shown: CmsChange[] = []
  if (target !== null) {
    shown = target.changes
  }

  let publishLabel = "Publish"
  if (publish.isPending) {
    publishLabel = "Publishing..."
  }
  let publishError = null
  if (publish.isError) {
    let message = publish.error.message
    if (publish.error.data?.code === "CONFLICT") {
      message = `Another ${noun} already uses this slug`
    }
    publishError = (
      <p role="alert" className="text-sm text-destructive">
        {message}
      </p>
    )
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className={actionClass}
        disabled={disabled}
        focusableWhenDisabled
        aria-busy={preparing}
        onClick={check}
      >
        Publish
      </Button>
      <AlertDialog open={checking} onOpenChange={changeOpen}>
        <AlertDialogContent className="rounded-lg p-6 shadow-lg data-[size=default]:sm:max-w-lg">
          <AlertDialogHeader className="gap-1">
            <AlertDialogTitle className="font-semibold">
              Publish this {noun}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              It goes live on the site right away. Check what changed first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul
            aria-label="Changes"
            tabIndex={0}
            className="max-h-[50vh] overflow-y-auto rounded-md border text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {shown.map((change) => (
              <CmsChangeRow key={change.name} change={change} />
            ))}
          </ul>
          {publishError}
          <AlertDialogFooter className="m-0 rounded-none border-t-0 bg-transparent p-0">
            <AlertDialogCancel
              size="lg"
              className={actionClass}
              disabled={publish.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              size="lg"
              className={actionClass}
              disabled={publish.isPending}
              focusableWhenDisabled
              onClick={confirmPublish}
            >
              {publishLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
