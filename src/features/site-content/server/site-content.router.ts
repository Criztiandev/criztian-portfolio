import { TRPCError } from "@trpc/server"
import { revalidatePath } from "next/cache"

import {
  SITE_CONTENT_PUBLIC_PATH,
  SITE_CONTENT_PUBLISH_FAILED_MESSAGE,
  SITE_CONTENT_READ_FAILED_MESSAGE,
  SITE_CONTENT_SAVE_FAILED_MESSAGE,
} from "@/data/site-content.data"
import { siteContentSchema } from "@/features/site-content/schemas/site-content.schema"
import {
  publishDraftContent,
  readDraftContent,
  saveDraftContent,
} from "@/features/site-content/server/site-content.service"
import { createTRPCRouter, ownerProcedure } from "@/server/trpc/trpc.init"
import type {
  SiteContentDraftState,
  SiteContentPublishResult,
  SiteContentSaveResult,
} from "@/types/site-content.type"

export const siteContentRouter = createTRPCRouter({
  getDraft: ownerProcedure.query(async function getDraft({
    ctx,
  }): Promise<SiteContentDraftState> {
    try {
      return await readDraftContent(ctx.requestId)
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: SITE_CONTENT_READ_FAILED_MESSAGE,
        cause: error,
      })
    }
  }),

  saveDraft: ownerProcedure
    .input(siteContentSchema)
    .mutation(async function saveDraft({
      ctx,
      input,
    }): Promise<SiteContentSaveResult> {
      try {
        return await saveDraftContent(input, ctx.requestId)
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: SITE_CONTENT_SAVE_FAILED_MESSAGE,
          cause: error,
        })
      }
    }),

  publish: ownerProcedure.mutation(async function publish({
    ctx,
  }): Promise<SiteContentPublishResult> {
    try {
      const result = await publishDraftContent(ctx.requestId)

      revalidatePath(SITE_CONTENT_PUBLIC_PATH)

      return result
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: SITE_CONTENT_PUBLISH_FAILED_MESSAGE,
        cause: error,
      })
    }
  }),
})
