import type { MetadataRoute } from "next";
import { listGameSlugs } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await listGameSlugs();
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...games.map((g) => ({
      url: `${SITE_URL}/games/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
