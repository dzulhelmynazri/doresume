"use client";

import {
  WORK_ARRANGEMENT_OPTIONS,
  WORK_ARRANGEMENTS,
  workArrangementSchema,
} from "@doresume/contracts";
import type { WorkArrangement, WorkArrangementForm } from "@doresume/contracts";
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

const WORK_ARRANGEMENT_DEFAULTS: { workArrangement?: WorkArrangement } = {
  workArrangement: undefined,
};

const isWorkArrangement = (value: string): value is WorkArrangement =>
  WORK_ARRANGEMENTS.some((arrangement) => arrangement === value);

export const useWorkArrangementForm = (
  onValidSubmit: (value: WorkArrangementForm) => void | Promise<void>,
  defaultValues: {
    workArrangement?: WorkArrangement;
  } = WORK_ARRANGEMENT_DEFAULTS
) =>
  useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onValidSubmit(workArrangementSchema.parse(value));
    },
    validators: {
      onSubmit: workArrangementSchema,
    },
  });

type WorkArrangementFormApi = ReturnType<typeof useWorkArrangementForm>;

const WorkArrangementFields = ({ form }: { form: WorkArrangementFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values.workArrangement}>
      {(workArrangement) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={workArrangement ?? "empty"}
            aria-label="Work arrangement"
            defaultValue={workArrangement ?? ""}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="workArrangement">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend className="sr-only">Work arrangement</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              className="gap-4"
              onValueChange={(value) => {
                if (value && isWorkArrangement(value)) {
                  field.handleChange(value);
                }
              }}
              value={field.state.value ?? null}
            >
              {WORK_ARRANGEMENT_OPTIONS.map((option) => (
                <FieldLabel
                  className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
                  htmlFor={`work-arrangement-${option.value}`}
                  key={option.value}
                >
                  <Field
                    className="min-h-12 items-center"
                    orientation="horizontal"
                  >
                    <RadioGroupItem
                      id={`work-arrangement-${option.value}`}
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

export { WORK_ARRANGEMENT_DEFAULTS, WorkArrangementFields };
