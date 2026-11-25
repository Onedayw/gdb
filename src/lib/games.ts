import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

// Data changes when we add a snapshot (a few times a week at most), so pages
// are prerendered and refreshed on a daily cadence or via revalidateTag("games").

export async function listGames() {
  "use cache";
  cacheLife("days");
  cacheTag("games");
  return db.game.findMany({
    orderBy: { title: "asc" },
    include: {
      snapshots: { orderBy: { capturedAt: "asc" } },
    },
  });
}

export async function getGame(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("games", `game:${slug}`);
  return db.game.findUnique({
    where: { slug },
    include: {
      snapshots: { orderBy: { capturedAt: "asc" } },
      events: { orderBy: { date: "asc" } },
    },
  });
}

export async function listGameSlugs() {
  "use cache";
  cacheLife("days");
  cacheTag("games");
  return db.game.findMany({ select: { slug: true, updatedAt: true } });
}
