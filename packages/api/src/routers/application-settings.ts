import { applicationSettingsSchema } from "@doresume/contracts";
import {
  saveUserApplicationSettings,
  getUserApplicationSettings,
} from "@doresume/db/user-application-settings";

import { protectedProcedure } from "../index";

export const getApplicationSettings = protectedProcedure.handler(
  async ({ context }) => ({
    settings: await getUserApplicationSettings(context.session.user.id),
  })
);

export const saveApplicationSettings = protectedProcedure
  .input(applicationSettingsSchema)
  .handler(async ({ context, input }) => {
    await saveUserApplicationSettings(context.session.user.id, input);

    return { ok: true as const };
  });
