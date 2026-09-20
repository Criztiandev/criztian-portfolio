import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "@/server/trpc/app.router"
import { createTRPCContext } from "@/server/trpc/trpc.init"

// No `export const runtime`: Node is already the default, and 'edge' is
// deprecated in Next 16.
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })

export { handler as GET, handler as POST }
