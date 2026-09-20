import "server-only"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { cache } from "react"

import { makeQueryClient } from "@/lib/query/query.factory"

import { appRouter } from "./app.router"
import { createTRPCContext } from "./trpc.init"

// Stable per request: the same client for every call within one request.
export const getQueryClient = cache(makeQueryClient)

// Server Components call procedures through this proxy rather than making a
// loopback HTTP request to our own route handler.
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
})

export const caller = appRouter.createCaller(createTRPCContext)
