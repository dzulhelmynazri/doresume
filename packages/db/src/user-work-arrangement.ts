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
