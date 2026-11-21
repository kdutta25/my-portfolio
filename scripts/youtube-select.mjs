/** Longest duration YouTube allows for a Short. */
export const SHORT_MAX_SECONDS = 180;

/** Parse an ISO 8601 duration such as `PT1H2M3S` into seconds (0 when unparseable). */
export function parseIsoDuration(iso) {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(iso || "");
  if (!m) return 0;
  const [, d = 0, h = 0, min = 0, s = 0] = m;
  return Number(d) * 86400 + Number(h) * 3600 + Number(min) * 60 + Number(s);
}

/**
 * Read lifetime `estimatedMinutesWatched` from a YouTube Analytics v2 report with no dimensions.
 * Returns `null` when the report has no such column or no usable value.
 */
export function parseWatchMinutes(report) {
  const col = (report?.columnHeaders || []).findIndex((h) => h?.name === "estimatedMinutesWatched");
  const value = col >= 0 ? Number(report?.rows?.[0]?.[col]) : NaN;
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}

/**
 * Split uploads into regular videos and Shorts, each sorted by views (descending) and trimmed.
 * Items need `{ id, views, isShort }`; everything else passes through untouched.
 */
export function selectTop(items, { videos = 3, shorts = 4 } = {}) {
  const byViews = [...items].sort((a, b) => b.views - a.views);
  return {
    topVideos: byViews.filter((v) => !v.isShort).slice(0, videos),
    topShorts: byViews.filter((v) => v.isShort).slice(0, shorts),
  };
}
