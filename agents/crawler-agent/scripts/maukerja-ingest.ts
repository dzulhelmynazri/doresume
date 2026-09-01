import { listExistingExternalIds, upsertPosting } from "@doresume/db/postings";
import type { PostingInput } from "@doresume/db/postings";

import {
  generateFeed as generatePortalFeed,
  refreshAllFeeds as refreshPortalFeeds,
} from "./feed";
import { mapSectorNames, tokenizeTitle } from "./match";

const BASE = "https://www.maukerja.my";
const MAX_PAGES = 25;
const PAGE_SIZE = 20;
const PORTAL = "Maukerja";
const PORTAL_KEY = "maukerja";
const SEARCH_URL = "https://services.maukerja.my/v3/jobs/job/search";

// Public app key that the SPA bundle sends with every services.maukerja.my
// request; unlike the MYFutureJobs WAF, this API accepts plain HTTP clients.
const API_TOKEN = "fa076a2z-452a-7a5c-8a26-1zy373eef11e";

const postingId = (externalId: string) => `${PORTAL_KEY}_${externalId}`;

// Verified in a live browser: /job/<jobPostID>-<slug> resolves (bare
// /job/<id> 404s); the id prefix carries foreign-script titles through.
const slugify = (title: string) =>
  title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");

const getJobUrl = (id: string, title: string) =>
  `${BASE}/job/${id}-${slugify(title)}`;

interface MkCompany {
  category?: string | null;
  name?: string | null;
  size?: string | null;
}

interface MkDetails {
  benefits?: string | null;
  created?: number | null;
  requirement?: string | null;
  responsibility?: string | null;
}

interface MkLocation {
  city?: (string | null)[] | null;
  state?: (string | null)[] | null;
}

interface MkSalary {
  lowerMonthlySalary?: number | null;
  upperMonthlySalary?: number | null;
}

interface MkHit {
  category?: { jobCategory?: string | null } | null;
  company?: MkCompany | null;
  details?: MkDetails | null;
  education?: { minimum?: string | null } | null;
  jobPostID: string;
  jobTitle: string;
  jobType?: (string | null)[] | null;
  location?: MkLocation | null;
  salary?: MkSalary | null;
}

interface MkSearchResponse {
  hits: MkHit[];
  total: number;
}

const USAGE =
  "Usage: bun run scripts/maukerja-ingest.ts crawl | feed <userId> | full <userId>";

type IngestArgs = { mode: "crawl" } | { mode: "feed" | "full"; userId: string };

const parseArgs = (): IngestArgs => {
  const [mode, value] = process.argv.slice(2);

  if (mode === "feed" || mode === "full") {
    if (!value) {
      throw new Error(USAGE);
    }
    return { mode, userId: value };
  }

  if (mode === "crawl") {
    return { mode: "crawl" };
  }

  throw new Error(USAGE);
};

// Normalizes portal job types onto the CONTRACT_SCORES keys used by the
// matcher ("Full Time" would otherwise fall through to the neutral score).
const EMPLOYMENT_TYPES: Record<string, string> = {
  contract: "contract",
  "full time": "permanent",
  internship: "internship",
  "part time": "part time",
};

const toEmploymentType = (types?: (string | null)[] | null) => {
  const [first] = types ?? [];
  if (!first) {
    return;
  }
  const key = first.toLowerCase();
  return EMPLOYMENT_TYPES[key] ?? key;
};

// Portal state spellings mapped onto the onboarding STATE_NAMES values.
const STATE_ALIASES: Record<string, string> = {
  "pulau pinang": "Penang",
};

const formatState = (raw?: string | null) => {
  if (!raw) {
    return null;
  }
  const cleaned = raw.replace(/^WP\s+/iu, "").trim();
  return STATE_ALIASES[cleaned.toLowerCase()] ?? cleaned;
};

const formatLocation = (location?: MkLocation | null) => {
  const city = location?.city?.find(Boolean)?.trim();
  const state = formatState(location?.state?.find(Boolean));
  return [city, state].filter(Boolean).join(", ") || null;
};

// Portal publishes monthly MYR amounts; stored raw on salary_min/salary_max.
const toSalaryRange = (salary?: MkSalary | null) => ({
  salaryMax: salary?.upperMonthlySalary ?? undefined,
  salaryMin: salary?.lowerMonthlySalary ?? undefined,
});

const HTML_ENTITIES: Record<string, string> = {
  "#39": "'",
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

// The ad sections arrive as HTML but the feed renders description as plain
// text lines, so lists become one line per item and tags are stripped.
export const htmlToText = (html: string) =>
  html
    .replaceAll(/<li[^>]*>/giu, "\n")
    .replaceAll(/<(?:br|\/p|\/h[1-6]|\/li|\/ul|\/ol|\/div)[^>]*>/giu, "\n")
    .replaceAll(/<[^>]+>/gu, "")
    .replaceAll(/&#?(?<code>\w+);/gu, (entity, code: string) => {
      if (/^\d+$/u.test(code)) {
        return String.fromCodePoint(Math.trunc(Number(code)));
      }
      return HTML_ENTITIES[code.toLowerCase()] ?? entity;
    })
    .replaceAll(/[ \t]+/gu, " ")
    .replaceAll(/ ?\n ?/gu, "\n")
    .replaceAll(/\n{2,}/gu, "\n")
    .trim();

// Search hits carry the full ad: HTML responsibility/requirement/benefits
// sections, so there is no separate detail phase like MYFutureJobs has.
const toDescription = (hit: MkHit) => {
  const { details } = hit;
  const parts = [
    details?.responsibility?.trim(),
    details?.requirement?.trim(),
    details?.benefits?.trim(),
  ]
    .filter((section): section is string => Boolean(section))
    .map((section) => htmlToText(section));

  const { company } = hit;
  const aboutLines = [
    company?.name?.trim(),
    company?.category?.trim(),
    company?.size?.trim(),
  ].filter(Boolean);

  if (aboutLines.length > 0) {
    parts.push(["About the company", ...aboutLines].join("\n"));
  }

  return parts.join("\n\n") || null;
};

const hitToPosting = (hit: MkHit): PostingInput => ({
  ...toSalaryRange(hit.salary),
  company: hit.company?.name ?? undefined,
  description: toDescription(hit) ?? undefined,
  educationRequirement: hit.education?.minimum ?? undefined,
  employmentType: toEmploymentType(hit.jobType),
  externalId: hit.jobPostID,
  id: postingId(hit.jobPostID),
  industries: mapSectorNames([
    hit.category?.jobCategory,
    hit.company?.category,
  ]),
  location: formatLocation(hit.location) ?? undefined,
  portal: PORTAL,
  postedAt: hit.details?.created ? new Date(hit.details.created) : undefined,
  stateName: formatState(hit.location?.state?.find(Boolean)) ?? undefined,
  title: hit.jobTitle,
  titleTokens: tokenizeTitle(hit.jobTitle),
  url: getJobUrl(hit.jobPostID, hit.jobTitle),
});

// Newest-first page of the full catalog (empty term matches everything).
const fetchPage = async (from: number): Promise<MkSearchResponse> => {
  const response = await fetch(SEARCH_URL, {
    body: JSON.stringify({ from, size: PAGE_SIZE, sort: "date", term: "" }),
    headers: {
      accept: "application/json",
      authorization: `Bearer ${API_TOKEN}`,
      "content-type": "application/json",
      referer: `${BASE}/`,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Maukerja search returned HTTP ${response.status}`);
  }

  return (await response.json()) as MkSearchResponse;
};

interface CrawlTotals {
  fresh: number;
  ingested: number;
}

// Delta crawl: pages arrive newest-first, so stop at the first page made up
// entirely of postings the catalog already has. Pass force to walk every
// page up to MAX_PAGES regardless (manual full refresh). Recursive to keep
// one search request in flight at a time.
const crawlPages = async (
  pageIndex: number,
  force: boolean,
  totals: CrawlTotals
): Promise<CrawlTotals> => {
  if (pageIndex >= MAX_PAGES) {
    return totals;
  }

  const { hits } = await fetchPage(pageIndex * PAGE_SIZE);
  if (hits.length === 0) {
    return totals;
  }

  const existing = new Set(
    force
      ? []
      : await listExistingExternalIds(
          PORTAL,
          hits.map((hit) => hit.jobPostID)
        )
  );

  await Promise.all(hits.map((hit) => upsertPosting(hitToPosting(hit))));

  const newCount = hits.filter((hit) => !existing.has(hit.jobPostID)).length;
  console.log(
    `Page ${pageIndex + 1}: ${hits.length} postings (${newCount} new)`
  );

  const next: CrawlTotals = {
    fresh: totals.fresh + newCount,
    ingested: totals.ingested + hits.length,
  };

  if (!force && newCount === 0) {
    console.log("Reached postings already in the catalog; stopping");
    return next;
  }

  if (hits.length < PAGE_SIZE) {
    return next;
  }

  return crawlPages(pageIndex + 1, force, next);
};

export const crawlCatalog = async (force = false) => {
  const { fresh, ingested } = await crawlPages(0, force, {
    fresh: 0,
    ingested: 0,
  });
  console.log(
    `Catalog refresh complete: ${ingested} postings ingested, ${fresh} new`
  );
};

// Entry point for the daily schedule: delta crawl, then every job seeker.
export const refreshAllFeeds = async () => {
  await crawlCatalog();
  await refreshPortalFeeds(PORTAL);
};

const run = async () => {
  const args = parseArgs();

  if (args.mode === "feed") {
    await generatePortalFeed(PORTAL, args.userId);
    return;
  }

  if (args.mode === "full") {
    await crawlCatalog(true);
    await generatePortalFeed(PORTAL, args.userId);
    return;
  }

  await crawlCatalog();
};

// Guard lets the eve schedule import this module without starting the CLI.
if ((process.argv[1] ?? "").endsWith("maukerja-ingest.ts")) {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
