import type { RouterClient } from "@orpc/server";

import { saveApplicationPassword } from "./application-password";
import { saveApplicationSettings } from "./application-settings";
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
  saveApplicationSettings,
  saveChecklist,
  saveContact,
  saveLocation,
  saveWorkEligibility,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
