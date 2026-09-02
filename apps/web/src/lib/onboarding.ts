import { userHasOnboardingProfile } from "@doresume/db/user-onboarding";
import { cache } from "react";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = cache(async (userId: string) => {
  const [hasResume, hasProfile] = await Promise.all([
    userHasResume(userId),
    userHasOnboardingProfile(userId),
  ]);

  return hasResume && hasProfile;
});
