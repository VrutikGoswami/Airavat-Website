import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Demonstration imagery is real licensed photography (Unsplash License,
  // free for commercial use, no attribution required) served locally from
  // /public/images. Swap individual files for final brand photography before
  // launch — see README "Image replacement".
};

export default nextConfig;
