import { env } from "@doresume/env/server";
import { Files } from "files-sdk";
import { r2 } from "files-sdk/r2";

export const storage = new Files({
  adapter: r2({
    accountId: env.R2_ACCOUNT_ID,
    bucket: env.R2_BUCKET,
  }),
});

export { FilesError } from "files-sdk";
export type { StoredFile } from "files-sdk";
