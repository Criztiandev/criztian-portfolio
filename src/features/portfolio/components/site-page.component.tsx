import { PUBLIC_TOKEN_OVERRIDES } from "@/data/portfolio.data"
import { AboutSection } from "@/features/portfolio/components/about-section.component"
import { BlogSection } from "@/features/portfolio/components/blog-section.component"
import { ConnectSection } from "@/features/portfolio/components/connect-section.component"
import { ContactSection } from "@/features/portfolio/components/contact-section.component"
import { FaqSection } from "@/features/portfolio/components/faq-section.component"
import { Hero } from "@/features/portfolio/components/hero.component"
import { ProcessSection } from "@/features/portfolio/components/process-section.component"
import { ProjectsSection } from "@/features/portfolio/components/projects-section.component"
import { QuoteSection } from "@/features/portfolio/components/quote-section.component"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { ServicesSection } from "@/features/portfolio/components/services-section.component"
import { SiteFooter } from "@/features/portfolio/components/site-footer.component"
import { TestimonialsSection } from "@/features/portfolio/components/testimonials-section.component"
import { buildThemeStyle } from "@/features/site-content/site-content.rules"
import { cn } from "@/lib/utils"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"
import type { SiteContent } from "@/types/site-content.type"

export function SitePage({
  content,
  displayFontFamily,
}: Readonly<{ content: SiteContent; displayFontFamily: string }>) {
  const stageStyle = {
    ...buildThemeStyle(content.theme),
    ...PUBLIC_TOKEN_OVERRIDES,
  }

  return (
    <PortfolioStoreProvider>
      <div
        data-status="idle"
        data-scene="name"
        className={cn(
          "group/stage dark isolate bg-background text-foreground scheme-dark",
          "selection:bg-foreground selection:text-background"
        )}
        style={stageStyle as React.CSSProperties}
      >
        <SectionNavigation />

        <main>
          <Hero content={content} displayFontFamily={displayFontFamily} />

          <QuoteSection quote={content.quote} />

          <ServicesSection />

          <AboutSection />

          <ProjectsSection projects={content.projects} />

          <ProcessSection />

          <div
            data-dot-scene="dust"
            data-dot-shapes="dust"
            className="scroll-mt-18"
          >
            <ConnectSection />

            <TestimonialsSection />

            <FaqSection />

            <BlogSection />

            <ContactSection />
          </div>
        </main>

        <SiteFooter name={content.hero.name} />
      </div>
    </PortfolioStoreProvider>
  )
}
