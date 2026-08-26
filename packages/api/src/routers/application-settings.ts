import { applicationSettingsSchema } from "@doresume/contracts";
import { saveUserApplicationSettings } from "@doresume/db/user-application-settings";

import { protectedProcedure } from "../index";

export const saveApplicationSettings = protectedProcedure
  .input(applicationSettingsSchema)
  .handler(async ({ context, input }) => {
    await saveUserApplicationSettings(context.session.user.id, input);

    return { ok: true as const };
  });
