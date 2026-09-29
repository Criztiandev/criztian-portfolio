import type { PortfolioSection } from "@/types/portfolio.type"

export type PageSectionHeading = {
  id: PortfolioSection
  headingId: string
  heading: string
}

export type SceneStep = {
  title: string
  body: string
  items: string[]
}

export type StepSceneContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  steps: SceneStep[]
}

export type ServiceStep = SceneStep & {
  size: StatementSize
}

export type ServicesSceneContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  steps: ServiceStep[]
}

export type StepHandover = {
  inFrom: number
  inTo: number
  outFrom: number | null
  outTo: number | null
}

export type StepMotionStyle = Record<`--${string}`, string | number>

export type AboutStat = {
  value: string
  label: string
}

export type PlaceholderPlate = {
  src: string
  label: string
}

export type StatementSize =
  "default" | "service" | "longWord" | "belief" | "client" | "contact" | "faq"

export type AboutSectionContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  statement: string
  body: string
  story: string
  stats: AboutStat[]
  plate: PlaceholderPlate
}

export type Testimonial = {
  quote: string
  attribution: string
}

export type TestimonialsSectionContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  items: Testimonial[]
  plate: PlaceholderPlate
}

export type ContactSectionContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  statement: string
  emailPrompt: string
}

export type PlaceholderSectionContent = PageSectionHeading & {
  placeholders: string[]
}

export type FaqItem = {
  question: string
  answer: string
}

export type FaqSectionContent = PageSectionHeading & {
  items: FaqItem[]
}

export type SiteFooterProps = {
  name: string
}

export type SceneFitGateProps = {
  shapes: string
}
