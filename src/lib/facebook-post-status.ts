// Live detection of Facebook source posts that should not be shown.
//  - "gone": Meta's tokenless oEmbed endpoint answers HTTP 400 / code 100 (deleted or non-public).
//  - "blocked": the post exists but Facebook refuses to embed it (the "Unavailable... content owned by
//    someone else" box). oEmbed cannot see this, and the box is drawn in a cross-origin iframe, so it is
//    recognised by its fixed 400x225 size after the embed settles.
// Verdicts are cached in localStorage for a day. A rate-limit (403) or network error is never a
// verdict: the stage simply stays visible.
import { useSyncExternalStore } from "react";

export type PostVerdict = "ok" | "gone" | "blocked";

const KEY = "tcp-fb-post-verdicts-v1";
const TTL_MS = 24 * 60 * 60 * 1000;
type Store = Record<string, { v: PostVerdict; t: number }>;

const read = (): Store => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store; } catch { return {}; }
};
const write = (s: Store) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } };

/** `knownGone`: optional site-owned seed list of URLs already confirmed deleted. */
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

let queue: Promise<unknown> = Promise.resolve();

/** Asks oEmbed whether the post still exists. Calls are serialised ~1.2 s apart. Resolves "gone" only on
 * a definite 400/code 100; anything else (rate limit, network) resolves "ok" without being cached. */
export function checkExists(url: string): Promise<PostVerdict> {
  const run = queue.then(async (): Promise<PostVerdict> => {
    let verdict: PostVerdict = "ok";
    let definite = false;
    try {
      const res = await fetch(`https://graph.facebook.com/v26.0/oembed_post?url=${encodeURIComponent(url)}&omitscript=true`);
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.html) definite = true;
      else if (res.status === 400 && j?.error?.code === 100) { verdict = "gone"; definite = true; }
    } catch { /* inconclusive */ }
    if (definite) rememberVerdict(url, verdict);
    await new Promise((r) => setTimeout(r, 1200));
    return verdict;
  });
  queue = run;
  return run;
}

/** Resolves true when the iframe inside `box` settles at the blocked-embed size (width 360-460 x height
 * 200-250, stable for ~1.5 s), false if it settles at any other size or never appears within ~15 s. */
export function detectBlockedEmbed(box: HTMLElement): Promise<boolean> {
  return new Promise((resolve) => {
    let last = "";
    let stable = 0;
    let ticks = 0;
    const id = window.setInterval(() => {
      ticks += 1;
      const f = box.querySelector("iframe");
      const r = f?.getBoundingClientRect();
      const key = r ? `${Math.round(r.width)}x${Math.round(r.height)}` : "";
      if (key && key === last) stable += 1; else stable = 0;
      last = key;
      if (r && stable >= 3) {
        window.clearInterval(id);
        resolve(r.width >= 360 && r.width <= 460 && r.height >= 200 && r.height <= 250);
      } else if (ticks > 30) {
        window.clearInterval(id);
        resolve(false);
      }
    }, 500);
  });
}

const noopSubscribe = () => () => undefined;

/** Verdict already known without any network call (seed list or a cached verdict from the last day).
 * The server snapshot is undefined so prerendered HTML and the first client render agree. */
export function useCachedFacebookVerdict(url: string | undefined, knownGone?: ReadonlySet<string>): PostVerdict | undefined {
  return useSyncExternalStore(noopSubscribe, () => (url ? cachedVerdict(url, knownGone) : undefined), () => undefined);
}
