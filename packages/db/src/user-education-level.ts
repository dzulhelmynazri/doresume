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
