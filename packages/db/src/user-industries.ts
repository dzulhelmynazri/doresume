import type { Industries } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserIndustries = async (
  userId: string,
  industries: Industries
) => {
  await db.update(user).set({ industries }).where(eq(user.id, userId));
};

export const userHasIndustries = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { industries: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.industries);
};
