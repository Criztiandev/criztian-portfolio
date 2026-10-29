import type {
  CmsChange,
  CmsColorChannels,
  CmsColumn,
  CmsEntry,
  CmsField,
  CmsListCell,
  CmsListCollection,
  CmsListRow,
  CmsOptions,
  CmsPublishState,
  CmsValue,
  CmsValues,
} from "@/type/cms.type"
import type { Json } from "@/type/database.type"

export function findCmsCollection<Collection extends { slug: string }>(
  collections: readonly Collection[],
  slug: string
): Collection | null {
  for (const collection of collections) {
    if (collection.slug === slug) {
      return collection
    }
  }
  return null
}

export function findCmsField(
  fields: readonly CmsField[],
  name: string | undefined
): CmsField | null {
  for (const field of fields) {
    if (field.name === name) {
      return field
    }
  }
  return null
}

export function toCmsValues(json: Json | null): CmsValues | null {
  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    return null
  }
  const values: CmsValues = {}
  for (const [name, value] of Object.entries(json)) {
    if (typeof value === "string" || typeof value === "boolean") {
      values[name] = value
    }
  }
  return values
}

export function cmsPublishState(
  entry: Pick<CmsEntry, "draft" | "published">
): CmsPublishState {
  if (entry.published === null) {
    return "draft"
  }
  if (entry.draft === null) {
    return "published"
  }
  return "changed"
}

function readValue(values: CmsValues | null, name: string): CmsValue | null {
  if (values === null) {
    return null
  }
  const value = values[name]
  if (value === undefined) {
    return null
  }
  return value
}

export function cmsNewestValues(
  entry: Pick<CmsEntry, "draft" | "published">
): CmsValues {
  if (entry.draft !== null) {
    return entry.draft
  }
  if (entry.published !== null) {
    return entry.published
  }
  return {}
}

function readText(values: CmsValues, name: string | undefined): string {
  if (name === undefined) {
    return ""
  }
  const value = readValue(values, name)
  if (typeof value !== "string") {
    return ""
  }
  return value
}

export function cmsValueText(value: CmsValue | null): string {
  if (value === true) {
    return "Yes"
  }
  if (value === false) {
    return "No"
  }
  if (value === null) {
    return ""
  }
  return value
}

function toCmsListCell(column: CmsColumn, values: CmsValues): CmsListCell {
  if ("badge" in column) {
    const badge = column.badge(values)
    if (badge === null) {
      return ""
    }
    return badge
  }
  return cmsValueText(readValue(values, column.field))
}

export function toCmsListRow(
  collection: CmsListCollection,
  entry: CmsEntry
): CmsListRow {
  const values = cmsNewestValues(entry)
  let title = readText(values, collection.titleField)
  if (title === "") {
    title = "Untitled"
  }
  const cells: CmsListCell[] = []
  if (collection.columns !== undefined) {
    for (const column of collection.columns) {
      cells.push(toCmsListCell(column, values))
    }
  }
  return {
    id: entry.id,
    title,
    summary: readText(values, collection.summaryField),
    updatedAt: entry.updated_at,
    state: cmsPublishState(entry),
    cells,
  }
}

function initialChoice(
  options: CmsOptions,
  stored: CmsValue | null,
  fallback: CmsValue | undefined
): string {
  const values = options.map((option) => option.value)
  if (typeof stored === "string" && values.includes(stored)) {
    return stored
  }
  if (typeof fallback === "string" && values.includes(fallback)) {
    return fallback
  }
  return options[0].value
}

function optionLabel(
  options: CmsOptions,
  value: CmsValue | null
): CmsValue | null {
  for (const option of options) {
    if (option.value === value) {
      return option.label
    }
  }
  return value
}

function initialValue(
  field: CmsField,
  stored: CmsValue | null,
  today: string
): CmsValue {
  if (field.type === "switch") {
    if (typeof stored === "boolean") {
      return stored
    }
    if (typeof field.default === "boolean") {
      return field.default
    }
    return true
  }
  if (field.type === "select") {
    return initialChoice(field.options, stored, field.default)
  }
  if (typeof stored === "string") {
    return stored
  }
  if (typeof field.default === "string") {
    return field.default
  }
  if (field.type === "date" && field.required === true) {
    return today
  }
  return ""
}

export function cmsInitialValues(
  fields: readonly CmsField[],
  stored: CmsValues | null,
  today: string
): CmsValues {
  const values: CmsValues = {}
  for (const field of fields) {
    values[field.name] = initialValue(
      field,
      readValue(stored, field.name),
      today
    )
  }
  return values
}

const colorPattern = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/

export function cmsColorChannels(
  value: CmsValue | undefined
): CmsColorChannels | null {
  if (typeof value !== "string") {
    return null
  }
  const match = colorPattern.exec(value)
  if (match === null) {
    return null
  }
  return [
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16),
  ]
}

function linearChannel(channel: number): number {
  const share = channel / 255
  if (share <= 0.04045) {
    return share / 12.92
  }
  return ((share + 0.055) / 1.055) ** 2.4
}

function luminance(color: CmsColorChannels): number {
  return (
    0.2126 * linearChannel(color[0]) +
    0.7152 * linearChannel(color[1]) +
    0.0722 * linearChannel(color[2])
  )
}

export function cmsContrast(a: CmsColorChannels, b: CmsColorChannels): number {
  const first = luminance(a)
  const second = luminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

const paragraphBreak = /\n{2,}/

function changedParagraphs(
  before: string,
  after: string
): { before: string; after: string } {
  const oldParagraphs = before.split(paragraphBreak)
  const newParagraphs = after.split(paragraphBreak)
  let start = 0
  while (
    start < oldParagraphs.length &&
    start < newParagraphs.length &&
    oldParagraphs[start] === newParagraphs[start]
  ) {
    start += 1
  }
  let oldEnd = oldParagraphs.length
  let newEnd = newParagraphs.length
  while (
    oldEnd > start &&
    newEnd > start &&
    oldParagraphs[oldEnd - 1] === newParagraphs[newEnd - 1]
  ) {
    oldEnd -= 1
    newEnd -= 1
  }
  if (oldEnd === start && newEnd === start) {
    return { before, after }
  }
  return {
    before: oldParagraphs.slice(start, oldEnd).join("\n\n"),
    after: newParagraphs.slice(start, newEnd).join("\n\n"),
  }
}

export function cmsChanges(
  fields: readonly CmsField[],
  live: CmsValues | null,
  draft: CmsValues
): CmsChange[] {
  const changes: CmsChange[] = []
  for (const field of fields) {
    const before = readValue(live, field.name)
    const after = readValue(draft, field.name)
    if (before === after) {
      continue
    }
    let change: CmsChange = {
      name: field.name,
      label: field.label,
      type: field.type,
      before,
      after,
    }
    if (
      field.type === "richtext" &&
      typeof before === "string" &&
      typeof after === "string"
    ) {
      change = { ...change, ...changedParagraphs(before, after) }
    }
    if (field.type === "select") {
      change = {
        ...change,
        before: optionLabel(field.options, before),
        after: optionLabel(field.options, after),
      }
    }
    changes.push(change)
  }
  return changes
}
