import { initTRPC } from "@trpc/server"
import { cache } from "react"

export const createTRPCContext = cache(async function createContext() {
  return {}
})

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create()

export const createTRPCRouter = t.router

export const createCallerFactory = t.createCallerFactory

export const baseProcedure = t.procedure
