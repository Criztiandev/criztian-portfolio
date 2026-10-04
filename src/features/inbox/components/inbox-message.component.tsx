import { ArrowUpRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { CONTACT_SERVICE_LABELS } from "@/data/contact.data"
import { INBOX_COPY, INBOX_MESSAGE_HEADING_ID } from "@/data/inbox.data"
import { InboxDate } from "@/features/inbox/components/inbox-date.component"
import { InboxMessageActions } from "@/features/inbox/components/inbox-message-actions.component"
import { buildInboxHref, buildReplyHref } from "@/features/inbox/inbox.rules"
import type {
  InboxLocation,
  InboxMessage,
  InboxNotification,
} from "@/types/inbox.type"

function NotificationStatus({
  notification,
}: Readonly<{ notification: InboxNotification }>) {
  if (notification.status === "notified") {
    return (
      <>
        {INBOX_COPY.notifiedAt}{" "}
        <InboxDate iso={notification.notifiedAt} format="time" />
      </>
    )
  }

  if (notification.status === "failed") {
    return <>{INBOX_COPY.notifyFailed}</>
  }

  return <>{INBOX_COPY.notNotified}</>
}

function MessageDetails({
  message,
  listHref,
}: Readonly<{ message: InboxMessage; listHref: string }>) {
  return (
    <article
      aria-labelledby={INBOX_MESSAGE_HEADING_ID}
      className="flex max-w-3xl flex-col gap-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2
            id={INBOX_MESSAGE_HEADING_ID}
            tabIndex={-1}
            className="text-lg font-semibold break-words outline-none"
          >
            {message.name}
          </h2>

          <p className="text-sm break-all">{message.email}</p>

          <p className="text-sm text-muted-foreground">
            {message.service === null ? null : (
              <>
                {CONTACT_SERVICE_LABELS[message.service]}
                {INBOX_COPY.separator}
              </>
            )}
            <InboxDate iso={message.receivedAt} format="full" />
          </p>

          <p className="text-xs text-muted-foreground">
            <NotificationStatus notification={message.notification} />
          </p>
        </div>

        <a
          href={buildReplyHref(message.email)}
          className={buttonVariants({ variant: "outline" })}
        >
          {INBOX_COPY.reply}
          <ArrowUpRight aria-hidden />
        </a>
      </header>

      <p className="border-t pt-6 text-sm/relaxed break-words whitespace-pre-wrap">
        {message.message}
      </p>

      <InboxMessageActions
        key={message.id}
        messageId={message.id}
        isRead={message.isRead}
        isArchived={message.isArchived}
        listHref={listHref}
      />
    </article>
  )
}

export function InboxMessagePane({
  location,
  message,
}: Readonly<{
  location: InboxLocation
  message: InboxMessage | null
}>) {
  const listHref = buildInboxHref({ ...location, messageId: null })

  if (location.messageId === null) {
    return (
      <section className="hidden min-w-0 flex-1 items-center justify-center p-6 md:flex">
        <p className="text-sm text-muted-foreground">
          {INBOX_COPY.noneSelected}
        </p>
      </section>
    )
  }

  return (
    <section className="min-w-0 flex-1 px-4 py-6 md:overflow-y-auto md:px-8">
      {message === null ? (
        <p
          id={INBOX_MESSAGE_HEADING_ID}
          tabIndex={-1}
          className="text-sm text-muted-foreground outline-none"
        >
          {INBOX_COPY.missing}
        </p>
      ) : (
        <MessageDetails message={message} listHref={listHref} />
      )}
    </section>
  )
}
