// Wraps PayPal's newer "Hosted Buttons" product (paypal.com/sdk/js?...components=hosted-buttons /
// paypal.HostedButtons) — needs both a client-id (from the SDK script's own client-id query param,
// shared by every hosted button in the org's PayPal account) and a hostedButtonId. NOT
// interchangeable with PayPalDonateButton.tsx, which wraps the older, separate "Donate Button"
// product (donate-sdk.js). A button id from one product renders nothing (or a cryptic CORS error
// from the wrong product's API, easily mistaken for a domain-whitelist problem) under the other's
// SDK — see module-wiring-contracts.md's "PayPal Buttons" entry for how to tell which product a
// given org's button belongs to before wiring it up.
import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const HOSTED_BUTTONS_SDK_ORIGIN = "https://www.paypal.com/sdk/js";

let hostedButtonsSdkPromise: Promise<void> | null = null;
let loadedForClientId: string | null = null;

function loadHostedButtonsSdk(clientId: string, currency: string, enableFunding: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.paypal?.HostedButtons && loadedForClientId === clientId) return Promise.resolve();
  if (hostedButtonsSdkPromise && loadedForClientId === clientId) return hostedButtonsSdkPromise;

  loadedForClientId = clientId;
  const src = `${HOSTED_BUTTONS_SDK_ORIGIN}?client-id=${encodeURIComponent(clientId)}&components=hosted-buttons&enable-funding=${encodeURIComponent(enableFunding)}&currency=${encodeURIComponent(currency)}`;

  hostedButtonsSdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    if (existing) {
      const startedAt = Date.now();
      const tick = () => {
        if (window.paypal?.HostedButtons) {
          resolve();
          return;
        }
        if (Date.now() - startedAt > 15_000) {
          reject(new Error("Timed out waiting for the PayPal Hosted Buttons SDK to become available."));
          return;
        }
        window.setTimeout(tick, 100);
      };

      tick();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Failed to load the PayPal Hosted Buttons SDK script.")),
    );
    document.head.appendChild(script);
  });

  return hostedButtonsSdkPromise;
}

type PayPalHostedButtonProps = {
  /** The PayPal app client-id embedded in the SDK script's `client-id` query param. */
  clientId: string;
  hostedButtonId: string;
  currency?: string;
  enableFunding?: string;
  className?: string;
};

const PayPalHostedButton = ({
  clientId,
  hostedButtonId,
  currency = "USD",
  enableFunding = "venmo",
  className,
}: PayPalHostedButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const reactId = useId();

  const containerId = useMemo(() => {
    // React's useId() can include ":" which is valid for HTML id but brittle for CSS selectors.
    // Sanitizing keeps it stable across SSR/hydration while remaining selector-safe.
    const safeReactId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
    return `paypal-hosted-button-${safeReactId || "donate"}`;
  }, [reactId]);

  useEffect(() => {
    if (!clientId || !hostedButtonId) return;
    let cancelled = false;

    const run = async () => {
      setErrorMessage(null);
      try {
        await loadHostedButtonsSdk(clientId, currency, enableFunding);
        if (cancelled) return;
        if (!window.paypal?.HostedButtons) {
          throw new Error("PayPal Hosted Buttons SDK loaded but the global API was not found.");
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        await window.paypal.HostedButtons({ hostedButtonId }).render(`#${containerId}`);
      } catch (error) {
        if (cancelled) return;
        const resolvedError =
          error instanceof Error ? error : new Error("Failed to render PayPal hosted button.");

        setErrorMessage(resolvedError.message);
      }
    };

    void run();

    return () => {
      cancelled = true;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [clientId, containerId, currency, enableFunding, hostedButtonId]);

  return (
    <div className={cn("space-y-2", className)}>
      <div id={containerId} />
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
};

export default PayPalHostedButton;
