# gdb

Video game database platform, starting with one question: **"Is it good now?"**

Metacritic mostly freezes an outlet's launch score, OpenCritic moves slowly, and
Steam's % positive doesn't say when it changed. Each game page here shows a
timeline instead: launch score vs. current score, Steam overall % vs. recent
30-day %, and the patch or expansion that moved it.

The MVP is 20 hand-picked games. Lead examples: No Man's Sky, Cyberpunk 2077,
Fallout 76, Battlefield 2042, Sea of Thieves, and Starfield as the inverse case
where reception went down. We expand only once those pages are live, indexed,
and getting traffic.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript) with Cache Components, so
  game pages are prerendered as static HTML
- PostgreSQL via [Prisma](https://www.prisma.io) 7
- ESLint, [Vitest](https://vitest.dev), and GitHub Actions CI

## Getting started

Requirements: Node 22+, and either Docker or a local Postgres 16.

```bash
npm install                 # also runs `prisma generate`
cp .env.example .env
docker compose up -d        # starts Postgres on localhost:5432 (user/pass/db: gdb)
npm run db:migrate          # applies migrations
npm run db:seed             # loads the 20 MVP games
npm run dev                 # http://localhost:3000
```

Using your own Postgres instead of Docker? Point `DATABASE_URL` in `.env` at it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build. Needs a migrated, seeded database, because it prerenders every game page |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Unit tests (Vitest) |
| `npm run db:migrate` | Create/apply a migration after editing `prisma/schema.prisma` |
| `npm run db:deploy` | Apply existing migrations (CI/production) |
| `npm run db:seed` | Load fixture data from `prisma/seed.ts` |
| `npm run db:studio` | Browse the database in Prisma Studio |

## How it fits together

- `prisma/schema.prisma`: `Game`, `ScoreSnapshot` (one dated value of one metric,
  such as Steam overall % or Metacritic critic score), and `GameEvent` (launch,
  patch, expansion, season).
- `src/lib/timeline.ts`: pure functions that turn snapshots and events into the
  page: launch vs. now, verdict, Steam overall vs. recent gap, and which events
  sit between two snapshots where the score moved. Tested in `timeline.test.ts`.
- `src/lib/games.ts`: cached database reads (`"use cache"`, refreshed daily or via
  `revalidateTag("games")`).
- `src/app/games/[slug]/page.tsx`: the per-game page, prerendered for every game
  via `generateStaticParams`, with SEO metadata. `sitemap.xml` and `robots.txt`
  are generated too.

## Seed data

`prisma/seed-data.ts` holds development fixtures for the 20 MVP games: release
dates and the patches, expansions, relaunches and end-of-support dates that may
explain a score move. Anthem is the failure control (support ended February
2021) and Starfield the inverse control. None of it has been checked against a
source yet. The only scores are the two figures from the product brief (No Man's
Sky 50 → 82, Battlefield 2042 41 → 56), recorded as Steam overall % pending
confirmation. Anything without a `sourceUrl` is shown as "unverified" on the page.
`prisma/seed-data.test.ts` checks the fixtures are well formed.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests: install,
lint, typecheck, test, then migrate and seed a Postgres service and run the
production build.
