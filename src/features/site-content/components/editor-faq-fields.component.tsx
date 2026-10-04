"use client"

import { useFieldArray, useFormState } from "react-hook-form"
import type { Control, UseFormRegister } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FAQ_ITEM_FIELDS,
  FAQ_MAX,
  NEW_FAQ_ITEM,
} from "@/data/site-content.data"
import type { SiteContent, SiteContentInput } from "@/types/site-content.type"

export function EditorFaqFields({
  control,
  register,
}: Readonly<{
  control: Control<SiteContentInput, unknown, SiteContent>
  register: UseFormRegister<SiteContentInput>
}>) {
  const { errors } = useFormState({ control, name: "faq" })
  const {
    fields: questionFields,
    append: appendQuestion,
    move: moveQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "faq.items" })

  function handleAddQuestion() {
    appendQuestion(NEW_FAQ_ITEM)
  }

  return (
    <FieldGroup>
      {questionFields.map(function renderQuestionCard(questionField, index) {
        const position = index + 1

        return (
          <FieldSet key={questionField.id} className="border-t pt-5">
            <FieldLegend variant="label">{`FAQ ${position}`}</FieldLegend>

            {FAQ_ITEM_FIELDS.map(function renderQuestionField(itemField) {
              const fieldId = `faq-${questionField.id}-${itemField.key}`
              const hintId = `${fieldId}-hint`
              const describedBy = itemField.hint === null ? undefined : hintId
              const fieldError = errors.faq?.items?.[index]?.[itemField.key]
              const registration = register(
                `faq.items.${index}.${itemField.key}`
              )

              return (
                <Field key={itemField.key}>
                  <FieldLabel htmlFor={fieldId}>
                    {`${itemField.label} ${position}`}
                  </FieldLabel>
                  {itemField.multiline ? (
                    <Textarea
                      id={fieldId}
                      aria-describedby={describedBy}
                      maxLength={itemField.maxLength}
                      aria-invalid={fieldError ? true : undefined}
                      {...registration}
                    />
                  ) : (
                    <Input
                      id={fieldId}
                      aria-describedby={describedBy}
                      autoComplete="off"
                      maxLength={itemField.maxLength}
                      aria-invalid={fieldError ? true : undefined}
                      {...registration}
                    />
                  )}
                  {itemField.hint !== null && (
                    <FieldDescription id={hintId}>
                      {itemField.hint}
                    </FieldDescription>
                  )}
                  <FieldError errors={[fieldError]} />
                </Field>
              )
            })}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={function moveQuestionUp() {
                  moveQuestion(index, index - 1)
                }}
              >
                {`Move question ${position} up`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={function removeQuestionCard() {
                  removeQuestion(index)
                }}
              >
                {`Remove question ${position}`}
              </Button>
            </div>
          </FieldSet>
        )
      })}

      <Button
        type="button"
        variant="outline"
        disabled={questionFields.length >= FAQ_MAX}
        onClick={handleAddQuestion}
      >
        Add question
      </Button>
    </FieldGroup>
  )
}
