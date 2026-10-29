import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { CmsCanvasFrame } from "@/components/cms-canvas-frame"
import { cmsCanvasViews } from "@/config/cms-canvas.config"
import { cmsCollections } from "@/config/cms.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"
import { listSingleValues } from "@/service/cms.service"
import { findCmsCollection } from "@/util/cms.util"

export const metadata: Metadata = {
  title: "Page preview",
  robots: { index: false, follow: false },
}

export default async function CmsCanvasPage({
  params,
}: PageProps<"/preview/[collection]/canvas">) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  const { collection: slug } = await params
  const collection = findCmsCollection(cmsCollections, slug)
  if (collection === null || !cmsCanvasViews.has(collection.slug)) {
    notFound()
  }
  const site = await listSingleValues(supabase)
  return (
    <CmsCanvasFrame
      collection={collection.slug}
      cards={collection.cards.map((card) => card.name)}
      site={site}
    />
  )
}
