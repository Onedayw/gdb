export const SITE_NAME = "Is It Good Now?";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function signed(n: number) {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
}
