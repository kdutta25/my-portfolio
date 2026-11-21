/**
 * One-time local helper: sign in as the channel owner and print a refresh token for the
 * YouTube Analytics API (watch time tile). Run on your own machine, never in CI.
 *
 *   YT_OAUTH_CLIENT_ID=... YT_OAUTH_CLIENT_SECRET=... node scripts/youtube-oauth-setup.mjs
 *
 * The OAuth client must be a "Desktop app" client, and its consent screen must be "In production";
 * in "Testing" Google expires refresh tokens after 7 days. Store the printed token as the
 * `YT_OAUTH_REFRESH_TOKEN` repo secret (for example `gh secret set YT_OAUTH_REFRESH_TOKEN`).
 */
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

const SCOPE = "https://www.googleapis.com/auth/yt-analytics.readonly";
const clientId = (process.env.YT_OAUTH_CLIENT_ID || "").trim();
const clientSecret = (process.env.YT_OAUTH_CLIENT_SECRET || "").trim();

if (!clientId || !clientSecret) {
  console.error("Set YT_OAUTH_CLIENT_ID and YT_OAUTH_CLIENT_SECRET (from your Desktop app OAuth client), then rerun.");
  process.exit(1);
}

const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("hex");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const finish = (status, message) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(message);
    server.close();
  };
  if (url.searchParams.get("state") !== state) return finish(400, "State mismatch. Rerun the helper.");
  const code = url.searchParams.get("code");
  if (!code) return finish(400, `Sign-in was not completed (${url.searchParams.get("error") || "no code"}).`);

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
    });
    const body = await tokenRes.json();
    if (!tokenRes.ok || !body.refresh_token) {
      finish(500, "Token exchange failed. Check the terminal.");
      console.error(`Token exchange failed (${tokenRes.status}): ${body.error || "no refresh_token returned"}.`);
      process.exitCode = 1;
      return;
    }
    finish(200, "Done. You can close this tab and return to the terminal.");
    console.log("\nRefresh token (store it as the YT_OAUTH_REFRESH_TOKEN secret; do not commit it):\n");
    console.log(body.refresh_token);
  } catch (err) {
    finish(500, "Token exchange failed. Check the terminal.");
    console.error(`Token exchange failed: ${err.message}`);
    process.exitCode = 1;
  }
});

let redirectUri = "";
server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  }).toString();
  console.log(`Sign in as the channel owner in your browser. If it does not open, visit:\n\n${auth}\n`);
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  spawn(opener, [auth.toString()], { stdio: "ignore", detached: true }).on("error", () => {}).unref();
});
