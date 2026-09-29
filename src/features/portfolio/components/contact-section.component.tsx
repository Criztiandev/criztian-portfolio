import {
  CONTACT_SECTION,
  CUE_CLASS,
  FOCUS_RING_CLASS,
  OWNER_EMAIL_ADDRESS,
  OWNER_EMAIL_HREF,
  SCREEN_CENTRED_GROUP_CLASS,
  SCREEN_CLASS,
  SCREEN_COPY_CLASS,
  SCREEN_HEIGHT_CLASS,
  SCREEN_LABEL_CLASS,
  SCREEN_OBJECT_CLASS,
  SECTION_FRAME_CLASS,
  SECTION_LABEL_CLASS,
  STATEMENT_CLASS,
  STATEMENT_SIZE_CLASSES,
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
        SCREEN_CLASS,
        SCREEN_HEIGHT_CLASS,
        "text-foreground"
      )}
    >
      <h2
        id={CONTACT_SECTION.headingId}
        className={cn(SECTION_LABEL_CLASS, SCREEN_LABEL_CLASS)}
      >
        {CONTACT_SECTION.heading}
      </h2>

      <div className={SCREEN_CENTRED_GROUP_CLASS}>
        <div className={SCREEN_COPY_CLASS}>
          <p className={cn(STATEMENT_CLASS, STATEMENT_SIZE_CLASSES.contact)}>
            {CONTACT_SECTION.statement}
          </p>

          <p className={cn(CUE_CLASS, "mt-3.5 split:mt-8")}>
            {CONTACT_SECTION.emailPrompt}{" "}
            <a
              href={OWNER_EMAIL_HREF}
              className={cn(
                "-my-3.5 inline-block py-3.5 text-foreground underline",
                "decoration-1 underline-offset-3 split:my-0 split:py-0",
                "split:underline-offset-4",
                FOCUS_RING_CLASS
              )}
            >
              {OWNER_EMAIL_ADDRESS}
            </a>
          </p>
        </div>

        <div
          className={cn(
            SCREEN_OBJECT_CLASS,
            "mt-10 flex w-full flex-col justify-center bg-background",
            "split:mt-0 split:min-h-[27.5rem] split:max-w-[32.5rem] split:justify-self-center split:p-8"
          )}
        >
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
