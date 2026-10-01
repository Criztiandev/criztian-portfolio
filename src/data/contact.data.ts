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

export const CONTACT_SEND_LABEL = "Send message"

export const CONTACT_SENDING_LABEL = "Sending…"

export const CONTACT_ERROR_IDS = {
  name: "contact-name-error",
  email: "contact-email-error",
  service: "contact-service-error",
  message: "contact-message-error",
  submit: "contact-submit-error",
} as const

export const CONTACT_FIELD_NUMBERS = {
  name: "01",
  email: "02",
  service: "03",
  message: "04",
} as const

export const CONTACT_LABEL_LINE_CLASS = "flex min-h-4 items-baseline gap-2.5"

export const CONTACT_NUMBER_CLASS =
  "font-display text-sm/4 font-bold tracking-[0.04em] text-muted-foreground"

export const CONTACT_LABEL_CLASS =
  "-mb-0.75 text-xs/4 font-medium tracking-[0.08em] text-foreground uppercase"

export const CONTACT_FIELD_CLASS =
  "h-11 scroll-mt-18 border-x-0 border-t-0 px-0 text-base focus-visible:outline-hidden md:text-[0.9375rem] dark:bg-transparent dark:aria-invalid:focus-visible:border-ring dark:aria-invalid:focus-visible:ring-ring/50 forced-colors:aria-invalid:border-b-3"

export const CONTACT_MESSAGE_CLASS =
  "h-20 field-sizing-fixed resize-none py-2.5 split:h-28"

export const CONTACT_CHIP_CLASS =
  "relative inline-flex h-10 cursor-pointer items-center gap-2 border border-input px-3 text-xs font-medium tracking-[0.08em] text-foreground/75 uppercase transition-colors hover:text-foreground has-checked:border-foreground has-checked:text-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:outline-hidden split:px-2.5 group-aria-invalid/service:border-destructive/50 forced-colors:group-aria-invalid/service:border-dashed"

export const CONTACT_CHIP_INPUT_CLASS =
  "peer/chip absolute top-0 m-0 size-px scroll-mt-18 scroll-mb-10 opacity-0"

export const CONTACT_CHIP_DOT_CLASS =
  "hidden size-1.5 shrink-0 rounded-full bg-foreground peer-checked/chip:block forced-colors:bg-[CanvasText]"

export const CONTACT_SUBMIT_CLASS =
  "mt-1 h-12 w-full scroll-mt-18 gap-2.5 bg-foreground text-sm font-medium tracking-[0.025em] text-background uppercase hover:bg-foreground/80 focus-visible:outline-hidden"

export const CONTACT_ACKNOWLEDGEMENT_CLASS =
  "self-center text-sm text-muted-foreground [grid-area:1/1] [clip-path:inset(-1rem)] [translate:0_0] transition-[clip-path,translate] duration-900 ease-signal starting:[clip-path:inset(-1rem_100%_-1rem_-1rem)] starting:[translate:-24px_0] motion-reduce:transition-none"

export const EMPTY_CONTACT_FORM: Omit<ContactInput, "renderedAt"> = {
  name: "",
  email: "",
  service: "",
  message: "",
  website: "",
}
