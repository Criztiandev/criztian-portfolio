import { ContactForm } from "@/features/contact/components/contact.form"
import { Hero } from "@/features/portfolio/components/hero.component"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { buildThemeStyle } from "@/features/site-content/site-content.rules"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"
import type { SiteContent } from "@/types/site-content.type"

const PLACEHOLDER_SECTIONS = [
  {
    id: "project",
    heading: "Project",
    body: "Selected projects will go here.",
  },
  {
    id: "about",
    heading: "About",
    body: "A short introduction will go here.",
  },
  {
    id: "services",
    heading: "Services",
    body: "What I can help with will go here.",
  },
  {
    id: "blog",
    heading: "Blog",
    body: "Writing will go here.",
  },
]

export function SitePage({
  content,
  displayFontFamily,
}: Readonly<{ content: SiteContent; displayFontFamily: string }>) {
  return (
    <PortfolioStoreProvider>
      <div style={buildThemeStyle(content.theme) as React.CSSProperties}>
        <SectionNavigation />

        <Hero content={content} displayFontFamily={displayFontFamily} />

        <main>
          {PLACEHOLDER_SECTIONS.map(function renderSection(section) {
            return (
              <section
                key={section.id}
                id={section.id}
                className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20"
              >
                <h2 className="text-2xl font-semibold">{section.heading}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.body}
                </p>
              </section>
            )
          })}

          <section
            id="contact"
            className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20"
          >
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Send me a message and I will get back to you.
            </p>
            <ContactForm />
          </section>
        </main>
      </div>
    </PortfolioStoreProvider>
  )
}
