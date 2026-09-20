import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "@/server/trpc/app.router"
import { createTRPCContext } from "@/server/trpc/trpc.init"

function responseMeta() {
  return {
    headers: {
      "cache-control":
        "private, no-cache, no-store, must-revalidate, max-age=0",
      pragma: "no-cache",
      expires: "0",
    },
  }
}

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta,
  })
}

export { handler as GET, handler as POST }
