// Deterministic profile ↔ posting matcher, portal-agnostic: it scores
// normalized catalog rows (see packages/db job_posting), so any portal
// adapter can feed it. Each axis scores 0–1; the weighted sum becomes
// job.match_percent.
import { convertSalaryAmount, resumeDocumentSchema } from "@doresume/contracts";
import type {
  EducationLevel,
  Industries,
  Industry,
  MinimumSalary,
  WorkType,
} from "@doresume/contracts";
import { db } from "@doresume/db";

export interface MatchProfile {
  country: string | null;
  educationLevel: EducationLevel | null;
  industries: Industries | null;
  minimumSalary: MinimumSalary | null;
  // From the uploaded resume: header title + past role titles.
  resumeTitles: string[];
  state: string | null;
  workType: WorkType | null;
}

// Normalized posting facts: catalog rows arrive in this shape regardless
// of which portal adapter ingested them.
export interface MatchablePosting {
  educationRequirement?: string | null;
  employmentType?: string | null;
  industries: Industry[];
  salaryMax?: number | null;
  stateName?: string | null;
  title?: string | null;
}

export interface MatchResult {
  breakdown: Record<keyof typeof AXIS_WEIGHTS, number>;
  percent: number;
}

const AXIS_WEIGHTS = {
  education: 5,
  industry: 20,
  location: 25,
  salary: 20,
  title: 25,
  workType: 5,
} as const;

export const STATE_NAMES: Record<string, string> = {
  JHR: "Johor",
  KDH: "Kedah",
  KTN: "Kelantan",
  KUL: "Kuala Lumpur",
  LBN: "Labuan",
  MLK: "Melaka",
  NSN: "Negeri Sembilan",
  PHG: "Pahang",
  PJY: "Putrajaya",
  PLS: "Perlis",
  PNG: "Penang",
  PRK: "Perak",
  SBH: "Sabah",
  SGR: "Selangor",
  SRW: "Sarawak",
  TRG: "Terengganu",
};

const resumeTitlesFrom = (value: unknown): string[] => {
  const parsed = resumeDocumentSchema.safeParse(value);
  if (!parsed.success) {
    return [];
  }

  const { data } = parsed;
  return [
    ...(data.header.title ? [data.header.title] : []),
    ...data.workExperience.map((entry) => entry.title),
  ]
    .map((title) => title.trim())
    .filter((title) => title.length > 0);
};

export const loadProfile = async (userId: string): Promise<MatchProfile> => {
  const record = await db.query.user.findFirst({
    columns: {
      country: true,
      educationLevel: true,
      industries: true,
      minimumSalary: true,
      resumeDocument: true,
      state: true,
      workType: true,
    },
    where: (table, { eq }) => eq(table.id, userId),
  });

  if (!record) {
    throw new Error(`No user profile found for ${userId}`);
  }

  return {
    country: record.country ?? null,
    educationLevel: record.educationLevel ?? null,
    industries: record.industries ?? null,
    minimumSalary: record.minimumSalary ?? null,
    resumeTitles: resumeTitlesFrom(record.resumeDocument),
    state: record.state ?? null,
    workType: record.workType ?? null,
  };
};

// Users whose onboarding picked industries — the feed-refresh cohort.
export const listJobSeekerIds = async (): Promise<string[]> => {
  const records = await db.query.user.findMany({
    columns: { id: true },
    where: (table, { isNotNull }) => isNotNull(table.industries),
  });
  return records.map((record) => record.id);
};

// Filler + seniority words that would drown out the meaningful overlap.
const TITLE_STOPWORDS = new Set([
  "and",
  "assistant",
  "associate",
  "at",
  "cum",
  "executive",
  "for",
  "head",
  "in",
  "intern",
  "internship",
  "junior",
  "lead",
  "manager",
  "of",
  "officer",
  "senior",
  "specialist",
  "the",
]);

export const tokenizeTitle = (value: string) => [
  ...new Set(
    value
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/gu, " ")
      .split(" ")
      .filter((word) => word.length > 2 && !TITLE_STOPWORDS.has(word))
  ),
];

// Prefix match tolerates suffix variants (accounting ↔ account, engineer ↔ engineering).
const tokensMatch = (left: string, right: string) => {
  if (left === right) {
    return true;
  }
  const [shorter, longer] =
    left.length <= right.length ? [left, right] : [right, left];
  return shorter.length >= 4 && longer.startsWith(shorter);
};

const titleOverlap = (jobTokens: string[], candidateTokens: string[]) => {
  if (jobTokens.length === 0 || candidateTokens.length === 0) {
    return 0;
  }

  const hits = jobTokens.filter((token) =>
    candidateTokens.some((candidate) => tokensMatch(token, candidate))
  ).length;
  return hits / jobTokens.length;
};

const titleScore = (profile: MatchProfile, posting: MatchablePosting) => {
  const jobTokens = tokenizeTitle(posting.title ?? "");
  if (jobTokens.length === 0 || profile.resumeTitles.length === 0) {
    return 0.5;
  }

  const best = Math.max(
    ...profile.resumeTitles.map((title) =>
      titleOverlap(jobTokens, tokenizeTitle(title))
    )
  );

  if (best >= 0.6) {
    return 1;
  }
  if (best >= 0.34) {
    return 0.6;
  }
  if (best > 0) {
    return 0.3;
  }
  return 0.1;
};

// ISIC-style MYFutureJobs sector names mapped to onboarding industry values.
const INDUSTRY_KEYWORDS: Partial<Record<Industry, string[]>> = {
  agriculture_fishing: ["agriculture", "fishing", "forestry"],
  architecture_construction: ["construction", "architectur", "engineering"],
  defense_military: ["defence", "defense"],
  education: ["education"],
  energy_utilities: ["electricity", "gas", "water supply", "sewerage"],
  entertainment_media: ["entertainment", "publishing", "broadcasting"],
  environmental: ["waste management", "remediation"],
  finance_insurance: ["financial", "insurance", "accounting", "legal"],
  government: ["public administration"],
  healthcare: ["human health", "social work", "hospital"],
  home_services: ["personal service", "household", "repair of"],
  hospitality_tourism: ["accommodation", "food service", "tourism", "travel"],
  hr_recruiting: ["employment activities", "human resources"],
  it_and_software: [
    "information and communication",
    "computer",
    "software",
    "telecommunication",
  ],
  logistics_transport: ["transportation", "storage", "courier", "postal"],
  manufacturing_trades: ["manufactur"],
  mining: ["mining", "quarrying"],
  nonprofit: ["membership organization"],
  private_security: ["security activities"],
  public_safety: ["public order"],
  real_estate: ["real estate"],
  retail_wholesale: ["wholesale", "retail"],
  science_rd: ["scientific research", "research and development"],
  sports_athletics: ["sports activities"],
};

const EDUCATION_RANK: Record<EducationLevel, number> = {
  bachelors: 3,
  diploma: 2,
  highschool: 1,
  masters_or_higher: 4,
  no_formal: 0,
};

const CONTRACT_SCORES: Record<WorkType, Record<string, number>> = {
  contract_freelance: {
    contract: 1,
    internship: 0.5,
    "part time": 0.5,
    permanent: 0.5,
    temporary: 0.7,
  },
  full_time: {
    contract: 0.5,
    internship: 0.2,
    "part time": 0.3,
    permanent: 1,
    temporary: 0.4,
  },
  open_to_anything: {},
  part_time: {
    contract: 0.4,
    internship: 0.4,
    "part time": 1,
    permanent: 0.3,
    temporary: 0.6,
  },
};

export const sectorToIndustry = (name: string): Industry | null => {
  const value = name.toLowerCase();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if ((keywords ?? []).some((keyword) => value.includes(keyword))) {
      return industry as Industry;
    }
  }
  return null;
};

// Maps raw portal sector names onto unique onboarding industry values.
export const mapSectorNames = (names: (string | null | undefined)[]) => [
  ...new Set(
    names
      .filter((name): name is string => Boolean(name))
      .map((name) => sectorToIndustry(name))
      .filter((industry): industry is Industry => industry !== null)
  ),
];

const locationScore = (profile: MatchProfile, posting: MatchablePosting) => {
  const jobState = posting.stateName?.trim().toLowerCase() ?? null;
  const userState = profile.state?.trim().toLowerCase();

  if (!jobState || !userState) {
    return 0.5;
  }

  if (userState === jobState || userState.includes(jobState)) {
    return 1;
  }

  // Portal feeds only list Malaysian postings, so same-country partial credit.
  return 0.35;
};

const salaryScore = (profile: MatchProfile, posting: MatchablePosting) => {
  const minimum = profile.minimumSalary;
  if (!minimum || minimum.currency !== "MYR") {
    return 0.5;
  }

  if (!posting.salaryMax || posting.salaryMax <= 0) {
    return 0.5;
  }

  // Portals publish monthly MYR amounts.
  const monthlyMinimum = convertSalaryAmount(
    minimum.amount,
    minimum.period,
    "monthly"
  );
  const ratio = posting.salaryMax / monthlyMinimum;

  if (ratio >= 1) {
    return 1;
  }
  if (ratio >= 0.8) {
    return 0.6;
  }
  if (ratio >= 0.6) {
    return 0.3;
  }
  return 0;
};

const industryScore = (profile: MatchProfile, posting: MatchablePosting) => {
  if (posting.industries.length === 0 || !profile.industries) {
    return 0.5;
  }

  const selected = profile.industries.industries;
  const matched = posting.industries.some((industry) =>
    selected.includes(industry)
  );

  if (matched) {
    return 1;
  }
  return profile.industries.openToAny ? 0.7 : 0.15;
};

const educationRank = (name?: string | null) => {
  if (!name) {
    return null;
  }

  const value = name.toLowerCase();
  if (/doctor|phd|master/u.test(value)) {
    return 4;
  }
  if (/bachelor|degree/u.test(value)) {
    return 3;
  }
  if (/diploma|dkm|dlkm|dvm|skm/u.test(value)) {
    return 2;
  }
  if (/spm|stpm|secondary|school|certificate/u.test(value)) {
    return 1;
  }
  return 1;
};

const educationScore = (profile: MatchProfile, posting: MatchablePosting) => {
  const requiredRank = educationRank(posting.educationRequirement);
  if (requiredRank === null || !profile.educationLevel) {
    return 0.5;
  }

  const userRank = EDUCATION_RANK[profile.educationLevel] ?? 0;
  if (userRank >= requiredRank) {
    return 1;
  }
  if (userRank === requiredRank - 1) {
    return 0.5;
  }
  return 0.15;
};

const workTypeScore = (profile: MatchProfile, posting: MatchablePosting) => {
  const contractName = posting.employmentType?.toLowerCase();
  if (!profile.workType || !contractName) {
    return 0.5;
  }

  if (profile.workType === "open_to_anything") {
    return 0.9;
  }

  const scores = CONTRACT_SCORES[profile.workType] ?? {};
  return scores[contractName] ?? 0.6;
};

export const scoreJob = (
  profile: MatchProfile,
  posting: MatchablePosting
): MatchResult => {
  const breakdown = {
    education: educationScore(profile, posting),
    industry: industryScore(profile, posting),
    location: locationScore(profile, posting),
    salary: salaryScore(profile, posting),
    title: titleScore(profile, posting),
    workType: workTypeScore(profile, posting),
  };

  const percent = Math.round(
    (Object.keys(AXIS_WEIGHTS) as (keyof typeof AXIS_WEIGHTS)[]).reduce(
      (total, axis) => total + AXIS_WEIGHTS[axis] * breakdown[axis],
      0
    )
  );

  return { breakdown, percent: Math.max(0, Math.min(100, percent)) };
};
