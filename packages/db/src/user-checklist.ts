import type { Checklist } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserChecklist = async (
  userId: string,
  checklist: Checklist
) => {
  await db.update(user).set({ checklist }).where(eq(user.id, userId));
};

export const userHasChecklist = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { checklist: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.checklist);
};
