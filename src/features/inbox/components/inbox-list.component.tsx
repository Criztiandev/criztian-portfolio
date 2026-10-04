import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { CONTACT_SERVICE_LABELS } from "@/data/contact.data"
import {
  INBOX_COPY,
  INBOX_LIST_HEADING_ID,
  INBOX_LIST_ID,
  INBOX_MAX_SHOWN,
  INBOX_PAGE_SIZE,
} from "@/data/inbox.data"
import { InboxDate } from "@/features/inbox/components/inbox-date.component"
import {
  buildInboxHref,
  formatCountLabel,
  readNextShownCount,
} from "@/features/inbox/inbox.rules"
import { cn } from "@/lib/utils"
import type {
  InboxListItem,
  InboxListPage,
  InboxLocation,
  InboxView,
} from "@/types/inbox.type"

function readOtherView(view: InboxView): InboxView {
  if (view === "inbox") {
    return "archived"
  }

  return "inbox"
}

function readHeading(view: InboxView, unreadCount: number | null): string {
  if (view === "inbox") {
    return formatCountLabel(INBOX_COPY.viewTitles.inbox, unreadCount)
  }

  return INBOX_COPY.viewTitles.archived
}

function readPreviewClass(isRead: boolean, isOpen: boolean): string {
  if (isOpen) {
    return "text-accent-foreground"
  }

  if (isRead) {
    return "text-muted-foreground"
  }

  return "text-foreground"
}

function InboxListRow({
  item,
  location,
}: Readonly<{ item: InboxListItem; location: InboxLocation }>) {
  const isOpen = item.id === location.messageId
  const href = buildInboxHref({ ...location, messageId: item.id })

  return (
    <li>
      <Link
        href={href}
        aria-current={isOpen ? "page" : undefined}
        data-unread={item.isRead ? undefined : ""}
        className={cn(
          "relative grid grid-cols-[0.5rem_minmax(0,1fr)_auto] items-baseline gap-x-2.5 gap-y-1 border-b px-4 py-3 text-sm transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground",
          isOpen &&
            "bg-accent hover:bg-accent forced-colors:outline forced-colors:-outline-offset-4"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-2 self-center rounded-full",
            !item.isRead && "bg-foreground forced-colors:bg-[CanvasText]"
          )}
        />
        {item.isRead ? null : (
          <span className="sr-only">{INBOX_COPY.newMarker}</span>
        )}{" "}
        <span
          className={cn(
            "truncate",
            item.isRead ? "font-normal" : "font-semibold"
          )}
        >
          {item.name}
        </span>{" "}
        <span
          className={cn(
            "flex gap-3 text-xs whitespace-nowrap",
            isOpen ? "text-accent-foreground" : "text-muted-foreground"
          )}
        >
          {item.service === null ? null : (
            <span>{CONTACT_SERVICE_LABELS[item.service]}</span>
          )}{" "}
          <InboxDate iso={item.receivedAt} format="list" />
        </span>{" "}
        <span
          className={cn(
            "col-span-2 col-start-2 truncate",
            readPreviewClass(item.isRead, isOpen)
          )}
        >
          {item.preview}
        </span>
      </Link>
    </li>
  )
}

export function InboxList({
  location,
  page,
  unreadCount,
  className,
}: Readonly<{
  location: InboxLocation
  page: InboxListPage
  unreadCount: number | null
  className?: string
}>) {
  const otherView = readOtherView(location.view)
  const switchHref = buildInboxHref({
    view: otherView,
    messageId: null,
    shown: INBOX_PAGE_SIZE,
  })
  const olderHref = buildInboxHref({
    ...location,
    shown: readNextShownCount(location.shown),
  })

  return (
    <section
      aria-labelledby={INBOX_LIST_HEADING_ID}
      className={cn(
        "flex w-full flex-col md:w-80 md:shrink-0 md:overflow-y-auto md:border-r lg:w-96",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <h1
          id={INBOX_LIST_HEADING_ID}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          {readHeading(location.view, unreadCount)}
        </h1>

        <Link
          href={switchHref}
          className={buttonVariants({ variant: "ghost" })}
        >
          {INBOX_COPY.viewTitles[otherView]}
        </Link>
      </div>

      {page.items.length === 0 ? (
        <p className="border-t px-4 py-6 text-sm text-muted-foreground">
          {INBOX_COPY.emptyLists[location.view]}
        </p>
      ) : (
        <ul id={INBOX_LIST_ID} className="border-t">
          {page.items.map(function renderItem(item) {
            return (
              <InboxListRow key={item.id} item={item} location={location} />
            )
          })}
        </ul>
      )}

      {page.hasOlder && location.shown < INBOX_MAX_SHOWN ? (
        <div className="px-4 py-4">
          <Link
            href={olderHref}
            scroll={false}
            className={buttonVariants({ variant: "outline" })}
          >
            {INBOX_COPY.showOlder}
          </Link>
        </div>
      ) : null}
    </section>
  )
}
