import { fontDisplay } from "@/config/fonts.config"
import { SitePage } from "@/features/portfolio/components/site-page.component"
import { readPublishedContent } from "@/features/site-content/server/site-content.service"

export default async function Page() {
  const content = await readPublishedContent()

  return (
    <SitePage
      content={content}
      displayFontFamily={fontDisplay.style.fontFamily}
    />
  )
}
