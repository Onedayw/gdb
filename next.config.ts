import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under /gdb on natewang.dev, via a rewrite from the main site.
  // basePath makes links, assets and routes all live under /gdb.
  basePath: "/gdb",
  output: "standalone",
  // Pages are prerendered from cached data ("use cache") so they ship as
  // static HTML that search engines can index.
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
