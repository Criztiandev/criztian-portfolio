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

export type AboutSectionContent = PageSectionHeading & {
  sceneId: string
  shapes: string
  intro: string
  body: string
  stats: AboutStat[]
}

export type ConnectSectionContent = PageSectionHeading & {
  actionLabel: string
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
