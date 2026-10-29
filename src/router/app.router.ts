import { createTRPCRouter } from "@/lib/trpc/init"
import { cmsRouter } from "@/router/cms.router"
import { contactRouter } from "@/router/contact.router"

export const appRouter = createTRPCRouter({
  cms: cmsRouter,
  contact: contactRouter,
})
