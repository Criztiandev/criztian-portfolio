import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"

const NON_RETRYABLE_CODES = ["UNAUTHORIZED", "FORBIDDEN", "BAD_REQUEST"]

const MAX_QUERY_RETRIES = 2

const QUERY_STALE_TIME_MS = 30 * 1000

function readErrorCode(error: unknown): string | undefined {
  const withData = error as { data?: { code?: string } } | null

  return withData?.data?.code
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const code = readErrorCode(error)

  for (const nonRetryable of NON_RETRYABLE_CODES) {
    if (code === nonRetryable) {
      return false
    }
  }

  return failureCount < MAX_QUERY_RETRIES
}

function shouldDehydrate(
  query: Parameters<typeof defaultShouldDehydrateQuery>[0]
) {
  if (defaultShouldDehydrateQuery(query)) {
    return true
  }

  return query.state.status === "pending"
}

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: shouldDehydrate,
      },
    },
  })
}
