import { userHasApplicationPassword } from "@doresume/db/user-application-password";
import { userHasApplicationSettings } from "@doresume/db/user-application-settings";
import { userHasChecklist } from "@doresume/db/user-checklist";
import { userHasEducationLevel } from "@doresume/db/user-education-level";
import { userHasWorkEligibility } from "@doresume/db/user-eligibility";
import { userHasExperienceLevel } from "@doresume/db/user-experience-level";
import { userHasIndustries } from "@doresume/db/user-industries";
import { userHasLocation } from "@doresume/db/user-location";
import { userHasWorkArrangement } from "@doresume/db/user-work-arrangement";
import { userHasWorkType } from "@doresume/db/user-work-type";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = async (userId: string) => {
  const [
    hasResume,
    hasLocation,
    hasWorkEligibility,
    hasChecklist,
    hasIndustries,
    hasExperienceLevel,
    hasWorkType,
    hasEducationLevel,
    hasWorkArrangement,
    hasApplicationPassword,
    hasApplicationSettings,
  ] = await Promise.all([
    userHasResume(userId),
    userHasLocation(userId),
    userHasWorkEligibility(userId),
    userHasChecklist(userId),
    userHasIndustries(userId),
    userHasExperienceLevel(userId),
    userHasWorkType(userId),
    userHasEducationLevel(userId),
    userHasWorkArrangement(userId),
    userHasApplicationPassword(userId),
    userHasApplicationSettings(userId),
  ]);

  return (
    hasResume &&
    hasLocation &&
    hasWorkEligibility &&
    hasChecklist &&
    hasIndustries &&
    hasExperienceLevel &&
    hasWorkType &&
    hasEducationLevel &&
    hasWorkArrangement &&
    hasApplicationPassword &&
    hasApplicationSettings
  );
};
