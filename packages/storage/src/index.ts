import { env } from "@doresume/env/server";
import { Files } from "files-sdk";
import { s3 } from "files-sdk/s3";

export const storage = new Files({
  adapter: s3({
    bucket: env.AWS_S3_BUCKET,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    region: env.AWS_REGION,
  }),
});

export { FilesError } from "files-sdk";
export type { StoredFile } from "files-sdk";
