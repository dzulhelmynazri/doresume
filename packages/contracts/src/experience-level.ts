import { z } from "zod";

export const EXPERIENCE_LEVELS = [
  "entry",
  "mid",
  "senior",
  "leadership",
  "not_sure",
] as const;

export const EXPERIENCE_LEVEL_OPTIONS = [
  {
    description: "Starting out or early in my career",
    label: "Entry-level",
    value: "entry",
  },
  {
    description: "A few years of experience in the field",
    label: "Mid-level",
    value: "mid",
  },
  {
    description: "Significant experience to lead projects or teams",
    label: "Senior",
    value: "senior",
  },
  {
    description: "Director, VP, or C-level",
    label: "Leadership",
    value: "leadership",
  },
  {
    description: "Help me figure it out",
    label: "Not sure",
    value: "not_sure",
  },
] as const satisfies readonly {
  description: string;
  label: string;
  value: (typeof EXPERIENCE_LEVELS)[number];
}[];

export const experienceLevelSchema = z.object({
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    error: "Select an experience level.",
  }),
});

export type ExperienceLevelForm = z.infer<typeof experienceLevelSchema>;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
