import { userHasWorkEligibility } from "@doresume/db/user-eligibility";
import { userHasLocation } from "@doresume/db/user-location";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = async (userId: string) => {
  const [hasResume, hasLocation, hasWorkEligibility] = await Promise.all([
    userHasResume(userId),
    userHasLocation(userId),
    userHasWorkEligibility(userId),
  ]);

  return hasResume && hasLocation && hasWorkEligibility;
};
