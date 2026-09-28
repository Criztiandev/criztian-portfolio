import {
  CONTACT_SECTION,
  SECTION_FRAME_CLASS,
  SECTION_HEADLINE_CLASS,
} from "@/data/page-sections.data"
import { ContactForm } from "@/features/contact/components/contact.form"
import { cn } from "@/lib/utils"

export function ContactSection() {
  return (
    <section
      id={CONTACT_SECTION.id}
      aria-labelledby={CONTACT_SECTION.headingId}
      className={cn(
        SECTION_FRAME_CLASS,
        "grid min-h-[calc(100svh_-_4.5rem)] content-start gap-10",
        "py-[max(4rem,10svh)] md:grid-cols-2 md:gap-16"
      )}
    >
      <h2
        id={CONTACT_SECTION.headingId}
        className={cn(SECTION_HEADLINE_CLASS, "max-w-[14ch]")}
      >
        {CONTACT_SECTION.heading}
      </h2>

      <div className="w-full max-w-xl">
        <ContactForm />
      </div>
    </section>
  )
}
