"use client";

import {
  EDUCATION_LEVEL_OPTIONS,
  EDUCATION_LEVELS,
  educationLevelSchema,
} from "@doresume/contracts";
import type { EducationLevel, EducationLevelForm } from "@doresume/contracts";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@doresume/ui/components/field";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import {
  RadioGroup,
  RadioGroupItem,
} from "@doresume/ui/components/radio-group";
import { useForm } from "@tanstack/react-form";

const EDUCATION_LEVEL_DEFAULTS: { educationLevel?: EducationLevel } = {
  educationLevel: undefined,
};

const isEducationLevel = (value: string): value is EducationLevel =>
  EDUCATION_LEVELS.some((level) => level === value);

export const useEducationLevelForm = (
  onValidSubmit: (value: EducationLevelForm) => void | Promise<void>
) =>
  useForm({
    defaultValues: EDUCATION_LEVEL_DEFAULTS,
    onSubmit: async ({ value }) => {
      await onValidSubmit(educationLevelSchema.parse(value));
    },
    validators: {
      onSubmit: educationLevelSchema,
    },
  });

type EducationLevelFormApi = ReturnType<typeof useEducationLevelForm>;

const EducationLevelFields = ({ form }: { form: EducationLevelFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values.educationLevel}>
      {(educationLevel) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={educationLevel ?? "empty"}
            aria-label="Education level"
            defaultValue={educationLevel ?? ""}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="educationLevel">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend className="sr-only">Education level</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              className="gap-4"
              onValueChange={(value) => {
                if (value && isEducationLevel(value)) {
                  field.handleChange(value);
                }
              }}
              value={field.state.value ?? null}
            >
              {EDUCATION_LEVEL_OPTIONS.map((option) => (
                <FieldLabel
                  className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
                  htmlFor={`education-level-${option.value}`}
                  key={option.value}
                >
                  <Field
                    className="min-h-12 items-center"
                    orientation="horizontal"
                  >
                    <RadioGroupItem
                      id={`education-level-${option.value}`}
                      value={option.value}
                    />
                    <FieldContent>
                      <FieldTitle className="group-has-data-checked/field-label:text-primary text-sm">
                        {option.label}
                      </FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </FieldSet>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { EDUCATION_LEVEL_DEFAULTS, EducationLevelFields };
