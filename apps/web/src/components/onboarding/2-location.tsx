"use client";

import { locationSchema } from "@doresume/contracts";
import type { Location } from "@doresume/contracts";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@doresume/ui/components/field";
import { Input } from "@doresume/ui/components/input";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import { useForm } from "@tanstack/react-form";

import { autosaveListener } from "./autosave";

const LOCATION_DEFAULTS: Location = {
  address: "",
  city: "",
  country: "",
  state: "",
  zip: "",
};

export const useLocationForm = (
  onValidSubmit: (value: Location) => void | Promise<void>,
  defaultValues: Location = LOCATION_DEFAULTS
) =>
  useForm({
    defaultValues,
    listeners: autosaveListener(locationSchema, onValidSubmit),
    onSubmit: async ({ value }) => {
      await onValidSubmit(value);
    },
    validators: {
      onBlur: locationSchema,
      onSubmit: locationSchema,
    },
  });

type LocationFormApi = ReturnType<typeof useLocationForm>;

const LocationFields = ({ form }: { form: LocationFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={JSON.stringify(values)}
            aria-label="Location"
            defaultValue={
              locationSchema.safeParse(values).success
                ? JSON.stringify(values)
                : ""
            }
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="address">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Address</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="address-line1"
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="city">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>City</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="address-level2"
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="zip">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="postal-code"
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="state">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>State</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="address-level1"
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="country">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Country</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="country-name"
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { LocationFields };
