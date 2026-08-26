import { z } from "zod";

import { yesNoSchema } from "./eligibility";

export const DISABILITY_STATUSES = [
  "do_not_wish_to_answer",
  "no",
  "yes",
] as const;

export const GENDERS = [
  "female",
  "male",
  "non_binary",
  "prefer_not_to_say",
] as const;

export const RACES = [
  "american_indian_or_alaska_native",
  "asian",
  "black_or_african_american",
  "hispanic_or_latino",
  "native_hawaiian_or_other_pacific_islander",
  "prefer_not_to_say",
  "two_or_more_races",
  "white",
] as const;

export const VETERAN_STATUSES = [
  "do_not_wish_to_answer",
  "not_protected_veteran",
  "protected_veteran",
] as const;

export const checklistSchema = z.object({
  activeClearance: yesNoSchema,
  additionalInfo: z.string(),
  canStartImmediately: yesNoSchema,
  disabilityStatus: z.union([z.enum(DISABILITY_STATUSES), z.literal("")]),
  familyTiesForeignGovernments: yesNoSchema,
  gender: z.union([z.enum(GENDERS), z.literal("")]),
  needsAccommodations: yesNoSchema,
  openToInPerson: yesNoSchema,
  raceEthnicity: z.union([z.enum(RACES), z.literal("")]),
  reliableTransportation: yesNoSchema,
  veteranStatus: z.union([z.enum(VETERAN_STATUSES), z.literal("")]),
  willingToRelocate: yesNoSchema,
});

export type Checklist = z.infer<typeof checklistSchema>;
export type DisabilityStatus = (typeof DISABILITY_STATUSES)[number];
export type Gender = (typeof GENDERS)[number];
export type RaceEthnicity = (typeof RACES)[number];
export type VeteranStatus = (typeof VETERAN_STATUSES)[number];
