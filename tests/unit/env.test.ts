import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { publicEnvSchema } from "@/config/env.public"
import { serverEnvSchema } from "@/config/env.server"

const validPublic = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_abc123",
}

const validServer = {
  SUPABASE_SECRET_KEY: "sb_secret_abc123",
  OWNER_EMAIL: "owner@example.test",
  EMAIL_MODE: "preview",
}

describe("publicEnvSchema", () => {
  it("accepts a current opaque publishable key", () => {
    expect(publicEnvSchema.safeParse(validPublic).success).toBe(true)
  })

  it("rejects a legacy JWT key copied from an old tutorial", () => {
    const result = publicEnvSchema.safeParse({
      ...validPublic,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOiJIUzI1NiJ9.stale",
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toContain("legacy JWT")
  })

  it("names the offending variable when a URL is malformed", () => {
    const result = publicEnvSchema.safeParse({
      ...validPublic,
      NEXT_PUBLIC_SUPABASE_URL: "127.0.0.1:54321",
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(["NEXT_PUBLIC_SUPABASE_URL"])
  })
})

describe("serverEnvSchema", () => {
  it("accepts a current opaque secret key", () => {
    expect(serverEnvSchema.safeParse(validServer).success).toBe(true)
  })

  it("rejects a legacy JWT secret key", () => {
    const result = serverEnvSchema.safeParse({
      ...validServer,
      SUPABASE_SECRET_KEY: "eyJhbGciOiJIUzI1NiJ9.stale",
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toContain("legacy JWT")
  })

  it("rejects an unknown EMAIL_MODE so live sending cannot be switched on by typo", () => {
    const result = serverEnvSchema.safeParse({
      ...validServer,
      EMAIL_MODE: "resend",
    })
    expect(result.success).toBe(false)
  })
})

describe("client/server boundary", () => {
  it("never lets the public env module reach the server env module", () => {
    const source = readFileSync("src/config/env.public.ts", "utf8")
    expect(source).not.toContain("env.server")
    expect(source).not.toMatch(/process\.env\.(?!NEXT_PUBLIC_)/)
  })
})
