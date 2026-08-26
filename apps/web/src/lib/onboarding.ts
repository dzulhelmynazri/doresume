import { userHasLocation } from "@doresume/db/user-location";

import { userHasResume } from "@/lib/resume";

export const userIsOnboarded = async (userId: string) => {
  const [hasResume, hasLocation] = await Promise.all([
    userHasResume(userId),
    userHasLocation(userId),
  ]);

  return hasResume && hasLocation;
};
