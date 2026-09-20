import { initTRPC } from "@trpc/server"
import { cache } from "react"

/**
 * Invoked two ways: by `fetchRequestHandler` for HTTP calls, and with no
 * arguments by `createTRPCOptionsProxy` in Server Components. It therefore
 * takes no parameters and reads request state from `next/headers` instead,
 * so one implementation serves both transports.
 *
 * `cache` scopes the result to a single request.
 */
export const createTRPCContext = cache(async () => {
  // Supabase clients and verified claims are added in a later phase.
  return {}
})

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create()

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
