import type { Metadata } from "next"
import Link from "next/link"

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password.form"

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We will email a reset link.
        </p>
      </div>

      <ForgotPasswordForm />

      <Link
        href="/login"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  )
}
