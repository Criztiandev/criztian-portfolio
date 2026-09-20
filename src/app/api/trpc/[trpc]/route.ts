import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { logError } from "@/server/logging/logger.service"
import { appRouter } from "@/server/trpc/app.router"
import type { TRPCContext } from "@/server/trpc/trpc.init"
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

function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta,
    onError({ error, path, ctx }) {
      const context = ctx as TRPCContext | undefined

      logError({
        event: "trpc.request_failed",
        requestId: context?.requestId ?? null,
        details: { path: path ?? null, code: error.code },
        error: error.cause ?? error,
      })
    },
  })
}

export { handler as GET, handler as POST }
