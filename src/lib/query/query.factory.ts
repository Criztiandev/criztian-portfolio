import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Non-zero so SSR-hydrated data is not refetched immediately on mount.
        staleTime: 30 * 1000,
        // Auth failures and bad input are not transient; retrying them only
        // delays the error the user needs to see.
        retry: (failureCount, error) => {
          const code = (error as { data?: { code?: string } })?.data?.code
          if (
            code === "UNAUTHORIZED" ||
            code === "FORBIDDEN" ||
            code === "BAD_REQUEST"
          ) {
            return false
          }
          return failureCount < 2
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // The RSC transport can hydrate promises, so pending queries are
        // dehydrated too: a server component high in the tree can start a
        // fetch that a client component further down consumes.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}
