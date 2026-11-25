// Loads the fixtures in seed-data.ts. Idempotent: re-running replaces each
// game's events and snapshots.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { games } from "./seed-data";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

async function main() {
  for (const g of games) {
    const game = await db.game.upsert({
      where: { slug: g.slug },
      update: { title: g.title, releaseDate: d(g.releaseDate), developer: g.developer, summary: g.summary },
      create: { slug: g.slug, title: g.title, releaseDate: d(g.releaseDate), developer: g.developer, summary: g.summary },
    });
    // Replace child rows so re-running the seed is idempotent.
    await db.gameEvent.deleteMany({ where: { gameId: game.id } });
    await db.scoreSnapshot.deleteMany({ where: { gameId: game.id } });
    await db.gameEvent.createMany({
      data: g.events.map((e) => ({ gameId: game.id, kind: e.kind, name: e.name, date: d(e.date) })),
    });
    if (g.snapshots?.length) {
      await db.scoreSnapshot.createMany({
        data: g.snapshots.map((s) => ({
          gameId: game.id,
          metric: s.metric,
          value: s.value,
          capturedAt: d(s.capturedAt),
          note: s.note,
        })),
      });
    }
  }
  console.log(`Seeded ${games.length} games.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
