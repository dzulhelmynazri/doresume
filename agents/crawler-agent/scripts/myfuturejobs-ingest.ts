import type { JobDescriptionSection } from "@doresume/contracts";
import { listExistingExternalIds, upsertPosting } from "@doresume/db/postings";
import type { PostingInput } from "@doresume/db/postings";
import { chromium } from "playwright";
import type { Page } from "playwright";

import {
  generateFeed as generatePortalFeed,
  refreshAllFeeds as refreshPortalFeeds,
} from "./feed";
import { mapSectorNames, STATE_NAMES, tokenizeTitle } from "./match";

const BASE = "https://candidates.myfuturejobs.gov.my";
const MAX_PAGES = 10;
const PORTAL = "MYFutureJobs";
const PORTAL_KEY = "myfuturejobs";
const SEARCH_PATH = "/search-jobs";

const postingId = (externalId: string) => `${PORTAL_KEY}_${externalId}`;

// The candidates portal renders job details as an Angular route:
// /search-jobs/description?jobId=<id> (plain /jobs/<id> hits the not-found route).
const getJobUrl = (id: string) =>
  `${BASE}${SEARCH_PATH}/description?jobId=${id}`;

interface MfjJob {
  companyName: string;
  contractType?: { name?: string } | null;
  datePosted?: string | null;
  id: string;
  location?: { CITY?: string | null; STATE?: string | null } | null;
  positionTitle: string;
}

interface MfjResponse {
  data: MfjJob[];
  limit: number;
  offset: number;
  resultCount: number;
  totalCount: number;
}

interface MfjRemuneration {
  maximumAmount?: number | null;
  minimumAmount?: number | null;
}

interface MfjDetail {
  companyDescription?: string | null;
  companyName?: string | null;
  companySectors?: { name?: string | null }[] | null;
  companySize?: { name?: string | null } | null;
  contractType?: { name?: string | null } | null;
  datePosted?: string | null;
  educationDegree?: { name?: string | null } | null;
  jobDescription?: string | null;
  location?: { CITY?: string | null; STATE?: string | null } | null;
  offeredRemunerationPackages?: MfjRemuneration[] | null;
  positionTitle?: string | null;
  vacancySectors?: { name?: string | null }[] | null;
}

const NEXT_SELECTORS = [
  'button[aria-label*="next" i]',
  '[aria-label*="next page" i]',
  'button:has-text("Next")',
  '[class*="pagination"] button:last-of-type',
];

const USAGE =
  "Usage: bun run scripts/myfuturejobs-ingest.ts crawl | feed <userId> | full <userId> | probe <jobId>";

type IngestArgs =
  | { jobId: string; mode: "probe" }
  | { mode: "crawl" }
  | { mode: "feed" | "full"; userId: string };

const parseArgs = (): IngestArgs => {
  const [mode, value] = process.argv.slice(2);

  if (mode === "probe") {
    if (!value) {
      throw new Error(USAGE);
    }
    return { jobId: value, mode: "probe" };
  }

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

const formatCode = (code?: string | null) => {
  if (!code) {
    return null;
  }

  return code
    .replace(/^MY(?:_[A-Z]{3})?_/u, "")
    .split("_")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
};

const formatState = (code?: string | null) => {
  if (!code) {
    return null;
  }

  const key = code.replace(/^MY_/u, "");
  return STATE_NAMES[key] ?? formatCode(code);
};

const formatLocation = (
  location?: { CITY?: string | null; STATE?: string | null } | null
) => {
  const city = formatCode(location?.CITY);
  const state = formatState(location?.STATE);
  return [city, state].filter(Boolean).join(", ") || null;
};

const isJobsResponse = (url: string, status: number) =>
  url.includes("/api/jobs?") && status === 200;

const waitForJobsResponse = async (page: Page): Promise<MfjResponse> => {
  const response = await page.waitForResponse(
    (candidate) => isJobsResponse(candidate.url(), candidate.status()),
    { timeout: 30_000 }
  );
  return (await response.json()) as MfjResponse;
};

const openDetailPage = async (page: Page, id: string) => {
  const detailPromise = page.waitForResponse(
    (candidate) =>
      candidate.url() === `${BASE}/api/jobs/${id}` &&
      candidate.status() === 200,
    { timeout: 30_000 }
  );
  await page.goto(getJobUrl(id), { waitUntil: "commit" });
  const response = await detailPromise;
  return (await response.json()) as Record<string, unknown>;
};

const advance = async (page: Page) => {
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1500);

  const buttons = NEXT_SELECTORS.map((selector) =>
    page.locator(selector).first()
  );
  const visibility = await Promise.all(
    buttons.map((button) => button.isVisible().catch(() => false))
  );
  const index = visibility.findIndex(Boolean);
  const button = index === -1 ? null : buttons[index];
  if (button) {
    await button.click();
  }
};

const collectPages = async (
  page: Page,
  collected: MfjResponse[]
): Promise<MfjResponse[]> => {
  if (collected.length >= MAX_PAGES) {
    return collected;
  }

  const last = collected.at(-1);
  if (last && last.offset + last.data.length >= last.totalCount) {
    return collected;
  }

  const nextPromise = waitForJobsResponse(page);
  await advance(page);

  let next: MfjResponse;
  try {
    next = await nextPromise;
  } catch {
    console.log("No further jobs response after scrolling; stopping");
    return collected;
  }

  if (last && next.offset <= last.offset) {
    return collected;
  }

  console.log(`Captured offset ${next.offset} (${next.data.length} jobs)`);
  return collectPages(page, [...collected, next]);
};

// Listing-level catalog row: facts visible on the search page plus derived
// title tokens. The detail phase enriches the same row later.
const listingToPosting = (jobListing: MfjJob): PostingInput => ({
  company: jobListing.companyName,
  employmentType: jobListing.contractType?.name,
  externalId: jobListing.id,
  id: postingId(jobListing.id),
  location: formatLocation(jobListing.location) ?? undefined,
  portal: PORTAL,
  postedAt: jobListing.datePosted ? new Date(jobListing.datePosted) : undefined,
  stateName: formatState(jobListing.location?.STATE) ?? undefined,
  title: jobListing.positionTitle,
  titleTokens: tokenizeTitle(jobListing.positionTitle),
  url: getJobUrl(jobListing.id),
});

// MYFutureJobs publishes MYR amounts; stored raw on salary_min/salary_max.
const toSalaryRange = (packages?: MfjRemuneration[] | null) => {
  const amounts = (packages ?? []).flatMap((entry) =>
    [entry.minimumAmount, entry.maximumAmount].filter(
      (amount): amount is number => typeof amount === "number"
    )
  );

  if (amounts.length === 0) {
    return { salaryMax: undefined, salaryMin: undefined };
  }

  return { salaryMax: Math.max(...amounts), salaryMin: Math.min(...amounts) };
};

const textToParagraphs = (text: string) =>
  text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const toDescriptionSections = (detail: MfjDetail): JobDescriptionSection[] => {
  const sections: JobDescriptionSection[] = [];
  const jobDescription = detail.jobDescription?.trim();

  if (jobDescription) {
    sections.push({
      heading: "Job Description",
      paragraphs: textToParagraphs(jobDescription),
    });
  }

  const aboutParagraphs = [
    detail.companyName?.trim(),
    detail.companySize?.name?.trim(),
    detail.companyDescription?.trim(),
  ].filter((line): line is string => Boolean(line));

  if (aboutParagraphs.length > 0) {
    sections.push({
      heading: "About the Company",
      paragraphs: aboutParagraphs,
    });
  }

  return sections;
};

const detailToPosting = (
  externalId: string,
  detail: MfjDetail
): PostingInput => {
  if (!detail.positionTitle) {
    throw new Error(`Detail payload for ${externalId} has no positionTitle`);
  }

  const sectorNames = [
    ...(detail.vacancySectors ?? []),
    ...(detail.companySectors ?? []),
  ].map((sector) => sector.name);

  return {
    ...toSalaryRange(detail.offeredRemunerationPackages),
    company: detail.companyName ?? undefined,
    descriptionSections: toDescriptionSections(detail),
    educationRequirement: detail.educationDegree?.name ?? undefined,
    employmentType: detail.contractType?.name ?? undefined,
    externalId,
    id: postingId(externalId),
    industries: mapSectorNames(sectorNames),
    location: formatLocation(detail.location) ?? undefined,
    portal: PORTAL,
    postedAt: detail.datePosted ? new Date(detail.datePosted) : undefined,
    stateName: formatState(detail.location?.STATE) ?? undefined,
    title: detail.positionTitle,
    titleTokens: tokenizeTitle(detail.positionTitle),
    url: getJobUrl(externalId),
  };
};

// Fetches the detail payload for each fresh listing and enriches its
// catalog row. Recursive to keep one in-flight navigation at a time.
const enrichNewPostings = async (
  page: Page,
  jobs: MfjJob[],
  done = 0
): Promise<void> => {
  const [next, ...rest] = jobs;
  if (!next) {
    return;
  }

  const detail = (await openDetailPage(page, next.id)) as unknown as MfjDetail;
  await upsertPosting(detailToPosting(next.id, detail));

  const count = done + 1;
  if (count % 10 === 0) {
    console.log(`Enriched ${count} catalog postings`);
  }
  await enrichNewPostings(page, rest, count);
};

const withBrowser = async (task: (page: Page) => Promise<void>) => {
  const browser = await chromium.launch({ channel: "chrome", headless: false });
  const context = await browser.newContext({
    locale: "en-MY",
    viewport: { height: 900, width: 1440 },
  });
  const page = await context.newPage();

  try {
    await task(page);
  } finally {
    await context.close();
    await browser.close();
  }
};

// Catalog refresh: listing rows for everything on the feed, detail payloads
// only for postings not seen before (the watermark delta). Pass force to
// re-fetch every detail (monthly full refresh).
export const crawlCatalog = async (force = false) => {
  await withBrowser(async (page) => {
    const [first] = await Promise.all([
      waitForJobsResponse(page),
      page.goto(`${BASE}${SEARCH_PATH}`, { waitUntil: "commit" }),
    ]);

    if (!first) {
      throw new Error("MYFutureJobs search page issued no jobs response");
    }

    console.log(`Feed reports ${first.totalCount} active postings`);
    const pages = await collectPages(page, [first]);
    const listings = pages.flatMap((result) => result.data);

    const existing = new Set(
      force
        ? []
        : await listExistingExternalIds(
            PORTAL,
            listings.map((job) => job.id)
          )
    );

    await Promise.all(
      listings.map((job) => upsertPosting(listingToPosting(job)))
    );
    console.log(`Upserted ${listings.length} listing rows into the catalog`);

    const fresh = listings.filter((job) => !existing.has(job.id));
    console.log(`${fresh.length} new postings; fetching details`);
    await enrichNewPostings(page, fresh);
    console.log(
      `Catalog refresh complete: ${listings.length} listings, ${fresh.length} enriched`
    );
  });
};

// Entry point for the daily schedule: delta crawl, then every job seeker.
export const refreshAllFeeds = async () => {
  await crawlCatalog();
  await refreshPortalFeeds(PORTAL);
};

const run = async () => {
  const args = parseArgs();

  if (args.mode === "probe") {
    const { jobId } = args;
    await withBrowser(async (page) => {
      const detail = await openDetailPage(page, jobId);
      console.log(JSON.stringify(detail, null, 2));
    });
    return;
  }

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
if ((process.argv[1] ?? "").endsWith("myfuturejobs-ingest.ts")) {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
