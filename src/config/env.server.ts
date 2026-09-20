import { z } from "zod"

// This module must never be imported from client code, and must never import
// env.public.ts — the two schemas stay independent so a secret can never leak
// into the browser bundle through a shared module.
const LEGACY_JWT_HINT =
  "looks like a legacy JWT key (starts with 'eyJ'). Supabase now issues opaque sb_publishable_… / sb_secret_… keys — re-copy it from `supabase status`."

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z
    .string()
    .min(1)
    .refine((v) => !v.startsWith("eyJ"), LEGACY_JWT_HINT),
  OWNER_EMAIL: z.email(),
  EMAIL_MODE: z.enum(["preview"]),
})

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  OWNER_EMAIL: process.env.OWNER_EMAIL,
  EMAIL_MODE: process.env.EMAIL_MODE,
})

if (!parsed.success) {
  throw new Error(
    "Invalid server environment variables:\n" +
      parsed.error.issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n") +
      "\n\nCopy .env.example to .env.local and fill it in."
  )
}

export const serverEnv = parsed.data
export { serverEnvSchema }
