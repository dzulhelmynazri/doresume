import {
  getResumeDocumentSeedUser,
  saveUserResumeDocumentFromUpload,
} from "@doresume/db/user-documents";
import { parseResumeBytes } from "@doresume/doc-parser";
import { env } from "@doresume/env/server";
import { storage } from "@doresume/storage";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

import { protectedProcedure } from "../index";

const parseResumeInputSchema = z.object({
  key: z.string().min(1),
});

const userResumePrefix = (userId: string) => `users/${userId}/resumes/`;

const RELATIVE_SEGMENT = /(?:^|\/)\.\.?(?:\/|$)/u;

const resolveUserResumeStorageKey = (userId: string, key: string) => {
  const prefix = userResumePrefix(userId);

  if (key.startsWith(prefix)) {
    return key;
  }

  // files-sdk returns keys relative to the upload prefix
  if (
    key.startsWith("users/") ||
    key.includes("\0") ||
    key.startsWith("/") ||
    RELATIVE_SEGMENT.test(key)
  ) {
    throw new ORPCError("FORBIDDEN", {
      message: "You can only parse your own resume files.",
    });
  }

  return `${prefix}${key.replace(/^\/+/u, "")}`;
};

const resumeFileNameFromKey = (key: string) => {
  const separatorIndex = key.lastIndexOf("/");

  return separatorIndex === -1 ? key : key.slice(separatorIndex + 1);
};

export const parseResume = protectedProcedure
  .input(parseResumeInputSchema)
  .handler(async ({ context, input }) => {
    const userId = context.session.user.id;
    const storageKey = resolveUserResumeStorageKey(userId, input.key);

    const downloaded = await storage.download(storageKey);
    const bytes = new Uint8Array(await downloaded.arrayBuffer());
    const fileName = resumeFileNameFromKey(storageKey);
    const seed = await getResumeDocumentSeedUser(userId);

    const document = await parseResumeBytes(bytes, {
      apiKey: env.FIRECRAWL_API_KEY,
      filename: fileName,
      seed,
      sourceFileKey: storageKey,
    });

    await saveUserResumeDocumentFromUpload(userId, document, fileName);

    return { document };
  });
