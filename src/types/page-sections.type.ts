import type { PortfolioSection } from "@/types/portfolio.type"
import type {
  SiteContentConnect,
  SiteContentContact,
  SiteContentFaq,
} from "@/types/site-content.type"

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

export type StepMotionStyle = Record<`--${string}`, string | number>

export type AboutStat = {
  value: string
  label: string
}

export type StatCount = {
  target: number
  suffix: string
}

export type PlaceholderPlate = {
  src: string
  label: string
}

export type StatementSize =
  "default" | "service" | "longWord" | "belief" | "client" | "contact"

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

export type SceneSectionContent = {
  id: PortfolioSection
  sceneId: string
  shapes: string
}

export type ContactSectionContent = SceneSectionContent & {
  headingId: string
}

export type PlaceholderSectionContent = PageSectionHeading & {
  placeholders: string[]
}

export type FaqSectionContent = PageSectionHeading & SceneSectionContent

export type FaqSectionProps = {
  faq: SiteContentFaq
}

export type ConnectSectionProps = {
  connect: SiteContentConnect
}

export type ContactSectionProps = {
  contact: SiteContentContact
}

export type SiteFooterProps = {
  name: string
  email: string
}

export type SceneFitGateProps = {
  shapes: string
}
