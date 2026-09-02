import { z } from "zod";

export const jobDescriptionSectionSchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()),
});

export type JobDescriptionSection = z.infer<typeof jobDescriptionSectionSchema>;
