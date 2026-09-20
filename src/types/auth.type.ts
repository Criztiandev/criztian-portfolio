import type { JwtPayload } from "@supabase/supabase-js"
import type { z } from "zod"

import type {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas/auth.schema"

export type OwnerClaims = JwtPayload

export type SessionState = {
  isAuthenticated: boolean
  email: string | null
}

export type LoginInput = z.input<typeof loginSchema>

export type LoginValues = z.output<typeof loginSchema>

export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>

export type ForgotPasswordValues = z.output<typeof forgotPasswordSchema>

export type ResetPasswordInput = z.input<typeof resetPasswordSchema>

export type ResetPasswordValues = z.output<typeof resetPasswordSchema>
