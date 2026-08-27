import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { env } from "@doresume/env/server";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

const IV_BYTES = 12;
const SECRET_VERSION = "v1";

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

  return `${SECRET_VERSION}.${iv.toString("base64url")}.${authTag.toString("base64url")}.${encrypted.toString("base64url")}`;
};

const decryptSecret = (payload: string) => {
  const [version, ivValue, authTagValue, encryptedValue] = payload.split(".");

  if (
    version !== SECRET_VERSION ||
    ivValue === undefined ||
    authTagValue === undefined ||
    encryptedValue === undefined
  ) {
    throw new Error("Invalid encrypted secret.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivValue, "base64url")
  );
  decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf-8");
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

export const getUserApplicationPassword = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { applicationPassword: true },
    where: eq(user.id, userId),
  });

  if (!record?.applicationPassword) {
    return null;
  }

  try {
    return decryptSecret(record.applicationPassword);
  } catch {
    return null;
  }
};

export const userHasApplicationPassword = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { applicationPassword: true },
    where: eq(user.id, userId),
  });

  return Boolean(record?.applicationPassword);
};
