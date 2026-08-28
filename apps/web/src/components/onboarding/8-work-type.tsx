"use client";

import {
  WORK_TYPE_OPTIONS,
  WORK_TYPES,
  workTypeSchema,
} from "@doresume/contracts";
import type { WorkType, WorkTypeForm } from "@doresume/contracts";
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

const WORK_TYPE_DEFAULTS: { workType?: WorkType } = {
  workType: undefined,
};

const isWorkType = (value: string): value is WorkType =>
  WORK_TYPES.some((type) => type === value);

export const useWorkTypeForm = (
  onValidSubmit: (value: WorkTypeForm) => void | Promise<void>
) =>
  useForm({
    defaultValues: WORK_TYPE_DEFAULTS,
    onSubmit: async ({ value }) => {
      await onValidSubmit(workTypeSchema.parse(value));
    },
    validators: {
      onSubmit: workTypeSchema,
    },
  });

type WorkTypeFormApi = ReturnType<typeof useWorkTypeForm>;

const WorkTypeFields = ({ form }: { form: WorkTypeFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values.workType}>
      {(workType) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={workType ?? "empty"}
            aria-label="Work type"
            defaultValue={workType ?? ""}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="workType">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend className="sr-only">Work type</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              className="gap-4"
              onValueChange={(value) => {
                if (value && isWorkType(value)) {
                  field.handleChange(value);
                }
              }}
              value={field.state.value ?? null}
            >
              {WORK_TYPE_OPTIONS.map((option) => (
                <FieldLabel
                  className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
                  htmlFor={`work-type-${option.value}`}
                  key={option.value}
                >
                  <Field
                    className="min-h-12 items-center"
                    orientation="horizontal"
                  >
                    <RadioGroupItem
                      id={`work-type-${option.value}`}
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

export { WORK_TYPE_DEFAULTS, WorkTypeFields };
