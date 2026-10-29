import assert from "node:assert/strict"
import { test } from "node:test"

import type { JSONContent } from "@tiptap/core"
import { getSchema } from "@tiptap/core"
import { MarkdownManager } from "@tiptap/markdown"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Markdown from "react-markdown"

import {
  flatMarkdownOptions,
  markdownOptions,
  markdownToText,
} from "../src/lib/react-markdown.ts"
import { editorExtensions } from "../src/lib/tiptap.ts"

const manager = new MarkdownManager({ extensions: editorExtensions })

function render(markdown: string): string {
  return renderToStaticMarkup(
    createElement(Markdown, markdownOptions, markdown)
  )
}

function paragraph(content: JSONContent[]): JSONContent {
  return { type: "paragraph", content }
}

function text(value: string, marks: string[] = []): JSONContent {
  return { type: "text", text: value, marks: marks.map((type) => ({ type })) }
}

function doc(content: JSONContent[]): JSONContent {
  return { type: "doc", content }
}

test("renders hostile Markdown safely", () => {
  const html = render(
    [
      "<script>alert(1)</script>",
      "[a](javascript:alert(1)) <javascript:alert(2)>",
      "<b>raw</b> <img src=x onerror=alert(1)>",
      "| a |\n| --- |\n| x<br>y |",
    ].join("\n\n")
  )
  assert.equal(html.includes("<script"), false, html)
  assert.equal(html.includes("onerror"), false, html)
  assert.equal(html.includes('href="javascript'), false, html)
  assert.equal(html.includes("<b>raw</b>"), true, html)
  assert.equal(html.includes("x<br/>y"), true, html)
})

test("turns rich text into plain text for previews and lists", () => {
  const samples = [
    ["Plain words stay.", "Plain words stay."],
    [
      "A **bold** and *soft* [link](https://example.com).",
      "A bold and soft link.",
    ],
    ["## Title\n\n- one\n- two", "Title one two"],
    ["Five \\* stars and snake\\_case", "Five * stars and snake_case"],
    ["| a<br>b | c |\n| --- | --- |\n| d | e |", "a b c d e"],
    ["<script>alert(1)</script>Safe", "Safe"],
  ]
  for (const [markdown, text] of samples) {
    assert.equal(markdownToText(markdown), text, markdown)
  }
})

test("draws summary headings as paragraphs", () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, flatMarkdownOptions, "# One\n\n## Two\n\n**kept**")
  )
  assert.equal(html.includes("<h"), false, html)
  assert.equal(html.includes("<p>One</p>"), true, html)
  assert.equal(html.includes("<strong>kept</strong>"), true, html)
})

test("keeps text through save and reload", () => {
  const samples = [
    { markdown: "Hi. there", type: "paragraph", text: "Hi. there" },
    { markdown: "A. Smith said hi", type: "paragraph", text: "A. Smith" },
    { markdown: "3. three\n4. four", type: "orderedList", text: '"start":3' },
    {
      markdown: "1. Step one\n   Ok. then more\n2. two",
      type: "orderedList",
      text: "Ok. then more",
    },
    { markdown: "- a\n  - b", type: "bulletList", text: '"text":"b"' },
    {
      markdown:
        "| Left | Center | Right |\n| :--- | :---: | ---: |\n| a \\| b | `c\\|d` | e |",
      type: "table",
      text: '"text":"c|d"',
    },
    {
      markdown: "```js\nconst a = 1\n```",
      type: "codeBlock",
      text: "const a = 1",
    },
    {
      markdown: "[site](https://example.com/a_(b))",
      type: "paragraph",
      text: "https://example.com/a_(b)",
    },
    { markdown: "> quoted", type: "blockquote", text: "quoted" },
  ]
  for (const sample of samples) {
    const parsed = manager.parse(sample.markdown)
    assert.ok(parsed.content, sample.markdown)
    assert.equal(parsed.content[0].type, sample.type, sample.markdown)
    assert.ok(JSON.stringify(parsed).includes(sample.text), sample.markdown)
    const reloaded = manager.parse(manager.serialize(parsed))
    assert.deepEqual(reloaded, parsed, sample.markdown)
  }
})

test("writes table cell line breaks that the blog renders", () => {
  const markdown = manager.serialize(
    doc([
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              {
                type: "tableHeader",
                content: [
                  paragraph([text("a"), { type: "hardBreak" }, text("b")]),
                ],
              },
            ],
          },
          {
            type: "tableRow",
            content: [
              {
                type: "tableCell",
                content: [paragraph([text("c")]), paragraph([text("d")])],
              },
            ],
          },
        ],
      },
    ])
  )
  assert.ok(markdown.includes("a<br>b"), markdown)
  assert.ok(markdown.includes("c<br>d"), markdown)
  const html = render(markdown)
  assert.ok(html.includes("<th>a<br/>b</th>"), html)
  assert.ok(html.includes("<td>c<br/>d</td>"), html)
})

test("writes overlapping bold and italic that the blog renders", () => {
  const markdown = manager.serialize(
    doc([
      paragraph([
        text("a", ["bold"]),
        text("b", ["bold", "italic"]),
        text("c", ["italic"]),
      ]),
    ])
  )
  const html = render(markdown)
  assert.ok(html.includes("<strong>a<em>b</em></strong><em>c</em>"), html)
})

test("keeps typed block markers as text", () => {
  const samples = [
    doc([paragraph([{ type: "text", text: "- not a list" }])]),
    doc([paragraph([{ type: "text", text: "# not a heading" }])]),
    doc([paragraph([{ type: "text", text: "1. not a list" }])]),
    doc([
      paragraph([
        { type: "text", text: "Hi" },
        { type: "hardBreak" },
        { type: "text", text: "- there" },
      ]),
    ]),
  ]
  for (const sample of samples) {
    assert.deepEqual(manager.parse(manager.serialize(sample)), sample)
  }
})

test("keeps table cells to paragraphs and leaves underline out", () => {
  const schema = getSchema(editorExtensions)
  for (const cellType of ["tableCell", "tableHeader"]) {
    const headingInCell = doc([
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: [
              {
                type: cellType,
                content: [
                  {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [text("h")],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
    assert.throws(() => schema.nodeFromJSON(headingInCell).check(), cellType)
  }
  assert.equal(schema.marks.underline, undefined)
})

test("keeps HTML typed in the editor as visible text", () => {
  const markdown = manager.serialize(doc([paragraph([text("<b>raw</b>")])]))
  const html = render(markdown)
  assert.ok(html.includes("&lt;b&gt;raw&lt;/b&gt;"), html)
  assert.equal(html.includes("<b>"), false, html)
})
