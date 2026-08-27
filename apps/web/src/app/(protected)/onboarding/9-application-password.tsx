"use client";

import { applicationPasswordSchema } from "@doresume/contracts";
import type { ApplicationPassword } from "@doresume/contracts";
import { Badge } from "@doresume/ui/components/badge";
import { Button } from "@doresume/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@doresume/ui/components/field";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import { useForm } from "@tanstack/react-form";
import { LockIcon } from "lucide-react";

import { InputPasswordStrength } from "@/components/shadcn-studio/input/input-46";

const APPLICATION_PASSWORD_DEFAULTS: ApplicationPassword = {
  password: "",
};

const APPLICATION_SITES = ["Workday", "iCIMS", "Oracle"] as const;

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*";
const ALL_PASSWORD_CHARS = `${LOWERCASE}${UPPERCASE}${NUMBERS}${SPECIAL}`;
const GENERATED_PASSWORD_LENGTH = 16;

const randomIndex = (max: number) => {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  const [value] = values;

  if (value === undefined) {
    throw new Error("Failed to generate a random value.");
  }

  return value % max;
};

const randomChar = (alphabet: string) => {
  const character = alphabet.at(randomIndex(alphabet.length));

  if (character === undefined) {
    throw new Error("Cannot pick a character from an empty alphabet.");
  }

  return character;
};

const shuffle = (values: string[]) => {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    const current = values[index];
    const swap = values[swapIndex];

    if (current === undefined || swap === undefined) {
      continue;
    }

    values[index] = swap;
    values[swapIndex] = current;
  }

  return values;
};

const generateStrongPassword = () => {
  const chars = [
    randomChar(LOWERCASE),
    randomChar(UPPERCASE),
    randomChar(NUMBERS),
    randomChar(SPECIAL),
  ];

  while (chars.length < GENERATED_PASSWORD_LENGTH) {
    chars.push(randomChar(ALL_PASSWORD_CHARS));
  }

  return shuffle(chars).join("");
};

export const useApplicationPasswordForm = (
  onValidSubmit: (value: ApplicationPassword) => void | Promise<void>
) =>
  useForm({
    defaultValues: APPLICATION_PASSWORD_DEFAULTS,
    onSubmit: async ({ value }) => {
      await onValidSubmit(applicationPasswordSchema.parse(value));
    },
    validators: {
      onSubmit: applicationPasswordSchema,
    },
  });

type ApplicationPasswordFormApi = ReturnType<typeof useApplicationPasswordForm>;

const ApplicationPasswordFields = ({
  form,
}: {
  form: ApplicationPasswordFormApi;
}) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values.password}>
      {(password) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={password}
            aria-label="Application password"
            defaultValue={password}
            readOnly
            type="password"
          />
        </div>
      )}
    </form.Subscribe>
    <FieldDescription>
      Some applications (Workday, iCIMS, Oracle) require you to create an
      account mid-flow. We use this to sign you up automatically.
    </FieldDescription>
    <div className="flex flex-wrap gap-2">
      {APPLICATION_SITES.map((site) => (
        <Badge key={site} variant="outline">
          {site}
        </Badge>
      ))}
      <Badge variant="secondary">+ more</Badge>
    </div>
    <form.Field name="password">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Button
                onClick={() => {
                  field.handleChange(generateStrongPassword());
                }}
                size="sm"
                type="button"
                variant="link"
              >
                Generate strong password
              </Button>
            </div>
            <InputPasswordStrength
              id={field.name}
              invalid={isInvalid}
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              value={field.state.value}
            />
            {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
            <FieldDescription className="flex items-center gap-2">
              <LockIcon className="size-3.5" />
              Encrypted before save
            </FieldDescription>
          </Field>
        );
      }}
    </form.Field>
  </FieldGroup>
);

export { APPLICATION_PASSWORD_DEFAULTS, ApplicationPasswordFields };
