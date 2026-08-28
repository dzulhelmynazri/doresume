import { getUserChecklist } from "@doresume/db/user-checklist";
import { getUserWorkEligibility } from "@doresume/db/user-eligibility";
import { getUserMinimumSalary } from "@doresume/db/user-minimum-salary";

import { protectedProcedure } from "../index";

export const getAtsFormData = protectedProcedure.handler(
  async ({ context }) => {
    const userId = context.session.user.id;
    const [checklist, eligibility, minimumSalary] = await Promise.all([
      getUserChecklist(userId),
      getUserWorkEligibility(userId),
      getUserMinimumSalary(userId),
    ]);

    return { checklist, eligibility, minimumSalary };
  }
);
