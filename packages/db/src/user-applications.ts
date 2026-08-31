import { and, desc, eq } from "drizzle-orm";

import { db } from "./index";
import { application } from "./schema/application";

export type ApplicationStatus = "pending" | "submitted" | "failed";

export interface SaveApplicationInput {
  id: string;
  userId: string;
  companyName?: string;
  confirmationUrl?: string;
  jobTitle?: string;
  jobUrl?: string;
  formSnapshot?: Record<string, unknown>;
  portal?: string;
  status?: ApplicationStatus;
}

export const saveApplication = async (input: SaveApplicationInput) => {
  const { id, userId, ...rest } = input;
  await db
    .insert(application)
    .values({ id, userId, ...rest })
    .onConflictDoUpdate({
      set: { ...rest, updatedAt: new Date() },
      target: application.id,
    });
};

export const getApplication = async (id: string, userId: string) => {
  const record = await db.query.application.findFirst({
    where: and(eq(application.id, id), eq(application.userId, userId)),
  });
  return record ?? null;
};

export const listApplications = async (userId: string) => {
  const records = await db.query.application.findMany({
    orderBy: desc(application.createdAt),
    where: eq(application.userId, userId),
  });
  return records;
};

export const updateApplicationStatus = async (
  id: string,
  userId: string,
  status: ApplicationStatus
) => {
  await db
    .update(application)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(application.id, id), eq(application.userId, userId)));
};

export interface ApplicationOutcome {
  confirmationUrl?: string;
  portal?: string;
  status: ApplicationStatus;
}

/**
 * Agent-side write path: apply-agent records the submission outcome on an
 * application it was asked to process. Ownership was already checked when the
 * user triggered the application, so this updates by id alone.
 */
export const updateApplicationOutcome = async (
  id: string,
  outcome: ApplicationOutcome
) => {
  await db
    .update(application)
    .set({ ...outcome, updatedAt: new Date() })
    .where(eq(application.id, id));
};
