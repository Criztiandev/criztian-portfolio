import { describe, expect, it } from "vitest"

import {
  buildContactNotification,
  escapeHtml,
} from "@/emails/contact/contact-notification.template"
import type { ContactValues } from "@/types/contact.type"

const BASE_VALUES: ContactValues = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  message: "Hello there, I have a project in mind.",
  website: "",
  renderedAt: 1_700_000_000_000,
}

describe("escapeHtml", () => {
  it("escapes every character that could break out of markup", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    )
  })

  it("escapes ampersands without double-escaping the result", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry")
  })

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s")
  })
})

describe("buildContactNotification", () => {
  it("sends to the owner and sets reply-to to the visitor", () => {
    const message = buildContactNotification(BASE_VALUES, "owner@example.test")

    expect(message.to).toBe("owner@example.test")
    expect(message.replyTo).toBe("ada@example.test")
  })

  it("never lets a visitor inject markup through the message body", () => {
    const message = buildContactNotification(
      { ...BASE_VALUES, message: '<img src=x onerror="alert(1)">' },
      "owner@example.test"
    )

    expect(message.html).not.toContain("<img")
    expect(message.html).toContain("&lt;img")
  })

  it("never lets a visitor inject markup through the name", () => {
    const message = buildContactNotification(
      { ...BASE_VALUES, name: "<b>Bold</b>" },
      "owner@example.test"
    )

    expect(message.html).not.toContain("<b>Bold</b>")
    expect(message.html).toContain("&lt;b&gt;")
  })

  it("keeps multi-line messages readable as separate paragraphs", () => {
    const message = buildContactNotification(
      { ...BASE_VALUES, message: "line one\nline two" },
      "owner@example.test"
    )

    expect(message.html).toContain("<p>line one</p>")
    expect(message.html).toContain("<p>line two</p>")
  })
})
