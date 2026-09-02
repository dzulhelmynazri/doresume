"use client";

import { contactSchema } from "@doresume/contracts";
import type { Contact } from "@doresume/contracts";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@doresume/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@doresume/ui/components/input-group";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import { LinkedIn } from "@doresume/ui/socials/linkedin";
import { useForm } from "@tanstack/react-form";
import { PhoneIcon } from "lucide-react";

const CONTACT_DEFAULTS: Contact = {
  linkedin: "",
  phone: "",
};

export const useContactForm = (
  onValidSubmit: (value: Contact) => void | Promise<void>,
  defaultValues: Contact = CONTACT_DEFAULTS
) =>
  useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onValidSubmit(value);
    },
    validators: {
      onBlur: contactSchema,
      onSubmit: contactSchema,
    },
  });

type ContactFormApi = ReturnType<typeof useContactForm>;

const ContactFields = ({ form }: { form: ContactFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={JSON.stringify(values)}
            aria-label="Contact"
            defaultValue={JSON.stringify(values)}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="phone">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>
              <InputGroupInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+60 12 345 6789"
                type="tel"
              />
            </InputGroup>
            <FieldDescription>
              Enter phone number starting with + and country code. Example: +60
              for Malaysia
            </FieldDescription>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="linkedin">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>LinkedIn</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LinkedIn className="rounded-xs" />
              </InputGroupAddon>
              <InputGroupInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="url"
                placeholder="https://linkedin.com/in/yourhandle"
                type="url"
              />
            </InputGroup>
            <FieldDescription>
              Asked on basically every Workday / Greenhouse application.
            </FieldDescription>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { CONTACT_DEFAULTS, ContactFields };
