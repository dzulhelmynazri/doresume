import { applicationPasswordSchema } from "@doresume/contracts";
import {
  getUserApplicationPassword,
  saveUserApplicationPassword,
} from "@doresume/db/user-application-password";

import { protectedProcedure } from "../index";

export const getApplicationPassword = protectedProcedure.handler(
  async ({ context }) => ({
    password: (await getUserApplicationPassword(context.session.user.id)) ?? "",
  })
);

export const saveApplicationPassword = protectedProcedure
  .input(applicationPasswordSchema)
  .handler(async ({ context, input }) => {
    await saveUserApplicationPassword(context.session.user.id, input.password);

    return { ok: true as const };
  });
