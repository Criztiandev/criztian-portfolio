"use client"

import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { useState } from "react"

import { publicEnv } from "@/config/env.public"
import { makeQueryClient } from "@/lib/query/query.factory"
import type { AppRouter } from "@/server/trpc/app.router"

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

const TRPC_ENDPOINT = "/api/trpc"

let browserQueryClient: QueryClient | undefined

function isServer(): boolean {
  return typeof window === "undefined"
}

function getQueryClient(): QueryClient {
  if (isServer()) {
    return makeQueryClient()
  }

  if (browserQueryClient === undefined) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

function getUrl(): string {
  if (isServer()) {
    return `${publicEnv.NEXT_PUBLIC_APP_URL}${TRPC_ENDPOINT}`
  }

  return TRPC_ENDPOINT
}

function createClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getUrl(),
      }),
    ],
  })
}

export function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(createClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
