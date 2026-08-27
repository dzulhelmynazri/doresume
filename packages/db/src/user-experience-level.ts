import type { ExperienceLevel } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserExperienceLevel = async (
  userId: string,
  experienceLevel: ExperienceLevel
) => {
  await db.update(user).set({ experienceLevel }).where(eq(user.id, userId));
};

export const userHasExperienceLevel = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { experienceLevel: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.experienceLevel);
};
