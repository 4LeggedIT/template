import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdoptAPetEmbedProps = {
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
  labels?: {
    openButton?: string;
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

const buildScrollerSrcDoc = (shelterId: string, width: number, height: number) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>body { margin: 0; font-family: Helvetica, Arial, Geneva, sans-serif; }</style>
</head>
<body>
<script language="JavaScript">
var AAPPetScrollerSettings = {
    'searchtools_box_width': '${width}',
    'searchtools_box_height': '${height}',
    'size': '${width}x${height}_listnew',
    'title': '',
    'clan_name': '',
    'color': 'green',
    'shelter_id': '${shelterId}',
    'sort_by': 'pet_name'
};
</script>
<div style="height: ${height}px; width: ${width}px; -webkit-overflow-scrolling: touch; overflow-y: scroll;">
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
  iframeUrl,
  iframeHeight = 760,
  showIframe = false,
  className,
  getbuddyUrl,
  petfinderUrl,
  pawPlacerUrl,
  rescueMeUrl,
  labels = {},
}: AdoptAPetEmbedProps) => {
  const {
    openButton = "Open Adopt-a-Pet",
    viewAllPrefix = "Or view all pets on",
    listConjunction = " or ",
  } = labels;

  const platforms = [
    { name: "Adopt-a-Pet", url: listingsUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
    ...(pawPlacerUrl ? [{ name: "PawPlacer", url: pawPlacerUrl }] : []),
    ...(rescueMeUrl ? [{ name: "Rescue Me", url: rescueMeUrl }] : []),
  ];

  return (
    <section className={className}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : <span />}
          <Button asChild variant="outline" size="sm">
            <a href={listingsUrl} target="_blank" rel="noreferrer">
              {openButton}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {shelterId ? (
          <div className="overflow-hidden rounded-xl border border-border/80" style={{ width: scrollerWidth }}>
            <iframe
              srcDoc={buildScrollerSrcDoc(shelterId, scrollerWidth, scrollerHeight)}
              title={`${title} widget`}
              className="block"
              width={scrollerWidth}
              height={scrollerHeight + 53}
              loading="lazy"
            />
          </div>
        ) : showIframe && iframeUrl ? (
          <div className="overflow-hidden rounded-xl border border-border/80">
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
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {platform.name}
              </a>
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
