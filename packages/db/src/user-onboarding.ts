import type {
  ApplicationSettings,
  Checklist,
  EducationLevel,
  ExperienceLevel,
  Industries,
  MinimumSalary,
  WorkArrangement,
  WorkEligibility,
  WorkType,
} from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

export interface UserOnboardingState {
  applicationPassword: string | null;
  applicationSettings: ApplicationSettings | null;
  checklist: Checklist | null;
  educationLevel: EducationLevel | null;
  experienceLevel: ExperienceLevel | null;
  industries: Industries | null;
  linkedin: string | null;
  location: {
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
  };
  minimumSalary: MinimumSalary | null;
  phone: string | null;
  workArrangement: WorkArrangement | null;
  workEligibility: {
    citizenship: WorkEligibility["citizenship"];
    workCountries: WorkEligibility["workCountries"];
  };
  workType: WorkType | null;
}

const EMPTY_ONBOARDING_STATE: UserOnboardingState = {
  applicationPassword: null,
  applicationSettings: null,
  checklist: null,
  educationLevel: null,
  experienceLevel: null,
  industries: null,
  linkedin: null,
  location: { address: "", city: "", country: "", state: "", zip: "" },
  minimumSalary: null,
  phone: null,
  workArrangement: null,
  workEligibility: { citizenship: [], workCountries: [] },
  workType: null,
};

export const getUserOnboardingState = async (
  userId: string
): Promise<UserOnboardingState> => {
  const record = await db.query.user.findFirst({
    columns: {
      address: true,
      applicationPassword: true,
      applicationSettings: true,
      checklist: true,
      citizenship: true,
      city: true,
      country: true,
      educationLevel: true,
      experienceLevel: true,
      industries: true,
      linkedin: true,
      minimumSalary: true,
      phone: true,
      state: true,
      workArrangement: true,
      workCountries: true,
      workType: true,
      zip: true,
    },
    where: eq(user.id, userId),
  });

  if (!record) {
    return EMPTY_ONBOARDING_STATE;
  }

  return {
    applicationPassword: record.applicationPassword,
    applicationSettings: record.applicationSettings,
    checklist: record.checklist,
    educationLevel: record.educationLevel,
    experienceLevel: record.experienceLevel,
    industries: record.industries,
    linkedin: record.linkedin,
    location: {
      address: record.address ?? "",
      city: record.city ?? "",
      country: record.country ?? "",
      state: record.state ?? "",
      zip: record.zip ?? "",
    },
    minimumSalary: record.minimumSalary,
    phone: record.phone,
    workArrangement: record.workArrangement,
    workEligibility: {
      citizenship: record.citizenship ?? [],
      workCountries: record.workCountries ?? [],
    },
    workType: record.workType,
  };
};

/**
 * Single-query counterpart to the per-field onboarding checks.
 *
 * Every onboarding field except the resume lives on the `user` row, so we read
 * them all at once instead of issuing one query per column. The resume check is
 * a storage lookup and stays with the caller (`userIsOnboarded`).
 */
export const userHasOnboardingProfile = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: {
      address: true,
      applicationPassword: true,
      applicationSettings: true,
      checklist: true,
      educationLevel: true,
      experienceLevel: true,
      industries: true,
      minimumSalary: true,
      workArrangement: true,
      workCountries: true,
      workType: true,
    },
    where: eq(user.id, userId),
  });

  if (!record) {
    return false;
  }

  return (
    Boolean(record.address?.trim()) &&
    Boolean(record.workCountries?.length) &&
    Boolean(record.checklist) &&
    Boolean(record.industries) &&
    Boolean(record.experienceLevel) &&
    Boolean(record.workType) &&
    Boolean(record.educationLevel) &&
    Boolean(record.workArrangement) &&
    Boolean(record.minimumSalary?.amount) &&
    Boolean(record.applicationPassword) &&
    Boolean(record.applicationSettings)
  );
};
