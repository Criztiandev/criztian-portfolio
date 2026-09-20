import { ContactForm } from "@/features/contact/components/contact.form"
import { SectionNavigation } from "@/features/portfolio/components/section-navigation.component"
import { PortfolioStoreProvider } from "@/providers/portfolio-store.provider"

export default function Page() {
  return (
    <PortfolioStoreProvider>
      <SectionNavigation />

      <main className="mx-auto max-w-4xl px-4">
        <section id="work" className="scroll-mt-20 py-20">
          <h1 className="text-2xl font-semibold">Work</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selected projects will go here.
          </p>
        </section>

        <section id="about" className="scroll-mt-20 py-20">
          <h2 className="text-2xl font-semibold">About</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A short introduction will go here.
          </p>
        </section>

        <section id="contact" className="scroll-mt-20 py-20">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">
            Send me a message and I will get back to you.
          </p>
          <ContactForm />
        </section>
      </main>
    </PortfolioStoreProvider>
  )
}
