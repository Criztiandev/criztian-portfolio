import "server-only"

import type { EmailAdapter } from "@/types/contact.type"

import { createEmailPreviewAdapter } from "./email-preview.adapter"

export function createEmailAdapter(): EmailAdapter {
  return createEmailPreviewAdapter()
}
