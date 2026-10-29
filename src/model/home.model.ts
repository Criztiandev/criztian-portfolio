import * as z from "zod"

import { HOME_DEFAULTS } from "@/data/home.data"

export const homeSchema = z.object({
  heroHeading: z.string().trim().min(1).catch(HOME_DEFAULTS.heroHeading),
  heroText: z.string().catch(HOME_DEFAULTS.heroText),
  contactHeading: z.string().trim().min(1).catch(HOME_DEFAULTS.contactHeading),
})
