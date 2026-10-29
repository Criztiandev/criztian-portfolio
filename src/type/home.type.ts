import type * as z from "zod"

import type { homeSchema } from "@/model/home.model"

export type Home = z.infer<typeof homeSchema>
