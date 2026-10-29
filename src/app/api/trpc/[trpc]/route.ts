import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createTRPCContext } from "@/lib/trpc/init"
import { appRouter } from "@/router/app.router"

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError({ error, path }) {
      if (
        error.code === "INTERNAL_SERVER_ERROR" ||
        error.code === "BAD_GATEWAY"
      ) {
        console.error("[trpc]", path, error)
      }
    },
  })
}

export { handler as GET, handler as POST }
