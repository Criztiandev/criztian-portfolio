import type { ReactNode } from "react"

export function PageFrame({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-12">{children}</div>
}
