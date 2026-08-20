import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@db-sdk/ui", "db-sdk"],
};

export default withMDX(nextConfig);
