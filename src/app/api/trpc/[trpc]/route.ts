import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { EXPECTED_TRPC_ERROR_CODES } from "@/data/logging.data"
import { logError, logWarn } from "@/server/logging/logger.service"
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

      const entry = {
        event: "trpc.request_failed",
        requestId: context?.requestId ?? null,
        details: { path: path ?? null, code: error.code },
        error: error.cause ?? error,
      }

      if (EXPECTED_TRPC_ERROR_CODES.includes(error.code)) {
        logWarn(entry)
        return
      }

      logError(entry)
    },
  })
}

export { handler as GET, handler as POST }
