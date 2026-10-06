import { createElement, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GIVEBUTTER_WIDGETS_ORIGIN = "https://widgets.givebutter.com";

const scriptPromises = new Map<string, Promise<void>>();

// The widget registers its element as soon as the script loads, but the visible
// button renders into it several seconds later on slow connections. The
// fallback link stays until the element has a real size, then hands over, so
// there is never a blank gap. If it never renders, the fallback just stays.
const READY_POLL_MS = 150;
const READY_GIVE_UP_MS = 20000;

// Givebutter's script registers the <givebutter-widget> custom element. Custom
// elements upgrade automatically, including ones mounted after the script has
// loaded, so (unlike Zeffy) no re-scan call is needed on SPA revisits. The
// script is injected once per account id, never twice across instances.
function loadGivebutterScript(accountId: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const cached = scriptPromises.get(accountId);
  if (cached) return cached;

  const src = `${GIVEBUTTER_WIDGETS_ORIGIN}/latest.umd.cjs?acct=${encodeURIComponent(accountId)}&p=other`;

  const promise = new Promise<void>((resolve, reject) => {
    const fail = () => {
      scriptPromises.delete(accountId);
      reject(new Error("Failed to load the Givebutter widget script."));
    };
    const existing = Array.from(document.scripts).find((el) => el.src === src) ?? null;
    if (existing) {
      if (customElements.get("givebutter-widget")) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", fail);
    document.head.appendChild(script);
  });

  scriptPromises.set(accountId, promise);
  return promise;
}

type GivebutterWidgetProps = {
  /** The id from the org's own `<givebutter-widget id="...">` snippet. */
  widgetId: string;
  /** The org's Givebutter account id (`acct=` in the vendor script URL). */
  accountId: string;
  /** Public campaign page, e.g. https://givebutter.com/jointhepack. Used for the no-JS fallback and the helper link. */
  campaignUrl: string;
  /** Visible text of the no-JS / script-failed fallback button. */
  fallbackLabel?: string;
  className?: string;
  showHelperLink?: boolean;
  helperLinkLabel?: string;
  /** Defer loading the vendor script until the widget scrolls near the viewport. */
  lazy?: boolean;
  onError?: (error: Error) => void;
};

const GivebutterWidget = ({
  widgetId,
  accountId,
  campaignUrl,
  fallbackLabel = "Give on Givebutter",
  className,
  showHelperLink = true,
  helperLinkLabel = "Having trouble? Open the campaign in a new tab",
  lazy = false,
  onError,
}: GivebutterWidgetProps) => {
  // "fallback" is the first value on server and client, a real link that works
  // with zero JS, so hydration never mismatches and the prerendered HTML is a
  // working donate action rather than an empty custom element. "mounted" =
  // script loaded, widget element present but still hidden behind the
  // fallback; "ready" = the widget has rendered and takes over.
  const [state, setState] = useState<"fallback" | "mounted" | "ready">("fallback");
  const [widgetEl, setWidgetEl] = useState<HTMLElement | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [near, setNear] = useState(() => !lazy || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (near || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [near, container]);

  useEffect(() => {
    if (!widgetId || !accountId || !near) return;
    let cancelled = false;

    loadGivebutterScript(accountId)
      .then(() => {
        if (!cancelled) setState("mounted");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onError?.(error instanceof Error ? error : new Error("Failed to load the Givebutter widget script."));
        // Stay on "fallback": already the safe, working default.
      });

    return () => {
      cancelled = true;
    };
  }, [widgetId, accountId, near, onError]);

  useEffect(() => {
    if (state !== "mounted" || !widgetEl) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const rect = widgetEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        window.clearInterval(timer);
        setState("ready");
      } else if (Date.now() - started > READY_GIVE_UP_MS) {
        window.clearInterval(timer);
      }
    }, READY_POLL_MS);
    return () => window.clearInterval(timer);
  }, [state, widgetEl]);

  if (!widgetId || !accountId || !campaignUrl) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground", className)}>
        <p className="font-medium text-foreground">Givebutter widget not configured</p>
        <p className="mt-1">Provide `widgetId`, `accountId` and `campaignUrl` props.</p>
      </div>
    );
  }

  return (
    <div ref={setContainer} className={cn("relative space-y-2", className)}>
      {state !== "fallback" ? (
        // One stable node: hidden (out of flow, still laid out so it can render
        // and be measured) until "ready", never remounted, so the vendor
        // widget initialises once.
        <div style={state === "ready" ? undefined : { position: "absolute", visibility: "hidden", pointerEvents: "none" }}>
          {createElement("givebutter-widget", { id: widgetId, ref: setWidgetEl })}
        </div>
      ) : null}
      {state !== "ready" ? (
        <a
          href={campaignUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {fallbackLabel}
        </a>
      ) : null}
      {showHelperLink && state === "ready" ? (
        <a
          href={campaignUrl}
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

export default GivebutterWidget;
