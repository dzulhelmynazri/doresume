import { expo } from "@better-auth/expo";
import { createDb } from "@doresume/db";
import * as schema from "@doresume/db/schema/auth";
import { env } from "@doresume/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";

export const createAuth = () => {
  const db = createDb();

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "pg",

      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      expo(),
      lastLoginMethod({
        storeInDatabase: true,
      }),
      nextCookies(),
    ],
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        prompt: "select_account",
      },
      linkedin: {
        clientId: env.LINKEDIN_CLIENT_ID,
        clientSecret: env.LINKEDIN_CLIENT_SECRET,
        mapProfileToUser: (profile) => ({
          email: profile.email ?? `${profile.sub}@linkedin.placeholder.invalid`,
        }),
      },
    },
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      "doresume://",
      "exp://",
      "http://localhost:8081",
    ],
  });
};

export const auth = createAuth();
