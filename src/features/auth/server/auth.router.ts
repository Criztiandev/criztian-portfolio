import { TRPCError } from "@trpc/server"

import { publicEnv } from "@/config/env.public"
import {
  AUTH_CONFIRM_PATH,
  GENERIC_LOGIN_ERROR,
  GENERIC_RECOVERY_MESSAGE,
  RESET_PASSWORD_PATH,
} from "@/data/auth.data"
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/auth.schema"
import { logWarn } from "@/server/logging/logger.service"
import {
  baseProcedure,
  createTRPCRouter,
  ownerProcedure,
} from "@/server/trpc/trpc.init"
import type { SessionState } from "@/types/auth.type"

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(function session({ ctx }): SessionState {
    if (ctx.claims === null) {
      return { isAuthenticated: false, email: null }
    }

    return {
      isAuthenticated: true,
      email: ctx.claims.email ?? null,
    }
  }),

  login: baseProcedure.input(loginSchema).mutation(async function login({
    ctx,
    input,
  }) {
    const { error } = await ctx.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error !== null) {
      logWarn({ event: "auth.login_failed", requestId: ctx.requestId })

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: GENERIC_LOGIN_ERROR,
      })
    }

    return { ok: true as const }
  }),

  logout: ownerProcedure.mutation(async function logout({ ctx }) {
    await ctx.supabase.auth.signOut()

    return { ok: true as const }
  }),

  forgotPassword: baseProcedure
    .input(forgotPasswordSchema)
    .mutation(async function forgotPassword({ ctx, input }) {
      const redirectTo = new URL(
        AUTH_CONFIRM_PATH,
        publicEnv.NEXT_PUBLIC_APP_URL
      )
      redirectTo.searchParams.set("next", RESET_PASSWORD_PATH)

      await ctx.supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: redirectTo.toString(),
      })

      return { message: GENERIC_RECOVERY_MESSAGE }
    }),

  resetPassword: ownerProcedure
    .input(resetPasswordSchema)
    .mutation(async function resetPassword({ ctx, input }) {
      const { error } = await ctx.supabase.auth.updateUser({
        password: input.password,
      })

      if (error !== null) {
        logWarn({
          event: "auth.reset_password_failed",
          requestId: ctx.requestId,
        })

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not update the password. Request a new reset link.",
        })
      }

      return { ok: true as const }
    }),
})
