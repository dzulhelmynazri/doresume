import { and, desc, eq } from "drizzle-orm";

import { db } from "./index";
import { application } from "./schema/auth";

export type ApplicationStatus = "pending" | "submitted" | "failed";

export interface SaveApplicationInput {
  id: string;
  userId: string;
  companyName?: string;
  jobTitle?: string;
  jobUrl?: string;
  formSnapshot?: Record<string, unknown>;
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
