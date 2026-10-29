"use client"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  let reference = null
  if (error.digest) {
    reference = (
      <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
    )
  }
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-16">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      {reference}
      <div>
        <Button onClick={retry}>Try again</Button>
      </div>
    </main>
  )
}
