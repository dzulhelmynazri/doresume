import {
  createDefaultCoverLetter,
  createDefaultResumeProfilesState,
  getActiveResumeProfile,
  resumeDocumentSchema,
  resumeProfilesStateSchema,
} from "@doresume/contracts";
import type {
  CoverLetter,
  ResumeDocument,
  ResumeDocumentSeedUser,
  ResumeProfilesState,
} from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

const toSeedUser = (record: {
  name: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}): ResumeDocumentSeedUser => ({
  city: record.city,
  country: record.country,
  email: record.email,
  linkedin: record.linkedin,
  name: record.name,
  phone: record.phone,
  state: record.state,
});

const parseLegacyDocument = (value: unknown): ResumeDocument | null => {
  if (!value) {
    return null;
  }

  const parsed = resumeDocumentSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};

const parseProfilesState = (value: unknown): ResumeProfilesState | null => {
  if (!value) {
    return null;
  }

  const parsed = resumeProfilesStateSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};

const getUserRecord = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: {
      city: true,
      country: true,
      email: true,
      linkedin: true,
      name: true,
      phone: true,
      resumeDocument: true,
      resumeProfiles: true,
      state: true,
    },
    where: eq(user.id, userId),
  });

  if (!record) {
    throw new Error("User not found.");
  }

  return record;
};

export const getUserResumeProfiles = async (
  userId: string
): Promise<ResumeProfilesState> => {
  const record = await getUserRecord(userId);
  const parsedProfiles = parseProfilesState(record.resumeProfiles);

  if (parsedProfiles) {
    return parsedProfiles;
  }

  return createDefaultResumeProfilesState(
    toSeedUser(record),
    parseLegacyDocument(record.resumeDocument)
  );
};

export const saveUserResumeProfiles = async (
  userId: string,
  state: ResumeProfilesState
) => {
  const parsed = resumeProfilesStateSchema.parse(state);
  const activeDocument = getActiveResumeProfile(parsed).document;

  await db
    .update(user)
    .set({
      resumeDocument: activeDocument,
      resumeProfiles: parsed,
    })
    .where(eq(user.id, userId));
};

export const getUserResumeDocument = async (
  userId: string
): Promise<ResumeDocument> => {
  const profiles = await getUserResumeProfiles(userId);

  return getActiveResumeProfile(profiles).document;
};

export const getUserActiveCoverLetter = async (
  userId: string
): Promise<{ coverLetter: CoverLetter; document: ResumeDocument }> => {
  const profiles = await getUserResumeProfiles(userId);
  const activeProfile = getActiveResumeProfile(profiles);

  return {
    coverLetter: activeProfile.coverLetter ?? createDefaultCoverLetter(),
    document: activeProfile.document,
  };
};

export const saveUserResumeDocument = async (
  userId: string,
  document: ResumeDocument
) => {
  const profiles = await getUserResumeProfiles(userId);
  const activeProfile = getActiveResumeProfile(profiles);

  await saveUserResumeProfiles(userId, {
    ...profiles,
    profiles: profiles.profiles.map((profile) =>
      profile.id === activeProfile.id ? { ...profile, document } : profile
    ),
  });
};

export const userHasResumeDocument = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { resumeDocument: true, resumeProfiles: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.resumeProfiles ?? record?.resumeDocument);
};
