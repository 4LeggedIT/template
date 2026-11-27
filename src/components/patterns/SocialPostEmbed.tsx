/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/SocialPostEmbed.tsx
 * Change it there, then sync it to every site.
 */
// Reusable pattern: shows any public Facebook, Instagram or TikTok post, photo, reel or video as posted,
// using the platform's own official embed.
// - Lazy: nothing loads until the block is near the viewport; the Facebook SDK loads once per page and only
//   measures (see FacebookBody): the visible Facebook embed is a plain plugin iframe. Instagram
//   and TikTok are plain iframes with no script (Instagram's embed.js silently fails to initialise when the
//   Facebook SDK was loaded first on the same page, so it is deliberately not used).
// - No-JS safe: the "View original post" link is plain HTML under the embed.
// - Self-policing: when the post is gone (deleted, private, never existed) or the platform refuses to embed
//   it, `onUnavailable` fires so the parent can drop the whole item. See lib/social-post-checks.ts for how
//   each platform reports that and what is never treated as a verdict.
// Supported URLs: see parseSocialPost() in lib/social-post.ts. Anything else (Instagram stories, TikTok
// short links) renders only the plain link and never calls `onUnavailable`.
// CSP: facebook = connect.facebook.net (script), graph.facebook.com (connect), www.facebook.com (frame);
// instagram = www.instagram.com (frame) and graph.facebook.com (connect); tiktok = www.tiktok.com (frame).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cachedVerdict, parseSocialPost, rememberVerdict, type SocialPost } from "@/lib/social-post";
import { checkExists, isBlockedEmbedSize, measureEmbed } from "@/lib/social-post-checks";
import ContentLink from "./ContentLink";

const scripts = new Map<string, Promise<void>>();
function loadScript(src: string, before?: () => void): Promise<void> {
  let p = scripts.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      before?.();
      const s = document.createElement("script");
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => { scripts.delete(src); reject(new Error(`script ${src}`)); };
      document.body.appendChild(s);
    });
    scripts.set(src, p);
  }
  return p;
}

const FACEBOOK_SDK = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0";

type Win = { FB?: { XFBML: { parse: (el?: Element | null) => void } } };

type BodyProps = { post: SocialPost; box: React.RefObject<HTMLDivElement>; onGone: (verdict: "gone" | "blocked") => void };

// Facebook is rendered in two steps, because the SDK's own iframe cannot be left on the page: the SDK gives its
// iframes a `channel=...xd_arbiter` parameter, and with it clicking "See more" inside the post turns the
// iframe into Chrome's blocked-frame (sad face) box. The same plugin URL without `channel` opens the post in
// a new tab and leaves the embed alone (verified in Chrome against the identical post). A plain iframe gets no
// resize messages though, and the SDK is also what tells us the post's height and whether Facebook refuses to
// embed it. So the SDK renders the post once in an invisible probe, we read its settled size, drop the probe
// and show the same plugin as a plain iframe of exactly that height.
const FACEBOOK_PLUGINS = "https://www.facebook.com/plugins";
const FACEBOOK_WIDTH = 400;

const FacebookBody = ({ post, onGone }: BodyProps) => {
  // Latest callback via ref so an unstable `onUnavailable` from the parent cannot re-run the parse effect.
  const gone = useRef(onGone);
  useEffect(() => { gone.current = onGone; }, [onGone]);
  const probe = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    loadScript(FACEBOOK_SDK, () => {
      if (!document.getElementById("fb-root")) {
        const root = document.createElement("div");
        root.id = "fb-root";
        document.body.appendChild(root);
      }
    })
      .then(() => {
        (window as unknown as Win).FB?.XFBML.parse(probe.current);
        return probe.current ? measureEmbed(probe.current) : null;
      })
      .then((size) => {
        if (!live) return;
        if (isBlockedEmbedSize(size)) gone.current("blocked");
        else setHeight(size?.height ?? (post.isVideo ? 711 : 775));
      })
      .catch(() => { if (live) setHeight(post.isVideo ? 711 : 775); });
    return () => { live = false; };
  }, [post]);
  if (height === null) {
    return (
      <div ref={probe} aria-hidden="true" className="pointer-events-none invisible absolute -left-[9999px] top-0" style={{ width: FACEBOOK_WIDTH }}>
        <div className={post.isVideo ? "fb-video" : "fb-post"} data-href={post.url} data-width={FACEBOOK_WIDTH} />
      </div>
    );
  }
  const params = new URLSearchParams({ href: post.url, width: String(FACEBOOK_WIDTH) });
  if (post.isVideo) { params.set("height", String(height)); params.set("show_text", "false"); }
  return (
    <iframe
      title={post.isVideo ? "Facebook video" : "Facebook post"}
      src={`${FACEBOOK_PLUGINS}/${post.isVideo ? "video" : "post"}.php?${params.toString()}`}
      width={FACEBOOK_WIDTH}
      height={height}
      scrolling="no"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      className="block max-w-full border-0"
    />
  );
};

// Instagram's embed page tells its parent how tall it is (`{"type":"MEASURE","details":{"height":n}}`, the same
// message embed.js listens to), so the iframe is sized from it instead of loading embed.js.
const InstagramBody = ({ post }: BodyProps) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(560);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || typeof e.data !== "string") return;
      try {
        const d = JSON.parse(e.data) as { type?: string; details?: { height?: number } };
        if (d.type === "MEASURE" && typeof d.details?.height === "number" && d.details.height > 0) setHeight(Math.ceil(d.details.height));
      } catch { /* not an Instagram message */ }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <iframe
      ref={frame}
      title="Instagram"
      src={`${post.canonicalUrl}embed/captioned/`}
      scrolling="no"
      loading="lazy"
      className="block w-full max-w-[540px] rounded border border-border bg-white"
      style={{ height }}
    />
  );
};

// TikTok's player reports its own errors through postMessage. 1001 (INVALID_VIDEO) means no video or photo
// exists for the id; every other error (network, playback, autoplay) is not a verdict.
const TIKTOK_INVALID_VIDEO = 1001;

const TikTokBody = ({ post, onGone }: BodyProps) => {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { "x-tiktok-player"?: boolean; type?: string; value?: { errorCode?: number; errorType?: string } } | null;
      if (d?.["x-tiktok-player"] && d.type === "onPlayerError" && (d.value?.errorCode === TIKTOK_INVALID_VIDEO || d.value?.errorType === "INVALID_VIDEO")) onGone("gone");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onGone]);
  return (
    <iframe
      ref={frame}
      title="TikTok"
      src={`${post.canonicalUrl}?music_info=1&description=1`}
      allow="fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="block h-[578px] w-full max-w-[325px] rounded-xl border-0"
    />
  );
};

type Props = {
  url: string;
  /** Defaults to the English "View original post"; pass a localized label on i18n sites. */
  linkLabel?: string;
  /** Called once when the post turns out to be gone or un-embeddable; the parent should stop showing the item. */
  onUnavailable?: () => void;
  /** Optional site-owned seed list of URLs already known to be unavailable (skips the live check). */
  knownGone?: ReadonlySet<string>;
  className?: string;
};

const SocialPostEmbed = ({ url, linkLabel, onUnavailable, knownGone, className = "mt-4 sm:max-w-md" }: Props) => {
  // Memoized per URL: effects below (and FacebookBody's FB.XFBML.parse) depend on `post`, so a fresh object each
  // render would re-parse and rebuild the platform iframe on every parent re-render (a loop if the parent reacts
  // to the iframe resizing).
  const post = useMemo(() => parseSocialPost(url), [url]);
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!post || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [post]);

  useEffect(() => {
    if (!near || !post) return;
    let live = true;
    (async () => {
      const verdict = cachedVerdict(url, knownGone) ?? (await checkExists(post));
      if (!live) return;
      if (verdict !== "ok") { onUnavailable?.(); return; }
      setShow(true);
    })();
    return () => { live = false; };
  }, [near, post, url, onUnavailable, knownGone]);

  // Stable as long as `onUnavailable` is (the parent keeps it in useCallback).
  const onGone = useCallback((verdict: "gone" | "blocked") => {
    rememberVerdict(url, verdict);
    onUnavailable?.();
  }, [url, onUnavailable]);

  const Body = post && show ? { facebook: FacebookBody, instagram: InstagramBody, tiktok: TikTokBody }[post.platform] : null;
  const label = linkLabel ?? "View original post";

  return (
    <div className={className}>
      <div ref={box} className="min-h-[120px] max-w-full overflow-x-auto [contain:inline-size]">{post && Body ? <Body post={post} box={box} onGone={onGone} /> : null}</div>
      <ContentLink href={url} external className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
        {label} ↗
      </ContentLink>
    </div>
  );
};

export default SocialPostEmbed;
