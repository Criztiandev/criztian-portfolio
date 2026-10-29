import { cmsCollections } from "@/config/cms.config"
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init"
import {
  buildCmsWriteSchema,
  cmsEntryIdSchema,
  cmsListSchema,
} from "@/model/cms.model"
import { getEntry } from "@/repository/cms-entry.repository"
import {
  createEntry,
  deleteEntry,
  listEntryRows,
  publishEntry,
  saveDraft,
} from "@/service/cms.service"

const cmsWriteSchema = buildCmsWriteSchema(cmsCollections)
const cmsSaveDraftSchema = cmsWriteSchema.and(cmsEntryIdSchema)

export const cmsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(cmsListSchema)
    .query(async ({ ctx, input }) => {
      return listEntryRows(ctx.db, input.collection)
    }),
  get: protectedProcedure
    .input(cmsEntryIdSchema)
    .query(async ({ ctx, input }) => {
      return getEntry(ctx.db, input.id)
    }),
  create: protectedProcedure
    .input(cmsWriteSchema)
    .mutation(async ({ ctx, input }) => {
      return createEntry(ctx.db, input)
    }),
  saveDraft: protectedProcedure
    .input(cmsSaveDraftSchema)
    .mutation(async ({ ctx, input }) => {
      await saveDraft(ctx.db, input)
    }),
  publish: protectedProcedure
    .input(cmsEntryIdSchema)
    .mutation(async ({ ctx, input }) => {
      await publishEntry(ctx.db, input.id)
    }),
  delete: protectedProcedure
    .input(cmsEntryIdSchema)
    .mutation(async ({ ctx, input }) => {
      await deleteEntry(ctx.db, input.id)
    }),
})
