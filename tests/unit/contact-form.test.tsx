import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  CONTACT_ACKNOWLEDGEMENT,
  CONTACT_ERROR_IDS,
  CONTACT_REJECTED_MESSAGE,
  CONTACT_SEND_LABEL,
  CONTACT_SENDING_LABEL,
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

let heldSend: Promise<void> | null = null

async function sendThroughServerChecks(values: ContactValues) {
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

function fillForm(): void {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Lovelace" },
  })
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.test" },
  })
  fireEvent.change(screen.getByLabelText("Service needed"), {
    target: { value: "branding" },
  })
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
      { label: "Name", errorId: CONTACT_ERROR_IDS.name },
      { label: "Email", errorId: CONTACT_ERROR_IDS.email },
      { label: "Service needed", errorId: CONTACT_ERROR_IDS.service },
      {
        label: "What can I help you with?",
        errorId: CONTACT_ERROR_IDS.message,
      },
    ]

    for (const field of fields) {
      const control = screen.getByLabelText(field.label)

      expect(control, field.label).toHaveAttribute("aria-invalid", "false")
      expect(control, field.label).not.toHaveAttribute("aria-describedby")
    }

    fireEvent.click(screen.getByRole("button", { name: CONTACT_SEND_LABEL }))

    for (const field of fields) {
      const control = await screen.findByLabelText(field.label)

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
})
