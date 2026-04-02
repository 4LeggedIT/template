import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const DONATE_SDK_SRC = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";

let donateSdkPromise: Promise<void> | null = null;

function loadDonateSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.PayPal?.Donation?.Button) return Promise.resolve();
  if (donateSdkPromise) return donateSdkPromise;

  donateSdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${DONATE_SDK_SRC}"]`) as
      | HTMLScriptElement
      | null;

    if (existing) {
      const startedAt = Date.now();
      const tick = () => {
        if (window.PayPal?.Donation?.Button) {
          resolve();
          return;
        }
        if (Date.now() - startedAt > 15_000) {
          reject(new Error("Timed out waiting for the PayPal Donate SDK to become available."));
          return;
        }
        window.setTimeout(tick, 100);
      };

      tick();
      return;
    }

    const script = document.createElement("script");
    script.src = DONATE_SDK_SRC;
    script.async = true;
    script.charset = "UTF-8";
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Failed to load the PayPal Donate SDK script.")));
    document.head.appendChild(script);
  });

  return donateSdkPromise;
}

type PayPalDonateButtonProps = {
  hostedButtonId?: string;
  env?: "production" | "sandbox";
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageTitle?: string;
  onComplete?: (params: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
};

const PayPalDonateButton = ({
  hostedButtonId: hostedButtonIdProp,
  env: envProp,
  className,
  imageSrc = "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
  imageAlt = "Donate with PayPal button",
  imageTitle = "PayPal - The safer, easier way to pay online!",
  onComplete,
  onError,
}: PayPalDonateButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hostedButtonId =
    hostedButtonIdProp ?? import.meta.env.VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID ?? "";

  const env =
    envProp ??
    (import.meta.env.VITE_PAYPAL_DONATE_ENV === "sandbox" ? "sandbox" : "production");

  const reactId = useId();

  const containerId = useMemo(() => {
    // React's useId() can include ":" which is valid for HTML id but brittle for CSS selectors.
    // Sanitizing keeps it stable across SSR/hydration while remaining selector-safe.
    const safeReactId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
    return `paypal-donate-${safeReactId || "donate"}`;
  }, [reactId]);

  useEffect(() => {
    if (!hostedButtonId) return;
    let cancelled = false;

    const run = async () => {
      setErrorMessage(null);
      try {
        await loadDonateSdk();
        if (cancelled) return;
        if (!window.PayPal?.Donation?.Button) {
          throw new Error("PayPal Donate SDK loaded but the global API was not found.");
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        window.PayPal.Donation.Button({
          env,
          hosted_button_id: hostedButtonId,
          image: {
            src: imageSrc,
            alt: imageAlt,
            title: imageTitle,
          },
          onComplete: onComplete
            ? (params: Record<string, unknown>) => {
                onComplete(params);
              }
            : undefined,
        }).render(`#${containerId}`);
      } catch (error) {
        if (cancelled) return;
        const resolvedError =
          error instanceof Error
            ? error
            : new Error("Failed to render PayPal donate button.");

        setErrorMessage(resolvedError.message);
        onError?.(resolvedError);
      }
    };

    void run();

    return () => {
      cancelled = true;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [containerId, env, hostedButtonId, imageAlt, imageSrc, imageTitle, onComplete, onError]);

  if (!hostedButtonId) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground", className)}>
        <p className="font-medium text-foreground">PayPal Donate button not configured</p>
        <p className="mt-1">
          Provide a `hostedButtonId` prop or set `VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID`.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div id={containerId} />
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
};

export default PayPalDonateButton;
