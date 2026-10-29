import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/trpc/init"
import { contactSchema } from "@/model/contact.model"
import { listContactMessages } from "@/repository/contact-message.repository"
import { submitContact } from "@/service/contact.service"

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(contactSchema)
    .mutation(async ({ ctx, input }) => {
      await submitContact(ctx.db, input)
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return listContactMessages(ctx.db)
  }),
})
