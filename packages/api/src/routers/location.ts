import { locationSchema } from "@doresume/contracts";
import { saveUserLocation } from "@doresume/db/user-location";

import { protectedProcedure } from "../index";

export const saveLocation = protectedProcedure
  .input(locationSchema)
  .handler(async ({ context, input }) => {
    await saveUserLocation(context.session.user.id, input);

    return { ok: true as const };
  });
