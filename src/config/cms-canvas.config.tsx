import { HomeView } from "@/components/home-view"
import { PostView } from "@/components/post-view"
import { SiteShell } from "@/components/site-shell"
import { homeSchema } from "@/model/home.model"
import { postPreviewSchema } from "@/model/post.model"
import { themeSchema } from "@/model/theme.model"
import type { CmsCanvasView, CmsSiteValues, CmsValues } from "@/type/cms.type"

function liveValues(site: CmsSiteValues, slug: string): CmsValues {
  const values = site[slug]
  if (values === undefined) {
    return {}
  }
  return values
}

function drawHomePage(home: CmsValues, theme: CmsValues) {
  return (
    <SiteShell theme={themeSchema.parse(theme)}>
      <HomeView home={homeSchema.parse(home)} />
    </SiteShell>
  )
}

function drawHome(values: CmsValues, site: CmsSiteValues) {
  return drawHomePage(values, liveValues(site, "theme"))
}

function drawTheme(values: CmsValues, site: CmsSiteValues) {
  return drawHomePage(liveValues(site, "home"), values)
}

function drawPost(values: CmsValues, site: CmsSiteValues) {
  const parsed = postPreviewSchema.safeParse(values)
  if (!parsed.success) {
    return null
  }
  return (
    <SiteShell theme={themeSchema.parse(liveValues(site, "theme"))}>
      <PostView post={parsed.data} />
    </SiteShell>
  )
}

export const cmsCanvasViews: ReadonlyMap<string, CmsCanvasView> = new Map([
  ["posts", drawPost],
  ["home", drawHome],
  ["theme", drawTheme],
])
