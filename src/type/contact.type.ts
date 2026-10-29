import type * as z from "zod"

import type { contactSchema } from "@/model/contact.model"

export type ContactInput = z.infer<typeof contactSchema>
