import * as z from "zod"

import { cmsSlugSchema } from "@/model/cms.model"

export const postSchema = z.object({
  title: z.string(),
  slug: cmsSlugSchema,
  summary: z.string(),
  body: z.string(),
  publishDate: z.iso.date(),
  visible: z.boolean(),
})

export const postPreviewSchema = postSchema.extend({ slug: z.string() })
