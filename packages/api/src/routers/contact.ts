import { contactSchema } from "@doresume/contracts";
import { saveUserContact } from "@doresume/db/user-contact";

import { protectedProcedure } from "../index";

export const saveContact = protectedProcedure
  .input(contactSchema)
  .handler(async ({ context, input }) => {
    await saveUserContact(context.session.user.id, input);

    return { ok: true as const };
  });
