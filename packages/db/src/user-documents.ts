import {
  createDefaultCoverLetter,
  createDefaultDocumentsState,
  documentsStateSchema,
  getActiveDocumentBundle,
  parseDocumentsState,
  resumeDocumentSchema,
} from "@doresume/contracts";
import type {
  CoverLetter,
  DocumentsState,
  ResumeDocument,
  ResumeDocumentSeedUser,
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

const getUserRecord = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: {
      city: true,
      country: true,
      documents: true,
      email: true,
      linkedin: true,
      name: true,
      phone: true,
      resumeDocument: true,
      state: true,
    },
    where: eq(user.id, userId),
  });

  if (!record) {
    throw new Error("User not found.");
  }

  return record;
};

export const getUserDocuments = async (
  userId: string
): Promise<DocumentsState> => {
  const record = await getUserRecord(userId);
  const parsedDocuments = parseDocumentsState(record.documents);

  if (parsedDocuments) {
    return parsedDocuments;
  }

  return createDefaultDocumentsState(
    toSeedUser(record),
    parseLegacyDocument(record.resumeDocument)
  );
};

export const saveUserDocuments = async (
  userId: string,
  state: DocumentsState
) => {
  const parsed = documentsStateSchema.parse(state);
  const activeDocument = getActiveDocumentBundle(parsed).document;

  await db
    .update(user)
    .set({
      documents: parsed,
      resumeDocument: activeDocument,
    })
    .where(eq(user.id, userId));
};

export const getUserResumeDocument = async (
  userId: string
): Promise<ResumeDocument> => {
  const documents = await getUserDocuments(userId);

  return getActiveDocumentBundle(documents).document;
};

export const getUserActiveCoverLetter = async (
  userId: string
): Promise<{ coverLetter: CoverLetter; document: ResumeDocument }> => {
  const documents = await getUserDocuments(userId);
  const activeDocument = getActiveDocumentBundle(documents);

  return {
    coverLetter: activeDocument.coverLetter ?? createDefaultCoverLetter(),
    document: activeDocument.document,
  };
};

export const getResumeDocumentSeedUser = async (
  userId: string
): Promise<ResumeDocumentSeedUser> => {
  const record = await getUserRecord(userId);

  return toSeedUser(record);
};

export const saveUserResumeDocument = async (
  userId: string,
  document: ResumeDocument
) => {
  const documents = await getUserDocuments(userId);
  const activeDocument = getActiveDocumentBundle(documents);

  await saveUserDocuments(userId, {
    ...documents,
    documents: documents.documents.map((entry) =>
      entry.id === activeDocument.id ? { ...entry, document } : entry
    ),
  });
};

export const saveUserResumeDocumentFromUpload = async (
  userId: string,
  document: ResumeDocument,
  fileName: string
) => {
  const documents = await getUserDocuments(userId);
  const activeDocument = getActiveDocumentBundle(documents);
  const displayName =
    fileName.replace(/\.[^.]+$/u, "").trim() || activeDocument.name;

  await saveUserDocuments(userId, {
    ...documents,
    documents: documents.documents.map((entry) =>
      entry.id === activeDocument.id
        ? { ...entry, document, name: displayName }
        : entry
    ),
  });
};

export const userHasResumeDocument = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { documents: true, resumeDocument: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.documents ?? record?.resumeDocument);
};
