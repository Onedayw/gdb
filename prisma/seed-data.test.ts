import { describe, expect, it } from "vitest";
import { games } from "./seed-data";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

describe("seed data", () => {
  it("has the 20 MVP games with unique slugs", () => {
    expect(games).toHaveLength(20);
    expect(new Set(games.map((g) => g.slug)).size).toBe(20);
  });

  it.each(games.map((g) => [g.slug, g] as const))("%s has a valid timeline", (_slug, g) => {
    expect(g.releaseDate).toMatch(ISO);
    const launch = g.events.filter((e) => e.kind === "LAUNCH");
    expect(launch).toHaveLength(1);
    expect(launch[0].date).toBe(g.releaseDate);
    for (const e of g.events) {
      expect(e.date).toMatch(ISO);
      expect(e.date >= g.releaseDate).toBe(true);
    }
    for (const s of g.snapshots ?? []) {
      expect(s.capturedAt >= g.releaseDate).toBe(true);
      expect(s.value).toBeGreaterThanOrEqual(0);
      expect(s.value).toBeLessThanOrEqual(100);
    }
  });
});
