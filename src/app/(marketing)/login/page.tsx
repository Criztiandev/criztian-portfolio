import type { Metadata } from "next"

import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = { title: "Log in" }

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <LoginForm />
    </div>
  )
}
