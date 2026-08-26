import type { WorkEligibility } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserWorkEligibility = async (
  userId: string,
  eligibility: WorkEligibility
) => {
  await db
    .update(user)
    .set({
      citizenship: eligibility.citizenship,
      workCountries: eligibility.workCountries,
    })
    .where(eq(user.id, userId));
};

export const userHasWorkEligibility = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { workCountries: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.workCountries?.length);
};
