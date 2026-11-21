/**
 * Fetch public channel stats and the most-viewed uploads from the YouTube Data API
 * and write them to `public/v1/youtube/channel.json` for the YouTube section.
 *
 * Env:
 *   YOUTUBE_API_KEY — Data API v3 key (when missing, nothing is written and the section shows its fallback)
 *   YOUTUBE_HANDLE  — channel handle (default: @KausDiaries)
 *   CONTENT_OUT_DIR — output root (default: public/v1)
 *   YT_OAUTH_CLIENT_ID, YT_OAUTH_CLIENT_SECRET, YT_OAUTH_REFRESH_TOKEN — channel-owner OAuth
 *     credentials for the YouTube Analytics API (see scripts/youtube-oauth-setup.mjs). When any is
 *     missing or the call fails, `channel.watchMinutes` is left out and the watch time tile hides.
 *
 * Never fails the build: any error is logged and the script exits 0.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SHORT_MAX_SECONDS, parseIsoDuration, parseWatchMinutes, selectTop } from "./youtube-select.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const KEY = (process.env.YOUTUBE_API_KEY || "").trim();
const HANDLE = process.env.YOUTUBE_HANDLE || "@KausDiaries";
const outFile = join(resolve(process.env.CONTENT_OUT_DIR || join(ROOT, "public/v1")), "youtube", "channel.json");
const TAG = "[generate-youtube-stats]";

async function api(path, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", KEY);
  const res = await fetch(url);
  // The URL carries the key, so errors report only the endpoint and status.
  if (!res.ok) throw new Error(`${path} responded ${res.status}`);
  return res.json();
}

const OAUTH = {
  clientId: (process.env.YT_OAUTH_CLIENT_ID || "").trim(),
  clientSecret: (process.env.YT_OAUTH_CLIENT_SECRET || "").trim(),
  refreshToken: (process.env.YT_OAUTH_REFRESH_TOKEN || "").trim(),
};

/** Lifetime watch time in minutes from the YouTube Analytics API, or `null` when unavailable. */
async function fetchWatchMinutes(channelPublishedAt) {
  if (!OAUTH.clientId || !OAUTH.clientSecret || !OAUTH.refreshToken) {
    console.warn(`${TAG} YT_OAUTH_* secrets are not all set — skipping watch time.`);
    return null;
  }
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: OAUTH.clientId,
        client_secret: OAUTH.clientSecret,
        refresh_token: OAUTH.refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!tokenRes.ok) throw new Error(`oauth token responded ${tokenRes.status}`);
    const { access_token: accessToken } = await tokenRes.json();

    const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
    url.searchParams.set("ids", "channel==MINE");
    url.searchParams.set("metrics", "estimatedMinutesWatched");
    url.searchParams.set("startDate", (channelPublishedAt || "2005-04-23").slice(0, 10));
    url.searchParams.set("endDate", new Date().toISOString().slice(0, 10));
    const reportRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!reportRes.ok) throw new Error(`analytics reports responded ${reportRes.status}`);
    const minutes = parseWatchMinutes(await reportRes.json());
    if (minutes == null) throw new Error("analytics report had no estimatedMinutesWatched");
    return minutes;
  } catch (err) {
    console.warn(`${TAG} watch time: ${err.message} — skipping watch time.`);
    return null;
  }
}

/** `true` / `false` from youtube.com/shorts (200 vs redirect), `null` when the check is inconclusive. */
async function shortsUrlAnswers(id) {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, { method: "HEAD", redirect: "manual" });
    if (res.status === 200) return true;
    if (res.status >= 300 && res.status < 400) return false;
  } catch {
    /* fall through to the duration heuristic */
  }
  return null;
}

async function listUploadIds(playlistId) {
  const ids = [];
  let pageToken;
  do {
    const page = await api("playlistItems", {
      part: "contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    ids.push(...page.items.map((i) => i.contentDetails.videoId));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return ids;
}

async function loadVideos(ids) {
  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await api("videos", { part: "snippet,statistics,contentDetails", id: ids.slice(i, i + 50).join(",") });
    for (const v of batch.items) {
      const seconds = parseIsoDuration(v.contentDetails.duration);
      const thumbs = v.snippet.thumbnails || {};
      videos.push({
        id: v.id,
        title: v.snippet.title,
        thumbnail: (thumbs.high || thumbs.medium || thumbs.default || {}).url || "",
        views: Number(v.statistics.viewCount || 0),
        publishedAt: v.snippet.publishedAt,
        seconds,
      });
    }
  }
  return videos;
}

async function classifyShorts(videos) {
  const candidates = videos.filter((v) => v.seconds > 0 && v.seconds <= SHORT_MAX_SECONDS);
  const verdicts = new Map();
  for (let i = 0; i < candidates.length; i += 8) {
    const slice = candidates.slice(i, i + 8);
    const answers = await Promise.all(slice.map((v) => shortsUrlAnswers(v.id)));
    slice.forEach((v, j) => verdicts.set(v.id, answers[j] ?? true));
  }
  return videos.map(({ seconds, ...v }) => ({ ...v, isShort: verdicts.get(v.id) ?? false }));
}

async function main() {
  if (!KEY) {
    console.warn(`${TAG} YOUTUBE_API_KEY is not set — skipping; the section will show its fallback.`);
    return;
  }
  const channels = await api("channels", {
    part: "snippet,statistics,contentDetails,brandingSettings",
    forHandle: HANDLE,
  });
  const ch = channels.items?.[0];
  if (!ch) throw new Error(`no channel found for ${HANDLE}`);

  const ids = await listUploadIds(ch.contentDetails.relatedPlaylists.uploads);
  const videos = await classifyShorts(await loadVideos(ids));
  const { topVideos, topShorts } = selectTop(videos, { videos: 3, shorts: 4 });
  const thumbs = ch.snippet.thumbnails || {};
  const watchMinutes = await fetchWatchMinutes(ch.snippet.publishedAt);

  const payload = {
    fetchedAt: new Date().toISOString(),
    channel: {
      title: ch.snippet.title,
      url: `https://www.youtube.com/${ch.snippet.customUrl || HANDLE}`,
      avatar: (thumbs.high || thumbs.medium || thumbs.default || {}).url || "",
      banner: (ch.brandingSettings?.image?.bannerExternalUrl || "").split("=")[0],
      subscribers: Number(ch.statistics.subscriberCount || 0),
      views: Number(ch.statistics.viewCount || 0),
      videoCount: Number(ch.statistics.videoCount || 0),
      ...(watchMinutes == null ? {} : { watchMinutes }),
    },
    topVideos,
    topShorts,
  };
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(payload)}\n`);
  console.log(`${TAG} ${ids.length} uploads → ${topVideos.length} videos, ${topShorts.length} Shorts → ${outFile}`);
}

main().catch((err) => {
  console.warn(`${TAG} ${err.message} — skipping; the section will show its fallback.`);
});
