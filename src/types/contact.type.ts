import type { z } from "zod"

import type { CONTACT_SERVICES } from "@/data/contact.data"
import type { contactSchema } from "@/features/contact/schemas/contact.schema"

export type ContactInput = z.input<typeof contactSchema>

export type ContactValues = z.output<typeof contactSchema>

export type ContactService = (typeof CONTACT_SERVICES)[number]

export type ContactFieldErrorProps = {
  id: string
  message: string | undefined
}

export type ContactSubmitResult = {
  received: true
}

export type ContactRejectionReason = "honeypot" | "too_fast" | "rate_limited"

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
