// Fixture data for the 20 MVP games, kept free of database imports so it can
// be checked by unit tests (see seed-data.test.ts).
//
// Titles, release dates and patch/expansion dates are public facts but have
// not been checked against a source yet (no sourceUrl, so the UI marks them
// unverified). The only score numbers are the two from the product brief
// (No Man's Sky 50 -> 82, Battlefield 2042 41 -> 56), recorded as Steam
// overall % until the metric is confirmed. Replace with sourced data before
// launch.
import type { EventKind, Metric } from "../src/lib/timeline";

export interface SeedGame {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  releaseDate: string;
  developer: string;
  summary: string;
  events: { kind: EventKind; name: string; date: string }[];
  snapshots?: { metric: Metric; value: number; capturedAt: string; note: string }[];
}

export const BRIEF_NOTE = "From product brief; metric and source to confirm.";

export const games: SeedGame[] = [
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
  {
    slug: "final-fantasy-xiv",
    title: "Final Fantasy XIV",
    releaseDate: "2010-09-30",
    developer: "Square Enix",
    summary: "So poorly received that Square Enix shut it down and relaunched it as A Realm Reborn.",
    events: [
      { kind: "LAUNCH", name: "Launch (version 1.0)", date: "2010-09-30" },
      { kind: "RELAUNCH", name: "A Realm Reborn", date: "2013-08-27" },
      { kind: "EXPANSION", name: "Heavensward", date: "2015-06-23" },
      { kind: "EXPANSION", name: "Shadowbringers", date: "2019-07-02" },
      { kind: "EXPANSION", name: "Endwalker", date: "2021-12-07" },
    ],
  },
  {
    slug: "diablo-iii",
    title: "Diablo III",
    releaseDate: "2012-05-15",
    developer: "Blizzard Entertainment",
    summary: "Always-online launch and the real-money auction house, fixed by Loot 2.0 and Reaper of Souls.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2012-05-15" },
      { kind: "PATCH", name: "Patch 2.0 (Loot 2.0)", date: "2014-02-25" },
      { kind: "EXPANSION", name: "Reaper of Souls", date: "2014-03-25" },
    ],
  },
  {
    slug: "star-wars-battlefront-ii",
    title: "Star Wars Battlefront II",
    releaseDate: "2017-11-17",
    developer: "DICE",
    summary: "The loot-box backlash game; progression was overhauled and later content was well liked.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2017-11-17" },
      { kind: "PATCH", name: "Progression overhaul", date: "2018-03-21" },
    ],
  },
  {
    slug: "rainbow-six-siege",
    title: "Rainbow Six Siege",
    releaseDate: "2015-12-01",
    developer: "Ubisoft Montreal",
    summary: "Modest, buggy launch that grew into a long-running competitive shooter.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2015-12-01" },
      { kind: "SEASON", name: "Operation Health", date: "2017-06-06" },
    ],
  },
  {
    slug: "street-fighter-v",
    title: "Street Fighter V",
    releaseDate: "2016-02-16",
    developer: "Capcom",
    summary: "Shipped without an arcade mode; Arcade Edition and Champion Edition filled it out.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2016-02-16" },
      { kind: "RELAUNCH", name: "Arcade Edition", date: "2018-01-16" },
      { kind: "RELAUNCH", name: "Champion Edition", date: "2020-02-14" },
    ],
  },
  {
    slug: "assassins-creed-unity",
    title: "Assassin's Creed Unity",
    releaseDate: "2014-11-11",
    developer: "Ubisoft Montreal",
    summary: "Infamous for launch bugs; patched into a game many now rate well.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2014-11-11" },
      { kind: "EXPANSION", name: "Dead Kings", date: "2015-01-13" },
    ],
  },
  {
    slug: "halo-the-master-chief-collection",
    title: "Halo: The Master Chief Collection",
    releaseDate: "2014-11-11",
    developer: "343 Industries",
    summary: "Broken matchmaking at launch; years of fixes and a PC release turned it around.",
    events: [
      { kind: "LAUNCH", name: "Launch (Xbox One)", date: "2014-11-11" },
      { kind: "RELAUNCH", name: "PC release (Halo: Reach)", date: "2019-12-03" },
    ],
  },
  {
    slug: "ghost-recon-breakpoint",
    title: "Ghost Recon Breakpoint",
    releaseDate: "2019-10-04",
    developer: "Ubisoft Paris",
    summary: "Panned for gear-score and monetisation; the Ghost Experience update let players turn them off.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2019-10-04" },
      { kind: "PATCH", name: "Ghost Experience update", date: "2020-03-24" },
    ],
  },
  {
    slug: "destiny-2",
    title: "Destiny 2",
    releaseDate: "2017-09-06",
    developer: "Bungie",
    summary: "Repeated swings: Forsaken lifted it, later years moved it up and down.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2017-09-06" },
      { kind: "EXPANSION", name: "Forsaken", date: "2018-09-04" },
      { kind: "EXPANSION", name: "Shadowkeep and New Light (free-to-play)", date: "2019-10-01" },
      { kind: "EXPANSION", name: "The Final Shape", date: "2024-06-04" },
    ],
  },
  {
    slug: "the-sims-4",
    title: "The Sims 4",
    releaseDate: "2014-09-02",
    developer: "Maxis",
    summary: "Launched missing series staples; rebuilt through packs, and the base game went free.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2014-09-02" },
      { kind: "PATCH", name: "Base game goes free-to-play", date: "2022-10-18" },
    ],
  },
  {
    slug: "need-for-speed-payback",
    title: "Need for Speed Payback",
    releaseDate: "2017-11-10",
    developer: "Ghost Games",
    summary: "Criticised for a grindy, loot-box progression system that later updates loosened.",
    events: [{ kind: "LAUNCH", name: "Launch", date: "2017-11-10" }],
  },
  {
    slug: "ryse-son-of-rome",
    title: "Ryse: Son of Rome",
    releaseDate: "2013-11-22",
    developer: "Crytek",
    summary: "Xbox One launch showpiece knocked for shallow combat; the PC port came a year later.",
    events: [
      { kind: "LAUNCH", name: "Launch (Xbox One)", date: "2013-11-22" },
      { kind: "RELAUNCH", name: "PC release", date: "2014-10-10" },
    ],
  },
  {
    slug: "mass-effect-andromeda",
    title: "Mass Effect: Andromeda",
    releaseDate: "2017-03-21",
    developer: "BioWare",
    summary: "Mocked for its animations; patched, but single-player support ended early.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2017-03-21" },
      { kind: "PATCH", name: "Patch 1.05 (animation fixes)", date: "2017-04-06" },
    ],
  },
  {
    slug: "anthem",
    title: "Anthem",
    releaseDate: "2019-02-22",
    developer: "BioWare",
    summary: "The failure control: a planned overhaul was cancelled and support ended in February 2021.",
    events: [
      { kind: "LAUNCH", name: "Launch", date: "2019-02-22" },
      { kind: "END_OF_SUPPORT", name: "Anthem Next cancelled, support ends", date: "2021-02-24" },
    ],
  },
];
