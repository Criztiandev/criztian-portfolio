import { z } from "zod"

// Supabase's current keys are short opaque strings (sb_publishable_… /
// sb_secret_…). A long value starting with "eyJ" is a legacy JWT key copied
// from a pre-2026 tutorial; they are deprecated and reject this project's
// asymmetric-signing assumptions, so fail loudly rather than at first request.
const LEGACY_JWT_HINT =
  "looks like a legacy JWT key (starts with 'eyJ'). Supabase now issues opaque sb_publishable_… / sb_secret_… keys — re-copy it from `supabase status`."

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1)
    .refine((v) => !v.startsWith("eyJ"), LEGACY_JWT_HINT),
})

// Next.js only inlines process.env.NEXT_PUBLIC_* for literal member
// expressions, so each variable is read explicitly instead of passing
// process.env wholesale.
const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})

if (!parsed.success) {
  throw new Error(
    "Invalid public environment variables:\n" +
      parsed.error.issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n") +
      "\n\nCopy .env.example to .env.local and fill it in."
  )
}

export const publicEnv = parsed.data
export { publicEnvSchema }
