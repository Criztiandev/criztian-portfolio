"use client"

import { IconDots } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

import { CmsPublishStateLabel } from "@/components/cms-publish-state"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { useTRPC } from "@/lib/trpc/client"
import { cn } from "@/lib/utils"
import type { CmsListCell, CmsListRow } from "@/type/cms.type"

const updatedFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })
const headClass = "px-2 py-3 font-medium"
const cellClass = "px-2 py-3"
const frameClass = "rounded-lg border"
const deleteClass =
  "bg-destructive text-background hover:bg-[color-mix(in_oklch,var(--destructive),var(--foreground)_10%)]"

function CmsEntryCell({ cell }: { cell: CmsListCell }) {
  if (typeof cell === "string") {
    return <span className="block truncate">{cell}</span>
  }
  return (
    <Badge variant={cell.tone} className="h-6">
      {cell.label}
    </Badge>
  )
}

function CmsEntrySummary({ summary }: { summary: string }) {
  if (summary === "") {
    return null
  }
  return (
    <p className="mt-1 truncate text-xs text-muted-foreground">{summary}</p>
  )
}

export function CmsEntryTable({
  collection,
  singular,
  columns,
}: {
  collection: string
  singular: string
  columns: string[]
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [target, setTarget] = useState<CmsListRow | null>(null)
  const [confirming, setConfirming] = useState(false)
  const entries = useQuery(trpc.cms.list.queryOptions({ collection }))
  const remove = useMutation(
    trpc.cms.delete.mutationOptions({
      onSuccess() {
        setConfirming(false)
        toast.add({ title: `${singular} deleted`, type: "success" })
      },
      onSettled() {
        return queryClient.invalidateQueries(
          trpc.cms.list.queryFilter({ collection })
        )
      },
    })
  )
  const noun = singular.toLowerCase()

  function askToDelete(row: CmsListRow) {
    remove.reset()
    setTarget(row)
    setConfirming(true)
  }

  function confirmDelete() {
    if (target !== null) {
      remove.mutate({ id: target.id })
    }
  }

  function retry() {
    entries.refetch()
  }

  if (entries.isPending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading...
      </p>
    )
  }
  if (entries.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 text-sm">
        <p>Could not load this list.</p>
        <Button variant="outline" disabled={entries.isFetching} onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }
  if (entries.data.length === 0) {
    return (
      <div className={cn(frameClass, "px-4 py-10 text-center text-sm")}>
        <p className="font-medium">Nothing here yet.</p>
        <p className="mt-1 text-muted-foreground">
          Use New {noun} to add the first one.
        </p>
      </div>
    )
  }

  let description = "It comes off the site right away. You can't undo this."
  if (target !== null && target.state === "draft") {
    description =
      "It was never published, so the site won't change. You can't undo this."
  }
  let deleteLabel = "Delete"
  if (remove.isPending) {
    deleteLabel = "Deleting..."
  }
  let deleteError = null
  if (remove.isError) {
    deleteError = (
      <p role="alert" className="text-sm text-destructive">
        {remove.error.message}
      </p>
    )
  }
  let targetTitle = ""
  if (target !== null) {
    targetTitle = target.title
  }
  const fixedWidth = 34 + 44 + 14
  const flexibleWidth = (columns.length + 1) * 40
  const minWidth = `calc(var(--spacing) * ${fixedWidth + flexibleWidth})`

  return (
    <>
      <div className={cn(frameClass, "relative overflow-x-auto")}>
        <table
          className="w-full table-fixed text-left text-sm"
          style={{ minWidth }}
        >
          <thead>
            <tr className="border-b text-muted-foreground">
              <th scope="col" className={cn(headClass, "pl-4")}>
                Title
              </th>
              {columns.map((column, index) => (
                <th key={index} scope="col" className={cn(headClass, "w-40")}>
                  {column}
                </th>
              ))}
              <th scope="col" className={cn(headClass, "w-34")}>
                Updated
              </th>
              <th scope="col" className={cn(headClass, "w-44")}>
                Site
              </th>
              <th scope="col" className="w-14">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.data.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                <td className={cn(cellClass, "relative pl-4")}>
                  <Link
                    href={`/editor/${collection}/${row.id}`}
                    prefetch={false}
                    className="block truncate rounded-sm font-medium after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden"
                  >
                    {row.title}
                  </Link>
                  <CmsEntrySummary summary={row.summary} />
                </td>
                {row.cells.map((cell, index) => (
                  <td key={index} className={cellClass}>
                    <CmsEntryCell cell={cell} />
                  </td>
                ))}
                <td className={cn(cellClass, "truncate text-muted-foreground")}>
                  <time dateTime={row.updatedAt}>
                    {updatedFormat.format(new Date(row.updatedAt))}
                  </time>
                </td>
                <td className={cellClass}>
                  <CmsPublishStateLabel state={row.state} />
                </td>
                <td className="py-3 pr-4 pl-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${row.title}`}
                        />
                      }
                    >
                      <IconDots aria-hidden />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        render={
                          <Link href={`/editor/${collection}/${row.id}`} />
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => askToDelete(row)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun}?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{targetTitle}</span>
              <br />
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={deleteClass}
              disabled={remove.isPending}
              onClick={confirmDelete}
            >
              {deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
