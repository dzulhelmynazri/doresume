import { minimumSalarySchema } from "@doresume/contracts";
import { saveUserMinimumSalary } from "@doresume/db/user-minimum-salary";

import { protectedProcedure } from "../index";

export const saveMinimumSalary = protectedProcedure
  .input(minimumSalarySchema)
  .handler(async ({ context, input }) => {
    await saveUserMinimumSalary(context.session.user.id, input);

    return { ok: true as const };
  });
