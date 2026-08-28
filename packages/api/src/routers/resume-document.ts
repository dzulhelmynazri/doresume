import { resumeDocumentSchema } from "@doresume/contracts";
import {
  getUserResumeDocument,
  saveUserResumeDocument,
} from "@doresume/db/user-resume-document";

import { protectedProcedure } from "../index";

export const getResumeDocument = protectedProcedure.handler(
  async ({ context }) => {
    const document = await getUserResumeDocument(context.session.user.id);

    return { document };
  }
);

export const saveResumeDocument = protectedProcedure
  .input(resumeDocumentSchema)
  .handler(async ({ context, input }) => {
    await saveUserResumeDocument(context.session.user.id, input);

    return { ok: true as const };
  });
