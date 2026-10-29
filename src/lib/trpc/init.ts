import { initTRPC, TRPCError } from "@trpc/server"
import { ZodError } from "zod"

import { APP_ERRORS, AppError } from "@/error/app.error"
import { createServerSupabase } from "@/lib/supabase/server"

export async function createTRPCContext() {
  return { db: await createServerSupabase() }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    let message = shape.message
    if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
      message = "Invalid input"
    }
    if (
      error.code === "INTERNAL_SERVER_ERROR" &&
      process.env.NODE_ENV === "production"
    ) {
      message = "Something went wrong"
    }
    return { ...shape, message }
  },
})

const mapAppError = t.middleware(async ({ next }) => {
  const result = await next()
  if (result.ok) {
    return result
  }
  const cause = result.error.cause
  if (cause instanceof AppError) {
    throw new TRPCError({
      code: APP_ERRORS[cause.code],
      message: cause.message,
      cause,
    })
  }
  return result
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure.use(mapAppError)
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { data } = await ctx.db.auth.getClaims()
  if (data === null) {
    throw new AppError("UNAUTHORIZED", "Sign in to continue")
  }
  return next()
})
