// Reusable pattern: shows any public Facebook, Instagram or TikTok post, photo, reel or video as posted,
// using the platform's own official embed.
// - Lazy: nothing loads until the block is near the viewport; the Facebook SDK loads once per page. Instagram
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
import { useCallback, useEffect, useRef, useState } from "react";
import { cachedVerdict, parseSocialPost, rememberVerdict, type SocialPost } from "@/lib/social-post";
import { checkExists, detectBlockedEmbed } from "@/lib/social-post-checks";

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

const FacebookBody = ({ post, box, onGone }: BodyProps) => {
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
        (window as unknown as Win).FB?.XFBML.parse(box.current);
        return box.current ? detectBlockedEmbed(box.current) : false;
      })
      .then((blocked) => { if (live && blocked) onGone("blocked"); })
      .catch(() => undefined);
    return () => { live = false; };
  }, [post, box, onGone]);
  return <div className={post.isVideo ? "fb-video" : "fb-post"} data-href={post.url} data-width="400" />;
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
  const post = parseSocialPost(url);
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
      <div ref={box} className="min-h-[120px]">{post && Body ? <Body post={post} box={box} onGone={onGone} /> : null}</div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
        {label} ↗
      </a>
    </div>
  );
};

export default SocialPostEmbed;
