-- CreateEnum
CREATE TYPE "ScoreMetric" AS ENUM ('METACRITIC_CRITIC', 'METACRITIC_USER', 'OPENCRITIC_TOP_CRITIC', 'STEAM_OVERALL_PCT', 'STEAM_RECENT_PCT');

-- CreateEnum
CREATE TYPE "GameEventKind" AS ENUM ('LAUNCH', 'PATCH', 'EXPANSION', 'SEASON', 'RELAUNCH');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" DATE NOT NULL,
    "developer" TEXT,
    "steamAppId" INTEGER,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreSnapshot" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "metric" "ScoreMetric" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER,
    "capturedAt" DATE NOT NULL,
    "sourceUrl" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "kind" "GameEventKind" NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "summary" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Game_steamAppId_key" ON "Game"("steamAppId");

-- CreateIndex
CREATE INDEX "ScoreSnapshot_gameId_capturedAt_idx" ON "ScoreSnapshot"("gameId", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreSnapshot_gameId_metric_capturedAt_key" ON "ScoreSnapshot"("gameId", "metric", "capturedAt");

-- CreateIndex
CREATE INDEX "GameEvent_gameId_date_idx" ON "GameEvent"("gameId", "date");

-- AddForeignKey
ALTER TABLE "ScoreSnapshot" ADD CONSTRAINT "ScoreSnapshot_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
