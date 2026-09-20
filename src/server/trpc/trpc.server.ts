import "server-only"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { cache } from "react"

import { makeQueryClient } from "@/lib/query/query.factory"

import { appRouter } from "./app.router"
import { createTRPCContext } from "./trpc.init"

export const getQueryClient = cache(makeQueryClient)

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
})

export const caller = appRouter.createCaller(createTRPCContext)
