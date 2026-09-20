import { baseProcedure, createTRPCRouter } from "./trpc.init"

export const appRouter = createTRPCRouter({
  // Database-free liveness check; proves the transport without Supabase.
  health: baseProcedure.query(() => ({ status: "ok" as const })),
})

export type AppRouter = typeof appRouter
