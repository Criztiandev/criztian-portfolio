import type { z } from "zod"

import type { publicEnvSchema } from "@/config/env.public"
import type { serverEnvSchema } from "@/config/env.server"

export type PublicEnv = z.output<typeof publicEnvSchema>

export type ServerEnv = z.output<typeof serverEnvSchema>

export type EmailMode = ServerEnv["EMAIL_MODE"]
