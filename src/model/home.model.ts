import * as z from "zod"

import { HOME_DEFAULTS } from "@/data/home.data"

export const homeSchema = z.object({
  heroHeading: z.string().trim().min(1).catch(HOME_DEFAULTS.heroHeading),
  heroText: z.string().catch(HOME_DEFAULTS.heroText),
  stakesHeading: z.string().trim().min(1).catch(HOME_DEFAULTS.stakesHeading),
  stakesText: z.string().catch(HOME_DEFAULTS.stakesText),
})
