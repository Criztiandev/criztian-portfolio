import assert from "node:assert/strict"
import { test } from "node:test"

import {
  findNextPost,
  formatPostDate,
  readingMinutes,
} from "../src/util/post.util.ts"

function words(count: number): string {
  return Array.from({ length: count }, () => "word").join(" ")
}

test("reading time rounds up at 200 words a minute, at least 1", () => {
  assert.equal(readingMinutes(""), 1)
  assert.equal(readingMinutes("  one  "), 1)
  assert.equal(readingMinutes(words(200)), 1)
  assert.equal(readingMinutes(words(201)), 2)
  assert.equal(readingMinutes(`${words(400)}\n\n`), 2)
})

test("post dates read like Nov 16, 2026 in every time zone", () => {
  assert.equal(formatPostDate("2026-11-16"), "Nov 16, 2026")
  assert.equal(formatPostDate("2026-01-01"), "Jan 1, 2026")
})

test("the next post is the next older one, or none", () => {
  const posts = [{ slug: "new" }, { slug: "mid" }, { slug: "old" }]
  assert.deepEqual(findNextPost(posts, "new"), { slug: "mid" })
  assert.equal(findNextPost(posts, "old"), null)
  assert.equal(findNextPost(posts, "gone"), null)
})
