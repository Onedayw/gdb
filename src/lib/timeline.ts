// Pure logic for "Is it good now?" timelines. No database or framework
// imports, so it is easy to unit test.

export type Metric =
  | "METACRITIC_CRITIC"
  | "METACRITIC_USER"
  | "OPENCRITIC_TOP_CRITIC"
  | "STEAM_OVERALL_PCT"
  | "STEAM_RECENT_PCT";

export type EventKind = "LAUNCH" | "PATCH" | "EXPANSION" | "SEASON" | "RELAUNCH";

export interface Snapshot {
  metric: Metric;
  value: number;
  capturedAt: Date;
  sourceUrl?: string | null;
}

export interface TimelineEvent {
  kind: EventKind;
  name: string;
  date: Date;
}

export const METRIC_LABELS: Record<Metric, string> = {
  METACRITIC_CRITIC: "Metacritic critics",
  METACRITIC_USER: "Metacritic users",
  OPENCRITIC_TOP_CRITIC: "OpenCritic top critics",
  STEAM_OVERALL_PCT: "Steam overall % positive",
  STEAM_RECENT_PCT: "Steam recent (30 days) % positive",
};

/**
 * Metrics that can show a game recovering, in order of preference for the
 * headline "launch vs now" number. Metacritic critic scores are excluded
 * because they mostly freeze at launch; Steam recent is excluded because it
 * is a rolling window rather than a cumulative score.
 */
export const HEADLINE_PRIORITY: Metric[] = [
  "STEAM_OVERALL_PCT",
  "METACRITIC_USER",
  "OPENCRITIC_TOP_CRITIC",
];

/** How many points a score must move before we call it a change. */
export const MOVE_THRESHOLD = 5;

const byDate = <T>(get: (x: T) => Date) => (a: T, b: T) =>
  get(a).getTime() - get(b).getTime();

export function seriesFor(snapshots: Snapshot[], metric: Metric): Snapshot[] {
  return snapshots
    .filter((s) => s.metric === metric)
    .sort(byDate((s) => s.capturedAt));
}

export interface LaunchVsNow {
  metric: Metric;
  launch: Snapshot;
  current: Snapshot;
  delta: number;
}

/** Earliest vs latest value of one metric, or null with fewer than 2 points. */
export function launchVsNow(
  snapshots: Snapshot[],
  metric: Metric,
): LaunchVsNow | null {
  const series = seriesFor(snapshots, metric);
  if (series.length < 2) return null;
  const launch = series[0];
  const current = series[series.length - 1];
  return { metric, launch, current, delta: current.value - launch.value };
}

/** The first metric in HEADLINE_PRIORITY that has a launch and a current value. */
export function headline(snapshots: Snapshot[]): LaunchVsNow | null {
  for (const metric of HEADLINE_PRIORITY) {
    const result = launchVsNow(snapshots, metric);
    if (result) return result;
  }
  return null;
}

export type Verdict = "better" | "worse" | "same" | "unknown";

export function verdict(h: LaunchVsNow | null): Verdict {
  if (!h) return "unknown";
  if (h.delta >= MOVE_THRESHOLD) return "better";
  if (h.delta <= -MOVE_THRESHOLD) return "worse";
  return "same";
}

export interface SteamGap {
  overall: number;
  recent: number;
  /** recent - overall. Positive means players like it more now than on average. */
  gap: number;
}

/** Latest Steam overall % vs latest Steam recent-30-days %. */
export function steamGap(snapshots: Snapshot[]): SteamGap | null {
  const overall = seriesFor(snapshots, "STEAM_OVERALL_PCT").at(-1);
  const recent = seriesFor(snapshots, "STEAM_RECENT_PCT").at(-1);
  if (!overall || !recent) return null;
  return {
    overall: overall.value,
    recent: recent.value,
    gap: recent.value - overall.value,
  };
}

export interface ScoreMove {
  metric: Metric;
  from: Snapshot;
  to: Snapshot;
  delta: number;
  /** Events dated after `from` and on or before `to`: the likely causes. */
  causes: TimelineEvent[];
}

/**
 * Consecutive snapshot pairs whose value moved by at least `threshold`,
 * each with the events that happened in between.
 */
export function attributeMoves(
  snapshots: Snapshot[],
  events: TimelineEvent[],
  metric: Metric,
  threshold = MOVE_THRESHOLD,
): ScoreMove[] {
  const series = seriesFor(snapshots, metric);
  const sortedEvents = [...events].sort(byDate((e) => e.date));
  const moves: ScoreMove[] = [];
  for (let i = 1; i < series.length; i++) {
    const from = series[i - 1];
    const to = series[i];
    const delta = to.value - from.value;
    if (Math.abs(delta) < threshold) continue;
    const causes = sortedEvents.filter(
      (e) =>
        e.date.getTime() > from.capturedAt.getTime() &&
        e.date.getTime() <= to.capturedAt.getTime(),
    );
    moves.push({ metric, from, to, delta, causes });
  }
  return moves;
}
