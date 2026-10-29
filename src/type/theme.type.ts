import type * as z from "zod"

import type { themeSchema } from "@/model/theme.model"

export type Theme = z.infer<typeof themeSchema>
