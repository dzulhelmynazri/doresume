import { expoClient } from "@better-auth/expo/client";
import { lastLoginMethodClient } from "@better-auth/expo/plugins";
import { env } from "@doresume/env/native";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const storagePrefix = Constants.expoConfig?.scheme as string;

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
      storagePrefix,
    }),
    lastLoginMethodClient({
      storage: SecureStore,
      storagePrefix,
    }),
  ],
});
