import { expo } from "@better-auth/expo";
import { createDb } from "@doresume/db";
import * as schema from "@doresume/db/schema/auth";
import { env } from "@doresume/env/server";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { polarClient } from "./lib/payments";

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
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            authenticatedUsersOnly: true,
            products: [
              {
                productId: "your-product-id",
                slug: "pro",
              },
            ],
            successUrl: env.POLAR_SUCCESS_URL,
          }),
          portal(),
        ],
      }),
      nextCookies(),
      expo(),
    ],
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      "doresume://",
      "exp://",
      "http://localhost:8081",
    ],
  });
};

export const auth = createAuth();
