import { authRouter } from "@/features/auth/server/auth.router"
import { contactRouter } from "@/features/contact/server/contact.router"

import { baseProcedure, createTRPCRouter } from "./trpc.init"

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(function health() {
    return { status: "ok" as const }
  }),
  auth: authRouter,
  contact: contactRouter,
})

export type AppRouter = typeof appRouter
