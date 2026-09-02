import { userHasOnboardingProfile } from "@doresume/db/user-onboarding";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = async (userId: string) => {
  const [hasResume, hasProfile] = await Promise.all([
    userHasResume(userId),
    userHasOnboardingProfile(userId),
  ]);

  return hasResume && hasProfile;
};
