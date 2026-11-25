import Link from "next/link";
import { listGames } from "@/lib/games";
import { headline, verdict, type Snapshot } from "@/lib/timeline";
import { signed } from "@/lib/site";

const VERDICT_TEXT = {
  better: "Better now",
  worse: "Worse now",
  same: "About the same",
  unknown: "Not enough data yet",
} as const;

export default async function Home() {
  const games = await listGames();

  return (
    <>
      <h1>Is it good now?</h1>
      <p className="muted">
        Review aggregators mostly freeze a game&apos;s launch score. We track how reception
        moved after patches and expansions, so you can tell whether a game got better.
      </p>

      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th className="num">Launch</th>
            <th className="num">Now</th>
            <th className="num">Change</th>
            <th className="hide-sm">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const h = headline(game.snapshots as Snapshot[]);
            const v = verdict(h);
            return (
              <tr key={game.id}>
                <td>
                  <Link href={`/games/${game.slug}`}>{game.title}</Link>
                </td>
                <td className="num">{h ? Math.round(h.launch.value) : "–"}</td>
                <td className="num">{h ? Math.round(h.current.value) : "–"}</td>
                <td className={`num ${v === "better" || v === "worse" ? v : ""}`}>
                  {h ? signed(h.delta) : "–"}
                </td>
                <td className="hide-sm">{VERDICT_TEXT[v]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
