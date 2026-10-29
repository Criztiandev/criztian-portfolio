import * as motion from "motion/react-client"

import { ContactForm } from "@/components/contact-form"
import type { Home } from "@/type/home.type"

export function HomeView({ home }: { home: Home }) {
  return (
    <div className="flex flex-col gap-16">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        data-cms-card="Hero"
        className="flex flex-col gap-4"
      >
        <h1
          data-cms-field="heroHeading"
          className="text-4xl font-semibold tracking-tight"
        >
          {home.heroHeading}
        </h1>
        <p
          data-cms-field="heroText"
          className="max-w-prose text-lg text-muted-foreground"
        >
          {home.heroText}
        </p>
      </motion.section>
      <section
        id="contact"
        data-cms-card="Contact"
        className="flex w-full max-w-md flex-col gap-4"
      >
        <h2 data-cms-field="contactHeading" className="text-2xl font-semibold">
          {home.contactHeading}
        </h2>
        <ContactForm />
      </section>
    </div>
  )
}
