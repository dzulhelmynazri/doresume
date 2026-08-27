import { z } from "zod";

export const EDUCATION_LEVELS = [
  "no_formal",
  "highschool",
  "diploma",
  "bachelors",
  "masters_or_higher",
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  { label: "No formal education", value: "no_formal" },
  { label: "Highschool", value: "highschool" },
  { label: "Diploma", value: "diploma" },
  { label: "Bachelor's Degree", value: "bachelors" },
  { label: "Master's or Higher", value: "masters_or_higher" },
] as const satisfies readonly {
  label: string;
  value: (typeof EDUCATION_LEVELS)[number];
}[];

export const educationLevelSchema = z.object({
  educationLevel: z.enum(EDUCATION_LEVELS, {
    error: "Select an education level.",
  }),
});

export type EducationLevelForm = z.infer<typeof educationLevelSchema>;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];
