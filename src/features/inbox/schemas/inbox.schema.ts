import { z } from "zod"

import { INBOX_MAX_SHOWN, INBOX_VIEWS } from "@/data/inbox.data"

export const inboxMessageIdSchema = z.object({
  id: z.number().int().positive(),
})

export const inboxListSchema = z.object({
  view: z.enum(INBOX_VIEWS),
  limit: z.number().int().positive().max(INBOX_MAX_SHOWN),
})

export const inboxReadSchema = inboxMessageIdSchema.extend({
  isRead: z.boolean(),
})

export const inboxArchiveSchema = inboxMessageIdSchema.extend({
  isArchived: z.boolean(),
})
