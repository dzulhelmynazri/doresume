import { z } from "zod";

export const WORK_TYPES = [
  "full_time",
  "part_time",
  "contract_freelance",
  "open_to_anything",
] as const;

export const WORK_TYPE_OPTIONS = [
  { label: "Full-time", value: "full_time" },
  { label: "Part-time", value: "part_time" },
  { label: "Contract / Freelance", value: "contract_freelance" },
  { label: "Open to anything", value: "open_to_anything" },
] as const satisfies readonly {
  label: string;
  value: (typeof WORK_TYPES)[number];
}[];

export const workTypeSchema = z.object({
  workType: z.enum(WORK_TYPES, {
    error: "Select a work type.",
  }),
});

export type WorkTypeForm = z.infer<typeof workTypeSchema>;
export type WorkType = (typeof WORK_TYPES)[number];
