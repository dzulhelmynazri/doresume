import {
  createDefaultResumeDocument,
  resumeDocumentSchema,
} from "@doresume/contracts";
import type {
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

export const getUserResumeDocument = async (
  userId: string
): Promise<ResumeDocument> => {
  const record = await db.query.user.findFirst({
    columns: {
      city: true,
      country: true,
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

  if (record.resumeDocument) {
    const parsed = resumeDocumentSchema.safeParse(record.resumeDocument);

    if (parsed.success) {
      return parsed.data;
    }
  }

  return createDefaultResumeDocument(toSeedUser(record));
};

export const saveUserResumeDocument = async (
  userId: string,
  document: ResumeDocument
) => {
  const parsed = resumeDocumentSchema.parse(document);

  await db
    .update(user)
    .set({ resumeDocument: parsed })
    .where(eq(user.id, userId));
};

export const userHasResumeDocument = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { resumeDocument: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.resumeDocument);
};
