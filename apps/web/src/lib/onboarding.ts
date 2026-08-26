import { userHasApplicationPassword } from "@doresume/db/user-application-password";
import { userHasChecklist } from "@doresume/db/user-checklist";
import { userHasWorkEligibility } from "@doresume/db/user-eligibility";
import { userHasLocation } from "@doresume/db/user-location";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = async (userId: string) => {
  const [
    hasResume,
    hasLocation,
    hasWorkEligibility,
    hasChecklist,
    hasApplicationPassword,
  ] = await Promise.all([
    userHasResume(userId),
    userHasLocation(userId),
    userHasWorkEligibility(userId),
    userHasChecklist(userId),
    userHasApplicationPassword(userId),
  ]);

  return (
    hasResume &&
    hasLocation &&
    hasWorkEligibility &&
    hasChecklist &&
    hasApplicationPassword
  );
};
