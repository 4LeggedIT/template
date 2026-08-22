import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Zeffy?: {
      embed?: {
        init?: () => void;
      };
    };
  }
}

const ZEFFY_ORIGIN = "https://www.zeffy.com";
const ZEFFY_EMBED_SCRIPT_SRC = `${ZEFFY_ORIGIN}/embed/v2/zeffy-embed.js`;

let zeffyScriptPromise: Promise<void> | null = null;

// Zeffy's script scans the DOM for [data-zeffy-embed] elements and populates
// them itself, but ONLY does this scan once, when it first loads -- it does
// not observe later DOM mutations. Since the script is only ever injected
// once per page (singleton, never twice even across multiple instances on
// one page), a container that mounts *after* the script already loaded --
// e.g. a client-side SPA route change back to this page in an already-warm
// session -- would otherwise sit empty forever. Confirmed live 2026-08-20:
// window.Zeffy.embed.init() is a public, synchronous, idempotent re-scan
// that Zeffy itself exposes for exactly this; called on every mount below,
// after the script is confirmed loaded, regardless of whether this is the
// first load or a cached one.
function loadZeffyEmbedScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (zeffyScriptPromise) return zeffyScriptPromise;

  zeffyScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${ZEFFY_EMBED_SCRIPT_SRC}"]`) as
      | HTMLScriptElement
      | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load the Zeffy embed script.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = ZEFFY_EMBED_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Failed to load the Zeffy embed script.")));
    document.head.appendChild(script);
  });

  return zeffyScriptPromise;
}

type ZeffyDonateEmbedProps = {
  formSlug: string;
  title?: string;
  height?: number;
  className?: string;
  showHelperLink?: boolean;
  helperLinkLabel?: string;
  onError?: (error: Error) => void;
};

const ZeffyDonateEmbed = ({
  formSlug,
  title = "Donation form powered by Zeffy",
  height = 450,
  className,
  showHelperLink = true,
  helperLinkLabel = "Having trouble? Open the donation form in a new tab",
  onError,
}: ZeffyDonateEmbedProps) => {
  const reactId = useId();

  const mountId = useMemo(() => {
    const safeReactId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
    return `zeffy-donate-${safeReactId || "embed"}`;
  }, [reactId]);

  // "fallback" is the initial value on both server and first client render --
  // a real, functional iframe that works with zero JS -- so hydration never
  // mismatches and the SSR-prerendered HTML is a working donation form, not
  // the vendor's own blank/inert default.
  const [state, setState] = useState<"fallback" | "embed">("fallback");

  useEffect(() => {
    if (!formSlug) return;
    let cancelled = false;

    loadZeffyEmbedScript()
      .then(() => {
        if (cancelled) return;
        window.Zeffy?.embed?.init?.();
        setState("embed");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onError?.(error instanceof Error ? error : new Error("Failed to load the Zeffy embed script."));
        // Stay on "fallback" -- it's already the safe, working default.
      });

    return () => {
      cancelled = true;
    };
  }, [formSlug, onError]);

  if (!formSlug) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground", className)}>
        <p className="font-medium text-foreground">Zeffy donate form not configured</p>
        <p className="mt-1">Provide a `formSlug` prop.</p>
      </div>
    );
  }

  const embedPath = `/embed/donation-form/${formSlug}`;
  const iframeSrc = `${ZEFFY_ORIGIN}${embedPath}`;
  const fullPageUrl = `${ZEFFY_ORIGIN}/en-US/donation-form/${formSlug}`;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        id={mountId}
        data-zeffy-embed
        data-form-url={embedPath}
        style={{
          minHeight: state === "embed" ? height : 0,
          display: state === "embed" ? undefined : "none",
        }}
      />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height,
          width: "100%",
          display: state === "fallback" ? undefined : "none",
        }}
      >
        {/* allow="payment" is the modern Permissions Policy equivalent of the
            vendor snippet's legacy `allowpaymentrequest` boolean attribute,
            which JSX can't emit cleanly. */}
        <iframe
          title={title}
          src={iframeSrc}
          allow="payment"
          style={{ position: "absolute", border: 0, inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      {showHelperLink ? (
        <a
          href={fullPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {helperLinkLabel}
        </a>
      ) : null}
    </div>
  );
};

export default ZeffyDonateEmbed;
