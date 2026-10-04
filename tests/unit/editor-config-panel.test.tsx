import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import type { Mock } from "vitest"
import { describe, expect, it, vi } from "vitest"

import {
  CONNECT_EMAIL_MAX_LENGTH,
  CONNECT_EMAIL_PROMPT_MAX_LENGTH,
  CONNECT_STATEMENT_MAX_LENGTH,
  CONTACT_LABEL_MAX_LENGTH,
  CONTACT_STATEMENT_MAX_LENGTH,
  DEFAULT_CONNECT_EMAIL,
  DEFAULT_CONNECT_EMAIL_PROMPT,
  DEFAULT_CONNECT_STATEMENT,
  DEFAULT_CONTACT_LABEL,
  DEFAULT_CONTACT_STATEMENT,
  DEFAULT_FAQ_ITEMS,
  DEFAULT_PROJECT_ITEMS,
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_MAX,
  FAQ_QUESTION_HINT,
  FAQ_QUESTION_MAX_LENGTH,
  HERO_NAME_MAX_LENGTH,
  HERO_TEXT_FIELDS,
  NEW_FAQ_ITEM,
  NEW_PROJECT_ITEM,
  PREVIEW_CONTENT_DEBOUNCE_MS,
  PREVIEW_CONTENT_MESSAGE,
  PROJECT_ITEM_FIELDS,
  PROJECTS_MAX,
  THEME_COLOR_FIELDS,
} from "@/data/site-content.data"
import { EditorConfigPanel } from "@/features/site-content/components/editor-config-panel.component"
import { EditorSectionList } from "@/features/site-content/components/editor-section-list.component"
import { createDefaultSiteContent } from "@/features/site-content/site-content.rules"
import { TRPCReactProvider } from "@/lib/trpc/trpc.client"
import { EditorStoreProvider } from "@/providers/editor-store.provider"
import type { SiteContent } from "@/types/site-content.type"

function renderPanel() {
  const postMessage = vi.fn()
  const onSelect = vi.fn()
  const frameRef = {
    current: { contentWindow: { postMessage } },
  } as unknown as React.RefObject<HTMLIFrameElement | null>

  const content = createDefaultSiteContent()
  const pendingContentRef: React.RefObject<SiteContent> = { current: content }

  render(
    <TRPCReactProvider>
      <EditorStoreProvider>
        <EditorSectionList onSelect={onSelect} />
        <EditorConfigPanel
          initialContent={content}
          initialHasUnpublishedChanges={false}
          frameRef={frameRef}
          pendingContentRef={pendingContentRef}
        />
      </EditorStoreProvider>
    </TRPCReactProvider>
  )

  return { postMessage, onSelect, pendingContentRef }
}

function selectEntry(label: string) {
  const sections = screen.getByRole("navigation", { name: "Sections" })

  fireEvent.click(within(sections).getByRole("button", { name: label }))
}

function readLastPayload(postMessage: Mock): SiteContent {
  const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

  return lastCall[0].payload
}

async function waitForPayload(postMessage: Mock): Promise<SiteContent> {
  await waitFor(
    function assertPosted() {
      expect(postMessage).toHaveBeenCalled()
    },
    { timeout: 3000 }
  )

  return readLastPayload(postMessage)
}

describe("EditorConfigPanel", () => {
  it("renders an input for every hero text field", () => {
    renderPanel()

    for (const textField of HERO_TEXT_FIELDS) {
      expect(screen.getByLabelText(textField.label)).toBeInTheDocument()
    }
  })

  it("renders a colour input for every theme field", () => {
    renderPanel()

    for (const colorField of THEME_COLOR_FIELDS) {
      expect(screen.getByLabelText(colorField.label)).toBeInTheDocument()
      expect(
        screen.getByLabelText(`${colorField.label} swatch`)
      ).toBeInTheDocument()
    }
  })

  it("shows the hero fields first and hides the theme fields", () => {
    renderPanel()

    const panel = screen.getByRole("complementary", { name: "Settings" })

    expect(panel).toHaveAttribute("data-selected-entry", "hero")
    expect(screen.getByLabelText("Name").closest("[hidden]")).toBeNull()
    expect(screen.getByLabelText("Accent").closest("[hidden]")).not.toBeNull()
  })

  it("posts the edited content to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Ada" },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].type).toBe(PREVIEW_CONTENT_MESSAGE)
    expect(lastCall[0].payload.hero.name).toBe("Ada")
    expect(lastCall[1]).toBe(window.location.origin)
  })

  it("renders hidden quote fields until the quote entry is selected", () => {
    renderPanel()

    expect(screen.getByLabelText("Quote").closest("[hidden]")).not.toBeNull()
    expect(screen.getByLabelText("Author").closest("[hidden]")).not.toBeNull()
  })

  it("posts an edited quote to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Quote"), {
      target: { value: "Keep going." },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.quote.text).toBe("Keep going.")
  })

  it("caps the name input at the schema limit", () => {
    renderPanel()

    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "maxLength",
      String(HERO_NAME_MAX_LENGTH)
    )
  })

  it("renders hidden project fields until the projects entry is selected", () => {
    renderPanel()

    expect(
      screen.getByLabelText("Project 1 title").closest("[hidden]")
    ).not.toBeNull()
    expect(
      screen.getByRole("button", { name: "Add project", hidden: true })
    ).toBeInTheDocument()
  })

  it("renders every project field with its schema limit", () => {
    renderPanel()

    for (const itemField of PROJECT_ITEM_FIELDS) {
      const input = screen.getByLabelText(`Project 1 ${itemField.label}`)

      expect(input).toHaveAttribute("maxLength", String(itemField.maxLength))
    }

    expect(screen.queryByLabelText("Heading")).toBeNull()
    expect(screen.queryByLabelText("Intro")).toBeNull()
  })

  it("posts an edited project title to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Project 2 title"), {
      target: { value: "Online shop" },
    })

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.projects.items[1].title).toBe("Online shop")
  })

  it("appends a new project and posts it to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.click(
      screen.getByRole("button", { name: "Add project", hidden: true })
    )

    expect(screen.getByLabelText("Project 4 title")).toHaveValue(
      NEW_PROJECT_ITEM.title
    )

    await waitFor(
      function assertPosted() {
        expect(postMessage).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )

    const lastCall = postMessage.mock.calls[postMessage.mock.calls.length - 1]

    expect(lastCall[0].payload.projects.items).toHaveLength(4)
    expect(lastCall[0].payload.projects.items[3]).toEqual(NEW_PROJECT_ITEM)
  })

  it("removes a project", () => {
    renderPanel()

    fireEvent.click(
      screen.getByRole("button", { name: "Remove project 1", hidden: true })
    )

    expect(screen.queryByLabelText("Project 3 title")).toBeNull()
    expect(screen.getByLabelText("Project 1 title")).toHaveValue("Project two")
  })

  it("moves a project up and never moves the first", () => {
    renderPanel()

    expect(
      screen.getByRole("button", { name: "Move project 1 up", hidden: true })
    ).toBeDisabled()

    fireEvent.click(
      screen.getByRole("button", { name: "Move project 2 up", hidden: true })
    )

    expect(screen.getByLabelText("Project 1 title")).toHaveValue("Project two")
    expect(screen.getByLabelText("Project 2 title")).toHaveValue("Project one")
  })

  it("disables adding once the list is full", () => {
    renderPanel()

    const addButton = screen.getByRole("button", {
      name: "Add project",
      hidden: true,
    })

    for (
      let count = DEFAULT_PROJECT_ITEMS.length;
      count < PROJECTS_MAX;
      count += 1
    ) {
      expect(addButton).toBeEnabled()
      fireEvent.click(addButton)
    }

    expect(screen.getByLabelText(`Project ${PROJECTS_MAX} title`)).toBeTruthy()
    expect(addButton).toBeDisabled()
  })

  it("keeps the publish button disabled while the live site is current", () => {
    renderPanel()

    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled()
  })

  it("lists the sections in page order and scrolls the preview to each", () => {
    const { onSelect } = renderPanel()
    const sections = screen.getByRole("navigation", { name: "Sections" })
    const visited: [string, string | null][] = []

    for (const button of within(sections).getAllByRole("button")) {
      fireEvent.click(button)

      const entry = onSelect.mock.calls[onSelect.mock.calls.length - 1][0]

      visited.push([button.textContent ?? "", entry.sectionId])
    }

    expect(visited).toEqual([
      ["Hero", "home"],
      ["Quote", "quote"],
      ["Projects", "project"],
      ["FAQ", "faq"],
      ["Let's connect", "connect"],
      ["Get in touch", "contact"],
      ["Theme", null],
    ])
  })

  it("keeps the hero name the only editor label that contains name", () => {
    renderPanel()

    expect(screen.getByLabelText(/name/i)).toHaveAttribute("id", "hero-name")
  })

  it("shows the FAQ, connect and contact fields only while their entry is selected", () => {
    renderPanel()

    const question = screen.getByLabelText("Question 1")
    const emailAddress = screen.getByLabelText("Email address")
    const label = screen.getByLabelText("Label")

    expect(question.closest("[hidden]")).not.toBeNull()
    expect(emailAddress.closest("[hidden]")).not.toBeNull()
    expect(label.closest("[hidden]")).not.toBeNull()

    selectEntry("FAQ")

    expect(question.closest("[hidden]")).toBeNull()
    expect(emailAddress.closest("[hidden]")).not.toBeNull()

    selectEntry("Let's connect")

    expect(emailAddress.closest("[hidden]")).toBeNull()
    expect(question.closest("[hidden]")).not.toBeNull()
    expect(screen.getByRole("textbox", { name: "Statement" })).toHaveValue(
      DEFAULT_CONNECT_STATEMENT
    )

    selectEntry("Get in touch")

    expect(label.closest("[hidden]")).toBeNull()
    expect(emailAddress.closest("[hidden]")).not.toBeNull()
    expect(screen.getByRole("textbox", { name: "Statement" })).toHaveValue(
      DEFAULT_CONTACT_STATEMENT
    )
  })

  it("renders a question and an answer for every seed question", () => {
    renderPanel()

    for (const [index, item] of DEFAULT_FAQ_ITEMS.entries()) {
      const position = index + 1
      const question = screen.getByLabelText(`Question ${position}`)
      const answer = screen.getByLabelText(`Answer ${position}`)

      expect(question).toHaveValue(item.question)
      expect(question).toHaveAttribute(
        "maxLength",
        String(FAQ_QUESTION_MAX_LENGTH)
      )
      expect(question).toHaveAccessibleDescription(FAQ_QUESTION_HINT)
      expect(answer.tagName).toBe("TEXTAREA")
      expect(answer).toHaveValue(item.answer)
      expect(answer).toHaveAttribute("maxLength", String(FAQ_ANSWER_MAX_LENGTH))
    }

    expect(
      screen.queryByLabelText(`Question ${DEFAULT_FAQ_ITEMS.length + 1}`)
    ).toBeNull()
  })

  it("posts an edited answer to the preview frame", async () => {
    const { postMessage } = renderPanel()

    fireEvent.change(screen.getByLabelText("Answer 3"), {
      target: { value: "Yes, on every screen." },
    })

    const payload = await waitForPayload(postMessage)

    expect(payload.faq.items[2].answer).toBe("Yes, on every screen.")
    expect(payload.faq.items[2].question).toBe(DEFAULT_FAQ_ITEMS[2].question)
  })

  it("appends a new question and posts it to the preview frame", async () => {
    const { postMessage } = renderPanel()
    const position = DEFAULT_FAQ_ITEMS.length + 1

    selectEntry("FAQ")
    fireEvent.click(screen.getByRole("button", { name: "Add question" }))

    expect(screen.getByLabelText(`Question ${position}`)).toHaveValue(
      NEW_FAQ_ITEM.question
    )
    expect(screen.getByLabelText(`Answer ${position}`)).toHaveValue(
      NEW_FAQ_ITEM.answer
    )

    const payload = await waitForPayload(postMessage)

    expect(payload.faq.items).toHaveLength(position)
    expect(payload.faq.items[position - 1]).toEqual(NEW_FAQ_ITEM)
  })

  it("removes a question with its answer", async () => {
    const { postMessage } = renderPanel()

    selectEntry("FAQ")
    fireEvent.click(screen.getByRole("button", { name: "Remove question 1" }))

    expect(
      screen.queryByLabelText(`Question ${DEFAULT_FAQ_ITEMS.length}`)
    ).toBeNull()
    expect(screen.getByLabelText("Question 1")).toHaveValue(
      DEFAULT_FAQ_ITEMS[1].question
    )
    expect(screen.getByLabelText("Answer 1")).toHaveValue(
      DEFAULT_FAQ_ITEMS[1].answer
    )

    const payload = await waitForPayload(postMessage)

    expect(payload.faq.items).toEqual(DEFAULT_FAQ_ITEMS.slice(1))
  })

  it("moves a question up with its answer and never moves the first", async () => {
    const { postMessage } = renderPanel()

    selectEntry("FAQ")

    expect(
      screen.getByRole("button", { name: "Move question 1 up" })
    ).toBeDisabled()

    fireEvent.click(screen.getByRole("button", { name: "Move question 3 up" }))

    expect(screen.getByLabelText("Question 2")).toHaveValue(
      DEFAULT_FAQ_ITEMS[2].question
    )
    expect(screen.getByLabelText("Answer 2")).toHaveValue(
      DEFAULT_FAQ_ITEMS[2].answer
    )
    expect(screen.getByLabelText("Question 3")).toHaveValue(
      DEFAULT_FAQ_ITEMS[1].question
    )

    const payload = await waitForPayload(postMessage)

    expect(payload.faq.items[1]).toEqual(DEFAULT_FAQ_ITEMS[2])
    expect(payload.faq.items[2]).toEqual(DEFAULT_FAQ_ITEMS[1])
  })

  it("disables adding a question once the list is full", () => {
    renderPanel()

    selectEntry("FAQ")

    const addButton = screen.getByRole("button", { name: "Add question" })

    for (let count = DEFAULT_FAQ_ITEMS.length; count < FAQ_MAX; count += 1) {
      expect(addButton).toBeEnabled()
      fireEvent.click(addButton)
    }

    expect(screen.getByLabelText(`Question ${FAQ_MAX}`)).toBeInTheDocument()
    expect(addButton).toBeDisabled()

    fireEvent.click(addButton)

    expect(screen.queryByLabelText(`Question ${FAQ_MAX + 1}`)).toBeNull()
  })

  it("flags an answer over the limit", async () => {
    renderPanel()

    selectEntry("FAQ")

    const answer = screen.getByLabelText("Answer 1")

    fireEvent.change(answer, {
      target: { value: "a".repeat(FAQ_ANSWER_MAX_LENGTH + 1) },
    })
    fireEvent.blur(answer)

    expect(
      await screen.findByText(
        `Must be ${FAQ_ANSWER_MAX_LENGTH} characters or fewer`
      )
    ).toBeInTheDocument()
    expect(answer).toHaveAttribute("aria-invalid", "true")
  })

  it("renders the connect and contact fields with their schema limits", () => {
    renderPanel()

    selectEntry("Let's connect")

    const statement = screen.getByRole("textbox", { name: "Statement" })
    const emailLine = screen.getByRole("textbox", { name: "Email line" })
    const emailAddress = screen.getByRole("textbox", { name: "Email address" })

    expect(statement).toHaveAttribute(
      "maxLength",
      String(CONNECT_STATEMENT_MAX_LENGTH)
    )
    expect(emailLine).toHaveValue(DEFAULT_CONNECT_EMAIL_PROMPT)
    expect(emailLine).toHaveAttribute(
      "maxLength",
      String(CONNECT_EMAIL_PROMPT_MAX_LENGTH)
    )
    expect(emailAddress).toHaveValue(DEFAULT_CONNECT_EMAIL)
    expect(emailAddress).toHaveAttribute("type", "email")
    expect(emailAddress).toHaveAttribute(
      "maxLength",
      String(CONNECT_EMAIL_MAX_LENGTH)
    )

    selectEntry("Get in touch")

    const label = screen.getByRole("textbox", { name: "Label" })

    expect(label).toHaveValue(DEFAULT_CONTACT_LABEL)
    expect(label).toHaveAttribute("maxLength", String(CONTACT_LABEL_MAX_LENGTH))
    expect(screen.getByRole("textbox", { name: "Statement" })).toHaveAttribute(
      "maxLength",
      String(CONTACT_STATEMENT_MAX_LENGTH)
    )
  })

  it("posts the edited connect and contact copy to the preview frame", async () => {
    const { postMessage } = renderPanel()

    selectEntry("Let's connect")
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "ada@example.test" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Email line" }), {
      target: { value: "Write to me:" },
    })

    selectEntry("Get in touch")
    fireEvent.change(screen.getByRole("textbox", { name: "Label" }), {
      target: { value: "Say hello" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Statement" }), {
      target: { value: "Start here." },
    })

    await waitFor(
      function assertLastEditPosted() {
        expect(postMessage).toHaveBeenCalled()
        expect(readLastPayload(postMessage).contact.statement).toBe(
          "Start here."
        )
      },
      { timeout: 3000 }
    )

    const payload = readLastPayload(postMessage)

    expect(payload.connect).toEqual({
      statement: DEFAULT_CONNECT_STATEMENT,
      emailPrompt: "Write to me:",
      email: "ada@example.test",
    })
    expect(payload.contact.label).toBe("Say hello")
  })

  it("flags an email address that is not one and keeps it from the preview", async () => {
    const { postMessage } = renderPanel()

    selectEntry("Let's connect")

    const emailAddress = screen.getByRole("textbox", { name: "Email address" })

    fireEvent.change(emailAddress, { target: { value: "not an address" } })
    fireEvent.blur(emailAddress)

    expect(
      await screen.findByText("Enter an email address")
    ).toBeInTheDocument()
    expect(emailAddress).toHaveAttribute("aria-invalid", "true")

    await new Promise(function waitPastPreviewDebounce(resolve) {
      window.setTimeout(resolve, PREVIEW_CONTENT_DEBOUNCE_MS * 3)
    })

    expect(postMessage).not.toHaveBeenCalled()
  })

  it("flags a blank contact label", async () => {
    renderPanel()

    selectEntry("Get in touch")

    const label = screen.getByRole("textbox", { name: "Label" })

    fireEvent.change(label, { target: { value: "   " } })
    fireEvent.blur(label)

    expect(await screen.findByText("Enter a label")).toBeInTheDocument()
    expect(label).toHaveAttribute("aria-invalid", "true")
  })
})
