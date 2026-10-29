import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CaseStudyView } from "@/components/case-study-view"
import { CASE_STUDIES } from "@/data/case-study.data"
import type { CaseStudy } from "@/type/case-study.type"

export function generateStaticParams(): { slug: string }[] {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }))
}

function findStudy(slug: string): CaseStudy | null {
  for (const study of CASE_STUDIES) {
    if (study.slug === slug) {
      return study
    }
  }
  return null
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const study = findStudy(slug)
  if (study === null) {
    notFound()
  }
  return { title: study.title, description: study.sub }
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params
  const study = findStudy(slug)
  if (study === null) {
    notFound()
  }
  return <CaseStudyView study={study} />
}
