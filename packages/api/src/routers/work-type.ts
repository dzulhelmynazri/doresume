import { workTypeSchema } from "@doresume/contracts";
import { saveUserWorkType } from "@doresume/db/user-work-type";

import { protectedProcedure } from "../index";

export const saveWorkType = protectedProcedure
  .input(workTypeSchema)
  .handler(async ({ context, input }) => {
    await saveUserWorkType(context.session.user.id, input.workType);

    return { ok: true as const };
  });
