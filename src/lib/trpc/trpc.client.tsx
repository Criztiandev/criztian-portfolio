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

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  // Server: a fresh client per request, never shared between requests.
  if (typeof window === "undefined") return makeQueryClient()
  // Browser: one stable client. Re-making it when React suspends during the
  // initial render would throw away in-flight queries.
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

function getUrl() {
  // Relative in the browser so the call stays same-origin. On the server the
  // validated app URL is used rather than a hardcoded localhost fallback.
  const base =
    typeof window === "undefined" ? publicEnv.NEXT_PUBLIC_APP_URL : ""
  return `${base}/api/trpc`
}

export function TRPCReactProvider(
  props: Readonly<{ children: React.ReactNode }>
) {
  // Deliberately not useState: with no suspense boundary between this and
  // code that may suspend, React would discard the client on first render.
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: getUrl() })],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
