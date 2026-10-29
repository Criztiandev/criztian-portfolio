import type { TablerIcon } from "@tabler/icons-react"
import type { ReactNode } from "react"

import type { Tables } from "@/type/database.type"

export type CmsFieldType =
  | "text"
  | "textarea"
  | "date"
  | "switch"
  | "slug"
  | "richtext"
  | "color"
  | "select"

export type CmsOption = {
  value: string
  label: string
}

export type CmsOptions = readonly [CmsOption, ...CmsOption[]]

export type CmsContrastRule = {
  field: string
  min: number
}

export type CmsColorChannels = [number, number, number]

export type CmsFieldRules = {
  label: string
  card: string
  required?: boolean
  max?: number
  helper?: string
  placeholder?: string
  compact?: boolean
  default?: CmsValue
  contrast?: CmsContrastRule
}

export type CmsField = CmsFieldRules &
  (
    | { name: "slug"; type: "slug" }
    | { name: string; type: "select"; options: CmsOptions }
    | { name: string; type: Exclude<CmsFieldType, "slug" | "select"> }
  )

export type CmsCard = {
  name: string
  description?: string
}

export type CmsBadgeTone = "success" | "info" | "neutral" | "outline"

export type CmsBadge = {
  tone: CmsBadgeTone
  label: string
}

export type CmsColumn = { label: string } & (
  { field: string } | { badge: (values: CmsValues) => CmsBadge | null }
)

export type CmsCollection = {
  slug: string
  label: string
  singular: string
  icon: TablerIcon
  single?: boolean
  cards: CmsCard[]
  titleField?: string
  summaryField?: string
  fields: CmsField[]
  columns?: CmsColumn[]
}

export type CmsCollectionFields = Pick<CmsCollection, "slug" | "fields">

export type CmsValue = string | boolean

export type CmsValues = Record<string, CmsValue>

export type CmsEntryRow = Tables<"cms_entries">

export type CmsLiveRow = Pick<CmsEntryRow, "id" | "published">

export type CmsEntry = Omit<CmsEntryRow, "draft" | "published"> & {
  draft: CmsValues | null
  published: CmsValues | null
}

export type CmsLiveEntry = {
  id: number
  values: CmsValues
}

export type CmsSiteValues = Partial<Record<string, CmsValues>>

export type CmsCanvasView = (
  values: CmsValues,
  site: CmsSiteValues
) => ReactNode

export type CmsCanvasMessage =
  | { type: "ready" }
  | { type: "values"; values: CmsValues }
  | { type: "card"; card: string }
  | { type: "select"; card: string | null; field: string | null }
  | { type: "blank"; blank: boolean }

export type CmsCanvasWidth = {
  label: string
  width: number
  icon: TablerIcon
}

export type CmsCanvasSize = {
  width: number
  height: number
}

export type CmsPublishState = "draft" | "changed" | "published"

export type CmsListCell = string | CmsBadge

export type CmsListRow = {
  id: number
  title: string
  summary: string
  updatedAt: string
  state: CmsPublishState
  cells: CmsListCell[]
}

export type CmsListCollection = Pick<
  CmsCollection,
  "titleField" | "summaryField" | "columns"
>

export type CmsEditorCollection = Pick<
  CmsCollection,
  "slug" | "label" | "singular" | "single" | "titleField" | "cards" | "fields"
>

export type CmsEditorEntry = {
  id: number
  values: CmsValues
  state: CmsPublishState
}

export type CmsPublishTarget = {
  id: number
  changes: CmsChange[]
}

export type CmsChange = {
  name: string
  label: string
  type: CmsFieldType
  before: CmsValue | null
  after: CmsValue | null
}

export type CmsWriteInput = {
  collection: string
  values: CmsValues
}

export type CmsSaveDraftInput = CmsWriteInput & {
  id: number
}
