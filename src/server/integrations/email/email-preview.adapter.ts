import "server-only"

import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { EMAIL_PREVIEW_DIRECTORY } from "@/data/contact.data"
import type {
  EmailAdapter,
  EmailDeliveryResult,
  EmailMessage,
} from "@/types/contact.type"

function buildPreviewDocument(message: EmailMessage): string {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    "<title>Email preview</title>",
    "</head>",
    "<body>",
    "<dl>",
    `<dt>To</dt><dd>${message.to}</dd>`,
    `<dt>Reply-To</dt><dd>${message.replyTo}</dd>`,
    `<dt>Subject</dt><dd>${message.subject}</dd>`,
    "</dl>",
    "<hr />",
    message.html,
    "</body>",
    "</html>",
  ].join("\n")
}

function buildPreviewFilename(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")

  return `${stamp}-${randomUUID()}.html`
}

export function createEmailPreviewAdapter(): EmailAdapter {
  async function send(message: EmailMessage): Promise<EmailDeliveryResult> {
    const directory = path.join(process.cwd(), EMAIL_PREVIEW_DIRECTORY)
    await mkdir(directory, { recursive: true })

    const filename = buildPreviewFilename()
    const filePath = path.join(directory, filename)
    await writeFile(filePath, buildPreviewDocument(message), "utf8")

    return { status: "previewed", reference: filename }
  }

  return { send }
}
