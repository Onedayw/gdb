import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages are prerendered from cached data ("use cache") so they ship as
  // static HTML that search engines can index.
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
