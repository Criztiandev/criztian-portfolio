import { TRPCError } from "@trpc/server"
import { headers } from "next/headers"

import {
  CONTACT_ACKNOWLEDGEMENT,
  CONTACT_REJECTED_MESSAGE,
} from "@/data/contact.data"
import { contactSchema } from "@/features/contact/schemas/contact.schema"
import { readClientAddress } from "@/features/contact/contact.rules"
import {
  ContactRejectedError,
  submitContactMessage,
} from "@/features/contact/server/contact.service"
import { baseProcedure, createTRPCRouter } from "@/server/trpc/trpc.init"

export const contactRouter = createTRPCRouter({
  submit: baseProcedure.input(contactSchema).mutation(async function submit({
    ctx,
    input,
  }) {
    const requestHeaders = await headers()
    const clientAddress = readClientAddress(requestHeaders)

    try {
      await submitContactMessage(input, clientAddress, ctx.requestId)
    } catch (error) {
      if (error instanceof ContactRejectedError) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: CONTACT_REJECTED_MESSAGE,
          cause: error,
        })
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not send your message. Please try again.",
        cause: error,
      })
    }

    return { message: CONTACT_ACKNOWLEDGEMENT }
  }),
})
