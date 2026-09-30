import type { ContactInput, ContactService } from "@/types/contact.type"

export const MIN_SECONDS_BEFORE_SUBMIT = 2

export const MAX_SUBMISSIONS_PER_HOUR = 5

export const RATE_LIMIT_WINDOW_MINUTES = 60

export const CONTACT_ACKNOWLEDGEMENT =
  "Thanks — your message has been received."

export const CONTACT_REJECTED_MESSAGE =
  "We could not accept that submission. Please try again later."

export const EMAIL_PREVIEW_DIRECTORY = ".local/email-previews"

export const CONTACT_SERVICES = [
  "branding",
  "web_design",
  "development",
  "something_else",
] as const

export const CONTACT_SERVICE_LABELS: Record<ContactService, string> = {
  branding: "Branding",
  web_design: "Web design",
  development: "Development",
  something_else: "Something else",
}

export const CONTACT_SERVICE_PROMPT = "Choose a service"

export const CONTACT_FIELD_CLASS =
  "h-11 scroll-mt-18 px-3 text-base md:text-[0.9375rem] dark:bg-transparent dark:aria-invalid:focus-visible:border-ring dark:aria-invalid:focus-visible:ring-ring/50"

export const CONTACT_SELECT_CLASS =
  "h-11 w-full min-w-0 scroll-mt-18 appearance-none border border-input bg-transparent pr-10 pl-3 text-base transition-colors outline-none *:bg-background *:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 has-[option[value='']:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-[0.9375rem] dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:border-ring dark:aria-invalid:focus-visible:ring-ring/50"

export const CONTACT_SUBMIT_CLASS =
  "h-12 w-full scroll-mt-18 bg-foreground text-sm font-medium tracking-[0.025em] text-background uppercase hover:bg-foreground/80"

export const CONTACT_ACKNOWLEDGEMENT_CLASS =
  "self-center text-sm text-muted-foreground [grid-area:1/1] [clip-path:inset(-1rem)] [translate:0_0] transition-[clip-path,translate] duration-900 ease-signal starting:[clip-path:inset(-1rem_100%_-1rem_-1rem)] starting:[translate:-24px_0] motion-reduce:transition-none"

export const EMPTY_CONTACT_FORM: Omit<ContactInput, "renderedAt"> = {
  name: "",
  email: "",
  service: "",
  message: "",
  website: "",
}
