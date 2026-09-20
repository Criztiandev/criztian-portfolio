import { escapeHtml } from "@/lib/html/escape-html.util"
import type { ContactValues, EmailMessage } from "@/types/contact.type"

function toParagraphs(message: string): string {
  const lines = message.split("\n")
  const paragraphs: string[] = []

  for (const line of lines) {
    paragraphs.push(`<p>${escapeHtml(line)}</p>`)
  }

  return paragraphs.join("\n")
}

export function buildContactNotification(
  values: ContactValues,
  ownerEmail: string
): EmailMessage {
  const safeName = escapeHtml(values.name)
  const safeEmail = escapeHtml(values.email)

  const html = [
    "<h2>New contact message</h2>",
    `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>`,
    "<hr />",
    toParagraphs(values.message),
  ].join("\n")

  const text = [
    "New contact message",
    `From: ${values.name} <${values.email}>`,
    "",
    values.message,
  ].join("\n")

  return {
    to: ownerEmail,
    replyTo: values.email,
    subject: `Portfolio contact from ${values.name}`,
    html,
    text,
  }
}
