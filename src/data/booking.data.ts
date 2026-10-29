import { FOOTER } from "@/data/home.data"
import { BOOK_CALL } from "@/data/nav-links.data"

export const BOOKING = {
  title: "Book a call",
  embedUrl: `${BOOK_CALL.href}?embed=true&theme=dark`,
  embedOrigin: "https://cal.com",
  readyMessage: "navigatedToBooker",
  timeoutMs: 15000,
  frameTitle: "Cal.com booking calendar",
  loading: "Loading times…",
  errorHeading: "The calendar didn't load.",
  errorText: `Email me at ${FOOTER.email} and I'll reply within 24 hours.`,
  errorLink: {
    href: `mailto:${FOOTER.email}`,
    label: `Email ${FOOTER.email}`,
  },
} as const
