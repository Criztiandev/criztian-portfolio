import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { CmsEntryEditor } from "@/components/cms-entry-editor"
import { cmsCanvasViews } from "@/config/cms-canvas.config"
import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"
import { cmsIdSchema } from "@/model/cms.model"
import { getEntry, listEntries } from "@/repository/cms-entry.repository"
import type { CmsEditorEntry } from "@/type/cms.type"
import {
  cmsNewestValues,
  cmsPublishState,
  findCmsCollection,
} from "@/util/cms.util"

export async function generateMetadata({
  params,
}: PageProps<"/editor/[collection]/[id]">): Promise<Metadata> {
  const { collection: slug, id } = await params
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null) {
    return {}
  }
  if (collection.single === true) {
    return { title: collection.label }
  }
  const noun = collection.singular.toLowerCase()
  if (id === "new") {
    return { title: `New ${noun}` }
  }
  return { title: `Edit ${noun}` }
}

export default async function CmsEditorPage({
  params,
}: PageProps<"/editor/[collection]/[id]">) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  const { collection: slug, id } = await params
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null) {
    notFound()
  }
  if (id === "new" && collection.single === true) {
    const entries = await listEntries(supabase, collection.slug)
    if (entries.length > 0) {
      redirect(`/editor/${collection.slug}/${entries[0].id}`)
    }
  }
  let entry: CmsEditorEntry | null = null
  if (id !== "new") {
    const parsedId = cmsIdSchema.safeParse(Number(id))
    if (!parsedId.success) {
      notFound()
    }
    const found = await getEntry(supabase, parsedId.data)
    if (found === null || found.collection !== collection.slug) {
      notFound()
    }
    entry = {
      id: found.id,
      values: cmsNewestValues(found),
      state: cmsPublishState(found),
    }
  }
  return (
    <CmsEntryEditor
      key={id}
      collection={{
        slug: collection.slug,
        label: collection.label,
        singular: collection.singular,
        single: collection.single,
        titleField: collection.titleField,
        cards: collection.cards,
        fields: collection.fields,
      }}
      entry={entry}
      canvas={cmsCanvasViews.has(collection.slug)}
    />
  )
}
