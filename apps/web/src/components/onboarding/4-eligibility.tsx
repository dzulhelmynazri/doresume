"use client";

import {
  needsAuthorizationDetails,
  workEligibilitySchema,
} from "@doresume/contracts";
import type {
  AuthorizationBasis,
  AuthorizationStatus,
  WorkEligibility,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@doresume/ui/components/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@doresume/ui/components/field";
import { Input } from "@doresume/ui/components/input";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doresume/ui/components/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import { useForm } from "@tanstack/react-form";
import { XIcon } from "lucide-react";

import { COUNTRIES, getCountriesByCode, getCountryName } from "@/lib/countries";
import type { CountryOption } from "@/lib/countries";

import { autosaveListener } from "./autosave";

type YesNoDraft = "" | "no" | "yes";
type AuthorizationBasisDraft = "" | AuthorizationBasis;
type AuthorizationStatusDraft = "" | AuthorizationStatus;

interface WorkCountryDraft {
  authorizationBasis: AuthorizationBasisDraft;
  authorizationStatus: AuthorizationStatusDraft;
  authorized: YesNoDraft;
  country: string;
  requiresSponsorship: YesNoDraft;
  visaType: string;
}

interface WorkEligibilityDraft {
  citizenship: string[];
  workCountries: WorkCountryDraft[];
}

const AUTHORIZATION_BASIS_OPTIONS = [
  { label: "Citizen", value: "citizen" },
  { label: "Permanent resident", value: "permanent_resident" },
  {
    label: "Temporary work authorization",
    value: "temporary_work_authorization",
  },
  { label: "Other", value: "other" },
] as const;

const AUTHORIZATION_BASIS_ITEMS = [
  { label: "Select a status", value: null },
  ...AUTHORIZATION_BASIS_OPTIONS,
];

const AUTHORIZATION_STATUS_OPTIONS = [
  { label: "Valid", value: "valid" },
  { label: "Pending", value: "pending" },
  { label: "Expiring soon", value: "expiring_soon" },
  { label: "Expired", value: "expired" },
  { label: "Not applicable", value: "not_applicable" },
] as const;

const AUTHORIZATION_STATUS_ITEMS = [
  { label: "Select a status", value: null },
  ...AUTHORIZATION_STATUS_OPTIONS,
];

const EMPTY_WORK_COUNTRY: WorkCountryDraft = {
  authorizationBasis: "",
  authorizationStatus: "",
  authorized: "",
  country: "",
  requiresSponsorship: "",
  visaType: "",
};

const ELIGIBILITY_DEFAULTS: WorkEligibilityDraft = {
  citizenship: [],
  workCountries: [],
};

export const useWorkEligibilityForm = (
  onValidSubmit: (value: WorkEligibility) => void | Promise<void>,
  defaultValues: WorkEligibilityDraft = ELIGIBILITY_DEFAULTS
) =>
  useForm({
    defaultValues,
    listeners: autosaveListener(workEligibilitySchema, onValidSubmit),
    onSubmit: async ({ value }) => {
      await onValidSubmit(workEligibilitySchema.parse(value));
    },
    validators: {
      onBlur: workEligibilitySchema,
      onSubmit: workEligibilitySchema,
    },
  });

type WorkEligibilityFormApi = ReturnType<typeof useWorkEligibilityForm>;

const YesNoField = ({
  errors,
  isInvalid,
  label,
  labelId,
  onValueChange,
  value,
}: {
  errors: ({ message?: string } | undefined)[];
  isInvalid: boolean;
  label: string;
  labelId: string;
  onValueChange: (value: YesNoDraft) => void;
  value: YesNoDraft;
}) => (
  <Field data-invalid={isInvalid}>
    <FieldTitle id={labelId}>{label}</FieldTitle>
    <ToggleGroup
      aria-invalid={isInvalid}
      aria-labelledby={labelId}
      onValueChange={([selected]) => {
        onValueChange(selected === "yes" || selected === "no" ? selected : "");
      }}
      spacing={2}
      value={value ? [value] : []}
      variant="outline"
    >
      <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
      <ToggleGroupItem value="no">No</ToggleGroupItem>
    </ToggleGroup>
    {isInvalid ? <FieldError errors={errors} /> : null}
  </Field>
);

const WorkEligibilityFields = ({
  form,
  syncQuestionnaire = false,
}: {
  form: WorkEligibilityFormApi;
  syncQuestionnaire?: boolean;
}) => (
  <FieldGroup>
    {syncQuestionnaire ? (
      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <div className="sr-only">
            <QuestionnaireInput
              key={JSON.stringify(values)}
              aria-label="Work eligibility"
              defaultValue={
                workEligibilitySchema.safeParse(values).success
                  ? JSON.stringify(values)
                  : ""
              }
              readOnly
            />
          </div>
        )}
      </form.Subscribe>
    ) : null}
    <form.Field name="citizenship">
      {(field) => {
        const selected = getCountriesByCode(field.state.value);
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel>Countries of citizenship</FieldLabel>
            <Combobox
              items={COUNTRIES}
              itemToStringValue={(country: CountryOption) => country.name}
              multiple
              onValueChange={(countries: CountryOption[]) => {
                field.handleChange(countries.map((country) => country.code));
              }}
              value={selected}
            >
              <ComboboxChips>
                <ComboboxValue>
                  {selected.map((country) => (
                    <ComboboxChip key={country.code}>
                      {country.name}
                    </ComboboxChip>
                  ))}
                </ComboboxValue>
                <ComboboxChipsInput
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  placeholder="Search countries"
                />
              </ComboboxChips>
              <ComboboxContent>
                <ComboboxEmpty>No countries found.</ComboboxEmpty>
                <ComboboxList>
                  {(country: CountryOption) => (
                    <ComboboxItem key={country.code} value={country}>
                      {country.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldDescription>
              Select every country where you hold citizenship.
            </FieldDescription>
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
          </Field>
        );
      }}
    </form.Field>
    <form.Field name="workCountries">
      {(field) => {
        const addedCodes = new Set(
          field.state.value.map((entry) => entry.country)
        );
        const availableCountries = COUNTRIES.filter(
          (country) => !addedCodes.has(country.code)
        );
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <>
            <Field data-invalid={isInvalid}>
              <FieldLabel>Countries where you want to work *</FieldLabel>
              <Combobox
                items={availableCountries}
                itemToStringValue={(country: CountryOption) => country.name}
                key={field.state.value.length}
                onValueChange={(country: CountryOption | null) => {
                  if (!country) {
                    return;
                  }

                  field.pushValue({
                    ...EMPTY_WORK_COUNTRY,
                    country: country.code,
                  });
                }}
                value={null}
              >
                <ComboboxInput
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  placeholder="Search and add a country"
                />
                <ComboboxContent>
                  <ComboboxEmpty>No countries found.</ComboboxEmpty>
                  <ComboboxList>
                    {(country: CountryOption) => (
                      <ComboboxItem key={country.code} value={country}>
                        {country.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>
                Add each country you would take a job in.
              </FieldDescription>
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
            {field.state.value.map((entry, index) => {
              const countryName = getCountryName(entry.country);

              return (
                <Card key={entry.country} size="sm">
                  <CardHeader>
                    <CardDescription>Added country</CardDescription>
                    <CardTitle>{countryName}</CardTitle>
                    <CardAction>
                      <Button
                        aria-label={`Remove ${countryName}`}
                        onClick={() => {
                          field.removeValue(index);
                        }}
                        size="icon-xs"
                        type="button"
                        variant="ghost"
                      >
                        <XIcon />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <form.Field name={`workCountries[${index}].authorized`}>
                        {(authorized) => {
                          const isAuthorizedInvalid =
                            authorized.state.meta.isTouched &&
                            !authorized.state.meta.isValid;

                          return (
                            <YesNoField
                              errors={authorized.state.meta.errors}
                              isInvalid={isAuthorizedInvalid}
                              label={`Are you legally authorized to work in ${countryName}?`}
                              labelId={`${entry.country}-authorized`}
                              onValueChange={authorized.handleChange}
                              value={authorized.state.value}
                            />
                          );
                        }}
                      </form.Field>
                      <form.Field
                        name={`workCountries[${index}].requiresSponsorship`}
                      >
                        {(sponsorship) => {
                          const isSponsorshipInvalid =
                            sponsorship.state.meta.isTouched &&
                            !sponsorship.state.meta.isValid;

                          return (
                            <YesNoField
                              errors={sponsorship.state.meta.errors}
                              isInvalid={isSponsorshipInvalid}
                              label={`Will you now or in the future require employer sponsorship in ${countryName}?`}
                              labelId={`${entry.country}-sponsorship`}
                              onValueChange={sponsorship.handleChange}
                              value={sponsorship.state.value}
                            />
                          );
                        }}
                      </form.Field>
                      <form.Field
                        name={`workCountries[${index}].authorizationBasis`}
                      >
                        {(basis) => {
                          const isBasisInvalid =
                            basis.state.meta.isTouched &&
                            !basis.state.meta.isValid;

                          return (
                            <Field data-invalid={isBasisInvalid}>
                              <FieldLabel htmlFor={`${entry.country}-basis`}>
                                Authorization basis
                              </FieldLabel>
                              <Select
                                items={AUTHORIZATION_BASIS_ITEMS}
                                onValueChange={(next) => {
                                  basis.handleChange(next ?? "");

                                  if (!needsAuthorizationDetails(next ?? "")) {
                                    form.setFieldValue(
                                      `workCountries[${index}].authorizationStatus`,
                                      ""
                                    );
                                    form.setFieldValue(
                                      `workCountries[${index}].visaType`,
                                      ""
                                    );
                                  }
                                }}
                                value={basis.state.value || null}
                              >
                                <SelectTrigger
                                  aria-invalid={isBasisInvalid}
                                  className="w-full"
                                  id={`${entry.country}-basis`}
                                  onBlur={basis.handleBlur}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent alignItemWithTrigger={false}>
                                  <SelectGroup>
                                    {AUTHORIZATION_BASIS_OPTIONS.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {isBasisInvalid ? (
                                <FieldError errors={basis.state.meta.errors} />
                              ) : null}
                            </Field>
                          );
                        }}
                      </form.Field>
                      {needsAuthorizationDetails(entry.authorizationBasis) ? (
                        <FieldGroup className="grid grid-cols-2">
                          <form.Field name={`workCountries[${index}].visaType`}>
                            {(visa) => {
                              const isVisaInvalid =
                                visa.state.meta.isTouched &&
                                !visa.state.meta.isValid;

                              return (
                                <Field data-invalid={isVisaInvalid}>
                                  <FieldLabel
                                    htmlFor={`${entry.country}-visa-type`}
                                  >
                                    Work permit or visa type
                                  </FieldLabel>
                                  <Input
                                    aria-invalid={isVisaInvalid}
                                    id={`${entry.country}-visa-type`}
                                    name={visa.name}
                                    onBlur={visa.handleBlur}
                                    onChange={(event) => {
                                      visa.handleChange(event.target.value);
                                    }}
                                    placeholder="Enter the document or category"
                                    value={visa.state.value}
                                  />
                                  {isVisaInvalid ? (
                                    <FieldError
                                      errors={visa.state.meta.errors}
                                    />
                                  ) : null}
                                </Field>
                              );
                            }}
                          </form.Field>
                          <form.Field
                            name={`workCountries[${index}].authorizationStatus`}
                          >
                            {(status) => {
                              const isStatusInvalid =
                                status.state.meta.isTouched &&
                                !status.state.meta.isValid;

                              return (
                                <Field data-invalid={isStatusInvalid}>
                                  <FieldLabel
                                    htmlFor={`${entry.country}-authorization-status`}
                                  >
                                    Authorization status
                                  </FieldLabel>
                                  <Select
                                    items={AUTHORIZATION_STATUS_ITEMS}
                                    onValueChange={(next) => {
                                      status.handleChange(next ?? "");
                                    }}
                                    value={status.state.value || null}
                                  >
                                    <SelectTrigger
                                      aria-invalid={isStatusInvalid}
                                      className="w-full"
                                      id={`${entry.country}-authorization-status`}
                                      onBlur={status.handleBlur}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent alignItemWithTrigger={false}>
                                      <SelectGroup>
                                        {AUTHORIZATION_STATUS_OPTIONS.map(
                                          (item) => (
                                            <SelectItem
                                              key={item.value}
                                              value={item.value}
                                            >
                                              {item.label}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {isStatusInvalid ? (
                                    <FieldError
                                      errors={status.state.meta.errors}
                                    />
                                  ) : null}
                                </Field>
                              );
                            }}
                          </form.Field>
                        </FieldGroup>
                      ) : null}
                    </FieldGroup>
                  </CardContent>
                </Card>
              );
            })}
          </>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { ELIGIBILITY_DEFAULTS, WorkEligibilityFields };
