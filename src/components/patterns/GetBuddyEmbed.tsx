import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type GetBuddyEmbedProps = {
  title?: string;
  embedUrl: string;
  listingsUrl?: string;
  iframeHeight?: number;
  showIframe?: boolean;
  className?: string;
};

const GetBuddyEmbed = ({
  title = "GetBuddy Listings",
  embedUrl,
  listingsUrl,
  iframeHeight = 900,
  showIframe = true,
  className,
}: GetBuddyEmbedProps) => {
  const openUrl = listingsUrl?.trim() || embedUrl;

  return (
    <section className={className}>
      <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              GetBuddy provider integration with direct-listing links and optional inline embed.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={openUrl} target="_blank" rel="noreferrer">
              Open GetBuddy
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {showIframe ? (
          <div className="overflow-hidden rounded-xl border border-border/80">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full"
              style={{ height: `${iframeHeight}px`, border: "none" }}
              loading="lazy"
            />
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Or view all pets on{" "}
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            GetBuddy
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default GetBuddyEmbed;
