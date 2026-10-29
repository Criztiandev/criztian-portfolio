import * as z from "zod"

import type {
  CmsCanvasMessage,
  CmsCollectionFields,
  CmsField,
  CmsOptions,
  CmsValue,
  CmsValues,
  CmsWriteInput,
} from "@/type/cms.type"

import {
  cmsColorChannels,
  cmsContrast,
  findCmsField,
} from "../util/cms.util.ts"

export const cmsSlugSchema = z
  .string()
  .min(1, { error: "Enter a slug" })
  .max(100, { error: "Keep the slug under 100 characters" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error:
      "Use lowercase letters, numbers and single dashes, like my-first-entry",
  })

export const cmsLinkSchema = z
  .url({
    protocol: /^(https?|mailto)$/,
    error: "Enter a full link, like https://example.com",
  })
  .regex(/^\S+$/, { error: "Remove spaces from the link" })

export const cmsColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => cmsColorChannels(value) !== null, {
    error: "Enter a color like #1a2b3c",
  })

export const cmsIdSchema = z.int().positive()

export const cmsEntryIdSchema = z.object({ id: cmsIdSchema })

export const cmsListSchema = z.object({ collection: cmsSlugSchema })

export const cmsCanvasMessageSchema: z.ZodType<CmsCanvasMessage> =
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("ready") }),
    z.object({
      type: z.literal("values"),
      values: z.record(z.string(), z.union([z.string(), z.boolean()])),
    }),
    z.object({ type: z.literal("card"), card: z.string() }),
    z.object({
      type: z.literal("select"),
      card: z.string().nullable(),
      field: z.string().nullable(),
    }),
    z.object({ type: z.literal("blank"), blank: z.boolean() }),
  ])

function buildTextSchema(field: CmsField): z.ZodType<CmsValue, CmsValue> {
  let schema = z.string().trim()
  if (field.required === true) {
    schema = schema.min(1, { error: `${field.label} is required` })
  }
  if (field.max !== undefined) {
    const limit = field.max.toLocaleString("en-US")
    let error = `Keep it under ${limit} characters`
    if (field.type === "richtext") {
      error = `${error}, formatting and link addresses included`
    }
    schema = schema.max(field.max, { error })
  }
  return schema
}

function buildDateSchema(field: CmsField): z.ZodType<CmsValue, CmsValue> {
  const date = z.iso.date({ error: "Enter a valid date" })
  if (field.required === true) {
    return date
  }
  return date.or(z.literal(""))
}

function buildColorSchema(field: CmsField): z.ZodType<CmsValue, CmsValue> {
  if (field.required === true) {
    return cmsColorSchema
  }
  return cmsColorSchema.or(z.literal(""))
}

function buildSelectSchema(options: CmsOptions): z.ZodType<CmsValue, CmsValue> {
  return z.enum(
    options.map((option) => option.value),
    { error: "Pick one of the choices" }
  )
}

function buildFieldSchema(field: CmsField): z.ZodType<CmsValue, CmsValue> {
  switch (field.type) {
    case "switch":
      return z.boolean()
    case "slug":
      return cmsSlugSchema
    case "date":
      return buildDateSchema(field)
    case "color":
      return buildColorSchema(field)
    case "select":
      return buildSelectSchema(field.options)
    default:
      return buildTextSchema(field)
  }
}

function contrastMessage(
  fields: readonly CmsField[],
  field: CmsField,
  values: CmsValues
): string | null {
  if (field.contrast === undefined) {
    return null
  }
  const other = findCmsField(fields, field.contrast.field)
  const color = cmsColorChannels(values[field.name])
  const otherColor = cmsColorChannels(values[field.contrast.field])
  if (other === null || color === null || otherColor === null) {
    return null
  }
  if (cmsContrast(color, otherColor) >= field.contrast.min) {
    return null
  }
  return `${other.label} is hard to read on this color. Pick two colors that are further apart.`
}

export function buildCmsValuesSchema(
  fields: readonly CmsField[]
): z.ZodType<CmsValues, CmsValues> {
  const shape: Record<string, z.ZodType<CmsValue, CmsValue>> = {}
  for (const field of fields) {
    shape[field.name] = buildFieldSchema(field)
  }
  return z.object(shape).check((context) => {
    for (const field of fields) {
      const message = contrastMessage(fields, field, context.value)
      if (message !== null) {
        context.issues.push({
          code: "custom",
          message,
          path: [field.name],
          input: context.value,
        })
      }
    }
  })
}

export function buildCmsWriteSchema(
  collections: readonly CmsCollectionFields[]
): z.ZodType<CmsWriteInput, CmsWriteInput> {
  let schema: z.ZodType<CmsWriteInput, CmsWriteInput> = z.never()
  for (const collection of collections) {
    schema = schema.or(
      z.object({
        collection: z.literal(collection.slug),
        values: buildCmsValuesSchema(collection.fields),
      })
    )
  }
  return schema
}
