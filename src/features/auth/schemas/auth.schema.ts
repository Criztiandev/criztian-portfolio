import { z } from "zod"

import { PASSWORD_MIN_LENGTH } from "@/data/auth.data"

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

const emailField = z
  .string()
  .transform(normalizeEmail)
  .pipe(z.email("Enter a valid email address").max(254))

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password").max(72),
})

export const forgotPasswordSchema = z.object({
  email: emailField,
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Use at least ${PASSWORD_MIN_LENGTH} characters`
      )
      .max(72),
    confirmPassword: z.string(),
  })
  .refine(
    function passwordsMatch(values) {
      return values.password === values.confirmPassword
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
