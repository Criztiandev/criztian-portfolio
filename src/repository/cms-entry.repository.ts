import { fromPostgrestError } from "@/error/app.error"
import type {
  CmsEntry,
  CmsEntryRow,
  CmsLiveEntry,
  CmsLiveRow,
  CmsValues,
} from "@/type/cms.type"
import type { Db } from "@/type/supabase.type"
import { toCmsValues } from "@/util/cms.util"

const liveColumns = "id, published"

function toEntry(row: CmsEntryRow): CmsEntry {
  return {
    ...row,
    draft: toCmsValues(row.draft),
    published: toCmsValues(row.published),
  }
}

function toLiveEntries(rows: CmsLiveRow[]): CmsLiveEntry[] {
  const entries: CmsLiveEntry[] = []
  for (const row of rows) {
    const values = toCmsValues(row.published)
    if (values !== null) {
      entries.push({ id: row.id, values })
    }
  }
  return entries
}

export async function listEntries(
  db: Db,
  collection: string
): Promise<CmsEntry[]> {
  const { data, error } = await db
    .from("cms_entries")
    .select("*")
    .eq("collection", collection)
    .order("updated_at", { ascending: false })
    .limit(100)
  if (error !== null) {
    throw fromPostgrestError(error, "Could not load the entries")
  }
  return data.map(toEntry)
}

export async function getEntry(db: Db, id: number): Promise<CmsEntry | null> {
  const { data, error } = await db
    .from("cms_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error !== null) {
    throw fromPostgrestError(error, "Could not load the entry")
  }
  if (data === null) {
    return null
  }
  return toEntry(data)
}

export async function insertEntry(
  db: Db,
  collection: string,
  draft: CmsValues,
  single: boolean
): Promise<number> {
  const { data, error } = await db
    .from("cms_entries")
    .insert({ collection, draft, single })
    .select("id")
    .single()
  if (error !== null) {
    throw fromPostgrestError(error, "Could not save the draft")
  }
  return data.id
}

export async function updateDraft(
  db: Db,
  id: number,
  draft: CmsValues | null
): Promise<void> {
  const { error } = await db
    .from("cms_entries")
    .update({ draft })
    .eq("id", id)
    .select("id")
    .single()
  if (error !== null) {
    throw fromPostgrestError(error, "Could not save the draft")
  }
}

export async function publishDraft(db: Db, id: number): Promise<boolean> {
  const { data, error } = await db.rpc("cms_publish_entry", { entry_id: id })
  if (error !== null) {
    throw fromPostgrestError(error, "Could not publish the entry")
  }
  return data !== null
}

export async function removeEntry(
  db: Db,
  id: number
): Promise<CmsEntry | null> {
  const { data, error } = await db
    .from("cms_entries")
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle()
  if (error !== null) {
    throw fromPostgrestError(error, "Could not delete the entry")
  }
  if (data === null) {
    return null
  }
  return toEntry(data)
}

export async function listLiveEntries(
  db: Db,
  collection: string
): Promise<CmsLiveEntry[]> {
  const { data, error } = await db
    .from("cms_entries")
    .select(liveColumns)
    .eq("collection", collection)
    .not("published", "is", null)
    .order("id", { ascending: false })
    .limit(100)
  if (error !== null) {
    throw fromPostgrestError(error, "Could not load the entries")
  }
  return toLiveEntries(data)
}

export async function getLiveEntryBySlug(
  db: Db,
  collection: string,
  slug: string
): Promise<CmsLiveEntry | null> {
  const { data, error } = await db
    .from("cms_entries")
    .select(liveColumns)
    .eq("collection", collection)
    .eq("published->>slug", slug)
    .limit(1)
  if (error !== null) {
    throw fromPostgrestError(error, "Could not load the entry")
  }
  const entries = toLiveEntries(data)
  if (entries.length === 0) {
    return null
  }
  return entries[0]
}
