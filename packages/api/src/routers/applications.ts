import {
  getApplication,
  listApplications,
  saveApplication,
} from "@doresume/db/user-applications";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

import { checkFeatureAccess, getFeatureBalance, trackUsage } from "../autumn";
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

export const saveApplicationProcedure = protectedProcedure
  .input(
    z.object({
      companyName: z.string().optional(),
      id: z.string(),
      jobTitle: z.string().optional(),
      jobUrl: z.string().optional(),
    })
  )
  .handler(async ({ context, input }) => {
    const userId = context.session.user.id;

    const { allowed } = await checkFeatureAccess(userId, "applications");

    if (!allowed) {
      throw new ORPCError("PAYMENT_REQUIRED", {
        message: "Application limit reached. Upgrade your plan.",
      });
    }

    await saveApplication({
      companyName: input.companyName,
      id: input.id,
      jobTitle: input.jobTitle,
      jobUrl: input.jobUrl,
      userId,
    });

    await trackUsage(userId, "applications");
  });

export const getUsageBalanceProcedure = protectedProcedure.handler(
  ({ context }) => {
    const userId = context.session.user.id;
    return getFeatureBalance(userId, "applications");
  }
);
