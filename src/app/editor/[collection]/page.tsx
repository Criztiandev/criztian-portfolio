import { notFound, redirect } from "next/navigation"

import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"
import { listEntries } from "@/repository/cms-entry.repository"
import { findCmsCollection } from "@/util/cms.util"

export default async function CmsEditorCollectionPage({
  params,
}: PageProps<"/editor/[collection]">) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  const { collection: slug } = await params
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null) {
    notFound()
  }
  if (collection.single !== true) {
    redirect(`/dashboard/${collection.slug}`)
  }
  const entries = await listEntries(supabase, collection.slug)
  if (entries.length > 0) {
    redirect(`/editor/${collection.slug}/${entries[0].id}`)
  }
  redirect(`/editor/${collection.slug}/new`)
}
