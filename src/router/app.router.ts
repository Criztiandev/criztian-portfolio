import { createTRPCRouter } from "@/lib/trpc/init"
import { cmsRouter } from "@/router/cms.router"

export const appRouter = createTRPCRouter({
  cms: cmsRouter,
})
