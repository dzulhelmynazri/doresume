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
