import assert from "node:assert/strict"
import { test } from "node:test"

import { PostgrestError } from "@supabase/supabase-js"

import { fromPostgrestError, isUnavailable } from "../src/error/app.error.ts"

test("maps a database that never answered to UNAVAILABLE", () => {
  const unreachable = new PostgrestError({
    message: "TypeError: fetch failed",
    details:
      "TypeError: fetch failed\n\nCaused by: Error: connect ECONNREFUSED 127.0.0.1:56321 (ECONNREFUSED)",
    hint: "",
    code: "",
  })
  const refused = new PostgrestError({
    message: "permission denied for table cms_entries",
    details: "",
    hint: "",
    code: "42501",
  })
  const error = fromPostgrestError(unreachable, "Could not load the entries")
  assert.equal(error.code, "UNAVAILABLE")
  assert.equal(isUnavailable(error), true)
  assert.equal(
    isUnavailable(fromPostgrestError(refused, "Could not save")),
    false
  )
  assert.equal(isUnavailable(new Error("fetch failed")), false)
})
