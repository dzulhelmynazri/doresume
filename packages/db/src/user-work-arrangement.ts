import type { WorkArrangement } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserWorkArrangement = async (
  userId: string,
  workArrangement: WorkArrangement
) => {
  await db.update(user).set({ workArrangement }).where(eq(user.id, userId));
};

export const userHasWorkArrangement = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { workArrangement: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.workArrangement);
};
