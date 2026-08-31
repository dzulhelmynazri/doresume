"use client";

import { applicationSettingsSchema } from "@doresume/contracts";
import type { ApplicationSettings } from "@doresume/contracts";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@doresume/ui/components/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@doresume/ui/components/radio-group";
import { Switch } from "@doresume/ui/components/switch";
import { useForm } from "@tanstack/react-form";

const APPLICATION_SETTINGS_DEFAULTS: ApplicationSettings = {
  allowAccountCreation: false,
  autoApproveEdits: false,
  resumeOptimization: "honest",
  reviewBeforeSubmit: true,
};

const RESUME_OPTIMIZATION_OPTIONS = [
  {
    description: "Send your resume exactly as uploaded.",
    label: "Off",
    value: "off",
  },
  {
    description:
      "Reorder and emphasize experience that's relevant to each job.",
    label: "Honest",
    value: "honest",
  },
  {
    description: "Rewrite content to match the job description closely.",
    label: "Aggressive",
    value: "aggressive",
  },
] as const;

const REVIEW_BEFORE_SUBMIT_OPTIONS = [
  {
    description:
      "Pause on a review screen so you can check and edit each application before it's submitted.",
    label: "On",
    value: "on",
  },
  {
    description: "Submit applications automatically once they're filled.",
    label: "Off",
    value: "off",
  },
] as const;

export const useApplicationSettingsForm = (
  onValidSubmit: (value: ApplicationSettings) => void | Promise<void>,
  defaultValues: ApplicationSettings = APPLICATION_SETTINGS_DEFAULTS
) =>
  useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onValidSubmit(applicationSettingsSchema.parse(value));
    },
    validators: {
      onSubmit: applicationSettingsSchema,
    },
  });

type ApplicationSettingsFormApi = ReturnType<typeof useApplicationSettingsForm>;

const ChoiceRadio = ({
  description,
  id,
  label,
  value,
}: {
  description: string;
  id: string;
  label: string;
  value: string;
}) => (
  <FieldLabel htmlFor={id}>
    <Field orientation="horizontal">
      <RadioGroupItem id={id} value={value} />
      <FieldContent>
        <FieldTitle>{label}</FieldTitle>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
    </Field>
  </FieldLabel>
);

const AutoApproveField = ({ form }: { form: ApplicationSettingsFormApi }) => (
  <form.Field name="autoApproveEdits">
    {(field) => {
      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

      return (
        <Field data-invalid={isInvalid} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={field.name}>Auto-approve edits?</FieldLabel>
            <FieldDescription>
              Skip the preview step and send optimized files straight through.
            </FieldDescription>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </FieldContent>
          <Switch
            aria-invalid={isInvalid}
            checked={field.state.value}
            id={field.name}
            onCheckedChange={field.handleChange}
          />
        </Field>
      );
    }}
  </form.Field>
);

const AccountCreationField = ({
  form,
}: {
  form: ApplicationSettingsFormApi;
}) => (
  <form.Field name="allowAccountCreation">
    {(field) => {
      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

      return (
        <Field data-invalid={isInvalid} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={field.name}>
              Allow account creation?
            </FieldLabel>
            <FieldDescription>
              Some job sites need an account before you can apply. We sign up
              with your email and application password, then verify through your
              connected inbox.
            </FieldDescription>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </FieldContent>
          <Switch
            aria-invalid={isInvalid}
            checked={field.state.value}
            id={field.name}
            onCheckedChange={field.handleChange}
          />
        </Field>
      );
    }}
  </form.Field>
);

const ApplicationSettingsFields = ({
  form,
}: {
  form: ApplicationSettingsFormApi;
}) => (
  <FieldGroup>
    <form.Field name="resumeOptimization">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        const showAutoApprove = field.state.value !== "off";

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend>Resume optimization</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              onValueChange={(next) => {
                if (
                  next !== "aggressive" &&
                  next !== "honest" &&
                  next !== "off"
                ) {
                  return;
                }

                field.handleChange(next);

                if (next === "off") {
                  form.setFieldValue("autoApproveEdits", false);
                }
              }}
              value={field.state.value}
            >
              {RESUME_OPTIMIZATION_OPTIONS.map((option) => (
                <ChoiceRadio
                  description={option.description}
                  id={`resume-optimization-${option.value}`}
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </RadioGroup>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
            {showAutoApprove ? <AutoApproveField form={form} /> : null}
          </FieldSet>
        );
      }}
    </form.Field>
    <FieldSeparator />
    <AccountCreationField form={form} />
    <FieldSeparator />
    <FieldSet>
      <FieldLegend>Cover letter</FieldLegend>
      <FieldDescription>
        Generated automatically when a job asks for one. Tailored to the role
        from your documents (and your saved cover letter, if you have one). No
        setup needed.
      </FieldDescription>
    </FieldSet>
    <FieldSeparator />
    <form.Field name="reviewBeforeSubmit">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <FieldSet data-invalid={isInvalid}>
            <FieldLegend>Review before submit</FieldLegend>
            <RadioGroup
              aria-invalid={isInvalid}
              onValueChange={(next) => {
                if (next === "on" || next === "off") {
                  field.handleChange(next === "on");
                }
              }}
              value={field.state.value ? "on" : "off"}
            >
              {REVIEW_BEFORE_SUBMIT_OPTIONS.map((option) => (
                <ChoiceRadio
                  description={option.description}
                  id={`review-before-submit-${option.value}`}
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </RadioGroup>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </FieldSet>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { APPLICATION_SETTINGS_DEFAULTS, ApplicationSettingsFields };
