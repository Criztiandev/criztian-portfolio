import "server-only"

import {
  hasUnpublishedChanges,
  parseSiteContent,
} from "@/features/site-content/site-content.rules"
import { createSupabaseAdminClient } from "@/lib/supabase/supabase.admin"
import { logError, logWarn } from "@/server/logging/logger.service"
import type {
  SiteContent,
  SiteContentDraftState,
  SiteContentPublishResult,
  SiteContentSaveResult,
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

export async function saveDraftContent(
  content: SiteContent,
  requestId: string | null = null
): Promise<SiteContentSaveResult> {
  const admin = createSupabaseAdminClient()

  const { data, error } = await admin
    .from("site_content")
    .update({
      draft: content,
      draft_updated_at: new Date().toISOString(),
    })
    .gte("id", 0)
    .select("draft_updated_at, published_at")
    .maybeSingle()

  if (error !== null || data === null) {
    logError({
      event: "site_content.save_draft_failed",
      requestId,
      error,
    })

    throw new Error("site_content_save_draft_failed")
  }

  return {
    draftUpdatedAt: data.draft_updated_at,
    hasUnpublishedChanges: hasUnpublishedChanges(
      data.draft_updated_at,
      data.published_at
    ),
  }
}

export async function publishDraftContent(
  requestId: string | null = null
): Promise<SiteContentPublishResult> {
  const admin = createSupabaseAdminClient()

  const { data: current, error: readError } = await admin
    .from("site_content")
    .select("draft")
    .limit(1)
    .maybeSingle()

  if (readError !== null || current === null) {
    logError({
      event: "site_content.publish_read_failed",
      requestId,
      error: readError,
    })

    throw new Error("site_content_publish_failed")
  }

  const parsed = parseSiteContent(current.draft)

  const { data, error } = await admin
    .from("site_content")
    .update({
      published: parsed.content,
      published_at: new Date().toISOString(),
    })
    .gte("id", 0)
    .select("draft_updated_at, published_at")
    .maybeSingle()

  if (error !== null || data === null || data.published_at === null) {
    logError({
      event: "site_content.publish_failed",
      requestId,
      error,
    })

    throw new Error("site_content_publish_failed")
  }

  return {
    publishedAt: data.published_at,
    hasUnpublishedChanges: hasUnpublishedChanges(
      data.draft_updated_at,
      data.published_at
    ),
  }
}
