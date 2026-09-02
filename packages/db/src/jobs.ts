import type { JobDescriptionSection } from "@doresume/contracts";
import { and, desc, eq, notInArray, sql } from "drizzle-orm";

import { db } from "./index";
import { job } from "./schema/job";

export interface SaveJobInput {
  id: string;
  userId: string;
  company?: string;
  descriptionSections?: JobDescriptionSection[];
  employmentType?: string;
  location?: string;
  matchPercent?: number;
  portal?: string;
  postedAt?: Date;
  postingId?: string;
  salaryMax?: number;
  salaryMin?: number;
  seniority?: string;
  title: string;
  url: string;
}

export const saveJob = async (input: SaveJobInput) => {
  const { id, ...rest } = input;
  await db
    .insert(job)
    .values({ id, ...rest })
    .onConflictDoUpdate({
      set: { ...rest, updatedAt: new Date() },
      target: [job.url, job.userId],
    });
};

export const getJob = async (id: string) => {
  const record = await db.query.job.findFirst({
    where: eq(job.id, id),
  });
  return record ?? null;
};

export const listJobs = async (userId: string, limit = 50) => {
  const records = await db.query.job.findMany({
    limit,
    orderBy: [sql`${job.matchPercent} desc nulls last`, desc(job.createdAt)],
    where: eq(job.userId, userId),
  });
  return records;
};

// Drops a user's portal rows that fell out of their regenerated feed.
export const pruneUserPortalJobs = async (
  userId: string,
  portal: string,
  keepIds: string[]
) => {
  await db
    .delete(job)
    .where(
      and(
        eq(job.userId, userId),
        eq(job.portal, portal),
        keepIds.length > 0 ? notInArray(job.id, keepIds) : undefined
      )
    );
};
