import { checklistSchema } from "@doresume/contracts";
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

export const getUserChecklist = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { checklist: true },
    where: eq(user.id, userId),
  });

  if (!record?.checklist) {
    return null;
  }

  const parsed = checklistSchema.safeParse(record.checklist);

  return parsed.success ? parsed.data : null;
};
