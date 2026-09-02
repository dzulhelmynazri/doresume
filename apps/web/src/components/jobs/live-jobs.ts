import type { JobDescriptionSection } from "@doresume/contracts";

import type { JobSection } from "@/components/dashboard/data/grove-sections";
import type { Job } from "@/components/dashboard/data/jobs";

// Row shape returned by the listJobs procedure (see packages/db/src/jobs.ts).
export interface FeedJobRow {
  company: string | null;
  descriptionSections: JobDescriptionSection[] | null;
  employmentType: string | null;
  id: string;
  location: string | null;
  matchPercent: number | null;
  portal: string | null;
  postedAt: Date | string | null;
  salaryMax: number | null;
  salaryMin: number | null;
  seniority: string | null;
  title: string;
  url: string;
}

const DAY_MS = 86_400_000;

export const formatPostedAt = (postedAt: Date | string | null): string => {
  if (!postedAt) {
    return "Recently";
  }

  const posted = new Date(postedAt);
  const ageDays = Math.floor((Date.now() - posted.getTime()) / DAY_MS);

  if (ageDays <= 0) {
    return "Today";
  }

  if (ageDays === 1) {
    return "Yesterday";
  }

  if (ageDays < 7) {
    return `${ageDays} days ago`;
  }

  if (ageDays < 30) {
    const weeks = Math.floor(ageDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  return posted.toLocaleDateString("en-MY", { day: "numeric", month: "short" });
};

const toSections = (sections: JobDescriptionSection[] | null): JobSection[] =>
  sections ?? [];

export const toUiJob = (row: FeedJobRow): Job => ({
  appliedAt: formatPostedAt(row.postedAt),
  category: "",
  company: row.company ?? "",
  employmentType: row.employmentType ?? "",
  experience: "",
  id: row.id,
  location: row.location ?? "",
  matchPercent: row.matchPercent ?? 0,
  resumeStatus: "not-ready",
  // Both portals publish monthly MYR amounts (same invariant the
  // crawler-agent matcher relies on), stored raw on salary_min/salary_max.
  salaryCurrency: "MYR",
  salaryMax: row.salaryMax ?? 0,
  salaryMin: row.salaryMin ?? 0,
  salaryPeriod: "monthly",
  sections: toSections(row.descriptionSections),
  seniority: row.seniority ?? "",
  status: "submitted",
  title: row.title,
  url: row.url,
  workplace: "",
});
