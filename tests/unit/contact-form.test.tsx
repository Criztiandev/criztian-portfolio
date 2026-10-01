import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  CONTACT_ACKNOWLEDGEMENT,
  CONTACT_ERROR_IDS,
  CONTACT_FIELD_NUMBERS,
  CONTACT_REJECTED_MESSAGE,
  CONTACT_SEND_LABEL,
  CONTACT_SENDING_LABEL,
  CONTACT_SERVICE_LABELS,
  CONTACT_SERVICE_PROMPT,
  CONTACT_SERVICES,
  MIN_SECONDS_BEFORE_SUBMIT,
} from "@/data/contact.data"
import { ContactForm } from "@/features/contact/components/contact.form"
import { isTooFast } from "@/features/contact/contact.rules"
import type { ContactValues } from "@/types/contact.type"

vi.mock("@/lib/trpc/trpc.client", function mockTrpcClient() {
  return {
    useTRPC: function useTRPC() {
      return {
        contact: {
          submit: {
            mutationOptions: function mutationOptions() {
              return { mutationFn: sendThroughServerChecks }
            },
          },
        },
      }
    },
  }
})

const RENDERED_AT = Date.UTC(2026, 8, 30, 9)

const MINIMUM_WAIT_MS = MIN_SECONDS_BEFORE_SUBMIT * 1000

const MESSAGE = "A new identity for a small bakery."

const KEYBOARD_CONTROL_SELECTOR = `:is(input, textarea, select, button):not([type="hidden"]):not([tabindex="-1"])`

let heldSend: Promise<void> | null = null

let lastSentValues: ContactValues | null = null

async function sendThroughServerChecks(values: ContactValues) {
  lastSentValues = values

  if (heldSend !== null) {
    await heldSend
  }

  if (isTooFast(values.renderedAt, Date.now())) {
    throw new Error(CONTACT_REJECTED_MESSAGE)
  }

  return { message: CONTACT_ACKNOWLEDGEMENT }
}

function buildForm(client: QueryClient) {
  return (
    <QueryClientProvider client={client}>
      <ContactForm />
    </QueryClientProvider>
  )
}

function renderForm() {
  return render(buildForm(new QueryClient()))
}

function readForm(container: HTMLElement): HTMLFormElement {
  const form = container.querySelector("form")

  if (form === null) {
    throw new Error("contact form not found")
  }

  return form
}

function readServiceGroup(): HTMLElement {
  return screen.getByRole("radiogroup", { name: "Service needed" })
}

function expectServiceRadiosNeverInvalid(): void {
  for (const service of CONTACT_SERVICES) {
    const radio = screen.getByRole<HTMLInputElement>("radio", {
      name: CONTACT_SERVICE_LABELS[service],
    })

    expect(radio, service).not.toBeRequired()
    expect(radio, service).not.toHaveAttribute("aria-invalid")
    expect(radio.checkValidity(), service).toBe(true)
  }
}

function fillForm(): void {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Lovelace" },
  })
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.test" },
  })
  fireEvent.click(screen.getByRole("radio", { name: "Branding" }))
  fireEvent.change(screen.getByLabelText("What can I help you with?"), {
    target: { value: MESSAGE },
  })
}

function sendAfter(elapsedMs: number): void {
  vi.setSystemTime(RENDERED_AT + elapsedMs)
  fireEvent.click(screen.getByRole("button", { name: "Send message" }))
}

describe("ContactForm", () => {
  afterEach(() => {
    vi.useRealTimers()
    lastSentValues = null
  })

  it("focuses the acknowledgement over the same form, kept and hidden", async () => {
    vi.setSystemTime(RENDERED_AT)
    const { container } = renderForm()
    const form = readForm(container)

    expect(screen.queryByText(CONTACT_ACKNOWLEDGEMENT)).toBeNull()
    expect(form).not.toHaveClass("invisible")

    fillForm()
    sendAfter(MINIMUM_WAIT_MS)

    const acknowledgement = await screen.findByText(CONTACT_ACKNOWLEDGEMENT)

    expect(acknowledgement.tagName).toBe("P")
    expect(acknowledgement).toHaveAttribute("tabindex", "-1")
    expect(acknowledgement).toHaveClass("scroll-mt-18")
    expect(acknowledgement).toHaveFocus()
    expect(acknowledgement).not.toHaveAttribute("role")
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
    expect(readForm(container)).toBe(form)
    expect(form).toHaveClass("invisible")
    expect(form.nextElementSibling).toBe(acknowledgement)
    expect(form.parentElement).toHaveClass("grid")
    expect(form).toHaveClass("[grid-area:1/1]")
    expect(acknowledgement).toHaveClass("[grid-area:1/1]")
    expect(screen.getByLabelText("What can I help you with?")).toHaveValue(
      MESSAGE
    )
  })

  it("keeps the send button focused and announces sending while the message is on its way", async () => {
    let release: () => void = function releaseNothing() {}

    heldSend = new Promise(function holdUntilReleased(resolve) {
      release = resolve
    })
    vi.setSystemTime(RENDERED_AT)
    renderForm()
    fillForm()

    const send = screen.getByRole("button", { name: CONTACT_SEND_LABEL })

    send.focus()
    vi.setSystemTime(RENDERED_AT + MINIMUM_WAIT_MS)
    fireEvent.click(send)

    const sending = await screen.findByRole("button", {
      name: CONTACT_SENDING_LABEL,
    })

    expect(sending).toBe(send)
    expect(sending).toHaveFocus()
    expect(sending).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByRole("status")).toHaveTextContent(CONTACT_SENDING_LABEL)

    release()
    heldSend = null

    await screen.findByText(CONTACT_ACKNOWLEDGEMENT)
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
  })

  it("ties each field's error to its field, and claims no error before one is shown", async () => {
    renderForm()

    const fields = [
      {
        label: "Name",
        errorId: CONTACT_ERROR_IDS.name,
        readControl: function readName() {
          return screen.getByLabelText("Name")
        },
      },
      {
        label: "Email",
        errorId: CONTACT_ERROR_IDS.email,
        readControl: function readEmail() {
          return screen.getByLabelText("Email")
        },
      },
      {
        label: "Service needed",
        errorId: CONTACT_ERROR_IDS.service,
        readControl: readServiceGroup,
      },
      {
        label: "What can I help you with?",
        errorId: CONTACT_ERROR_IDS.message,
        readControl: function readMessage() {
          return screen.getByLabelText("What can I help you with?")
        },
      },
    ]

    for (const field of fields) {
      const control = field.readControl()

      expect(control, field.label).toHaveAttribute("aria-invalid", "false")
      expect(control, field.label).not.toHaveAttribute("aria-describedby")
    }

    expectServiceRadiosNeverInvalid()

    fireEvent.click(screen.getByRole("button", { name: CONTACT_SEND_LABEL }))

    for (const field of fields) {
      const control = field.readControl()

      await vi.waitFor(function expectInvalid() {
        expect(control, field.label).toHaveAttribute("aria-invalid", "true")
      })
      expect(control, field.label).toHaveAttribute(
        "aria-describedby",
        field.errorId
      )
      expect(control, field.label).toHaveAccessibleDescription(
        document.getElementById(field.errorId)?.textContent ?? "missing"
      )
    }

    expectServiceRadiosNeverInvalid()
  })

  it("leaves focus where the reader moved it when the form renders again", async () => {
    const client = new QueryClient()

    vi.setSystemTime(RENDERED_AT)
    const { rerender } = render(buildForm(client))

    fillForm()
    sendAfter(MINIMUM_WAIT_MS)

    const acknowledgement = await screen.findByText(CONTACT_ACKNOWLEDGEMENT)

    expect(acknowledgement).toHaveFocus()

    acknowledgement.blur()
    rerender(buildForm(client))

    expect(acknowledgement).not.toHaveFocus()
  })

  it("posts without JavaScript so no field lands in the URL", () => {
    const { container } = renderForm()

    expect(readForm(container)).toHaveAttribute("method", "post")
    expect(readForm(container)).not.toHaveAttribute("enctype")
  })

  it("keeps the form showing when a message is sent too soon", async () => {
    vi.setSystemTime(RENDERED_AT)
    const { container } = renderForm()

    fillForm()
    sendAfter(MINIMUM_WAIT_MS - 1)

    expect(
      await screen.findByText(CONTACT_REJECTED_MESSAGE)
    ).toBeInTheDocument()
    expect(screen.queryByText(CONTACT_ACKNOWLEDGEMENT)).toBeNull()
    expect(readForm(container)).not.toHaveClass("invisible")
  })

  it("offers the services as one required radio group, named by its legend, with none chosen", () => {
    renderForm()

    const group = readServiceGroup()

    expect(group.tagName).toBe("FIELDSET")
    expect(group).toBeRequired()
    expect(within(group).getAllByRole("radio")).toHaveLength(
      CONTACT_SERVICES.length
    )
    expect(screen.queryByRole("combobox")).toBeNull()

    for (const service of CONTACT_SERVICES) {
      const radio = within(group).getByRole("radio", {
        name: CONTACT_SERVICE_LABELS[service],
      })

      expect(radio, service).toHaveAttribute("value", service)
      expect(radio, service).toHaveAttribute("name", "service")
      expect(radio, service).not.toBeChecked()
    }
  })

  it("chooses one service when its chip is clicked and sends that service's value", async () => {
    vi.setSystemTime(RENDERED_AT)
    renderForm()
    fillForm()

    const chip = screen.getByText("Web design")

    expect(chip.tagName).toBe("LABEL")

    fireEvent.click(chip)

    expect(screen.getByRole("radio", { name: "Web design" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Branding" })).not.toBeChecked()

    sendAfter(MINIMUM_WAIT_MS)
    await screen.findByText(CONTACT_ACKNOWLEDGEMENT)

    expect(lastSentValues?.service).toBe("web_design")
  })

  it("numbers the rows 01 to 04 with hidden marks that sit outside the labels", () => {
    renderForm()

    const rows = [
      { number: "01", words: "Name" },
      { number: "02", words: "Email" },
      { number: "03", words: "Service needed" },
      { number: "04", words: "What can I help you with?" },
    ]

    for (const row of rows) {
      const number = screen.getByText(row.number)

      expect(number, row.words).toHaveAttribute("aria-hidden", "true")
      expect(number.closest("label"), row.words).toBeNull()
      expect(number.nextElementSibling, row.words).toBe(
        screen.getByText(row.words)
      )
    }

    expect(Object.values(CONTACT_FIELD_NUMBERS)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ])
  })

  it("holds the service error while focus moves between chips, and shows it once focus leaves the group with none chosen", async () => {
    renderForm()

    const branding = screen.getByRole("radio", { name: "Branding" })
    const webDesign = screen.getByRole("radio", { name: "Web design" })
    const name = screen.getByLabelText("Name")

    fireEvent.blur(branding, { relatedTarget: webDesign })
    fireEvent.blur(name, { relatedTarget: branding })

    expect(await screen.findByText("Enter your name")).toBeInTheDocument()
    expect(screen.queryByText(CONTACT_SERVICE_PROMPT)).toBeNull()
    expect(readServiceGroup()).toHaveAttribute("aria-invalid", "false")

    fireEvent.blur(webDesign, { relatedTarget: name })

    expect(await screen.findByText(CONTACT_SERVICE_PROMPT)).toBeInTheDocument()
    expect(readServiceGroup()).toHaveAttribute("aria-invalid", "true")
    expectServiceRadiosNeverInvalid()
  })

  it("puts focus on the name field first when an empty form is sent", async () => {
    renderForm()

    fireEvent.click(screen.getByRole("button", { name: CONTACT_SEND_LABEL }))

    await vi.waitFor(function expectNameFocused() {
      expect(screen.getByLabelText("Name")).toHaveFocus()
    })
  })

  it("keeps the ids the page links to and the message box's own scroll", () => {
    renderForm()

    const message = screen.getByLabelText("What can I help you with?")

    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "contact-name")
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "id",
      "contact-email"
    )
    expect(message).toHaveAttribute("id", "contact-message")
    expect(message).toHaveAttribute("data-lenis-prevent")
  })

  it("keeps every control the keyboard reaches clear of the fixed header", () => {
    const { container } = renderForm()
    const controls = container.querySelectorAll(KEYBOARD_CONTROL_SELECTOR)

    expect(controls).toHaveLength(8)

    for (const control of controls) {
      expect(control, control.outerHTML.slice(0, 80)).toHaveClass(
        "scroll-mt-18"
      )
    }
  })
})
