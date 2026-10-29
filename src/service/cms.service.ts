import { revalidatePath } from "next/cache"

import { cmsCollections } from "@/config/cms.config"
import { AppError, isUnavailable } from "@/error/app.error"
import { markdownToText } from "@/lib/react-markdown"
import {
  getEntry,
  getLiveEntryBySlug,
  insertEntry,
  listEntries,
  listLiveEntries,
  publishDraft,
  removeEntry,
  updateDraft,
} from "@/repository/cms-entry.repository"
import type {
  CmsCollection,
  CmsListRow,
  CmsLiveEntry,
  CmsSaveDraftInput,
  CmsSiteValues,
  CmsValues,
  CmsWriteInput,
} from "@/type/cms.type"
import type { Db } from "@/type/supabase.type"
import {
  cmsChanges,
  findCmsCollection,
  findCmsField,
  toCmsListRow,
} from "@/util/cms.util"

function requireCollection(slug: string): CmsCollection {
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null) {
    throw new AppError("NOT_FOUND", "Could not find the collection")
  }
  return collection
}

async function assertSlugIsFree(
  db: Db,
  collection: CmsCollection,
  values: CmsValues,
  ownId: number | null
): Promise<void> {
  const slug = values.slug
  if (typeof slug !== "string") {
    return
  }
  const live = await getLiveEntryBySlug(db, collection.slug, slug)
  if (live !== null && live.id !== ownId) {
    throw new AppError(
      "CONFLICT",
      `Another ${collection.singular.toLowerCase()} already uses this slug`
    )
  }
}

export async function listEntryRows(
  db: Db,
  slug: string
): Promise<CmsListRow[]> {
  const collection = requireCollection(slug)
  const entries = await listEntries(db, collection.slug)
  const rows = entries.map((entry) => toCmsListRow(collection, entry))
  const summary = findCmsField(collection.fields, collection.summaryField)
  if (summary === null || summary.type !== "richtext") {
    return rows
  }
  return rows.map((row) => ({ ...row, summary: markdownToText(row.summary) }))
}

export async function listSingleValues(db: Db): Promise<CmsSiteValues> {
  const site: CmsSiteValues = {}
  for (const collection of cmsCollections) {
    if (collection.single !== true) {
      continue
    }
    const entries = await listLiveEntries(db, collection.slug)
    if (entries.length > 0) {
      site[collection.slug] = entries[0].values
    }
  }
  return site
}

async function ifReachable<T>(read: Promise<T>, fallback: T): Promise<T> {
  try {
    return await read
  } catch (error) {
    if (!isUnavailable(error)) {
      throw error
    }
    console.warn(
      "[cms]",
      "Supabase is unreachable, so the site shows its defaults"
    )
    return fallback
  }
}

export function listLiveEntriesIfReachable(
  db: Db,
  collection: string
): Promise<CmsLiveEntry[]> {
  return ifReachable(listLiveEntries(db, collection), [])
}

export function getLiveEntryBySlugIfReachable(
  db: Db,
  collection: string,
  slug: string
): Promise<CmsLiveEntry | null> {
  return ifReachable(getLiveEntryBySlug(db, collection, slug), null)
}

export async function createEntry(
  db: Db,
  input: CmsWriteInput
): Promise<{ id: number }> {
  const collection = requireCollection(input.collection)
  await assertSlugIsFree(db, collection, input.values, null)
  const id = await insertEntry(
    db,
    collection.slug,
    input.values,
    collection.single === true
  )
  return { id }
}

export async function saveDraft(
  db: Db,
  input: CmsSaveDraftInput
): Promise<void> {
  const collection = requireCollection(input.collection)
  const entry = await getEntry(db, input.id)
  if (entry === null || entry.collection !== collection.slug) {
    throw new AppError("NOT_FOUND", "Could not find the entry")
  }
  await assertSlugIsFree(db, collection, input.values, entry.id)
  let draft: CmsValues | null = input.values
  if (entry.published !== null) {
    const changes = cmsChanges(collection.fields, entry.published, input.values)
    if (changes.length === 0) {
      draft = null
    }
  }
  await updateDraft(db, entry.id, draft)
}

export async function publishEntry(db: Db, id: number): Promise<void> {
  const published = await publishDraft(db, id)
  if (!published) {
    throw new AppError("NOT_FOUND", "There is nothing to publish")
  }
  revalidatePath("/", "layout")
}

export async function deleteEntry(db: Db, id: number): Promise<void> {
  const entry = await removeEntry(db, id)
  if (entry === null) {
    throw new AppError("NOT_FOUND", "Could not find the entry")
  }
  if (entry.published !== null) {
    revalidatePath("/", "layout")
  }
}
