import { jobDescriptionSectionSchema } from "@doresume/contracts";
import { saveJob } from "@doresume/db/jobs";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Store a crawled job posting that matches the user's profile so it appears in their jobs feed. Provide the user id of the profile the job was matched for. Duplicate URLs for the same user update the existing posting instead of creating a new one.",
  async execute({ postedAt, ...jobInput }) {
    await saveJob({
      ...jobInput,
      id: crypto.randomUUID(),
      postedAt: postedAt ? new Date(postedAt) : undefined,
    });
    return { ok: true };
  },
  inputSchema: z.object({
    company: z.string().optional(),
    descriptionSections: z
      .array(jobDescriptionSectionSchema)
      .describe(
        "Structured job description sections, each with a heading and paragraph list."
      )
      .optional(),
    employmentType: z
      .string()
      .describe(
        "Employment type as posted, for example Full Time, Part Time, Contract, or Internship."
      )
      .optional(),
    location: z.string().optional(),
    matchPercent: z
      .number()
      .int()
      .max(100)
      .min(0)
      .describe(
        "How well the posting fits the user's profile, 0 to 100, based on role, experience level, industries, work type and arrangement, location, and minimum salary."
      )
      .optional(),
    portal: z.string().optional(),
    postedAt: z.iso.datetime().optional(),
    salaryMax: z
      .number()
      .int()
      .describe("Top of the posted salary range, annualized in whole dollars.")
      .optional(),
    salaryMin: z
      .number()
      .int()
      .describe(
        "Bottom of the posted salary range, annualized in whole dollars."
      )
      .optional(),
    seniority: z
      .string()
      .describe(
        "Seniority level, for example Intern, Junior, Mid-level, Senior, Staff, or Lead."
      )
      .optional(),
    title: z.string().min(1),
    url: z.url(),
    userId: z
      .string()
      .min(1)
      .describe("User id of the profile this posting was matched for."),
  }),
});
