import type { WorkType } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserWorkType = async (userId: string, workType: WorkType) => {
  await db.update(user).set({ workType }).where(eq(user.id, userId));
};

export const userHasWorkType = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { workType: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.workType);
};
