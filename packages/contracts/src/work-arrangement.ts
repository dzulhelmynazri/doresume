import { z } from "zod";

export const WORK_ARRANGEMENTS = ["remote", "hybrid", "on_site"] as const;

export const WORK_ARRANGEMENT_OPTIONS = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "on_site" },
] as const satisfies readonly {
  label: string;
  value: (typeof WORK_ARRANGEMENTS)[number];
}[];

export const workArrangementSchema = z.object({
  workArrangement: z.enum(WORK_ARRANGEMENTS, {
    error: "Select how you'd like to work.",
  }),
});

export type WorkArrangementForm = z.infer<typeof workArrangementSchema>;
export type WorkArrangement = (typeof WORK_ARRANGEMENTS)[number];
