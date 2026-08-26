"use client";

import { APPLICATION_PASSWORD_REQUIREMENTS } from "@doresume/contracts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@doresume/ui/components/input-group";
import { cn } from "@doresume/ui/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useState } from "react";

const strengthBarClass = (score: number) => {
  if (score === 0) {
    return "bg-border";
  }

  if (score <= 2) {
    return "bg-destructive";
  }

  if (score <= 4) {
    return "bg-primary/60";
  }

  return "bg-primary";
};

const strengthLabel = (score: number) => {
  if (score === 0) {
    return "Enter a password";
  }

  if (score <= 2) {
    return "Weak password";
  }

  if (score <= 3) {
    return "Medium password";
  }

  if (score === 4) {
    return "Strong password";
  }

  return "Very strong password";
};

const InputPasswordStrength = ({
  id,
  invalid = false,
  name,
  onBlur,
  onValueChange,
  placeholder = "Enter your application password",
  value,
}: {
  id: string;
  invalid?: boolean;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const strengthScore = APPLICATION_PASSWORD_REQUIREMENTS.filter(
    (requirement) => requirement.test(value)
  ).length;

  return (
    <div className="flex w-full flex-col gap-2">
      <InputGroup>
        <InputGroupInput
          aria-invalid={invalid}
          autoComplete="new-password"
          id={id}
          name={name}
          onBlur={onBlur}
          onChange={(event) => {
            onValueChange(event.target.value);
          }}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={isVisible ? "Hide password" : "Show password"}
            onClick={() => {
              setIsVisible((visible) => !visible);
            }}
            size="icon-xs"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex h-1 w-full gap-1">
        {APPLICATION_PASSWORD_REQUIREMENTS.map((requirement, index) => (
          <span
            className={cn(
              "h-full flex-1 rounded-full",
              index < strengthScore
                ? strengthBarClass(strengthScore)
                : "bg-border"
            )}
            key={requirement.id}
          />
        ))}
      </div>
      <p className="text-xs/relaxed font-medium">
        {strengthLabel(strengthScore)}. Must contain:
      </p>
      <ul className="flex flex-col gap-1.5">
        {APPLICATION_PASSWORD_REQUIREMENTS.map((requirement) => {
          const met = requirement.test(value);

          return (
            <li className="flex items-center gap-2" key={requirement.id}>
              {met ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <XIcon className="text-muted-foreground size-3.5" />
              )}
              <span
                className={cn(
                  "text-xs/relaxed",
                  met ? undefined : "text-muted-foreground"
                )}
              >
                {requirement.label}
                <span className="sr-only">
                  {met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { InputPasswordStrength };
export default InputPasswordStrength;
