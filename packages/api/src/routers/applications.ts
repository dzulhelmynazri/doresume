import {
  getApplication,
  listApplications,
} from "@doresume/db/user-applications";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const getApplicationProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    const userId = context.session.user.id;
    const record = await getApplication(input.id, userId);
    return record;
  });

export const listApplicationsProcedure = protectedProcedure.handler(
  async ({ context }) => {
    const userId = context.session.user.id;
    const records = await listApplications(userId);
    return records;
  }
);
