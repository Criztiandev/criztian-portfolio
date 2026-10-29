import type { Metadata } from "next"

import { PrivacyView } from "@/components/privacy-view"
import { PRIVACY } from "@/data/privacy.data"

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
}

export default function PrivacyPage() {
  return <PrivacyView />
}
