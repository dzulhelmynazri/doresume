import {
  getUserOnboardingState,
  userHasOnboardingProfile,
} from "@doresume/db/user-onboarding";
import { cache } from "react";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = cache(async (userId: string) => {
  const [hasResume, hasProfile] = await Promise.all([
    userHasResume(userId),
    userHasOnboardingProfile(userId),
  ]);

  return hasResume && hasProfile;
});

// Cached per-request so the server component and any downstream RSCs share
// one DB round-trip even when the onboarding page re-renders (e.g. after an
// OAuth redirect back from inbox connect).
export const getOnboardingState = cache((userId: string) =>
  getUserOnboardingState(userId)
);
