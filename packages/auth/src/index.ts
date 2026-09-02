import { expo } from "@better-auth/expo";
import { createDb } from "@doresume/db";
import * as schema from "@doresume/db/schema";
import { env } from "@doresume/env/server";
import { autumn } from "autumn-js/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { bearer, lastLoginMethod } from "better-auth/plugins";

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
      // Accepts `Authorization: Bearer <session token>`, which the native
      // app and the eve agents use to identify the signed-in user.
      bearer(),
      expo(),
      lastLoginMethod({
        storeInDatabase: true,
      }),
      nextCookies(),
      autumn({
        identify: ({ session }) => ({
          customerData: {
            email: session?.user.email,
            name: session?.user.name,
          },
          customerId: session?.user.id ?? "",
        }),
      }),
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
    user: {
      deleteUser: {
        enabled: true,
      },
    },
  });
};

export const auth = createAuth();
