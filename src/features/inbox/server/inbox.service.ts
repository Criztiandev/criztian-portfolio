import "server-only"

import { INBOX_LIST_COLUMNS, INBOX_MESSAGE_COLUMNS } from "@/data/inbox.data"
import {
  buildInboxListPage,
  buildInboxMessage,
} from "@/features/inbox/inbox.rules"
import { logError } from "@/server/logging/logger.service"
import type {
  InboxArchiveInput,
  InboxListInput,
  InboxListPage,
  InboxMessage,
  InboxReadInput,
  InboxSupabaseClient,
} from "@/types/inbox.type"

function selectView(supabase: InboxSupabaseClient, input: InboxListInput) {
  const query = supabase.from("contact_messages").select(INBOX_LIST_COLUMNS)

  if (input.view === "archived") {
    return query.not("archived_at", "is", null)
  }

  return query.is("archived_at", null)
}

export async function listInboxMessages(
  supabase: InboxSupabaseClient,
  input: InboxListInput,
  requestId: string | null
): Promise<InboxListPage> {
  const { data, error } = await selectView(supabase, input)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(input.limit + 1)

  if (error !== null) {
    logError({
      event: "inbox.list_failed",
      requestId,
      details: { view: input.view },
      error,
    })

    throw new Error("inbox_list_failed")
  }

  return buildInboxListPage(data, input.limit)
}

export async function readInboxMessage(
  supabase: InboxSupabaseClient,
  messageId: number,
  requestId: string | null
): Promise<InboxMessage | null> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select(INBOX_MESSAGE_COLUMNS)
    .eq("id", messageId)
    .maybeSingle()

  if (error !== null) {
    logError({
      event: "inbox.load_failed",
      requestId,
      details: { rowId: messageId },
      error,
    })

    throw new Error("inbox_load_failed")
  }

  if (data === null) {
    return null
  }

  return buildInboxMessage(data)
}

export async function countUnreadMessages(
  supabase: InboxSupabaseClient,
  requestId: string | null
): Promise<number | null> {
  const { count, error } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .is("archived_at", null)

  if (error !== null) {
    logError({
      event: "inbox.count_failed",
      requestId,
      error,
    })

    return null
  }

  return count
}

function updateReadState(supabase: InboxSupabaseClient, input: InboxReadInput) {
  const messages = supabase.from("contact_messages")

  if (input.isRead) {
    return messages
      .update({ read_at: new Date().toISOString() })
      .eq("id", input.id)
      .is("read_at", null)
  }

  return messages.update({ read_at: null }).eq("id", input.id)
}

function updateArchivedState(
  supabase: InboxSupabaseClient,
  input: InboxArchiveInput
) {
  const messages = supabase.from("contact_messages")

  if (input.isArchived) {
    return messages
      .update({ archived_at: new Date().toISOString() })
      .eq("id", input.id)
      .is("archived_at", null)
  }

  return messages.update({ archived_at: null }).eq("id", input.id)
}

export async function setMessageRead(
  supabase: InboxSupabaseClient,
  input: InboxReadInput,
  requestId: string | null
): Promise<void> {
  const { error } = await updateReadState(supabase, input)

  if (error !== null) {
    logError({
      event: "inbox.mark_failed",
      requestId,
      details: { rowId: input.id, isRead: input.isRead },
      error,
    })

    throw new Error("inbox_mark_failed")
  }
}

export async function setMessageArchived(
  supabase: InboxSupabaseClient,
  input: InboxArchiveInput,
  requestId: string | null
): Promise<void> {
  const { error } = await updateArchivedState(supabase, input)

  if (error !== null) {
    logError({
      event: "inbox.archive_failed",
      requestId,
      details: { rowId: input.id, isArchived: input.isArchived },
      error,
    })

    throw new Error("inbox_archive_failed")
  }
}

export async function deleteInboxMessage(
  supabase: InboxSupabaseClient,
  messageId: number,
  requestId: string | null
): Promise<void> {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", messageId)

  if (error !== null) {
    logError({
      event: "inbox.delete_failed",
      requestId,
      details: { rowId: messageId },
      error,
    })

    throw new Error("inbox_delete_failed")
  }
}
