import { workArrangementSchema } from "@doresume/contracts";
import { saveUserWorkArrangement } from "@doresume/db/user-work-arrangement";

import { protectedProcedure } from "../index";

export const saveWorkArrangement = protectedProcedure
  .input(workArrangementSchema)
  .handler(async ({ context, input }) => {
    await saveUserWorkArrangement(
      context.session.user.id,
      input.workArrangement
    );

    return { ok: true as const };
  });
