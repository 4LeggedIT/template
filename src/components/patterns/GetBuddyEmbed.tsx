type GetBuddyEmbedProps = {
  title?: string;
  embedUrl: string;
  listingsUrl?: string;
  iframeHeight?: number;
  showIframe?: boolean;
  className?: string;
  petfinderUrl?: string;
  adoptAPetUrl?: string;
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

const GetBuddyEmbed = ({
  title = "GetBuddy Listings",
  embedUrl,
  listingsUrl,
  iframeHeight = 900,
  showIframe = true,
  className,
  petfinderUrl,
  adoptAPetUrl,
  labels = {},
}: GetBuddyEmbedProps) => {
  const {
    viewAllPrefix = "Or view all pets on",
    viewAllLink = "GetBuddy",
    listConjunction = " or ",
  } = labels;

  const openUrl = listingsUrl?.trim() || embedUrl;
  const platforms = [
    { name: "GetBuddy", url: openUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(adoptAPetUrl ? [{ name: "Adopt-a-Pet", url: adoptAPetUrl }] : []),
  ];

  return (
    <section className={className}>
      <div className="space-y-4">
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

export default GetBuddyEmbed;
