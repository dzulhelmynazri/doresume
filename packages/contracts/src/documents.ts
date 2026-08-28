import { z } from "zod";

import { createDefaultCoverLetter, coverLetterSchema } from "./cover-letter";
import type { CoverLetter } from "./cover-letter";
import {
  createDefaultResumeDocument,
  createResumeId,
  resumeDocumentSchema,
} from "./resume-document";
import type { ResumeDocument, ResumeDocumentSeedUser } from "./resume-document";

export const documentBundleSchema = z.object({
  coverLetter: coverLetterSchema.default(createDefaultCoverLetter()),
  document: resumeDocumentSchema,
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  starred: z.boolean(),
});

export const documentsStateSchema = z.object({
  activeDocumentId: z.string().uuid(),
  documents: z.array(documentBundleSchema).min(1),
});

const legacyDocumentsStateSchema = z.object({
  activeProfileId: z.string().uuid(),
  profiles: z.array(documentBundleSchema).min(1),
});

export type DocumentBundle = z.infer<typeof documentBundleSchema>;
export type DocumentsState = z.infer<typeof documentsStateSchema>;

export const parseDocumentsState = (value: unknown): DocumentsState | null => {
  if (!value) {
    return null;
  }

  const modern = documentsStateSchema.safeParse(value);

  if (modern.success) {
    return modern.data;
  }

  const legacy = legacyDocumentsStateSchema.safeParse(value);

  if (legacy.success) {
    return {
      activeDocumentId: legacy.data.activeProfileId,
      documents: legacy.data.profiles,
    };
  }

  return null;
};

export const createDocumentBundle = ({
  coverLetter = createDefaultCoverLetter(),
  document,
  name,
  starred = false,
}: {
  coverLetter?: CoverLetter;
  document: ResumeDocument;
  name: string;
  starred?: boolean;
}): DocumentBundle => ({
  coverLetter,
  document,
  id: createResumeId(),
  name,
  starred,
});

export const createDefaultDocumentsState = (
  user: ResumeDocumentSeedUser,
  existingDocument?: ResumeDocument | null
): DocumentsState => {
  const document = createDocumentBundle({
    document: existingDocument ?? createDefaultResumeDocument(user),
    name: "Default",
    starred: true,
  });

  return {
    activeDocumentId: document.id,
    documents: [document],
  };
};

export const getActiveDocumentBundle = (
  state: DocumentsState
): DocumentBundle => {
  const activeDocument = state.documents.find(
    (document) => document.id === state.activeDocumentId
  );

  if (activeDocument) {
    return activeDocument;
  }

  const [firstDocument] = state.documents;

  if (!firstDocument) {
    throw new Error("Documents state must include at least one document.");
  }

  return firstDocument;
};

export const getNextDocumentName = (documents: DocumentBundle[]) => {
  const existingNames = new Set(
    documents.map((document) => document.name.toLowerCase())
  );

  if (!existingNames.has("default")) {
    return "Default";
  }

  let index = 2;

  while (existingNames.has(`document ${index}`)) {
    index += 1;
  }

  return `Document ${index}`;
};

export const updateActiveDocumentResume = (
  state: DocumentsState,
  document: ResumeDocument
): DocumentsState => ({
  ...state,
  documents: state.documents.map((entry) =>
    entry.id === state.activeDocumentId ? { ...entry, document } : entry
  ),
});

export const updateActiveDocumentCoverLetter = (
  state: DocumentsState,
  coverLetter: CoverLetter
): DocumentsState => ({
  ...state,
  documents: state.documents.map((entry) =>
    entry.id === state.activeDocumentId ? { ...entry, coverLetter } : entry
  ),
});
