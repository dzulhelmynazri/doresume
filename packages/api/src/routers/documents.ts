import { documentsStateSchema } from "@doresume/contracts";
import {
  getUserDocuments,
  saveUserDocuments,
} from "@doresume/db/user-documents";

import { protectedProcedure } from "../index";

export const getDocuments = protectedProcedure.handler(
  async ({ context }) => await getUserDocuments(context.session.user.id)
);

export const saveDocuments = protectedProcedure
  .input(documentsStateSchema)
  .handler(async ({ context, input }) => {
    await saveUserDocuments(context.session.user.id, input);

    return { ok: true as const };
  });
