import { z } from "zod";

import { createDefaultCoverLetter, coverLetterSchema } from "./cover-letter";
import type { CoverLetter } from "./cover-letter";
import {
  createDefaultResumeDocument,
  createResumeId,
  resumeDocumentSchema,
} from "./resume-document";
import type { ResumeDocument, ResumeDocumentSeedUser } from "./resume-document";

export const resumeProfileSchema = z.object({
  coverLetter: coverLetterSchema.default(createDefaultCoverLetter()),
  document: resumeDocumentSchema,
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  starred: z.boolean(),
});

export const resumeProfilesStateSchema = z.object({
  activeProfileId: z.string().uuid(),
  profiles: z.array(resumeProfileSchema).min(1),
});

export type ResumeProfile = z.infer<typeof resumeProfileSchema>;
export type ResumeProfilesState = z.infer<typeof resumeProfilesStateSchema>;

export const createResumeProfile = ({
  coverLetter = createDefaultCoverLetter(),
  document,
  name,
  starred = false,
}: {
  coverLetter?: CoverLetter;
  document: ResumeDocument;
  name: string;
  starred?: boolean;
}): ResumeProfile => ({
  coverLetter,
  document,
  id: createResumeId(),
  name,
  starred,
});

export const createDefaultResumeProfilesState = (
  user: ResumeDocumentSeedUser,
  existingDocument?: ResumeDocument | null
): ResumeProfilesState => {
  const profile = createResumeProfile({
    document: existingDocument ?? createDefaultResumeDocument(user),
    name: "Default",
    starred: true,
  });

  return {
    activeProfileId: profile.id,
    profiles: [profile],
  };
};

export const getActiveResumeProfile = (
  state: ResumeProfilesState
): ResumeProfile => {
  const activeProfile = state.profiles.find(
    (profile) => profile.id === state.activeProfileId
  );

  if (activeProfile) {
    return activeProfile;
  }

  const [firstProfile] = state.profiles;

  if (!firstProfile) {
    throw new Error("Resume profiles state must include at least one profile.");
  }

  return firstProfile;
};

export const getNextProfileName = (profiles: ResumeProfile[]) => {
  const existingNames = new Set(
    profiles.map((profile) => profile.name.toLowerCase())
  );

  if (!existingNames.has("default")) {
    return "Default";
  }

  let index = 2;

  while (existingNames.has(`profile ${index}`)) {
    index += 1;
  }

  return `Profile ${index}`;
};

export const updateActiveProfileDocument = (
  state: ResumeProfilesState,
  document: ResumeDocument
): ResumeProfilesState => ({
  ...state,
  profiles: state.profiles.map((profile) =>
    profile.id === state.activeProfileId ? { ...profile, document } : profile
  ),
});

export const updateActiveProfileCoverLetter = (
  state: ResumeProfilesState,
  coverLetter: CoverLetter
): ResumeProfilesState => ({
  ...state,
  profiles: state.profiles.map((profile) =>
    profile.id === state.activeProfileId ? { ...profile, coverLetter } : profile
  ),
});
