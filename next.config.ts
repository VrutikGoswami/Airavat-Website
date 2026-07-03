import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Demonstration imagery ships as locally generated SVG scenes so the build
  // has zero licensing risk. Replace with licensed photography before launch
  // (see README "Image replacement"), then remove dangerouslyAllowSVG.
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
