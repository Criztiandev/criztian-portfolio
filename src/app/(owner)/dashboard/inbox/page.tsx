import type { Metadata } from "next"

import { INBOX_COPY } from "@/data/inbox.data"
import { Inbox } from "@/features/inbox/components/inbox.component"
import { parseInboxLocation } from "@/features/inbox/inbox.rules"
import { caller } from "@/server/trpc/trpc.server"
import type { InboxMessage } from "@/types/inbox.type"

export const metadata: Metadata = {
  title: INBOX_COPY.pageTitle,
  robots: { index: false, follow: false },
}

async function loadOpenMessage(
  messageId: number | null
): Promise<InboxMessage | null> {
  if (messageId === null) {
    return null
  }

  return caller.inbox.message({ id: messageId })
}

export default async function InboxPage({
  searchParams,
}: PageProps<"/dashboard/inbox">) {
  const location = parseInboxLocation(await searchParams)

  const [page, unreadCount, message] = await Promise.all([
    caller.inbox.list({ view: location.view, limit: location.shown }),
    caller.inbox.unreadCount(),
    loadOpenMessage(location.messageId),
  ])

  return (
    <Inbox
      location={location}
      page={page}
      unreadCount={unreadCount}
      message={message}
    />
  )
}
