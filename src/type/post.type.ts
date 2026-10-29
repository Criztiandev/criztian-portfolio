import type * as z from "zod"

import type { postSchema } from "@/model/post.model"

export type Post = z.infer<typeof postSchema>
