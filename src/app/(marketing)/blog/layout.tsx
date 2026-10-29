import type { ReactNode } from "react"

import { PageFrame } from "@/components/page-frame"

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <PageFrame>{children}</PageFrame>
}
