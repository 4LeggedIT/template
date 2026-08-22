import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StickyApplySidebar = {
  icon: ElementType;
  heading: string;
  subtext: string;
  /** Full-size CTA control rendered in the desktop sticky aside (e.g. a site's FormCta). */
  cta: ReactNode;
  /** Compact CTA control for the mobile fixed bar. Falls back to `cta` if omitted. */
  mobileCta?: ReactNode;
  /** Optional one-line note under the heading in the mobile bar (e.g. a sign-in requirement). */
  mobileNotice?: string;
  /** Optional photo shown above the icon in the desktop sticky card. Omitted from the mobile bar to keep it compact. */
  imageSrc?: string;
  imageAlt?: string;
};

type StickyApplyLayoutProps = {
  sidebar: StickyApplySidebar;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const StickyApplyLayout = ({ sidebar, children, className, contentClassName }: StickyApplyLayoutProps) => {
  const { icon: Icon, heading, subtext, cta, mobileCta, mobileNotice, imageSrc, imageAlt } = sidebar;

  return (
    <>
      <section className={cn("section-y", className)}>
        <div className="container-page grid gap-12 pb-28 lg:grid-cols-[1fr_320px] lg:pb-0">
          <div className={cn("min-w-0", contentClassName)}>{children}</div>

          {/* Sticks within this grid row's height (the full content column), so it tracks the
              whole page's scroll rather than resetting at section boundaries. top-32 clears the
              site header's h-28 (112px, Header.tsx) with a 16px gap. */}
          <aside className="hidden flex-col items-start gap-4 p-6 lg:sticky lg:top-32 lg:flex lg:self-start card-soft">
            {imageSrc ? (
              <div className="image-frame aspect-[4/3] w-full">
                <img src={imageSrc} alt={imageAlt ?? ""} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <Icon className="h-8 w-8 text-sage" aria-hidden="true" />
            <p className="text-sm font-semibold">{heading}</p>
            <p className="text-sm text-muted-foreground">{subtext}</p>
            {cta}
          </aside>
        </div>
      </section>

      {/* Mobile/tablet: the sidebar becomes a bar fixed to the bottom of the viewport instead of
          sitting inline. Pure CSS (no scroll listeners/measurement), safe under SSR/no-JS. */}
      <div
        role="region"
        aria-label={heading}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{heading}</p>
            {mobileNotice ? <p className="truncate text-xs text-muted-foreground">{mobileNotice}</p> : null}
          </div>
          <div className="shrink-0">{mobileCta ?? cta}</div>
        </div>
      </div>
    </>
  );
};

export default StickyApplyLayout;
