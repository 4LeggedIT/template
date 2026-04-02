import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { X } from "lucide-react";

type EnvironmentBannerProps = {
  productionUrl?: string;
  messagePrefix?: string;
  linkLabel?: string;
  dismissible?: boolean;
};

const EnvironmentBanner = ({
  productionUrl = siteConfig.siteUrl,
  messagePrefix = "This page is a development copy. The production version can be found here:",
  linkLabel,
  dismissible = true,
}: EnvironmentBannerProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const productionHost = useMemo(() => {
    if (!productionUrl) return "";
    try {
      return new URL(productionUrl).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, [productionUrl]);

  const storageKey = useMemo(() => {
    const hostKey = productionHost || "unknown";
    return `dev_banner_dismissed:v1:${hostKey}`;
  }, [productionHost]);

  useEffect(() => {
    setIsClient(true);
    if (!dismissible) return;
    try {
      setIsDismissed(window.localStorage.getItem(storageKey) === "1");
    } catch {
      setIsDismissed(false);
    }
  }, [dismissible, storageKey]);

  if (!productionUrl) return null;
  if (!isClient) return null;

  try {
    const currentHost = window.location.hostname.replace(/^www\./, "");
    if (productionHost && currentHost === productionHost) return null;
  } catch {
    return null;
  }

  if (dismissible && isDismissed) return null;

  const dismiss = () => {
    if (!dismissible) return;
    setIsDismissed(true);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore storage failures; banner will reappear next load.
    }
  };

  return (
    <div className="relative z-30 border-b border-border bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span>{messagePrefix}</span>
          <a
            href={productionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline transition-colors hover:text-primary-foreground"
          >
            {linkLabel ?? productionUrl}
          </a>
        </div>
        {dismissible ? (
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-accent-foreground/80 transition hover:bg-accent-foreground/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EnvironmentBanner;
