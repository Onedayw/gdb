import { describe, expect, it } from "vitest";
import {
  attributeMoves,
  headline,
  launchVsNow,
  steamGap,
  verdict,
  type Snapshot,
  type TimelineEvent,
} from "./timeline";

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
const snap = (metric: Snapshot["metric"], value: number, date: string): Snapshot => ({
  metric,
  value,
  capturedAt: d(date),
});

// Shaped like No Man's Sky: bad launch, big recovery after updates.
const comeback: Snapshot[] = [
  snap("STEAM_OVERALL_PCT", 82, "2024-01-01"), // deliberately out of order
  snap("STEAM_OVERALL_PCT", 50, "2016-08-09"),
  snap("STEAM_OVERALL_PCT", 70, "2018-09-01"),
  snap("METACRITIC_CRITIC", 61, "2016-08-09"),
  snap("METACRITIC_CRITIC", 61, "2024-01-01"),
  snap("STEAM_RECENT_PCT", 90, "2024-01-01"),
];

const events: TimelineEvent[] = [
  { kind: "LAUNCH", name: "Launch", date: d("2016-08-09") },
  { kind: "PATCH", name: "Foundation", date: d("2016-11-27") },
  { kind: "PATCH", name: "NEXT", date: d("2018-07-24") },
  { kind: "EXPANSION", name: "Later update", date: d("2020-01-01") },
];

describe("launchVsNow", () => {
  it("compares earliest and latest values regardless of input order", () => {
    const r = launchVsNow(comeback, "STEAM_OVERALL_PCT");
    expect(r?.launch.value).toBe(50);
    expect(r?.current.value).toBe(82);
    expect(r?.delta).toBe(32);
  });

  it("returns null with fewer than two points", () => {
    expect(launchVsNow([snap("STEAM_OVERALL_PCT", 50, "2016-08-09")], "STEAM_OVERALL_PCT")).toBeNull();
  });
});

describe("headline", () => {
  it("prefers Steam overall over the frozen Metacritic critic score", () => {
    expect(headline(comeback)?.metric).toBe("STEAM_OVERALL_PCT");
  });

  it("never uses the Metacritic critic score as the headline", () => {
    expect(headline([snap("METACRITIC_CRITIC", 61, "2016-08-09"), snap("METACRITIC_CRITIC", 70, "2020-01-01")])).toBeNull();
  });
});

describe("verdict", () => {
  it("calls a recovery better", () => {
    expect(verdict(headline(comeback))).toBe("better");
  });

  it("calls a decline worse (the Starfield case)", () => {
    const decline = [snap("STEAM_OVERALL_PCT", 70, "2023-09-06"), snap("STEAM_OVERALL_PCT", 58, "2025-01-01")];
    expect(verdict(headline(decline))).toBe("worse");
  });

  it("treats small moves as the same, and missing data as unknown", () => {
    const flat = [snap("STEAM_OVERALL_PCT", 70, "2023-01-01"), snap("STEAM_OVERALL_PCT", 72, "2025-01-01")];
    expect(verdict(headline(flat))).toBe("same");
    expect(verdict(null)).toBe("unknown");
  });
});

describe("steamGap", () => {
  it("returns recent minus overall using the latest values", () => {
    expect(steamGap(comeback)).toEqual({ overall: 82, recent: 90, gap: 8 });
  });

  it("returns null without both series", () => {
    expect(steamGap([snap("STEAM_OVERALL_PCT", 82, "2024-01-01")])).toBeNull();
  });
});

describe("attributeMoves", () => {
  it("links each significant move to the events between the two snapshots", () => {
    const moves = attributeMoves(comeback, events, "STEAM_OVERALL_PCT");
    expect(moves.map((m) => [m.delta, m.causes.map((c) => c.name)])).toEqual([
      [20, ["Foundation", "NEXT"]],
      [12, ["Later update"]],
    ]);
  });

  it("does not count an event on the earlier snapshot's own date", () => {
    const moves = attributeMoves(comeback, events, "STEAM_OVERALL_PCT");
    expect(moves[0].causes.some((c) => c.name === "Launch")).toBe(false);
  });

  it("skips moves smaller than the threshold", () => {
    expect(attributeMoves(comeback, events, "STEAM_OVERALL_PCT", 25)).toEqual([]);
  });
});
