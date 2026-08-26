import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

const ignorePatterns = [
  ...(core.ignorePatterns ?? []),
  "packages/ui/**",
  ".agents/**",
  ".claude/**",
  "apps/native/metro.config.js",
  ".blume/**",
  ".blume-verify/**",
];

export default defineConfig({
  extends: [core, react, next],
  ignorePatterns,
  overrides: [
    {
      files: ["apps/extension/**"],
      rules: {
        "nextjs/no-img-element": "off",
        "unicorn/filename-case": "off",
      },
    },
    {
      files: ["packages/db/src/schema/**"],
      rules: {
        "eslint/no-inline-comments": "off",
        "oxc/no-barrel-file": "off",
        "unicorn/require-module-specifiers": "off",
      },
    },
  ],
});
