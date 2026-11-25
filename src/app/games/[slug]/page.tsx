import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGame, listGameSlugs } from "@/lib/games";
import {
  METRIC_LABELS,
  attributeMoves,
  headline,
  steamGap,
  verdict,
  type Snapshot,
  type TimelineEvent,
} from "@/lib/timeline";
import { formatDate, signed } from "@/lib/site";

// Every game page is prerendered at build time. Unknown slugs render notFound().

export async function generateStaticParams() {
  const games = await listGameSlugs();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return {};
  const h = headline(game.snapshots as Snapshot[]);
  const description = h
    ? `${game.title}: ${Math.round(h.launch.value)} at launch, ${Math.round(h.current.value)} now (${METRIC_LABELS[h.metric]}). See which patches changed it.`
    : `${game.title}: launch score vs. today, and the patches and expansions in between.`;
  return {
    title: `Is ${game.title} good now?`,
    description,
    alternates: { canonical: `/games/${game.slug}` },
  };
}

type Row =
  | { type: "event"; date: Date; event: TimelineEvent }
  | { type: "score"; date: Date; snapshot: Snapshot & { note?: string | null } };

export default async function GamePage({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const snapshots = game.snapshots as (Snapshot & { note: string | null })[];
  const events = game.events as TimelineEvent[];
  const h = headline(snapshots);
  const v = verdict(h);
  const gap = steamGap(snapshots);
  const moves = h ? attributeMoves(snapshots, events, h.metric) : [];

  const rows: Row[] = [
    ...events.map((event) => ({ type: "event" as const, date: event.date, event })),
    ...snapshots.map((snapshot) => ({ type: "score" as const, date: snapshot.capturedAt, snapshot })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <article>
      <h1>Is {game.title} good now?</h1>
      <p className="muted">
        Released {formatDate(game.releaseDate)}
        {game.developer ? ` by ${game.developer}` : ""}.
        {game.summary ? ` ${game.summary}` : ""}
      </p>

      <div className="cards">
        <div className="card">
          <div className="muted">At launch</div>
          <div className="big">{h ? Math.round(h.launch.value) : "–"}</div>
          {h && <div className="muted">{METRIC_LABELS[h.metric]}</div>}
        </div>
        <div className="card">
          <div className="muted">Now</div>
          <div className={`big ${v === "better" || v === "worse" ? v : ""}`}>
            {h ? `${Math.round(h.current.value)} (${signed(h.delta)})` : "–"}
          </div>
          {h && <div className="muted">as of {formatDate(h.current.capturedAt)}</div>}
        </div>
        <div className="card">
          <div className="muted">Steam overall vs recent 30 days</div>
          <div className="big">{gap ? `${Math.round(gap.overall)}% / ${Math.round(gap.recent)}%` : "–"}</div>
          {gap && <div className="muted">Recent is {signed(gap.gap)} vs overall</div>}
        </div>
      </div>

      {moves.length > 0 && (
        <>
          <h2>What moved the score</h2>
          <ul>
            {moves.map((m) => (
              <li key={`${m.from.capturedAt.toISOString()}-${m.to.capturedAt.toISOString()}`}>
                <span className={m.delta > 0 ? "better" : "worse"}>{signed(m.delta)}</span>{" "}
                between {formatDate(m.from.capturedAt)} and {formatDate(m.to.capturedAt)}
                {m.causes.length > 0
                  ? `, after ${m.causes.map((c) => c.name).join(", ")}`
                  : ", with no logged patch in between"}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Timeline</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>What</th>
            <th className="num">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) =>
            row.type === "event" ? (
              <tr key={i}>
                <td>{formatDate(row.date)}</td>
                <td>
                  <strong>{row.event.name}</strong> <span className="tag">{row.event.kind.toLowerCase()}</span>
                </td>
                <td />
              </tr>
            ) : (
              <tr key={i}>
                <td>{formatDate(row.date)}</td>
                <td>
                  {METRIC_LABELS[row.snapshot.metric]}{" "}
                  {!row.snapshot.sourceUrl && <span className="tag">unverified</span>}
                  {row.snapshot.note && <div className="muted">{row.snapshot.note}</div>}
                </td>
                <td className="num">{Math.round(row.snapshot.value)}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </article>
  );
}
