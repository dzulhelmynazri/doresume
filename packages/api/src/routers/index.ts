import type { RouterClient } from "@orpc/server";

import {
  getApplicationPassword,
  saveApplicationPassword,
} from "./application-password";
import {
  getApplicationSettings,
  saveApplicationSettings,
} from "./application-settings";
import {
  getApplicationProcedure,
  listApplicationsProcedure,
} from "./applications";
import { getAtsFormData } from "./ats-form";
import { saveChecklist } from "./checklist";
import { saveContact } from "./contact";
import { getDocuments, saveDocuments } from "./documents";
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
import { parseResume } from "./parse-resume";
import { privateData } from "./private-data";
import { getResumeDocument, saveResumeDocument } from "./resume-document";
import { saveWorkArrangement } from "./work-arrangement";
import { saveWorkType } from "./work-type";

export const appRouter = {
  connectIntegration,
  disconnectIntegration,
  getApplication: getApplicationProcedure,
  getApplicationPassword,
  getApplicationSettings,
  getAtsFormData,
  getConnections,
  getDocuments,
  getResumeDocument,
  healthCheck,
  listApplications: listApplicationsProcedure,
  parseResume,
  privateData,
  saveApplicationPassword,
  saveApplicationSettings,
  saveChecklist,
  saveContact,
  saveDocuments,
  saveEducationLevel,
  saveExperienceLevel,
  saveIndustries,
  saveLocation,
  saveMinimumSalary,
  saveResumeDocument,
  saveWorkArrangement,
  saveWorkEligibility,
  saveWorkType,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
