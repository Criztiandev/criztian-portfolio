import { TRPCError } from "@trpc/server"

import { INBOX_COPY, INBOX_LOAD_FAILED_MESSAGE } from "@/data/inbox.data"
import {
  inboxArchiveSchema,
  inboxListSchema,
  inboxMessageIdSchema,
  inboxReadSchema,
} from "@/features/inbox/schemas/inbox.schema"
import {
  countUnreadMessages,
  deleteInboxMessage,
  listInboxMessages,
  readInboxMessage,
  setMessageArchived,
  setMessageRead,
} from "@/features/inbox/server/inbox.service"
import { createTRPCRouter, ownerProcedure } from "@/server/trpc/trpc.init"
import type { InboxListPage, InboxMessage } from "@/types/inbox.type"

function failWith(message: string, error: unknown): TRPCError {
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: error,
  })
}

export const inboxRouter = createTRPCRouter({
  list: ownerProcedure.input(inboxListSchema).query(async function list({
    ctx,
    input,
  }): Promise<InboxListPage> {
    try {
      return await listInboxMessages(ctx.supabase, input, ctx.requestId)
    } catch (error) {
      throw failWith(INBOX_LOAD_FAILED_MESSAGE, error)
    }
  }),

  message: ownerProcedure
    .input(inboxMessageIdSchema)
    .query(async function message({
      ctx,
      input,
    }): Promise<InboxMessage | null> {
      try {
        return await readInboxMessage(ctx.supabase, input.id, ctx.requestId)
      } catch (error) {
        throw failWith(INBOX_LOAD_FAILED_MESSAGE, error)
      }
    }),

  unreadCount: ownerProcedure.query(async function unreadCount({
    ctx,
  }): Promise<number | null> {
    return countUnreadMessages(ctx.supabase, ctx.requestId)
  }),

  setRead: ownerProcedure
    .input(inboxReadSchema)
    .mutation(async function setRead({ ctx, input }) {
      try {
        await setMessageRead(ctx.supabase, input, ctx.requestId)
      } catch (error) {
        throw failWith(INBOX_COPY.updateFailed, error)
      }

      return { ok: true as const }
    }),

  setArchived: ownerProcedure
    .input(inboxArchiveSchema)
    .mutation(async function setArchived({ ctx, input }) {
      try {
        await setMessageArchived(ctx.supabase, input, ctx.requestId)
      } catch (error) {
        throw failWith(INBOX_COPY.updateFailed, error)
      }

      return { ok: true as const }
    }),

  remove: ownerProcedure
    .input(inboxMessageIdSchema)
    .mutation(async function remove({ ctx, input }) {
      try {
        await deleteInboxMessage(ctx.supabase, input.id, ctx.requestId)
      } catch (error) {
        throw failWith(INBOX_COPY.deleteFailed, error)
      }

      return { ok: true as const }
    }),
})
