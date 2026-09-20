import { describe, expect, it } from "vitest"

import { REDACTED_PLACEHOLDER } from "@/data/logging.data"
import {
  describeError,
  isSensitiveKey,
  maskSensitiveText,
  redactDetails,
} from "@/server/logging/logger.rules"

const SYNTHETIC_SUPABASE_SECRET = `sb_secret_${"0".repeat(32)}`

const SYNTHETIC_JWT = `eyJ${"0".repeat(12)}.${"1".repeat(12)}.${"2".repeat(12)}`

const SYNTHETIC_BEARER_TOKEN = `${"3".repeat(8)}.${"4".repeat(8)}-${"5".repeat(8)}`

describe("log redaction", () => {
  it("treats credential-bearing key names as sensitive", () => {
    expect(isSensitiveKey("password")).toBe(true)
    expect(isSensitiveKey("SUPABASE_SECRET_KEY")).toBe(true)
    expect(isSensitiveKey("accessToken")).toBe(true)
    expect(isSensitiveKey("Authorization")).toBe(true)
    expect(isSensitiveKey("cookie")).toBe(true)
    expect(isSensitiveKey("path")).toBe(false)
    expect(isSensitiveKey("code")).toBe(false)
  })

  it("keeps passwords out of logged details", () => {
    const redacted = redactDetails({ password: "hunter2", path: "auth.login" })

    expect(redacted.password).toBe(REDACTED_PLACEHOLDER)
    expect(redacted.path).toBe("auth.login")
  })

  it("keeps the contact message body and submitter email out of logs", () => {
    const redacted = redactDetails({
      message: "Please call me back on my private number.",
      email: "someone@example.test",
      messageId: 41,
    })

    expect(redacted.message).toBe(REDACTED_PLACEHOLDER)
    expect(redacted.email).toBe(REDACTED_PLACEHOLDER)
  })

  it("masks a Supabase secret key even under an innocent key name", () => {
    const redacted = redactDetails({
      note: `connecting with ${SYNTHETIC_SUPABASE_SECRET} now`,
    })

    expect(redacted.note).not.toContain(SYNTHETIC_SUPABASE_SECRET)
    expect(redacted.note).toContain(REDACTED_PLACEHOLDER)
  })

  it("masks a JWT and a bearer header found inside free text", () => {
    expect(maskSensitiveText(`token ${SYNTHETIC_JWT}`)).not.toContain(
      SYNTHETIC_JWT
    )
    expect(
      maskSensitiveText(`Authorization: Bearer ${SYNTHETIC_BEARER_TOKEN}`)
    ).not.toContain(SYNTHETIC_BEARER_TOKEN)
  })

  it("redacts nested objects and arrays", () => {
    const redacted = redactDetails({
      outer: { inner: { password: "hunter2", safe: "kept" } },
      items: [{ token: "abc" }],
    })

    const outer = redacted.outer as Record<string, Record<string, unknown>>
    expect(outer.inner.password).toBe(REDACTED_PLACEHOLDER)
    expect(outer.inner.safe).toBe("kept")

    const items = redacted.items as Array<Record<string, unknown>>
    expect(items[0].token).toBe(REDACTED_PLACEHOLDER)
  })

  it("stops runaway nesting instead of walking forever", () => {
    const deep = { a1: { a2: { a3: { a4: { a5: "too deep" } } } } }
    const redacted = redactDetails(deep)

    expect(JSON.stringify(redacted)).toContain(REDACTED_PLACEHOLDER)
  })

  it("truncates long strings so bodies cannot be dumped whole", () => {
    const redacted = redactDetails({ note: "x".repeat(500) })

    expect(String(redacted.note).length).toBeLessThan(250)
  })

  it("describes errors without leaking secrets from the message", () => {
    const described = describeError(
      new Error(`failed using ${SYNTHETIC_SUPABASE_SECRET}`)
    )

    expect(described?.name).toBe("Error")
    expect(described?.message).not.toContain(SYNTHETIC_SUPABASE_SECRET)
  })

  it("handles non-error throwables and absent errors", () => {
    expect(describeError(null)).toBeNull()
    expect(describeError(undefined)).toBeNull()
    expect(describeError("plain string")?.name).toBe("UnknownError")
  })
})
