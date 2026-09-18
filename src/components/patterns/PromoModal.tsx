import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type PromoModalItem = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Promo is not shown before this date. Omit to make it eligible immediately. */
  startsAtIso?: string;
  /** Promo stops being shown (and any prior dismissal is forgotten) after this date. Omit for a promo with no end date. */
  expiresAtIso?: string;
};

export type PromoModalLabels = {
  /** Screen-reader-only fallback title when `headline` is unset. */
  defaultHeadline?: string;
};

type PromoModalProps = {
  promos: PromoModalItem[];
  storageKeyPrefix?: string;
  /** Delay before the modal opens, so it doesn't compete with first paint. */
  openDelayMs?: number;
  className?: string;
  labels?: PromoModalLabels;
};

const DEFAULT_OPEN_DELAY_MS = 600;

const toMs = (iso?: string) => {
  if (!iso) return null;
  const value = Date.parse(iso);
  return Number.isFinite(value) ? value : null;
};

const getExpiryMs = (promo: PromoModalItem) => toMs(promo.expiresAtIso);

const isDismissed = (promo: PromoModalItem, storageKeyPrefix: string, expiresAtMs: number | null) => {
  if (typeof expiresAtMs !== "number") return false;
  const storageKey = `${storageKeyPrefix}_${promo.id}`;
  const dismissedUntilMs = Number(window.localStorage.getItem(storageKey) ?? "0");
  return Number.isFinite(dismissedUntilMs) && dismissedUntilMs >= expiresAtMs;
};

const getEligiblePromo = (promos: PromoModalItem[], storageKeyPrefix: string, nowMs: number) => {
  const eligible = promos.filter((promo) => {
    const startsAtMs = toMs(promo.startsAtIso);
    if (typeof startsAtMs === "number" && nowMs < startsAtMs) return false;

    const expiresAtMs = getExpiryMs(promo);
    if (typeof expiresAtMs === "number" && nowMs >= expiresAtMs) return false;
    if (isDismissed(promo, storageKeyPrefix, expiresAtMs)) return false;

    return true;
  });

  return (
    eligible.sort((a, b) => (getExpiryMs(a) ?? Infinity) - (getExpiryMs(b) ?? Infinity))[0] ?? null
  );
};

/**
 * A dismissible promo popup that opens on mount (home page only, by fleet convention — see
 * promo-modal-module-wiring-contract.md). Shows at most one promo at a time, picking the
 * soonest-expiring eligible entry. Dismissal persists in localStorage keyed by promo id, the
 * same `${storageKeyPrefix}_${id}` convention EventBanner uses, and — also matching EventBanner —
 * only survives a reload when the promo has a real `expiresAtIso`; an undated promo can be
 * dismissed again next visit.
 */
const PromoModal = ({
  promos,
  storageKeyPrefix = "template_promo_modal_dismissed_until",
  openDelayMs = DEFAULT_OPEN_DELAY_MS,
  className,
  labels = {},
}: PromoModalProps) => {
  const { defaultHeadline = "Special offer" } = labels;
  const [activePromo, setActivePromo] = useState<PromoModalItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    const activate = () => {
      const promo = getEligiblePromo(promos, storageKeyPrefix, Date.now());
      setActivePromo(promo);
      if (promo) {
        timer = window.setTimeout(() => setOpen(true), openDelayMs);
      }
    };

    activate();

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- promos is expected to be a stable module-level array, same assumption EventBanner makes
  }, [storageKeyPrefix, openDelayMs]);

  const dismiss = () => {
    if (!activePromo) return;
    const expiresAtMs = getExpiryMs(activePromo);
    if (typeof expiresAtMs === "number") {
      window.localStorage.setItem(`${storageKeyPrefix}_${activePromo.id}`, String(expiresAtMs));
    }
    setOpen(false);
  };

  if (!activePromo) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent className={cn("max-w-md overflow-hidden p-0", className)}>
        <div className="max-h-[85vh] overflow-y-auto">
          <img src={activePromo.imageSrc} alt={activePromo.imageAlt} className="h-auto w-full" />
          {activePromo.headline || activePromo.body || activePromo.ctaHref ? (
            <div className="space-y-3 p-6 pt-4 text-center">
              {activePromo.headline ? (
                <DialogTitle asChild>
                  <p className="text-lg font-semibold">{activePromo.headline}</p>
                </DialogTitle>
              ) : (
                <DialogTitle className="sr-only">{defaultHeadline}</DialogTitle>
              )}
              {activePromo.body ? (
                <DialogDescription asChild>
                  <p className="text-sm text-muted-foreground">{activePromo.body}</p>
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">{activePromo.imageAlt}</DialogDescription>
              )}
              {activePromo.ctaHref ? (
                <Button asChild onClick={dismiss}>
                  {activePromo.ctaHref.startsWith("/") ? (
                    <Link to={activePromo.ctaHref}>{activePromo.ctaLabel ?? "Learn more"}</Link>
                  ) : (
                    <a href={activePromo.ctaHref} target="_blank" rel="noopener noreferrer">
                      {activePromo.ctaLabel ?? "Learn more"}
                    </a>
                  )}
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <DialogTitle className="sr-only">{defaultHeadline}</DialogTitle>
              <DialogDescription className="sr-only">{activePromo.imageAlt}</DialogDescription>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
