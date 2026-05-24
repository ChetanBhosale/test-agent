import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next.js doesn't pick up the
  // sibling Riverline v1 lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
