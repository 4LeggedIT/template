// Platform-neutral model of a public social post that a page can show as posted (Facebook, Instagram,
// TikTok): URL parsing, the shared "should this item be dropped" verdict, and its 24 h cache.
// Per-platform live checks live in social-post-checks.ts; rendering lives in SocialPostEmbed.tsx.
//
// A verdict is one of:
//  - "ok"      show it (also the answer whenever a check was inconclusive: rate limit, network error)
//  - "gone"    deleted, private or never existed, as reported by the platform itself
//  - "blocked" the post exists but the platform refuses to embed it (Facebook's "Unavailable" box)
import { useSyncExternalStore } from "react";

export type SocialPlatform = "facebook" | "instagram" | "tiktok";
export type PostVerdict = "ok" | "gone" | "blocked";

export type SocialPost = {
  platform: SocialPlatform;
  /** The URL exactly as written in the data file; also the cache and seed-list key. */
  url: string;
  /** Platform post id: the shortcode (Instagram) or numeric id (TikTok). Facebook posts need none. */
  id?: string;
  /** Instagram `/p/` and `/reel/` form without the account prefix, which Meta's endpoints expect. */
  canonicalUrl: string;
  /** A video-type post (Facebook reels and videos render the video plugin). */
  isVideo: boolean;
};

/**
 * Returns the post for a public post, reel or video URL, or null for anything that cannot be embedded:
 * Instagram stories and profiles, TikTok short links (`vm.tiktok.com`, which must be resolved to the long
 * form first), non-http(s) strings and every other host.
 */
export function parseSocialPost(url: string): SocialPost | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.replace(/^(www|web|m)\./, "");
  const path = u.pathname;

  if (host === "facebook.com" || host === "fb.watch") {
    return { platform: "facebook", url, canonicalUrl: url, isVideo: /\/reel\/|\/videos\//.test(path) };
  }
  if (host === "instagram.com") {
    // `/p/ID`, `/reel/ID`, `/tv/ID`, optionally behind an account segment (`/comebackpack/p/ID`).
    const m = path.match(/^\/(?:[A-Za-z0-9._]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/);
    if (!m) return null;
    const kind = m[1] === "p" ? "p" : "reel";
    return { platform: "instagram", url, id: m[2], canonicalUrl: `https://www.instagram.com/${kind}/${m[2]}/`, isVideo: kind === "reel" };
  }
  if (host === "tiktok.com") {
    const m = path.match(/^\/@[A-Za-z0-9._-]+\/(video|photo)\/(\d+)\/?$/);
    if (!m) return null;
    return { platform: "tiktok", url, id: m[2], canonicalUrl: `https://www.tiktok.com/player/v1/${m[2]}`, isVideo: m[1] === "video" };
  }
  return null;
}

const KEY = "social-post-verdicts-v1";
const TTL_MS = 24 * 60 * 60 * 1000;
type Store = Record<string, { v: PostVerdict; t: number }>;

const read = (): Store => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store; } catch { return {}; }
};
const write = (s: Store) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } };

/** `knownGone`: optional site-owned seed list of URLs already confirmed unavailable. */
export function cachedVerdict(url: string, knownGone?: ReadonlySet<string>): PostVerdict | undefined {
  if (knownGone?.has(url)) return "gone";
  const hit = read()[url];
  return hit && Date.now() - hit.t < TTL_MS ? hit.v : undefined;
}

export function rememberVerdict(url: string, v: PostVerdict) {
  const s = read();
  s[url] = { v, t: Date.now() };
  write(s);
}

const noopSubscribe = () => () => undefined;

/** Verdict already known without any network call (seed list or a cached verdict from the last day).
 * The server snapshot is undefined so prerendered HTML and the first client render agree. */
export function useCachedSocialVerdict(url: string | undefined, knownGone?: ReadonlySet<string>): PostVerdict | undefined {
  return useSyncExternalStore(noopSubscribe, () => (url ? cachedVerdict(url, knownGone) : undefined), () => undefined);
}
