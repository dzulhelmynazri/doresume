import { getJob, listJobs } from "@doresume/db/jobs";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const getJobProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => await getJob(input.id));

export const listJobsProcedure = protectedProcedure
  .input(
    z.object({ limit: z.number().int().min(1).max(100).optional() }).optional()
  )
  .handler(
    async ({ context, input }) =>
      await listJobs(context.session.user.id, input?.limit)
  );
