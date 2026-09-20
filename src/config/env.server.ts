import { z } from "zod"

const LEGACY_JWT_MESSAGE =
  "looks like a legacy JWT key (starts with 'eyJ'). Supabase now issues opaque sb_publishable_ / sb_secret_ keys. Re-copy it from `pnpm exec supabase status`."

function isNotLegacyJwt(value: string): boolean {
  return !value.startsWith("eyJ")
}

export const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z
    .string()
    .min(1)
    .refine(isNotLegacyJwt, LEGACY_JWT_MESSAGE),
  OWNER_EMAIL: z.email(),
  EMAIL_MODE: z.enum(["preview"]),
})

function describeIssues(issues: z.core.$ZodIssue[]): string {
  const lines: string[] = []

  for (const issue of issues) {
    lines.push(`  ${issue.path.join(".")}: ${issue.message}`)
  }

  return lines.join("\n")
}

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  OWNER_EMAIL: process.env.OWNER_EMAIL,
  EMAIL_MODE: process.env.EMAIL_MODE,
})

if (!parsed.success) {
  throw new Error(
    [
      "Invalid server environment variables:",
      describeIssues(parsed.error.issues),
      "",
      "Copy .env.example to .env.local and fill it in.",
    ].join("\n")
  )
}

export const serverEnv = parsed.data
