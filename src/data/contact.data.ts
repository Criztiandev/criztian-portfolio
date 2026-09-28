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

export const EMPTY_CONTACT_FORM: Omit<ContactInput, "renderedAt"> = {
  name: "",
  email: "",
  service: "",
  message: "",
  website: "",
}
