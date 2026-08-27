import { educationLevelSchema } from "@doresume/contracts";
import { saveUserEducationLevel } from "@doresume/db/user-education-level";

import { protectedProcedure } from "../index";

export const saveEducationLevel = protectedProcedure
  .input(educationLevelSchema)
  .handler(async ({ context, input }) => {
    await saveUserEducationLevel(context.session.user.id, input.educationLevel);

    return { ok: true as const };
  });
