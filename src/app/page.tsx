import { fontDisplay } from "@/config/fonts.config"
import { AdaptiveCursor } from "@/features/portfolio/components/adaptive-cursor.component"
import { SitePage } from "@/features/portfolio/components/site-page.component"
import { SmoothScroll } from "@/features/portfolio/components/smooth-scroll.component"
import { readPublishedContent } from "@/features/site-content/server/site-content.service"

export const dynamic = "force-static"

export default async function Page() {
  const content = await readPublishedContent()

  return (
    <>
      <SitePage
        content={content}
        displayFontFamily={fontDisplay.style.fontFamily}
      />
      <SmoothScroll />
      <AdaptiveCursor />
    </>
  )
}
