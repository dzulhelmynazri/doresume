import { z } from "zod";

export const APPLICATION_PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 12 characters",
    test: (value: string) => value.length >= 12,
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (value: string) => /[a-z]/u.test(value),
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (value: string) => /[A-Z]/u.test(value),
  },
  {
    id: "number",
    label: "At least one number",
    test: (value: string) => /\d/u.test(value),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (value: string) => /[^A-Za-z0-9]/u.test(value),
  },
] as const;

export const applicationPasswordSchema = z.object({
  password: z.string().superRefine((value, ctx) => {
    const unmet = APPLICATION_PASSWORD_REQUIREMENTS.some(
      (requirement) => !requirement.test(value)
    );

    if (unmet) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a password that meets every requirement.",
      });
    }
  }),
});

export type ApplicationPassword = z.infer<typeof applicationPasswordSchema>;
