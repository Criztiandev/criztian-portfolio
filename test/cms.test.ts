import assert from "node:assert/strict"
import { test } from "node:test"

import {
  buildCmsValuesSchema,
  buildCmsWriteSchema,
  cmsCanvasMessageSchema,
  cmsColorSchema,
  cmsLinkSchema,
  cmsSlugSchema,
} from "../src/model/cms.model.ts"
import type {
  CmsEntry,
  CmsField,
  CmsListCollection,
  CmsValues,
} from "../src/type/cms.type.ts"
import {
  cmsChanges,
  cmsColorChannels,
  cmsContrast,
  cmsInitialValues,
  cmsPublishState,
  findCmsCollection,
  toCmsListRow,
  toCmsValues,
} from "../src/util/cms.util.ts"

const fields: CmsField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    card: "Main",
    required: true,
    max: 10,
  },
  { name: "slug", type: "slug", label: "Slug", card: "Main" },
  { name: "note", type: "textarea", label: "Note", card: "Main" },
  {
    name: "story",
    type: "richtext",
    label: "Story",
    card: "Main",
    required: true,
  },
  { name: "day", type: "date", label: "Day", card: "Main", required: true },
  { name: "shown", type: "switch", label: "Shown", card: "Main" },
]

const collections = [{ slug: "things", fields }]

const validValues = {
  name: "Ada",
  slug: "ada",
  note: "",
  story: "Hello",
  day: "2026-10-10",
  shown: true,
}

const valuesSchema = buildCmsValuesSchema(fields)
const writeSchema = buildCmsWriteSchema(collections)

const listCollection: CmsListCollection = {
  titleField: "name",
  summaryField: "note",
  columns: [
    { label: "Day", field: "day" },
    { label: "Shown", field: "shown" },
    { label: "Missing", field: "missing" },
    {
      label: "Status",
      badge: (values) => {
        if (values.shown === true) {
          return { tone: "success", label: "Live" }
        }
        return null
      },
    },
  ],
}

function entry(draft: CmsValues | null, published: CmsValues | null): CmsEntry {
  return {
    id: 7,
    collection: "things",
    draft,
    published,
    published_at: null,
    single: false,
    created_at: "2026-10-01T09:00:00+00:00",
    updated_at: "2026-10-08T09:00:00+00:00",
    updated_by: null,
  }
}

test("reads the publish state from the two versions", () => {
  assert.equal(
    cmsPublishState({ draft: validValues, published: null }),
    "draft"
  )
  assert.equal(
    cmsPublishState({ draft: validValues, published: validValues }),
    "changed"
  )
  assert.equal(
    cmsPublishState({ draft: null, published: validValues }),
    "published"
  )
})

test("lists every field on a first publish", () => {
  const changes = cmsChanges(fields, null, validValues)
  assert.deepEqual(
    changes.map((change) => change.name),
    ["name", "slug", "note", "story", "day", "shown"]
  )
  assert.deepEqual(changes[0], {
    name: "name",
    label: "Name",
    type: "text",
    before: null,
    after: "Ada",
  })
})

test("lists only the fields that changed", () => {
  const draft = { ...validValues, name: "Grace", shown: false }
  assert.deepEqual(cmsChanges(fields, validValues, draft), [
    {
      name: "name",
      label: "Name",
      type: "text",
      before: "Ada",
      after: "Grace",
    },
    {
      name: "shown",
      label: "Shown",
      type: "switch",
      before: true,
      after: false,
    },
  ])
  assert.deepEqual(cmsChanges(fields, validValues, { ...validValues }), [])
})

test("lists only the paragraphs of rich text that changed", () => {
  const story = "One.\n\nTwo.\n\nThree."
  const live = { ...validValues, story }
  const cases = [
    {
      after: "One.\n\nTwo, edited.\n\nThree.",
      old: "Two.",
      now: "Two, edited.",
    },
    { after: "One.\n\nTwo.\n\nThree.\n\nFour.", old: "", now: "Four." },
    { after: "One.\n\nThree.", old: "Two.", now: "" },
    {
      after: "One, edited.\n\nTwo.\n\nThree, edited.",
      old: story,
      now: "One, edited.\n\nTwo.\n\nThree, edited.",
    },
    {
      after: "One.\n\n\nTwo.\n\nThree.",
      old: story,
      now: "One.\n\n\nTwo.\n\nThree.",
    },
  ]
  for (const { after, old, now } of cases) {
    assert.deepEqual(
      cmsChanges(fields, live, { ...validValues, story: after }),
      [
        {
          name: "story",
          label: "Story",
          type: "richtext",
          before: old,
          after: now,
        },
      ],
      after
    )
  }
  const first = cmsChanges(fields, null, live)
  assert.equal(first[3].before, null)
  assert.equal(first[3].after, story)
  const note = cmsChanges(fields, { ...live, note: "A\n\nB" }, live)
  assert.deepEqual(note, [
    {
      name: "note",
      label: "Note",
      type: "textarea",
      before: "A\n\nB",
      after: "",
    },
  ])
})

test("builds a list row from the newest version", () => {
  const live = { ...validValues, note: "The live note" }
  const draft = { ...validValues, name: "Grace", note: "The draft note" }
  const changed = toCmsListRow(listCollection, entry(draft, live))
  assert.equal(changed.id, 7)
  assert.equal(changed.title, "Grace")
  assert.equal(changed.summary, "The draft note")
  assert.equal(changed.updatedAt, "2026-10-08T09:00:00+00:00")
  assert.equal(changed.state, "changed")
  const published = toCmsListRow(listCollection, entry(null, live))
  assert.equal(published.title, "Ada")
  assert.equal(published.summary, "The live note")
  assert.equal(published.state, "published")
})

test("keeps a list row readable when the title or summary is missing", () => {
  const row = toCmsListRow({ titleField: "name" }, entry({ shown: true }, null))
  assert.equal(row.title, "Untitled")
  assert.equal(row.summary, "")
  assert.equal(row.state, "draft")
  assert.deepEqual(row.cells, [])
  const untitled = toCmsListRow({}, entry({ name: "Ada" }, null))
  assert.equal(untitled.title, "Untitled")
})

test("fills extra list columns from a field or a badge", () => {
  const shown = toCmsListRow(listCollection, entry(validValues, null))
  assert.deepEqual(shown.cells, [
    "2026-10-10",
    "Yes",
    "",
    { tone: "success", label: "Live" },
  ])
  const hidden = toCmsListRow(
    listCollection,
    entry({ ...validValues, shown: false }, null)
  )
  assert.deepEqual(hidden.cells, ["2026-10-10", "No", "", ""])
})

test("starts a new entry with a value for every field", () => {
  assert.deepEqual(cmsInitialValues(fields, null, "2026-10-11"), {
    name: "",
    slug: "",
    note: "",
    story: "",
    day: "2026-10-11",
    shown: true,
  })
  const optionalDay: CmsField[] = [
    { name: "day", type: "date", label: "Day", card: "Main" },
  ]
  assert.deepEqual(cmsInitialValues(optionalDay, null, "2026-10-11"), {
    day: "",
  })
})

test("starts an edit from the stored values and fills the gaps", () => {
  const stored = { ...validValues, shown: false }
  assert.deepEqual(cmsInitialValues(fields, stored, "2026-10-11"), stored)
  assert.deepEqual(
    cmsInitialValues(
      fields,
      { name: "Ada", slug: true, shown: "yes", extra: "x" },
      "2026-10-11"
    ),
    {
      name: "Ada",
      slug: "",
      note: "",
      story: "",
      day: "2026-10-11",
      shown: true,
    }
  )
})

test("starts a field from its default when nothing fitting is stored", () => {
  const withDefaults: CmsField[] = [
    {
      name: "heading",
      type: "text",
      label: "Heading",
      card: "Main",
      default: "Hello",
    },
    {
      name: "shown",
      type: "switch",
      label: "Shown",
      card: "Main",
      default: false,
    },
  ]
  assert.deepEqual(cmsInitialValues(withDefaults, null, "2026-10-11"), {
    heading: "Hello",
    shown: false,
  })
  assert.deepEqual(
    cmsInitialValues(
      withDefaults,
      { heading: true, shown: "yes" },
      "2026-10-11"
    ),
    { heading: "Hello", shown: false }
  )
  assert.deepEqual(
    cmsInitialValues(withDefaults, { heading: "", shown: true }, "2026-10-11"),
    { heading: "", shown: true }
  )
})

test("keeps a dropdown on one of its options", () => {
  const sizes: CmsField[] = [
    {
      name: "size",
      type: "select",
      label: "Size",
      card: "Main",
      default: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
      ],
    },
    {
      name: "shape",
      type: "select",
      label: "Shape",
      card: "Main",
      default: "star",
      options: [
        { value: "round", label: "Round" },
        { value: "square", label: "Square" },
      ],
    },
  ]
  const starts = [
    { stored: null, size: "medium", shape: "round" },
    {
      stored: { size: "small", shape: "square" },
      size: "small",
      shape: "square",
    },
    { stored: { size: "huge", shape: true }, size: "medium", shape: "round" },
  ]
  for (const start of starts) {
    assert.deepEqual(
      cmsInitialValues(sizes, start.stored, "2026-10-11"),
      { size: start.size, shape: start.shape },
      JSON.stringify(start.stored)
    )
  }

  const schema = buildCmsValuesSchema(sizes)
  assert.equal(
    schema.safeParse({ size: "small", shape: "round" }).success,
    true
  )
  for (const size of ["huge", "", "Small", true]) {
    const result = schema.safeParse({ size, shape: "round" })
    assert.equal(result.success, false, String(size))
    assert.equal(result.error?.issues[0].message, "Pick one of the choices")
  }

  assert.deepEqual(
    cmsChanges(
      sizes,
      { size: "small", shape: "gone" },
      { size: "medium", shape: "round" }
    ),
    [
      {
        name: "size",
        label: "Size",
        type: "select",
        before: "Small",
        after: "Medium",
      },
      {
        name: "shape",
        label: "Shape",
        type: "select",
        before: "gone",
        after: "Round",
      },
    ]
  )
})

test("builds a schema that accepts a valid entry", () => {
  const result = valuesSchema.safeParse({ ...validValues, name: "  Ada  " })
  assert.equal(result.success, true)
  assert.deepEqual(result.data, validValues)
})

test("builds a schema that enforces the rules of every field type", () => {
  const invalid = [
    { name: "   " },
    { name: "a".repeat(11) },
    { slug: "Not A Slug" },
    { story: "" },
    { day: "10/10/2026" },
    { day: "" },
    { shown: "yes" },
    { note: 5 },
  ]
  for (const change of invalid) {
    const result = valuesSchema.safeParse({ ...validValues, ...change })
    assert.equal(result.success, false, JSON.stringify(change))
  }
})

test("rejects malformed slugs", () => {
  assert.equal(cmsSlugSchema.safeParse("my-first-post").success, true)
  const slugs = [
    "",
    "Hello",
    "has space",
    "-lead",
    "trail-",
    "two--dashes",
    "a".repeat(101),
  ]
  for (const slug of slugs) {
    assert.equal(
      cmsSlugSchema.safeParse(slug).success,
      false,
      `accepted "${slug}"`
    )
  }
})

test("accepts only full http, https and mailto links", () => {
  const accepted = ["https://example.com/a_(b)", "mailto:a@b.com"]
  for (const link of accepted) {
    assert.equal(cmsLinkSchema.safeParse(link).success, true, link)
  }
  const rejected = [
    "javascript:alert(1)",
    "tel:123",
    "/blog/x",
    "example.com",
    "https://a.com/a b",
  ]
  for (const link of rejected) {
    assert.equal(cmsLinkSchema.safeParse(link).success, false, link)
  }
})

test("accepts only six-digit hex colors and stores them in lowercase", () => {
  assert.equal(cmsColorSchema.parse(" #A1B2C3 "), "#a1b2c3")
  const rejected = ["red", "#fff", "#12345g", "a1b2c3", "#1234567", ""]
  for (const color of rejected) {
    assert.equal(cmsColorSchema.safeParse(color).success, false, color)
  }
})

test("measures the contrast of two colors", () => {
  const black = cmsColorChannels("#000000")
  const white = cmsColorChannels("#ffffff")
  const grey = cmsColorChannels("#767676")
  assert.ok(black !== null && white !== null && grey !== null)
  assert.deepEqual(grey, [118, 118, 118])
  assert.equal(cmsContrast(black, white).toFixed(2), "21.00")
  assert.equal(cmsContrast(white, black).toFixed(2), "21.00")
  assert.equal(cmsContrast(white, grey).toFixed(2), "4.54")
  for (const value of ["red", "#FFFFFF", "#fff", true, undefined]) {
    assert.equal(cmsColorChannels(value), null, String(value))
  }
})

test("blocks a color that the other one cannot be read on", () => {
  const palette: CmsField[] = [
    {
      name: "paper",
      type: "color",
      label: "Paper",
      card: "Main",
      required: true,
      contrast: { field: "ink", min: 4.5 },
    },
    { name: "ink", type: "color", label: "Ink", card: "Main", required: true },
    { name: "trim", type: "color", label: "Trim", card: "Main" },
  ]
  const schema = buildCmsValuesSchema(palette)
  const readable = schema.safeParse({
    paper: "#FFFFFF",
    ink: "#0A0A0A",
    trim: "",
  })
  assert.deepEqual(readable.data, {
    paper: "#ffffff",
    ink: "#0a0a0a",
    trim: "",
  })

  const faint = schema.safeParse({ paper: "#FFFFFF", ink: "#CCCCCC", trim: "" })
  assert.deepEqual(
    faint.error?.issues.map((issue) => [issue.path, issue.message]),
    [
      [
        ["paper"],
        "Ink is hard to read on this color. Pick two colors that are further apart.",
      ],
    ]
  )

  const malformed = schema.safeParse({ paper: "#ffffff", ink: "red", trim: "" })
  assert.deepEqual(
    malformed.error?.issues.map((issue) => issue.path),
    [["ink"]]
  )
  const empty = schema.safeParse({ paper: "", ink: "#0a0a0a", trim: "" })
  assert.deepEqual(
    empty.error?.issues.map((issue) => issue.path),
    [["paper"]]
  )
})

test("builds a schema that strips unknown keys", () => {
  const result = valuesSchema.safeParse({ ...validValues, extra: "x" })
  assert.deepEqual(result.data, validValues)
})

test("accepts writes only for a known collection", () => {
  const known = writeSchema.safeParse({
    collection: "things",
    values: validValues,
  })
  assert.equal(known.success, true)
  const unknown = writeSchema.safeParse({
    collection: "other",
    values: validValues,
  })
  assert.equal(unknown.success, false)
  const invalid = writeSchema.safeParse({
    collection: "things",
    values: { ...validValues, name: "" },
  })
  assert.equal(invalid.success, false)
})

test("checks each collection against its own fields", () => {
  const noteFields: CmsField[] = [
    { name: "text", type: "text", label: "Text", card: "Main", required: true },
  ]
  const schema = buildCmsWriteSchema([
    ...collections,
    { slug: "notes", fields: noteFields },
  ])
  const note = schema.safeParse({
    collection: "notes",
    values: { ...validValues, text: "Hi" },
  })
  assert.deepEqual(note.data, { collection: "notes", values: { text: "Hi" } })
  const thing = schema.safeParse({ collection: "things", values: validValues })
  assert.deepEqual(thing.data, { collection: "things", values: validValues })
  const mixed = schema.safeParse({ collection: "notes", values: validValues })
  assert.equal(mixed.success, false)
})

test("accepts only the five messages of the editor frame", () => {
  const messages = [
    { type: "ready" },
    { type: "values", values: { title: "Hi", shown: true } },
    { type: "card", card: "Main" },
    { type: "select", card: "Main", field: "name" },
    { type: "select", card: null, field: null },
    { type: "blank", blank: true },
  ]
  for (const message of messages) {
    assert.deepEqual(cmsCanvasMessageSchema.safeParse(message).data, message)
  }
  const refused = [
    { type: "reload" },
    { type: "card" },
    { type: "select", card: "Main" },
    { type: "blank" },
    { type: "blank", blank: "yes" },
    { type: "values", values: { count: 5 } },
    { type: "values", values: { nested: { a: "b" } } },
    "ready",
    null,
  ]
  for (const message of refused) {
    assert.equal(cmsCanvasMessageSchema.safeParse(message).success, false)
  }
})

test("finds a collection by its slug", () => {
  assert.equal(findCmsCollection(collections, "things"), collections[0])
  assert.equal(findCmsCollection(collections, "other"), null)
})

test("drops stored values that are not text or a switch", () => {
  assert.deepEqual(
    toCmsValues({ title: "Hi", shown: true, count: 5, nested: { a: "b" } }),
    { title: "Hi", shown: true }
  )
  assert.equal(toCmsValues(null), null)
  assert.equal(toCmsValues(["a"]), null)
  assert.equal(toCmsValues("text"), null)
})
