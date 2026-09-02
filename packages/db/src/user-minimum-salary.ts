import { minimumSalarySchema } from "@doresume/contracts";
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

export const getUserMinimumSalary = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { minimumSalary: true },
    where: eq(user.id, userId),
  });

  if (!record?.minimumSalary) {
    return null;
  }

  const parsed = minimumSalarySchema.safeParse(record.minimumSalary);

  return parsed.success ? parsed.data : null;
};
