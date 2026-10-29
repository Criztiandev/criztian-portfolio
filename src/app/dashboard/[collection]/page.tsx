import { IconPlus } from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { CmsEntryTable } from "@/components/cms-entry-table"
import { buttonVariants } from "@/components/ui/button"
import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"
import { findCmsCollection } from "@/util/cms.util"

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/[collection]">): Promise<Metadata> {
  const { collection: slug } = await params
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null) {
    return {}
  }
  return { title: collection.label }
}

export default async function CmsCollectionPage({
  params,
}: PageProps<"/dashboard/[collection]">) {
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
  if (collection.single === true) {
    redirect(`/editor/${collection.slug}`)
  }
  let columns: string[] = []
  if (collection.columns !== undefined) {
    columns = collection.columns.map((column) => column.label)
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl font-semibold">{collection.label}</h1>
          <p className="text-sm text-muted-foreground">
            Everything in this collection. Edits stay in draft until you
            publish.
          </p>
        </div>
        <Link
          href={`/editor/${collection.slug}/new`}
          className={buttonVariants({ size: "lg", className: "gap-2 px-4" })}
        >
          <IconPlus aria-hidden />
          New {collection.singular.toLowerCase()}
        </Link>
      </div>
      <CmsEntryTable
        collection={collection.slug}
        singular={collection.singular}
        columns={columns}
      />
    </div>
  )
}
