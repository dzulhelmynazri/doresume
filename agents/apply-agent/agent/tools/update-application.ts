import { updateApplicationOutcome } from "@doresume/db/user-applications";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Persist the outcome of a job application you processed: which portal was used, whether it was submitted or failed, and the confirmation URL when available.",
  async execute({ confirmationUrl, id, portal, status }) {
    await updateApplicationOutcome(id, {
      confirmationUrl,
      portal,
      status,
    });
    return { ok: true };
  },
  inputSchema: z.object({
    confirmationUrl: z.string().optional(),
    id: z.string().min(1),
    portal: z.string().min(1),
    status: z.enum(["failed", "submitted"]),
  }),
});
