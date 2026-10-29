"use client"

import { IconChevronRight } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTRPC } from "@/lib/trpc/client"
import { cn } from "@/lib/utils"
import type { ContactMessage } from "@/type/contact-message.type"
import { contactReplyHref } from "@/util/contact.util"

const receivedFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})
const headClass = "py-3 text-muted-foreground"
const cellClass = "py-3 align-top"
const frameClass = "rounded-lg border"
const toggleClass =
  "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden"

function ContactMessageRow({ message }: { message: ContactMessage }) {
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(!open)
  }

  let coverClass = "after:absolute after:inset-0"
  let iconClass = "size-4"
  let textClass = "truncate"
  if (open) {
    coverClass = ""
    iconClass = "size-4 rotate-90"
    textClass = "wrap-break-word whitespace-pre-wrap"
  }

  return (
    <TableRow>
      <TableCell className={cn(cellClass, "pl-4")}>
        <p className={cn("font-medium", textClass)}>{message.name}</p>
        <p className={cn("mt-1 text-xs text-muted-foreground", textClass)}>
          {message.email}
        </p>
      </TableCell>
      <TableCell className={cn(cellClass, "relative")}>
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-expanded={open}
            aria-label={`Message from ${message.name}`}
            onClick={toggle}
            className={cn(toggleClass, coverClass)}
          >
            <IconChevronRight aria-hidden className={iconClass} />
          </button>
          <p className={cn("min-w-0 flex-1", textClass)}>{message.message}</p>
        </div>
      </TableCell>
      <TableCell className={cn(cellClass, "truncate text-muted-foreground")}>
        <time dateTime={message.created_at}>
          {receivedFormat.format(new Date(message.created_at))}
        </time>
      </TableCell>
      <TableCell className={cn(cellClass, "pr-4 text-right")}>
        <a
          href={contactReplyHref(message.email)}
          aria-label={`Reply to ${message.name}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Reply
        </a>
      </TableCell>
    </TableRow>
  )
}

export function ContactMessageList() {
  const trpc = useTRPC()
  const messages = useQuery(trpc.contact.list.queryOptions())

  function retry() {
    messages.refetch()
  }

  if (messages.isPending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading...
      </p>
    )
  }
  if (messages.isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 text-sm">
        <p>Could not load the messages.</p>
        <Button
          variant="outline"
          disabled={messages.isFetching}
          onClick={retry}
        >
          Try again
        </Button>
      </div>
    )
  }
  if (messages.data.length === 0) {
    return (
      <div className={cn(frameClass, "px-4 py-10 text-center text-sm")}>
        <p className="font-medium">No messages yet.</p>
        <p className="mt-1 text-muted-foreground">
          Messages sent from the contact form show up here.
        </p>
      </div>
    )
  }
  return (
    <div className={cn(frameClass, "overflow-hidden")}>
      <Table className="min-w-160 table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className={cn(headClass, "w-56 pl-4")}>
              From
            </TableHead>
            <TableHead scope="col" className={headClass}>
              Message
            </TableHead>
            <TableHead scope="col" className={cn(headClass, "w-48")}>
              Received
            </TableHead>
            <TableHead scope="col" className="w-24">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.data.map((message) => (
            <ContactMessageRow key={message.id} message={message} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
