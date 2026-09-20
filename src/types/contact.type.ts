import type { z } from "zod"

import type { contactSchema } from "@/features/contact/schemas/contact.schema"

export type ContactInput = z.input<typeof contactSchema>

export type ContactValues = z.output<typeof contactSchema>

export type ContactFieldName = "name" | "email" | "message"
