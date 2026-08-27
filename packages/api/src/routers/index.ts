import type { RouterClient } from "@orpc/server";

import { saveApplicationPassword } from "./application-password";
import { saveApplicationSettings } from "./application-settings";
import { saveChecklist } from "./checklist";
import { saveContact } from "./contact";
import { saveEducationLevel } from "./education-level";
import { saveWorkEligibility } from "./eligibility";
import { saveExperienceLevel } from "./experience-level";
import { healthCheck } from "./health";
import { saveIndustries } from "./industries";
import {
  connectIntegration,
  disconnectIntegration,
  getConnections,
} from "./integrations";
import { saveLocation } from "./location";
import { saveMinimumSalary } from "./minimum-salary";
import { privateData } from "./private-data";
import { saveWorkArrangement } from "./work-arrangement";
import { saveWorkType } from "./work-type";

export const appRouter = {
  connectIntegration,
  disconnectIntegration,
  getConnections,
  healthCheck,
  privateData,
  saveApplicationPassword,
  saveApplicationSettings,
  saveChecklist,
  saveContact,
  saveEducationLevel,
  saveExperienceLevel,
  saveIndustries,
  saveLocation,
  saveMinimumSalary,
  saveWorkArrangement,
  saveWorkEligibility,
  saveWorkType,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
