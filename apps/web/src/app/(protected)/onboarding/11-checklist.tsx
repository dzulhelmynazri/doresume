"use client";

import { checklistSchema } from "@doresume/contracts";
import type { Checklist } from "@doresume/contracts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@doresume/ui/components/accordion";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@doresume/ui/components/field";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doresume/ui/components/select";
import { Textarea } from "@doresume/ui/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import { useForm } from "@tanstack/react-form";

type YesNo = Checklist["activeClearance"];
type YesNoKey =
  | "activeClearance"
  | "canStartImmediately"
  | "familyTiesForeignGovernments"
  | "needsAccommodations"
  | "openToInPerson"
  | "reliableTransportation"
  | "willingToRelocate";

const CHECKLIST_DEFAULTS: Checklist = {
  activeClearance: "no",
  additionalInfo: "",
  canStartImmediately: "yes",
  disabilityStatus: "",
  familyTiesForeignGovernments: "no",
  gender: "",
  needsAccommodations: "no",
  openToInPerson: "yes",
  raceEthnicity: "",
  reliableTransportation: "yes",
  veteranStatus: "",
  willingToRelocate: "no",
};

const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Non-binary", value: "non_binary" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
] as const;

const RACE_OPTIONS = [
  { label: "Hispanic or Latino", value: "hispanic_or_latino" },
  { label: "White", value: "white" },
  { label: "Black or African American", value: "black_or_african_american" },
  {
    label: "Native Hawaiian or Other Pacific Islander",
    value: "native_hawaiian_or_other_pacific_islander",
  },
  { label: "Asian", value: "asian" },
  {
    label: "American Indian or Alaska Native",
    value: "american_indian_or_alaska_native",
  },
  { label: "Two or more races", value: "two_or_more_races" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
] as const;

const VETERAN_OPTIONS = [
  { label: "I am not a protected veteran", value: "not_protected_veteran" },
  {
    label: "I identify as a protected veteran",
    value: "protected_veteran",
  },
  { label: "I don't wish to answer", value: "do_not_wish_to_answer" },
] as const;

const DISABILITY_OPTIONS = [
  { label: "Yes, I have a disability", value: "yes" },
  { label: "No, I don't have a disability", value: "no" },
  { label: "I don't wish to answer", value: "do_not_wish_to_answer" },
] as const;

export const useChecklistForm = (
  onValidSubmit: (value: Checklist) => void | Promise<void>
) =>
  useForm({
    defaultValues: CHECKLIST_DEFAULTS,
    onSubmit: async ({ value }) => {
      await onValidSubmit(checklistSchema.parse(value));
    },
    validators: {
      onSubmit: checklistSchema,
    },
  });

type ChecklistFormApi = ReturnType<typeof useChecklistForm>;

const YesNoField = ({
  description,
  errors,
  isInvalid,
  label,
  labelId,
  onValueChange,
  value,
}: {
  description?: string;
  errors: ({ message?: string } | undefined)[];
  isInvalid: boolean;
  label: string;
  labelId: string;
  onValueChange: (value: YesNo) => void;
  value: YesNo;
}) => (
  <Field data-invalid={isInvalid} orientation="horizontal">
    <FieldContent>
      <FieldTitle id={labelId}>{label}</FieldTitle>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid ? <FieldError errors={errors} /> : null}
    </FieldContent>
    <ToggleGroup
      aria-invalid={isInvalid}
      aria-labelledby={labelId}
      className="shrink-0"
      onValueChange={([selected]) => {
        if (selected === "yes" || selected === "no") {
          onValueChange(selected);
        }
      }}
      spacing={2}
      value={[value]}
      variant="outline"
    >
      <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
      <ToggleGroupItem value="no">No</ToggleGroupItem>
    </ToggleGroup>
  </Field>
);

const YesNoFormField = ({
  description,
  form,
  label,
  name,
}: {
  description?: string;
  form: ChecklistFormApi;
  label: string;
  name: YesNoKey;
}) => (
  <form.Field name={name}>
    {(field) => {
      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

      return (
        <YesNoField
          description={description}
          errors={field.state.meta.errors}
          isInvalid={isInvalid}
          label={label}
          labelId={name}
          onValueChange={field.handleChange}
          value={field.state.value}
        />
      );
    }}
  </form.Field>
);

const OptionalSelectField = <T extends string>({
  errors,
  id,
  isInvalid,
  label,
  onBlur,
  onValueChange,
  options,
  value,
}: {
  errors: ({ message?: string } | undefined)[];
  id: string;
  isInvalid: boolean;
  label: string;
  onBlur: () => void;
  onValueChange: (value: T | "") => void;
  options: readonly { label: string; value: T }[];
  value: T | "";
}) => (
  <Field data-invalid={isInvalid}>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Select
      items={[{ label: "Select…", value: null }, ...options]}
      onValueChange={(next) => {
        const selected = options.find((item) => item.value === next);
        onValueChange(selected?.value ?? "");
      }}
      value={value || null}
    >
      <SelectTrigger
        aria-invalid={isInvalid}
        className="w-full"
        id={id}
        onBlur={onBlur}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    {isInvalid ? <FieldError errors={errors} /> : null}
  </Field>
);

const ChecklistAccordionSection = ({
  children,
  description,
  title,
  value,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
  value: string;
}) => (
  <AccordionItem
    className="border-b px-4 last:border-b-0 data-open:bg-transparent"
    value={value}
  >
    <AccordionTrigger>{title}</AccordionTrigger>
    <AccordionContent>
      {description ? (
        <FieldDescription className="mb-3">{description}</FieldDescription>
      ) : null}
      <FieldGroup>{children}</FieldGroup>
    </AccordionContent>
  </AccordionItem>
);

const ChecklistFields = ({ form }: { form: ChecklistFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={JSON.stringify(values)}
            aria-label="Checklist"
            defaultValue={JSON.stringify(values)}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <Accordion className="rounded-lg border" defaultValue={["preferences"]}>
      <ChecklistAccordionSection title="Preferences" value="preferences">
        <YesNoFormField
          form={form}
          label="Open to in-person work?"
          name="openToInPerson"
        />
        <YesNoFormField
          form={form}
          label="Willing to relocate?"
          name="willingToRelocate"
        />
        <YesNoFormField
          form={form}
          label="Can start immediately?"
          name="canStartImmediately"
        />
        <YesNoFormField
          form={form}
          label="Reliable transportation?"
          name="reliableTransportation"
        />
        <YesNoFormField
          description="Disability, religious, or other."
          form={form}
          label="Need workplace accommodations?"
          name="needsAccommodations"
        />
      </ChecklistAccordionSection>
      <ChecklistAccordionSection title="Background" value="background">
        <YesNoFormField
          form={form}
          label="Active government clearance?"
          name="activeClearance"
        />
        <YesNoFormField
          description="Employers are required to ask."
          form={form}
          label="Family ties to foreign governments?"
          name="familyTiesForeignGovernments"
        />
      </ChecklistAccordionSection>
      <ChecklistAccordionSection
        description="Employers must report this in aggregate."
        title="Diversity & Inclusion (Optional)"
        value="diversity"
      >
        <form.Field name="gender">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <OptionalSelectField
                errors={field.state.meta.errors}
                id={field.name}
                isInvalid={isInvalid}
                label="Gender"
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                options={GENDER_OPTIONS}
                value={field.state.value}
              />
            );
          }}
        </form.Field>
        <form.Field name="raceEthnicity">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <OptionalSelectField
                errors={field.state.meta.errors}
                id={field.name}
                isInvalid={isInvalid}
                label="Race / Ethnicity"
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                options={RACE_OPTIONS}
                value={field.state.value}
              />
            );
          }}
        </form.Field>
        <form.Field name="veteranStatus">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <OptionalSelectField
                errors={field.state.meta.errors}
                id={field.name}
                isInvalid={isInvalid}
                label="Veteran status"
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                options={VETERAN_OPTIONS}
                value={field.state.value}
              />
            );
          }}
        </form.Field>
        <form.Field name="disabilityStatus">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <OptionalSelectField
                errors={field.state.meta.errors}
                id={field.name}
                isInvalid={isInvalid}
                label="Disability status"
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                options={DISABILITY_OPTIONS}
                value={field.state.value}
              />
            );
          }}
        </form.Field>
      </ChecklistAccordionSection>
      <ChecklistAccordionSection
        title="Additional info (Optional)"
        value="additional-info"
      >
        <form.Field name="additionalInfo">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Anything else we should know when filling applications?
                </FieldLabel>
                <FieldDescription>
                  e.g. “Notice period 15 days”, “Willing to travel up to 50%”
                </FieldDescription>
                <Textarea
                  aria-invalid={isInvalid}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Optional notes…"
                  value={field.state.value}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      </ChecklistAccordionSection>
    </Accordion>
  </FieldGroup>
);

export { CHECKLIST_DEFAULTS, ChecklistFields };
