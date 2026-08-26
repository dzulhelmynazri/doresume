import { checklistSchema } from "@doresume/contracts";
import { saveUserChecklist } from "@doresume/db/user-checklist";

import { protectedProcedure } from "../index";

export const saveChecklist = protectedProcedure
  .input(checklistSchema)
  .handler(async ({ context, input }) => {
    await saveUserChecklist(context.session.user.id, input);

    return { ok: true as const };
  });
