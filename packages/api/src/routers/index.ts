import type { RouterClient } from "@orpc/server";

import { saveContact } from "./contact";
import { saveWorkEligibility } from "./eligibility";
import { healthCheck } from "./health";
import { saveLocation } from "./location";
import { privateData } from "./private-data";

export const appRouter = {
  healthCheck,
  privateData,
  saveContact,
  saveLocation,
  saveWorkEligibility,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
