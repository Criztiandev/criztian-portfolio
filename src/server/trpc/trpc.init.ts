import { initTRPC, TRPCError } from "@trpc/server"
import { cache } from "react"

import { createSupabaseServerClient } from "@/lib/supabase/supabase.server"
import type { OwnerClaims } from "@/types/auth.type"

export const createTRPCContext = cache(async function createContext() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getClaims()
  const claims: OwnerClaims | null = data?.claims ?? null

  return { supabase, claims }
})

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create()

export const createTRPCRouter = t.router

export const createCallerFactory = t.createCallerFactory

export const baseProcedure = t.procedure

const requireOwner = t.middleware(async function ownerGuard({ ctx, next }) {
  if (ctx.claims === null) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({ ctx: { ...ctx, claims: ctx.claims } })
})

export const ownerProcedure = baseProcedure.use(requireOwner)
