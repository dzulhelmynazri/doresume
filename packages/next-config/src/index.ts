import type { NextConfig } from "next";

export const nextConfig = {
  cacheComponents: true,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    turbopackRustReactCompiler: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["@firecrawl/anydoc"],
} satisfies NextConfig;
