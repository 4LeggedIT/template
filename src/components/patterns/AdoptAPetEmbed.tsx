/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/AdoptAPetEmbed.tsx
 * Change it there, then sync it to every site.
 */
import { safeContentUrl } from "@/lib/safe-url";
import ContentLink from "./ContentLink";

type AdoptAPetEmbedProps = {
  /** Accessible name for the embedded widget (not rendered as a heading, like the other adoptable-pets embeds). */
  title?: string;
  listingsUrl: string;
  /** Adopt-a-Pet's numeric shelter ID (the leading number in the shelter's listingsUrl slug, e.g. "74343" from /shelter/74343-example-rescue). When set, renders Adopt-a-Pet's real "Pet Scroller" widget. */
  shelterId?: string;
  scrollerWidth?: number;
  scrollerHeight?: number;
  iframeUrl?: string;
  iframeHeight?: number;
  showIframe?: boolean;
  className?: string;
  getbuddyUrl?: string;
  petfinderUrl?: string;
  pawPlacerUrl?: string;
  rescueMeUrl?: string;
  rockyKanakaUrl?: string;
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

// The iframe's srcDoc inherits the parent page's CSP, so under an enforcing
// policy an inline script needs a hash. This script is deliberately STATIC (no
// interpolation): the per-site values travel as data- attributes on <body>, so
// one fixed sha256 (registered in tools/csp-registry.mjs and asserted by
// AdoptAPetEmbed.test.tsx) covers the whole fleet. Change this text and the
// registry hash must change with it.
const SETTINGS_SCRIPT =
  "var d=document.body.dataset;window.AAPPetScrollerSettings={searchtools_box_width:d.w,searchtools_box_height:d.h,size:d.w+'x'+d.h+'_listnew',title:'',clan_name:'',color:'green',shelter_id:d.id,sort_by:'pet_name'};";

// The iframe's own scrollbar is the only scroller (no scroll box inside the widget document), so give it room beside the table.
const SCROLLBAR_ALLOWANCE = 16;

const buildScrollerSrcDoc = (shelterId: string, width: number, height: number) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>html, body { margin: 0; overflow-x: hidden; font-family: Helvetica, Arial, Geneva, sans-serif; }</style>
</head>
<body data-w="${width}" data-h="${height}" data-id="${shelterId}">
<script>${SETTINGS_SCRIPT}</script>
<div style="width: ${width}px;">
<script language="JavaScript" src="https://images.adoptapet.com/js/st-portable-pet-list.js"></script></div>
<div style="background-color:#fff; width:${width}px; text-align:center; height:53px;"><p style="font-family:Helvetica, Arial, Geneva, sans-serif; font-size:12px; color: #444444;">Pet adoption and rescue powered by <a href="https://www.adoptapet.com/" title="Pet adoption and rescue powered by Adopt-a-Pet.com" target="_blank" rel="noopener noreferrer"><img src="https://images.adoptapet.com/images/st-logo-lg.gif" alt="Adopt-a-Pet.com" width="150" height="37" border="0" style="vertical-align:middle; margin-left:15px;" /></a></p></div>
</body>
</html>`;

const AdoptAPetEmbed = ({
  title = "Adopt-a-Pet Listings",
  listingsUrl,
  shelterId,
  scrollerWidth = 450,
  scrollerHeight = 320,
  iframeUrl: rawIframeUrl,
  iframeHeight = 760,
  showIframe = false,
  className,
  getbuddyUrl,
  petfinderUrl,
  pawPlacerUrl,
  rescueMeUrl,
  rockyKanakaUrl,
  labels = {},
}: AdoptAPetEmbedProps) => {
  const iframeUrl = safeContentUrl(rawIframeUrl);
  const {
    viewAllPrefix = "Or view all pets on",
    listConjunction = " or ",
  } = labels;

  const platforms = [
    { name: "Adopt-a-Pet", url: listingsUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
    ...(pawPlacerUrl ? [{ name: "PawPlacer", url: pawPlacerUrl }] : []),
    ...(rescueMeUrl ? [{ name: "Rescue Me", url: rescueMeUrl }] : []),
    ...(rockyKanakaUrl ? [{ name: "Rocky Kanaka", url: rockyKanakaUrl }] : []),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className={className}>
      <div className="space-y-4">
        {shelterId && /^\d+$/.test(shelterId) ? (
          /* overflow-x-auto stays (TPL-068): on a 375px screen the wider widget scrolls sideways instead of being clipped. No border: the card around the section already frames it. */
          <div className="max-w-full overflow-x-auto overflow-y-hidden" style={{ width: scrollerWidth + SCROLLBAR_ALLOWANCE }}>
            <iframe
              srcDoc={buildScrollerSrcDoc(shelterId, scrollerWidth, scrollerHeight)}
              title={`${title} widget`}
              className="block"
              width={scrollerWidth + SCROLLBAR_ALLOWANCE}
              height={scrollerHeight + 53}
              loading="lazy"
              sandbox="allow-scripts"
            />
          </div>
        ) : showIframe && iframeUrl ? (
          <div className="overflow-hidden">
            <iframe
              src={iframeUrl}
              title={title}
              className="w-full"
              style={{ height: `${iframeHeight}px` }}
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

export default AdoptAPetEmbed;
