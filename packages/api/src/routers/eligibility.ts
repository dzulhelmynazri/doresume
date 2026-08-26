import { workEligibilitySchema } from "@doresume/contracts";
import { saveUserWorkEligibility } from "@doresume/db/user-eligibility";

import { protectedProcedure } from "../index";

export const saveWorkEligibility = protectedProcedure
  .input(workEligibilitySchema)
  .handler(async ({ context, input }) => {
    await saveUserWorkEligibility(context.session.user.id, input);

    return { ok: true as const };
  });
