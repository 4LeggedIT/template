/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/GetBuddyEmbed.tsx
 * Change it there, then sync it to every site.
 */
import { safeContentUrl } from "@/lib/safe-url";
import ContentLink from "./ContentLink";

type GetBuddyEmbedProps = {
  title?: string;
  embedUrl: string;
  listingsUrl?: string;
  /** Height of the embed window in px (default 600). GetBuddy's embed has no pagination and lists every animal, so this is a fixed scroll window, additionally capped at 80% of the viewport height so a short screen is never filled by it. */
  iframeHeight?: number;
  showIframe?: boolean;
  className?: string;
  petfinderUrl?: string;
  adoptAPetUrl?: string;
  pawPlacerUrl?: string;
  rescueMeUrl?: string;
  rockyKanakaUrl?: string;
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

const GetBuddyEmbed = ({
  title = "GetBuddy Listings",
  embedUrl: rawEmbedUrl,
  listingsUrl,
  iframeHeight = 600,
  showIframe = true,
  className,
  petfinderUrl,
  adoptAPetUrl,
  pawPlacerUrl,
  rescueMeUrl,
  rockyKanakaUrl,
  labels = {},
}: GetBuddyEmbedProps) => {
  const {
    viewAllPrefix = "Or view all pets on",
    viewAllLink = "GetBuddy",
    listConjunction = " or ",
  } = labels;

  const embedUrl = safeContentUrl(rawEmbedUrl) ?? "about:blank";
  const openUrl = listingsUrl?.trim() || embedUrl;
  const platforms = [
    { name: "GetBuddy", url: openUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(adoptAPetUrl ? [{ name: "Adopt-a-Pet", url: adoptAPetUrl }] : []),
    ...(pawPlacerUrl ? [{ name: "PawPlacer", url: pawPlacerUrl }] : []),
    ...(rescueMeUrl ? [{ name: "Rescue Me", url: rescueMeUrl }] : []),
    ...(rockyKanakaUrl ? [{ name: "Rocky Kanaka", url: rockyKanakaUrl }] : []),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className={className}>
      <div className="space-y-4">
        {showIframe ? (
          <div className="overflow-hidden">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full"
              style={{ height: `min(${iframeHeight}px, 80vh)`, border: "none" }}
              loading="lazy"
            />
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          {viewAllPrefix}{" "}
          {platforms.map((platform, idx) => (
            <span key={platform.name}>
              <ContentLink href={platform.url} external className="underline underline-offset-4 hover:text-foreground">
                {platform.name}
              </ContentLink>
              {idx < platforms.length - 2 ? ", " : idx < platforms.length - 1 ? listConjunction : ""}
            </span>
          ))}
          .
        </p>
      </div>
    </section>
  );
};

export default GetBuddyEmbed;
