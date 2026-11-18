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
