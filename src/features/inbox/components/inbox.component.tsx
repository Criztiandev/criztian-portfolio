import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { DASHBOARD_PATH } from "@/data/auth.data"
import { INBOX_COPY } from "@/data/inbox.data"
import { InboxFocus } from "@/features/inbox/components/inbox-focus.component"
import { InboxList } from "@/features/inbox/components/inbox-list.component"
import { InboxMessagePane } from "@/features/inbox/components/inbox-message.component"
import { buildInboxHref } from "@/features/inbox/inbox.rules"
import { cn } from "@/lib/utils"
import type {
  InboxListPage,
  InboxLocation,
  InboxMessage,
} from "@/types/inbox.type"

export function Inbox({
  location,
  page,
  unreadCount,
  message,
}: Readonly<{
  location: InboxLocation
  page: InboxListPage
  unreadCount: number | null
  message: InboxMessage | null
}>) {
  const isMessageOpen = location.messageId !== null
  const listHref = buildInboxHref({ ...location, messageId: null })

  return (
    <div className="flex min-h-svh flex-col md:h-svh">
      <header className="flex h-14 shrink-0 items-center border-b px-2 md:px-4">
        <Link
          href={DASHBOARD_PATH}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            isMessageOpen && "max-md:hidden"
          )}
        >
          <ArrowLeft aria-hidden />
          {INBOX_COPY.backToDashboard}
        </Link>

        {isMessageOpen ? (
          <Link
            href={listHref}
            className={cn(buttonVariants({ variant: "ghost" }), "md:hidden")}
          >
            <ArrowLeft aria-hidden />
            {INBOX_COPY.viewTitles[location.view]}
          </Link>
        ) : null}
      </header>

      <main className="flex min-h-0 flex-1">
        <InboxList
          location={location}
          page={page}
          unreadCount={unreadCount}
          className={isMessageOpen ? "max-md:hidden" : undefined}
        />

        <InboxMessagePane location={location} message={message} />
      </main>

      <InboxFocus messageId={location.messageId} shown={location.shown} />
    </div>
  )
}
