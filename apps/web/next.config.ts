import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@db-sdk/core", "@db-sdk/ui"],
};

export default withMDX(nextConfig);
