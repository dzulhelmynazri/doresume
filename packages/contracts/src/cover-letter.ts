import { z } from "zod";

export const coverLetterSchema = z.object({
  body: z.string(),
  salutation: z.string(),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

export const PROFILE_DOCUMENT_TYPES = ["resume", "cover-letter"] as const;

export type ProfileDocumentType = (typeof PROFILE_DOCUMENT_TYPES)[number];

export const createDefaultCoverLetter = (): CoverLetter => ({
  body: "",
  salutation: "Dear Hiring Manager,",
});
