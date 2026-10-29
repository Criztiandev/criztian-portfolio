import { fromPostgrestError } from "@/error/app.error"
import type {
  ContactMessage,
  ContactMessageInsert,
} from "@/type/contact-message.type"
import type { Db } from "@/type/supabase.type"

export async function insertContactMessage(
  db: Db,
  row: ContactMessageInsert
): Promise<void> {
  const { error } = await db.from("contact_messages").insert(row)
  if (error !== null) {
    throw fromPostgrestError(error, "Could not save the contact message")
  }
}

export async function listContactMessages(db: Db): Promise<ContactMessage[]> {
  const { data, error } = await db
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)
  if (error !== null) {
    throw fromPostgrestError(error, "Could not load contact messages")
  }
  return data
}
