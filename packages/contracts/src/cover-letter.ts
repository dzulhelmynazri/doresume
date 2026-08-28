import { z } from "zod";

export const coverLetterSchema = z.object({
  body: z.string(),
  salutation: z.string(),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

export const DOCUMENT_KINDS = ["resume", "cover-letter"] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const createDefaultCoverLetter = (): CoverLetter => ({
  body: "",
  salutation: "Dear Hiring Manager,",
});
