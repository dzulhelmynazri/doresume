import type { Location } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export const saveUserLocation = async (userId: string, location: Location) => {
  await db
    .update(user)
    .set({
      address: location.address,
      city: location.city,
      country: location.country,
      state: location.state,
      zip: location.zip,
    })
    .where(eq(user.id, userId));
};

export const userHasLocation = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { address: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.address?.trim());
};
