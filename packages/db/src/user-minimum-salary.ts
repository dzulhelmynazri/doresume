import type { MinimumSalary } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserMinimumSalary = async (
  userId: string,
  minimumSalary: MinimumSalary
) => {
  await db.update(user).set({ minimumSalary }).where(eq(user.id, userId));
};

export const userHasMinimumSalary = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { minimumSalary: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.minimumSalary?.amount);
};
