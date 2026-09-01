import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "./index";
import { jobPosting } from "./schema/job-posting";

export interface PostingInput {
  id: string;
  portal: string;
  externalId: string;
  title: string;
  url: string;
  company?: string;
  description?: string;
  educationRequirement?: string;
  employmentType?: string;
  industries?: string[];
  location?: string;
  postedAt?: Date;
  salaryMax?: number;
  salaryMin?: number;
  stateName?: string;
  titleTokens?: string[];
}

export const upsertPosting = async (input: PostingInput) => {
  const { id, ...rest } = input;
  await db
    .insert(jobPosting)
    .values({ id, ...rest })
    .onConflictDoUpdate({
      set: { ...rest, updatedAt: new Date() },
      target: [jobPosting.portal, jobPosting.externalId],
    });
};

export const listExistingExternalIds = async (
  portal: string,
  externalIds: string[]
) => {
  if (externalIds.length === 0) {
    return [];
  }

  const rows = await db
    .select({ externalId: jobPosting.externalId })
    .from(jobPosting)
    .where(
      and(
        eq(jobPosting.portal, portal),
        inArray(jobPosting.externalId, externalIds)
      )
    );

  return rows.map((row) => row.externalId);
};

export interface FeedFilters {
  industries: string[];
  portal: string;
  stateName: string | null;
  titleTokens: string[];
}

// Postgres array literal; the neon-http driver binds plain JS arrays as
// strings, so we cast an escaped literal instead.
const pgArray = (values: string[]) =>
  `{${values
    .map(
      (value) => `"${value.replaceAll(/(?<special>[\\"])/gu, "\\$<special>")}"`
    )
    .join(",")}}`;

// Indexed pre-filter for one user's feed: title-token overlap, same state,
// or mapped-industry overlap, scoped to one portal's catalog rows. Scoring
// happens on the returned rows.
export const candidatePostings = async (filters: FeedFilters, limit = 2000) => {
  const { industries, portal, stateName, titleTokens } = filters;

  const conditions = sql`(${jobPosting.portal} = ${portal} AND (
    ${jobPosting.titleTokens} && ${pgArray(titleTokens)}::text[]
    OR ${jobPosting.industries} && ${pgArray(industries)}::text[]
    ${stateName ? sql`OR ${jobPosting.stateName} = ${stateName}` : sql``}))`;

  return await db
    .select()
    .from(jobPosting)
    .where(conditions)
    .orderBy(desc(jobPosting.postedAt))
    .limit(limit);
};
