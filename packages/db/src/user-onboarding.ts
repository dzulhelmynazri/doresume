import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

/**
 * Single-query counterpart to the per-field onboarding checks.
 *
 * Every onboarding field except the resume lives on the `user` row, so we read
 * them all at once instead of issuing one query per column. The resume check is
 * a storage lookup and stays with the caller (`userIsOnboarded`).
 */
export const userHasOnboardingProfile = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: {
      address: true,
      applicationPassword: true,
      applicationSettings: true,
      checklist: true,
      educationLevel: true,
      experienceLevel: true,
      industries: true,
      minimumSalary: true,
      workArrangement: true,
      workCountries: true,
      workType: true,
    },
    where: eq(user.id, userId),
  });

  if (!record) {
    return false;
  }

  return (
    Boolean(record.address?.trim()) &&
    Boolean(record.workCountries?.length) &&
    Boolean(record.checklist) &&
    Boolean(record.industries) &&
    Boolean(record.experienceLevel) &&
    Boolean(record.workType) &&
    Boolean(record.educationLevel) &&
    Boolean(record.workArrangement) &&
    Boolean(record.minimumSalary?.amount) &&
    Boolean(record.applicationPassword) &&
    Boolean(record.applicationSettings)
  );
};
