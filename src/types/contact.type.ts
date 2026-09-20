import type { z } from "zod"

import type { contactSchema } from "@/features/contact/schemas/contact.schema"
import type { Database } from "@/types/database.type"

export type ContactInput = z.input<typeof contactSchema>

export type ContactValues = z.output<typeof contactSchema>

export type ContactMessageRow =
  Database["public"]["Tables"]["contact_messages"]["Row"]

export type ContactMessageInsert =
  Database["public"]["Tables"]["contact_messages"]["Insert"]

export type ContactSubmitResult = {
  received: true
}

export type EmailMessage = {
  to: string
  replyTo: string
  subject: string
  html: string
  text: string
}

export type EmailDeliveryResult = {
  status: "previewed"
  reference: string
}

export type EmailAdapter = {
  send: (message: EmailMessage) => Promise<EmailDeliveryResult>
}
