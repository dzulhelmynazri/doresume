import { z } from "zod";

export const RESUME_OPTIMIZATION_MODES = [
  "aggressive",
  "honest",
  "off",
] as const;

export const applicationSettingsSchema = z.object({
  autoApproveEdits: z.boolean(),
  resumeOptimization: z.enum(RESUME_OPTIMIZATION_MODES),
  reviewBeforeSubmit: z.boolean(),
});

export type ApplicationSettings = z.infer<typeof applicationSettingsSchema>;
export type ResumeOptimization = (typeof RESUME_OPTIMIZATION_MODES)[number];
