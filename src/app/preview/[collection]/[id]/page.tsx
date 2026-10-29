import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { cmsCanvasViews } from "@/config/cms-canvas.config"
import { siteConfig } from "@/config/site.config"
import { createServerSupabase } from "@/lib/supabase/server"
import { cmsIdSchema } from "@/model/cms.model"
import { getEntry } from "@/repository/cms-entry.repository"
import { listSingleValues } from "@/service/cms.service"

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
}

export default async function CmsPreviewPage({
  params,
}: PageProps<"/preview/[collection]/[id]">) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getClaims()
  if (data === null) {
    redirect(siteConfig.loginPath)
  }
  const { collection, id } = await params
  const view = cmsCanvasViews.get(collection)
  const parsedId = cmsIdSchema.safeParse(Number(id))
  if (view === undefined || !parsedId.success) {
    notFound()
  }
  const entry = await getEntry(supabase, parsedId.data)
  if (entry === null || entry.collection !== collection) {
    notFound()
  }
  let values = entry.draft
  if (values === null) {
    values = entry.published
  }
  if (values === null) {
    notFound()
  }
  const content = view(values, await listSingleValues(supabase))
  if (content === null) {
    notFound()
  }
  return (
    <>
      <aside
        aria-label="Preview"
        className="border-b bg-muted px-4 py-2 text-center text-sm font-medium"
      >
        Preview: you&apos;re seeing unpublished changes.{" "}
        <Link
          href={`/editor/${collection}/${parsedId.data}`}
          className="underline underline-offset-4"
        >
          Back to editor
        </Link>
      </aside>
      {content}
    </>
  )
}
