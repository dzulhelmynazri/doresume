import { resumeProfilesStateSchema } from "@doresume/contracts";
import {
  getUserResumeProfiles,
  saveUserResumeProfiles,
} from "@doresume/db/user-resume-document";

import { protectedProcedure } from "../index";

export const getResumeProfiles = protectedProcedure.handler(
  async ({ context }) => {
    const profiles = await getUserResumeProfiles(context.session.user.id);

    return { profiles };
  }
);

export const saveResumeProfiles = protectedProcedure
  .input(resumeProfilesStateSchema)
  .handler(async ({ context, input }) => {
    await saveUserResumeProfiles(context.session.user.id, input);

    return { ok: true as const };
  });
