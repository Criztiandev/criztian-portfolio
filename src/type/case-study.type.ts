import type { FooterLink, HomeImage } from "@/type/home.type"

export type ShotImage = HomeImage & {
  aspectRatio?: string
  objectPosition?: string
}

export type CaseStudyShot = {
  image: ShotImage
  caption: string
}

export type CaseStudyNote = {
  title: string
  body: string
}

export type CaseStudyChange = {
  title: string
  body: string
  screen: ShotImage
  phoneScreen: ShotImage
}

export type CaseStudyNext = {
  heading: string
  link: FooterLink
}

export type CaseStudy = {
  slug: string
  title: string
  sub: string
  meta: string
  image: ShotImage
  business: {
    heading: string
    paragraphs: string[]
  }
  before: {
    heading: string
    intro: string
    shots: CaseStudyShot[]
    notes: CaseStudyNote[]
  }
  after: {
    heading: string
    intro: string
    changes: CaseStudyChange[]
  }
  measure: {
    heading: string
    intro: string
    items: string[]
  }
  next?: CaseStudyNext
}
