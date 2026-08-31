import { saveJob } from "@doresume/db/jobs";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Store a crawled job posting that matches the user's profile so it appears in their jobs feed. Duplicate URLs update the existing posting instead of creating a new one.",
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
    description: z.string().optional(),
    location: z.string().optional(),
    portal: z.string().optional(),
    postedAt: z.iso.datetime().optional(),
    title: z.string().min(1),
    url: z.url(),
  }),
});
