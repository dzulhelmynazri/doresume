import { z } from "zod";

export const AUTHORIZATION_BASES = [
  "citizen",
  "other",
  "permanent_resident",
  "temporary_work_authorization",
] as const;

export const AUTHORIZATION_STATUSES = [
  "expired",
  "expiring_soon",
  "not_applicable",
  "pending",
  "valid",
] as const;

export const needsAuthorizationDetails = (basis: string) =>
  basis === "other" || basis === "temporary_work_authorization";

export const yesNoSchema = z.enum(["no", "yes"], {
  error: "Choose yes or no.",
});

const authorizationStatusDraftSchema = z.union([
  z.enum(AUTHORIZATION_STATUSES),
  z.literal(""),
]);

export const workCountrySchema = z
  .object({
    authorizationBasis: z.enum(AUTHORIZATION_BASES, {
      error: "Select a status.",
    }),
    authorizationStatus: authorizationStatusDraftSchema,
    authorized: yesNoSchema,
    country: z
      .string()
      .length(2, "Select a country.")
      .regex(/^[A-Z]{2}$/u, "Select a country."),
    requiresSponsorship: yesNoSchema,
    visaType: z.string(),
  })
  .superRefine((value, ctx) => {
    if (!needsAuthorizationDetails(value.authorizationBasis)) {
      return;
    }

    if (value.visaType.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Enter the document or category.",
        path: ["visaType"],
      });
    }

    if (value.authorizationStatus === "") {
      ctx.addIssue({
        code: "custom",
        message: "Select a status.",
        path: ["authorizationStatus"],
      });
    }
  });

export const workEligibilitySchema = z.object({
  citizenship: z.array(
    z
      .string()
      .length(2, "Select a country.")
      .regex(/^[A-Z]{2}$/u, "Select a country.")
  ),
  workCountries: z
    .array(workCountrySchema)
    .min(1, "Add a country where you want to work."),
});

export type AuthorizationBasis = (typeof AUTHORIZATION_BASES)[number];
export type AuthorizationStatus = (typeof AUTHORIZATION_STATUSES)[number];
export type WorkCountry = z.infer<typeof workCountrySchema>;
export type WorkEligibility = z.infer<typeof workEligibilitySchema>;
