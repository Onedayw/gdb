// Development fixtures for the six lead games in the MVP.
//
// Titles, release dates and patch/expansion dates are public facts but have
// not been checked against a source yet (sourceUrl is null, so the UI marks
// them unverified). The only score numbers here are the two from the product
// brief (No Man's Sky 50 -> 82, Battlefield 2042 41 -> 56); which metric they
// are is still to be confirmed. Replace everything with sourced data before
// launch.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { GameEventKind, ScoreMetric } from "../src/generated/prisma/enums";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

interface SeedGame {
  slug: string;
  title: string;
  releaseDate: string;
  developer: string;
  summary: string;
  events: { kind: GameEventKind; name: string; date: string }[];
  snapshots?: { metric: ScoreMetric; value: number; capturedAt: string; note: string }[];
}

const BRIEF_NOTE = "From product brief; metric and source to confirm.";

const games: SeedGame[] = [
  {
    slug: "no-mans-sky",
    title: "No Man's Sky",
    releaseDate: "2016-08-09",
    developer: "Hello Games",
    summary: "The canonical comeback: panned at launch, rebuilt through years of free updates.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2016-08-09" },
      { kind: "PATCH", name: "Foundation Update", date: "2016-11-27" },
      { kind: "PATCH", name: "NEXT", date: "2018-07-24" },
    ],
    snapshots: [
      { metric: "STEAM_OVERALL_PCT", value: 50, capturedAt: "2016-08-09", note: BRIEF_NOTE },
      { metric: "STEAM_OVERALL_PCT", value: 82, capturedAt: "2026-11-25", note: BRIEF_NOTE },
    ],
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
    summary: "Broken console launch, recovered with update 2.0 and Phantom Liberty.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2020-12-10" },
      { kind: "PATCH", name: "Update 2.0", date: "2023-09-21" },
      { kind: "EXPANSION", name: "Phantom Liberty", date: "2023-09-26" },
    ],
  },
  {
    slug: "fallout-76",
    title: "Fallout 76",
    releaseDate: "2018-11-14",
    developer: "Bethesda Game Studios",
    summary: "Launched without human NPCs; Wastelanders added them back.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2018-11-14" },
      { kind: "EXPANSION", name: "Wastelanders", date: "2020-04-14" },
    ],
  },
  {
    slug: "battlefield-2042",
    title: "Battlefield 2042",
    releaseDate: "2021-11-19",
    developer: "DICE",
    summary: "Rough launch, partial recovery through seasons and map reworks.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2021-11-19" },
      { kind: "SEASON", name: "Season 1: Zero Hour", date: "2022-06-09" },
    ],
    snapshots: [
      { metric: "STEAM_OVERALL_PCT", value: 41, capturedAt: "2021-11-19", note: BRIEF_NOTE },
      { metric: "STEAM_OVERALL_PCT", value: 56, capturedAt: "2026-11-25", note: BRIEF_NOTE },
    ],
  },
  {
    slug: "sea-of-thieves",
    title: "Sea of Thieves",
    releaseDate: "2018-03-20",
    developer: "Rare",
    summary: "Thin at launch, filled out by free content updates.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2018-03-20" },
      { kind: "PATCH", name: "Anniversary Update", date: "2019-04-30" },
    ],
  },
  {
    slug: "starfield",
    title: "Starfield",
    releaseDate: "2023-09-06",
    developer: "Bethesda Game Studios",
    summary: "The inverse control: reviewed well at launch, player sentiment fell afterwards.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2023-09-06" },
      { kind: "EXPANSION", name: "Shattered Space", date: "2024-09-30" },
    ],
  },
];

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
