"use client";

import {
  EXPERIENCE_LEVEL_OPTIONS,
  EXPERIENCE_LEVELS,
  experienceLevelSchema,
} from "@doresume/contracts";
import type { ExperienceLevel, ExperienceLevelForm } from "@doresume/contracts";
import {
  Field,
  FieldContent,
  FieldDescription,
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

import { autosaveListener } from "./autosave";

const EXPERIENCE_LEVEL_DEFAULTS: { experienceLevel?: ExperienceLevel } = {
  experienceLevel: undefined,
};

const isExperienceLevel = (value: string): value is ExperienceLevel =>
  EXPERIENCE_LEVELS.some((level) => level === value);

export const useExperienceLevelForm = (
  onValidSubmit: (value: ExperienceLevelForm) => void | Promise<void>,
  defaultValues: {
    experienceLevel?: ExperienceLevel;
  } = EXPERIENCE_LEVEL_DEFAULTS
) =>
  useForm({
    defaultValues,
    listeners: autosaveListener(experienceLevelSchema, onValidSubmit),
    onSubmit: async ({ value }) => {
      await onValidSubmit(experienceLevelSchema.parse(value));
    },
    validators: {
      onSubmit: experienceLevelSchema,
    },
  });

type ExperienceLevelFormApi = ReturnType<typeof useExperienceLevelForm>;

const ExperienceLevelFields = ({ form }: { form: ExperienceLevelFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values.experienceLevel}>
      {(experienceLevel) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={experienceLevel ?? "empty"}
            aria-label="Experience level"
            defaultValue={experienceLevel ?? ""}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="experienceLevel">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend className="sr-only">Experience level</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              className="gap-4"
              onValueChange={(value) => {
                if (value && isExperienceLevel(value)) {
                  field.handleChange(value);
                }
              }}
              value={field.state.value ?? null}
            >
              {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                <FieldLabel
                  className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
                  htmlFor={`experience-level-${option.value}`}
                  key={option.value}
                >
                  <Field
                    className="min-h-12 items-center"
                    orientation="horizontal"
                  >
                    <RadioGroupItem
                      id={`experience-level-${option.value}`}
                      value={option.value}
                    />
                    <FieldContent>
                      <FieldTitle className="group-has-data-checked/field-label:text-primary text-sm">
                        {option.label}
                      </FieldTitle>
                      <FieldDescription>{option.description}</FieldDescription>
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

export { EXPERIENCE_LEVEL_DEFAULTS, ExperienceLevelFields };
