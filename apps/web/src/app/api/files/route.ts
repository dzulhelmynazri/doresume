import { auth } from "@doresume/auth";
import { env } from "@doresume/env/server";
import { FilesError, storage } from "@doresume/storage";
import { createFilesRouter } from "files-sdk/api";
import { createRouteHandler } from "files-sdk/next";

import { MAX_RESUME_BYTES, userResumePrefix } from "@/lib/resume";

const router = createFilesRouter({
  authorize: async ({ req }) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      throw new FilesError("Unauthorized", "Sign in to upload a resume.");
    }

    return {
      keyPrefix: userResumePrefix(session.user.id),
    };
  },
  files: storage,
  maxUploadSize: MAX_RESUME_BYTES,
  operations: ["list", "upload"],
  secret: env.BETTER_AUTH_SECRET,
});

export const { GET, POST, PUT } = createRouteHandler(router);
