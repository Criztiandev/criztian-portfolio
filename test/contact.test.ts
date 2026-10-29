import assert from "node:assert/strict"
import { test } from "node:test"

import { PostgrestError } from "@supabase/supabase-js"

import { fromPostgrestError } from "../src/error/app.error.ts"
import { contactSchema } from "../src/model/contact.model.ts"
import { contactReplyHref } from "../src/util/contact.util.ts"

const validInput = {
  name: "Ada",
  email: "ada@example.com",
  message: "Hello, I would like to work with you.",
  website: "",
}

test("accepts a valid contact message", () => {
  const result = contactSchema.safeParse(validInput)
  assert.equal(result.success, true)
})

test("rejects a filled honeypot field", () => {
  const result = contactSchema.safeParse({ ...validInput, website: "x" })
  assert.equal(result.success, false)
})

test("rejects a message shorter than ten characters", () => {
  const result = contactSchema.safeParse({ ...validInput, message: "short" })
  assert.equal(result.success, false)
})

test("keeps a stored address from adding mail headers to a reply", () => {
  assert.equal(contactReplyHref("ada@example.com"), "mailto:ada@example.com")
  assert.equal(
    contactReplyHref("ada+news@example.com"),
    "mailto:ada%2Bnews@example.com"
  )
  assert.equal(
    contactReplyHref("a@b.com?bcc=x@y.com&subject=Hi"),
    "mailto:a@b.com%3Fbcc%3Dx%40y.com%26subject%3DHi"
  )
})

test("wraps a Postgrest error in an identifiable AppError", () => {
  const postgrestError = new PostgrestError({
    message: "permission denied for table contact_messages",
    details: "",
    hint: "",
    code: "42501",
  })
  const error = fromPostgrestError(postgrestError, "Could not save")
  assert.equal(error.name, "AppError")
  assert.equal(error.code, "DATABASE_ERROR")
  assert.equal(error.message, "Could not save")
  assert.equal(error.cause, postgrestError)
})

test("maps a duplicate key to CONFLICT", () => {
  const postgrestError = new PostgrestError({
    message:
      'duplicate key value violates unique constraint "cms_entries_live_slug_key"',
    details: "",
    hint: "",
    code: "23505",
  })
  const error = fromPostgrestError(
    postgrestError,
    "Could not publish the entry"
  )
  assert.equal(error.name, "AppError")
  assert.equal(error.code, "CONFLICT")
  assert.equal(error.cause, postgrestError)
})
