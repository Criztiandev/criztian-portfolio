import { baseProcedure, createTRPCRouter } from "./trpc.init"

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(function health() {
    return { status: "ok" as const }
  }),
})

export type AppRouter = typeof appRouter
