import { describe, expect, it } from "vitest"

import { contactSchema } from "@/features/contact/schemas/contact.schema"

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  message: "Hello, I would like to talk about a project.",
  website: "",
  renderedAt: 1_700_000_000_000,
}

describe("contactSchema", () => {
  it("accepts a well-formed submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it("collapses internal whitespace and trims the name", () => {
    const result = contactSchema.parse({ ...valid, name: "  Ada   Lovelace " })
    expect(result.name).toBe("Ada Lovelace")
  })

  it("lowercases and trims the email", () => {
    const result = contactSchema.parse({
      ...valid,
      email: " Ada@Example.TEST ",
    })
    expect(result.email).toBe("ada@example.test")
  })

  it("preserves newlines inside the message", () => {
    const result = contactSchema.parse({
      ...valid,
      message: "  line one\nline two  ",
    })
    expect(result.message).toBe("line one\nline two")
  })

  it("rejects a malformed email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false
    )
  })

  it("rejects a name that is only whitespace", () => {
    expect(contactSchema.safeParse({ ...valid, name: "   " }).success).toBe(
      false
    )
  })

  it("rejects an oversized message", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "x".repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it("rejects a missing renderedAt so timing cannot be skipped", () => {
    const { renderedAt, ...withoutTimestamp } = valid
    void renderedAt

    expect(contactSchema.safeParse(withoutTimestamp).success).toBe(false)
  })

  it("accepts a filled honeypot at the schema layer, leaving rejection to the service", () => {
    const result = contactSchema.safeParse({
      ...valid,
      website: "http://spam.test",
    })

    expect(result.success).toBe(true)
  })
})
