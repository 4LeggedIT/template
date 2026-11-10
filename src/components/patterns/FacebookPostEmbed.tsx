// Reusable pattern: shows any public Facebook post, photo, video or reel via the official embed.
// - Lazy: nothing loads until the block is near the viewport; the Facebook SDK loads once per page.
// - No-JS safe: the "View on Facebook" link is plain HTML under the embed.
// - Self-policing: if the post is deleted (oEmbed 400) or Facebook refuses to embed it (the
//   "Unavailable" box), `onUnavailable` fires so the parent can drop the whole item. See
//   lib/facebook-post-status.ts for how each case is detected and what is never treated as a verdict.
// Needs `connect.facebook.net` (script) and `graph.facebook.com` (connect) + `www.facebook.com`
// (frame) allowed in any enforced CSP.
import { useEffect, useRef, useState } from "react";
import { cachedVerdict, checkExists, detectBlockedEmbed, rememberVerdict } from "@/lib/facebook-post-status";

let sdk: Promise<void> | null = null;
function loadSdk(): Promise<void> {
  sdk ??= new Promise((resolve, reject) => {
    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div");
      root.id = "fb-root";
      document.body.appendChild(root);
    }
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0";
    s.onload = () => resolve();
    s.onerror = () => { sdk = null; reject(new Error("facebook sdk")); };
    document.body.appendChild(s);
  });
  return sdk;
}

type FbWindow = { FB?: { XFBML: { parse: (el?: Element | null) => void } } };

type Props = {
  url: string;
  linkLabel?: string;
  /** Called once when the post turns out to be gone or un-embeddable; the parent should stop showing the item. */
  onUnavailable?: () => void;
  /** Optional site-owned seed list of URLs already known to be deleted (skips the live check). */
  knownGone?: ReadonlySet<string>;
  className?: string;
};

const FacebookPostEmbed = ({ url, linkLabel = "View on Facebook", onUnavailable, knownGone, className = "mt-4 sm:max-w-md" }: Props) => {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const isVideo = /\/reel\/|\/videos\//.test(url);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!near) return;
    let live = true;
    (async () => {
      const known = cachedVerdict(url, knownGone);
      const verdict = known ?? (await checkExists(url));
      if (!live) return;
      if (verdict !== "ok") { onUnavailable?.(); return; }
      setShow(true);
    })();
    return () => { live = false; };
  }, [near, url, onUnavailable, knownGone]);

  useEffect(() => {
    if (!show) return;
    let live = true;
    loadSdk()
      .then(() => {
        (window as unknown as FbWindow).FB?.XFBML.parse(box.current);
        return box.current ? detectBlockedEmbed(box.current) : false;
      })
      .then((blocked) => {
        if (!live || !blocked) return;
        rememberVerdict(url, "blocked");
        onUnavailable?.();
      })
      .catch(() => undefined);
    return () => { live = false; };
  }, [show, url, onUnavailable]);

  return (
    <div className={className}>
      <div ref={box} className="min-h-[120px]">
        {show ? <div className={isVideo ? "fb-video" : "fb-post"} data-href={url} data-width="400" /> : null}
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
        {linkLabel} ↗
      </a>
    </div>
  );
};

export default FacebookPostEmbed;
