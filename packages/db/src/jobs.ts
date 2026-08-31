import { desc, eq } from "drizzle-orm";

import { db } from "./index";
import { job } from "./schema/job";

export interface SaveJobInput {
  id: string;
  company?: string;
  description?: string;
  location?: string;
  portal?: string;
  postedAt?: Date;
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
      target: job.url,
    });
};

export const getJob = async (id: string) => {
  const record = await db.query.job.findFirst({
    where: eq(job.id, id),
  });
  return record ?? null;
};

export const listJobs = async (limit = 50) => {
  const records = await db.query.job.findMany({
    limit,
    orderBy: desc(job.createdAt),
  });
  return records;
};
