import { createCipheriv, createHash, randomBytes } from "node:crypto";

import { env } from "@doresume/env/server";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

const IV_BYTES = 12;

const encryptionKey = () =>
  createHash("sha256").update(env.BETTER_AUTH_SECRET).digest();

const encryptSecret = (plaintext: string) => {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `v1.${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
};

export const saveUserApplicationPassword = async (
  userId: string,
  password: string
) => {
  await db
    .update(user)
    .set({ applicationPassword: encryptSecret(password) })
    .where(eq(user.id, userId));
};

export const userHasApplicationPassword = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { applicationPassword: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.applicationPassword);
};
