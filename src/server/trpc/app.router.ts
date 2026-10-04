import { authRouter } from "@/features/auth/server/auth.router"
import { contactRouter } from "@/features/contact/server/contact.router"
import { inboxRouter } from "@/features/inbox/server/inbox.router"
import { siteContentRouter } from "@/features/site-content/server/site-content.router"

import { baseProcedure, createTRPCRouter } from "./trpc.init"

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(function health() {
    return { status: "ok" as const }
  }),
  auth: authRouter,
  contact: contactRouter,
  inbox: inboxRouter,
  siteContent: siteContentRouter,
})

export type AppRouter = typeof appRouter
