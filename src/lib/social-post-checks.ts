// Live "is this post still there?" checks, one per platform. Each resolves a PostVerdict and only ever
// returns "gone" on a definite answer from the platform: a rate limit, a network error or an unexpected
// reply resolves "ok" (show it) and is not cached.
//
//  - Facebook: Meta's tokenless `oembed_post` answers HTTP 400 / code 100 for a deleted or non-public post.
//    Never use `oembed_video`: it succeeds for any URL. Facebook can also refuse to embed an existing post
//    (the "Unavailable... content owned by someone else" box); oEmbed cannot see that and the box is drawn
//    in a cross-origin iframe, so detectBlockedEmbed() recognises it by its fixed size.
//  - Instagram: Meta's tokenless `instagram_oembed` answers HTTP 400 with error_subcode 2207045 (media not
//    found) or 2207046 (private media; only public media can be embedded).
//  - TikTok: its oEmbed answers 200 even for an invented video id, so it cannot be used as a check. The
//    player iframe reports a missing video itself (`onPlayerError`, code 1001), handled in SocialPostEmbed.
import { rememberVerdict, type PostVerdict, type SocialPost } from "@/lib/social-post";

const GRAPH = "https://graph.facebook.com/v26.0";
// Meta's limit tripped after roughly 90 calls in a few minutes from one IP, so Graph calls are serialised ~1.2 s apart.
let queue: Promise<unknown> = Promise.resolve();

type Graph = { status: number; ok: boolean; body: { html?: string; error?: { code?: number; error_subcode?: number } } };

async function graph(endpoint: string, url: string): Promise<Graph | null> {
  try {
    const res = await fetch(`${GRAPH}/${endpoint}?url=${encodeURIComponent(url)}&omitscript=true`);
    const body = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, body };
  } catch {
    return null;
  }
}

async function facebook(post: SocialPost): Promise<[PostVerdict, boolean]> {
  const r = await graph("oembed_post", post.url);
  if (r?.ok && r.body.html) return ["ok", true];
  if (r?.status === 400 && r.body.error?.code === 100) return ["gone", true];
  return ["ok", false];
}

async function instagram(post: SocialPost): Promise<[PostVerdict, boolean]> {
  const r = await graph("instagram_oembed", post.canonicalUrl);
  if (r?.ok && r.body.html) return ["ok", true];
  const sub = r?.body.error?.error_subcode;
  if (r?.status === 400 && (sub === 2207045 || sub === 2207046)) return ["gone", true];
  return ["ok", false];
}

/** Asks the platform whether the post still exists. Platforms with no usable live check resolve "ok". */
export function checkExists(post: SocialPost): Promise<PostVerdict> {
  if (post.platform === "tiktok") return Promise.resolve("ok");
  const run = queue.then(async (): Promise<PostVerdict> => {
    const [verdict, definite] = await (post.platform === "facebook" ? facebook(post) : instagram(post));
    if (definite) rememberVerdict(post.url, verdict);
    return verdict;
  });
  // The spacing delays the next call, never this answer.
  queue = run.then(() => new Promise((r) => setTimeout(r, 1200)));
  return run;
}

/** Facebook only. Resolves true when the iframe inside `box` settles at the blocked-embed size (width
 * 360-460 x height 200-250, stable for ~1.5 s), false if it settles at any other size or never appears
 * within ~15 s. A genuine 16:9 landscape video embeds at the same size and would be dropped, so check a
 * sample before relying on this for landscape-heavy content. */
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
