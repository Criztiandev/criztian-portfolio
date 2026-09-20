import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/features/auth/components/login.form"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

const LINK_ERRORS: Record<string, string> = {
  invalid_link: "That link was not valid. Request a new one.",
  expired_link: "That link has expired. Request a new one.",
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams
  const errorKey = typeof params.error === "string" ? params.error : null
  const next = typeof params.next === "string" ? params.next : undefined
  const linkError = errorKey === null ? null : (LINK_ERRORS[errorKey] ?? null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Owner access only.</p>
      </div>

      {linkError === null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {linkError}
        </p>
      )}

      <LoginForm next={next} />

      <Link
        href="/forgot-password"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Forgot your password?
      </Link>
    </div>
  )
}
