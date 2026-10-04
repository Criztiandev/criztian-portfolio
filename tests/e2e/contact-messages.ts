import type { ContactService } from "@/types/contact.type"
import type { Database } from "@/types/database.type"

import { createAdminClient } from "./owner-account"

export type TestMessage = {
  name: string
  email: string
  message: string
  service: ContactService
  createdAt?: string
}

export const INBOX_RUN_PREFIX = "inbox-e2e"

export const CONTACT_RUN_PREFIX = "contact-e2e"

export function createRunMarker(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

export async function insertTestMessages(
  messages: TestMessage[]
): Promise<number[]> {
  const admin = createAdminClient()
  const rows = []

  for (const message of messages) {
    const row: Database["public"]["Tables"]["contact_messages"]["Insert"] = {
      name: message.name,
      email: message.email,
      message: message.message,
      service: message.service,
    }

    if (message.createdAt !== undefined) {
      row.created_at = message.createdAt
    }

    rows.push(row)
  }

  const { data, error } = await admin
    .from("contact_messages")
    .insert(rows, { defaultToNull: false })
    .select("id")

  if (error !== null || data === null) {
    throw new Error(`Could not insert the test messages: ${error?.message}`)
  }

  const ids: number[] = []

  for (const row of data) {
    ids.push(row.id)
  }

  return ids
}

export async function deleteMessagesContaining(
  marker: string,
  senderEmail: string
): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin
    .from("contact_messages")
    .delete()
    .eq("email", senderEmail)
    .like("message", `%${marker}%`)

  if (error !== null) {
    throw new Error(`Could not delete the test messages: ${error.message}`)
  }
}

export async function readMessageState(messageId: number) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("contact_messages")
    .select("read_at, archived_at")
    .eq("id", messageId)
    .maybeSingle()

  if (error !== null) {
    throw new Error(`Could not read the test message: ${error.message}`)
  }

  return data
}

export async function countUnreadMessages(): Promise<number> {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .is("archived_at", null)

  if (error !== null || count === null) {
    throw new Error(`Could not count the unread messages: ${error?.message}`)
  }

  return count
}

export async function countInboxMessages(): Promise<number> {
  const admin = createAdminClient()
  const { count, error } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .is("archived_at", null)

  if (error !== null || count === null) {
    throw new Error(`Could not count the inbox: ${error?.message}`)
  }

  return count
}
