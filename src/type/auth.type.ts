import type * as z from "zod"

import type { loginSchema } from "@/model/auth.model"

export type LoginInput = z.infer<typeof loginSchema>
