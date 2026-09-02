// Portal-agnostic feed generation: scores one portal's catalog rows against
// a user profile and materializes the top matches into the user's job rows.
// Each portal adapter crawls into the shared catalog, then calls this.
import type { Industry } from "@doresume/contracts";
import { pruneUserPortalJobs, saveJob } from "@doresume/db/jobs";
import { candidatePostings } from "@doresume/db/postings";

import {
  listJobSeekerIds,
  loadProfile,
  scoreJob,
  tokenizeTitle,
} from "./match";

const FEED_CAP = 100;
const MATCH_THRESHOLD = 25;

// Per-user feed: indexed candidate query over one portal's catalog,
// deterministic score, top matches materialized into the user's job rows.
export const generateFeed = async (portal: string, userId: string) => {
  const profile = await loadProfile(userId);
  const titleTokens = [...new Set(profile.resumeTitles.flatMap(tokenizeTitle))];
  const industries = profile.industries?.industries ?? [];

  const candidates = await candidatePostings({
    industries,
    portal,
    stateName: profile.state,
    titleTokens,
  });

  const scored = candidates
    .map((posting) => ({
      percent: scoreJob(profile, {
        educationRequirement: posting.educationRequirement,
        employmentType: posting.employmentType,
        industries: posting.industries as Industry[],
        salaryMax: posting.salaryMax,
        stateName: posting.stateName,
        title: posting.title,
      }).percent,
      posting,
    }))
    .filter((entry) => entry.percent >= MATCH_THRESHOLD)
    .toSorted((a, b) => b.percent - a.percent)
    .slice(0, FEED_CAP);

  await Promise.all(
    scored.map(({ percent, posting }) =>
      saveJob({
        company: posting.company ?? undefined,
        descriptionSections: posting.descriptionSections ?? undefined,
        employmentType: posting.employmentType ?? undefined,
        id: posting.externalId,
        location: posting.location ?? undefined,
        matchPercent: percent,
        portal,
        postedAt: posting.postedAt ?? undefined,
        postingId: posting.id,
        salaryMax: posting.salaryMax ?? undefined,
        salaryMin: posting.salaryMin ?? undefined,
        title: posting.title,
        url: posting.url,
        userId,
      })
    )
  );

  await pruneUserPortalJobs(
    userId,
    portal,
    scored.map(({ posting }) => posting.externalId)
  );
  console.log(
    `Feed for ${userId} (${portal}): ${scored.length} matches out of ${candidates.length} candidates`
  );
};

// Sequential to keep feed logs readable and DB load flat.
const refreshFeeds = async (
  portal: string,
  userIds: string[]
): Promise<void> => {
  const [next, ...rest] = userIds;
  if (!next) {
    return;
  }

  await generateFeed(portal, next);
  await refreshFeeds(portal, rest);
};

// Regenerates every job seeker's feed rows for one portal.
export const refreshAllFeeds = async (portal: string) => {
  await refreshFeeds(portal, await listJobSeekerIds());
};
