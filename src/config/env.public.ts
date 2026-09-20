import { z } from "zod"

const LEGACY_JWT_MESSAGE =
  "looks like a legacy JWT key (starts with 'eyJ'). Supabase now issues opaque sb_publishable_ / sb_secret_ keys. Re-copy it from `pnpm exec supabase status`."

function isNotLegacyJwt(value: string): boolean {
  return !value.startsWith("eyJ")
}

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1)
    .refine(isNotLegacyJwt, LEGACY_JWT_MESSAGE),
})

function describeIssues(issues: z.core.$ZodIssue[]): string {
  const lines: string[] = []

  for (const issue of issues) {
    lines.push(`  ${issue.path.join(".")}: ${issue.message}`)
  }

  return lines.join("\n")
}

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})

if (!parsed.success) {
  throw new Error(
    [
      "Invalid public environment variables:",
      describeIssues(parsed.error.issues),
      "",
      "Copy .env.example to .env.local and fill it in.",
    ].join("\n")
  )
}

export const publicEnv = parsed.data
