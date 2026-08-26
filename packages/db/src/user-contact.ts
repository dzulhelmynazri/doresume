import type { Contact } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserContact = async (userId: string, contact: Contact) => {
  await db
    .update(user)
    .set({
      linkedin: contact.linkedin || null,
      phone: contact.phone || null,
    })
    .where(eq(user.id, userId));
};
