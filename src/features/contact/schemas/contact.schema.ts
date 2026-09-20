import { z } from "zod"

const NAME_MAX_LENGTH = 100

const EMAIL_MAX_LENGTH = 254

const MESSAGE_MIN_LENGTH = 10

const MESSAGE_MAX_LENGTH = 5000

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function trimOnly(value: string): string {
  return value.trim()
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export const contactSchema = z.object({
  name: z
    .string()
    .transform(collapseWhitespace)
    .pipe(
      z
        .string()
        .min(1, "Enter your name")
        .max(NAME_MAX_LENGTH, `Must be ${NAME_MAX_LENGTH} characters or fewer`)
    ),
  email: z
    .string()
    .transform(normalizeEmail)
    .pipe(z.email("Enter a valid email address").max(EMAIL_MAX_LENGTH)),
  message: z
    .string()
    .transform(trimOnly)
    .pipe(
      z
        .string()
        .min(MESSAGE_MIN_LENGTH, "Please write at least 10 characters")
        .max(
          MESSAGE_MAX_LENGTH,
          `Must be ${MESSAGE_MAX_LENGTH} characters or fewer`
        )
    ),
  website: z.string().max(0).optional().or(z.literal("")),
})
