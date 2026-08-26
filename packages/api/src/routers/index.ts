import type { RouterClient } from "@orpc/server";

import { saveApplicationPassword } from "./application-password";
import { saveChecklist } from "./checklist";
import { saveContact } from "./contact";
import { saveWorkEligibility } from "./eligibility";
import { healthCheck } from "./health";
import { saveLocation } from "./location";
import { privateData } from "./private-data";

export const appRouter = {
  healthCheck,
  privateData,
  saveApplicationPassword,
  saveChecklist,
  saveContact,
  saveLocation,
  saveWorkEligibility,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
