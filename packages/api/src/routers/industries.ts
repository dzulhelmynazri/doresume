import { industriesSchema } from "@doresume/contracts";
import { saveUserIndustries } from "@doresume/db/user-industries";

import { protectedProcedure } from "../index";

export const saveIndustries = protectedProcedure
  .input(industriesSchema)
  .handler(async ({ context, input }) => {
    await saveUserIndustries(context.session.user.id, input);

    return { ok: true as const };
  });
