import { describe, expect, it } from "vitest"

import { buildContactNotification } from "@/emails/contact/contact-notification.template"
import { escapeHtml } from "@/lib/html/escape-html.util"
import { buildPreviewDocument } from "@/server/integrations/email/email-preview.document"
import type { ContactValues } from "@/types/contact.type"

const HOSTILE_NAME = '<img src=x onerror="alert(1)">'

const BASE_VALUES: ContactValues = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  message: "Hello there.",
  website: "",
  renderedAt: 1_700_000_000_000,
}

describe("escapeHtml", () => {
  it("escapes every character that could break out of markup", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    )
  })

  it("escapes ampersands and single quotes", () => {
    expect(escapeHtml("Tom & Jerry's")).toBe("Tom &amp; Jerry&#39;s")
  })
})

describe("buildPreviewDocument", () => {
  it("escapes a hostile name that reaches the preview through the subject", () => {
    const notification = buildContactNotification(
      { ...BASE_VALUES, name: HOSTILE_NAME },
      "owner@example.test"
    )
    const document = buildPreviewDocument(notification)

    expect(notification.subject).toContain(HOSTILE_NAME)
    expect(document).not.toContain("<img")
    expect(document).toContain("&lt;img src=x")
  })

  it("escapes the To and Reply-To header fields", () => {
    const document = buildPreviewDocument({
      to: "<b>owner</b>@example.test",
      replyTo: "<i>visitor</i>@example.test",
      subject: "plain",
      html: "<p>body</p>",
      text: "body",
    })

    expect(document).not.toContain("<b>owner</b>")
    expect(document).not.toContain("<i>visitor</i>")
    expect(document).toContain("&lt;b&gt;owner")
  })

  it("still renders the already-escaped body markup", () => {
    const notification = buildContactNotification(
      BASE_VALUES,
      "owner@example.test"
    )
    const document = buildPreviewDocument(notification)

    expect(document).toContain("<p>Hello there.</p>")
    expect(document).toContain("<h2>New contact message</h2>")
  })
})
