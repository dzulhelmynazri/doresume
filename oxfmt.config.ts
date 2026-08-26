import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    "packages/ui/**",
    ".agents/**",
    ".claude/**",
    ".blume/**",
    ".blume-verify/**",
    "apps/docs/content/**",
  ],
});
