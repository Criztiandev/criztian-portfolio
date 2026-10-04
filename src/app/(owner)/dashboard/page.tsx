import type { Metadata } from "next"
import Link from "next/link"

import { INBOX_COPY, INBOX_PATH } from "@/data/inbox.data"
import { EDITOR_PATH } from "@/data/site-content.data"
import { SignOutButton } from "@/features/auth/components/sign-out.button"
import { formatCountLabel } from "@/features/inbox/inbox.rules"
import { caller } from "@/server/trpc/trpc.server"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const [session, unreadCount] = await Promise.all([
    caller.auth.session(),
    caller.inbox.unreadCount(),
  ])

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <SignOutButton />
      </div>

      <p className="text-sm text-muted-foreground">
        Signed in as {session.email}
      </p>

      <Link
        href={INBOX_PATH}
        className="w-fit text-sm underline underline-offset-4"
      >
        {formatCountLabel(INBOX_COPY.dashboardLink, unreadCount)}
      </Link>

      <Link
        href={EDITOR_PATH}
        className="w-fit text-sm underline underline-offset-4"
      >
        Open the content editor
      </Link>
    </div>
  )
}
