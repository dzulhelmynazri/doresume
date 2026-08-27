import { experienceLevelSchema } from "@doresume/contracts";
import { saveUserExperienceLevel } from "@doresume/db/user-experience-level";

import { protectedProcedure } from "../index";

export const saveExperienceLevel = protectedProcedure
  .input(experienceLevelSchema)
  .handler(async ({ context, input }) => {
    await saveUserExperienceLevel(
      context.session.user.id,
      input.experienceLevel
    );

    return { ok: true as const };
  });
