import "server-only"

import { createHmac } from "node:crypto"

import { serverEnv } from "@/config/env.server"
import { RATE_LIMIT_WINDOW_MINUTES } from "@/data/contact.data"
import { buildContactNotification } from "@/emails/contact/contact-notification.template"
import {
  isHoneypotFilled,
  isOverSubmissionCount,
  isTooFast,
} from "@/features/contact/contact.rules"
import { createSupabaseAdminClient } from "@/lib/supabase/supabase.admin"
import { createEmailAdapter } from "@/server/integrations/email/email.adapter"
import type { ContactSubmitResult, ContactValues } from "@/types/contact.type"

type SupabaseAdminClient = ReturnType<typeof createSupabaseAdminClient>

export class ContactRejectedError extends Error {}

export function hashClientAddress(address: string | null): string | null {
  if (address === null || address.length === 0) {
    return null
  }

  const hmac = createHmac("sha256", serverEnv.SUPABASE_SECRET_KEY)
  hmac.update(address)

  return hmac.digest("hex")
}

async function isOverRateLimit(
  admin: SupabaseAdminClient,
  ipHash: string | null
): Promise<boolean> {
  if (ipHash === null) {
    return false
  }

  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString()

  const { count, error } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart)

  if (error !== null || count === null) {
    return false
  }

  return isOverSubmissionCount(count)
}

async function notifyOwner(
  admin: SupabaseAdminClient,
  messageId: number,
  values: ContactValues
): Promise<void> {
  const adapter = createEmailAdapter()
  const notification = buildContactNotification(values, serverEnv.OWNER_EMAIL)

  try {
    await adapter.send(notification)

    await admin
      .from("contact_messages")
      .update({ notified_at: new Date().toISOString(), notify_error: null })
      .eq("id", messageId)
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown"

    await admin
      .from("contact_messages")
      .update({ notify_error: reason.slice(0, 2000) })
      .eq("id", messageId)
  }
}

export async function submitContactMessage(
  values: ContactValues,
  clientAddress: string | null
): Promise<ContactSubmitResult> {
  if (isHoneypotFilled(values.website)) {
    throw new ContactRejectedError("honeypot")
  }

  if (isTooFast(values.renderedAt, Date.now())) {
    throw new ContactRejectedError("too_fast")
  }

  const admin = createSupabaseAdminClient()
  const ipHash = hashClientAddress(clientAddress)

  if (await isOverRateLimit(admin, ipHash)) {
    throw new ContactRejectedError("rate_limited")
  }

  const { data: inserted, error: insertError } = await admin
    .from("contact_messages")
    .insert({
      name: values.name,
      email: values.email,
      message: values.message,
      ip_hash: ipHash,
    })
    .select("id")
    .single()

  if (insertError !== null || inserted === null) {
    throw new Error("contact_persist_failed")
  }

  await notifyOwner(admin, inserted.id, values)

  return { received: true }
}
