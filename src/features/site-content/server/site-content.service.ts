import "server-only"

import {
  hasUnpublishedChanges,
  parseSiteContent,
} from "@/features/site-content/site-content.rules"
import { createSupabaseAdminClient } from "@/lib/supabase/supabase.admin"
import { logWarn } from "@/server/logging/logger.service"
import type {
  SiteContent,
  SiteContentDraftState,
} from "@/types/site-content.type"

export async function readPublishedContent(
  requestId: string | null = null
): Promise<SiteContent> {
  const admin = createSupabaseAdminClient()

  const { data, error } = await admin
    .from("site_content")
    .select("published")
    .limit(1)
    .maybeSingle()

  if (error !== null) {
    logWarn({
      event: "site_content.read_published_failed",
      requestId,
      error,
    })
  }

  const parsed = parseSiteContent(data?.published ?? null)

  if (parsed.usedDefaults && data?.published != null) {
    logWarn({
      event: "site_content.published_invalid",
      requestId,
    })
  }

  return parsed.content
}

export async function readDraftContent(
  requestId: string | null = null
): Promise<SiteContentDraftState> {
  const admin = createSupabaseAdminClient()

  const { data, error } = await admin
    .from("site_content")
    .select("draft, draft_updated_at, published_at")
    .limit(1)
    .maybeSingle()

  if (error !== null || data === null) {
    logWarn({
      event: "site_content.read_draft_failed",
      requestId,
      error,
    })

    const fallback = parseSiteContent(null)

    return {
      content: fallback.content,
      hasUnpublishedChanges: true,
    }
  }

  const parsed = parseSiteContent(data.draft)

  if (parsed.usedDefaults) {
    logWarn({
      event: "site_content.draft_invalid",
      requestId,
    })
  }

  return {
    content: parsed.content,
    hasUnpublishedChanges: hasUnpublishedChanges(
      data.draft_updated_at,
      data.published_at
    ),
  }
}
