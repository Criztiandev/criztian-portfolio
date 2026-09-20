import { escapeHtml } from "@/lib/html/escape-html.util"
import type { EmailMessage } from "@/types/contact.type"

export function buildPreviewDocument(message: EmailMessage): string {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    "<title>Email preview</title>",
    "</head>",
    "<body>",
    "<dl>",
    `<dt>To</dt><dd>${escapeHtml(message.to)}</dd>`,
    `<dt>Reply-To</dt><dd>${escapeHtml(message.replyTo)}</dd>`,
    `<dt>Subject</dt><dd>${escapeHtml(message.subject)}</dd>`,
    "</dl>",
    "<hr />",
    message.html,
    "</body>",
    "</html>",
  ].join("\n")
}
