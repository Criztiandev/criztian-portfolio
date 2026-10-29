import type * as z from "zod"

import type { homeSchema } from "@/model/home.model"

export type Home = z.infer<typeof homeSchema>

export type HomeImage = {
  src: string
  alt: string
}

export type WorkScreens = {
  desktop: HomeImage
  detail: HomeImage
  phone: HomeImage
  phoneDetail: HomeImage
}

export type WorkRow = {
  name: string
  meta: string
  line: string
  tag?: string
  link?: { href: string; label: string }
  screens?: WorkScreens
  bookCall?: boolean
}

export type Step = {
  number: string
  title: string
  body: string
}

export type Stat = {
  value: string
  label: string
}

export type PricePackage = {
  name: string
  price: string
  summary: string
  includes: string[]
}

export type FooterLink = {
  href: string
  label: string
}
