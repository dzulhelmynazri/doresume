import type { WorkType } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserWorkType = async (userId: string, workType: WorkType) => {
  await db.update(user).set({ workType }).where(eq(user.id, userId));
};
