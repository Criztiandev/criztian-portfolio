import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  CONTACT_ACKNOWLEDGEMENT,
  CONTACT_REJECTED_MESSAGE,
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

async function sendThroughServerChecks(values: ContactValues) {
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
    expect(screen.queryByRole("status")).toBeNull()
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
