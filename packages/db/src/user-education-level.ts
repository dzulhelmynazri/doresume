import type { EducationLevel } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserEducationLevel = async (
  userId: string,
  educationLevel: EducationLevel
) => {
  await db.update(user).set({ educationLevel }).where(eq(user.id, userId));
};

export const userHasEducationLevel = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { educationLevel: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.educationLevel);
};
