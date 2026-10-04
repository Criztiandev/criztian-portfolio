"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { INBOX_COPY } from "@/data/inbox.data"
import { useTRPC } from "@/lib/trpc/trpc.client"

export function InboxMessageActions({
  messageId,
  isRead,
  isArchived,
  listHref,
}: Readonly<{
  messageId: number
  isRead: boolean
  isArchived: boolean
  listHref: string
}>) {
  const router = useRouter()
  const trpc = useTRPC()
  const refreshAfterChange = {
    onSuccess: function refreshInbox() {
      router.refresh()
    },
  }
  const markRead = useMutation(
    trpc.inbox.setRead.mutationOptions(refreshAfterChange)
  )
  const markUnread = useMutation(
    trpc.inbox.setRead.mutationOptions(refreshAfterChange)
  )
  const archive = useMutation(
    trpc.inbox.setArchived.mutationOptions(refreshAfterChange)
  )
  const remove = useMutation(
    trpc.inbox.remove.mutationOptions(refreshAfterChange)
  )
  const markReadOnOpen = markRead.mutate

  useEffect(
    function markReadWhenOpened() {
      if (isRead) {
        return
      }

      markReadOnOpen({ id: messageId, isRead: true })
    },
    [isRead, markReadOnOpen, messageId]
  )

  const isBusy =
    markRead.isPending ||
    markUnread.isPending ||
    archive.isPending ||
    remove.isPending

  function readFailure(): string {
    if (remove.isError) {
      return INBOX_COPY.deleteFailed
    }

    if (markRead.isError || markUnread.isError || archive.isError) {
      return INBOX_COPY.updateFailed
    }

    return ""
  }

  function returnToList() {
    router.replace(listHref)
  }

  function onMarkUnread() {
    markUnread.mutate(
      { id: messageId, isRead: false },
      { onSuccess: returnToList }
    )
  }

  function onToggleArchive() {
    archive.mutate(
      { id: messageId, isArchived: !isArchived },
      { onSuccess: returnToList }
    )
  }

  function onDelete() {
    if (!window.confirm(INBOX_COPY.deleteConfirm)) {
      return
    }

    remove.mutate({ id: messageId }, { onSuccess: returnToList })
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onMarkUnread}
          disabled={isBusy}
        >
          {INBOX_COPY.markUnread}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onToggleArchive}
          disabled={isBusy}
        >
          {isArchived ? INBOX_COPY.restore : INBOX_COPY.archive}
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={isBusy}
          className="focus-visible:border-ring focus-visible:ring-ring/50"
        >
          {INBOX_COPY.delete}
        </Button>
      </div>

      <p role="alert" className="text-sm text-destructive not-empty:mt-3">
        {readFailure()}
      </p>
    </div>
  )
}
