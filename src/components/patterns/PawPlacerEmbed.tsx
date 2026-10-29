import { useEffect, useId } from "react";

type PawPlacerEmbedOptions = {
  species?: string;
  limit?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
};

declare global {
  interface Window {
    embedPawPlacerComponent?: (
      component: string,
      organizationId: string,
      targetId: string,
      options?: PawPlacerEmbedOptions,
    ) => void;
  }
}

const PAWPLACER_SCRIPT_SRC = "https://www.pawplacer.com/embed/component";

type PawPlacerEmbedProps = {
  title?: string;
  organizationId: string;
  species?: string;
  limit?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  listingsUrl?: string;
  showEmbed?: boolean;
  className?: string;
  petfinderUrl?: string;
  adoptAPetUrl?: string;
  getbuddyUrl?: string;
  rescueMeUrl?: string;
  rockyKanakaUrl?: string;
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

const PawPlacerEmbed = ({
  title = "PawPlacer Listings",
  organizationId,
  species,
  limit,
  sortBy,
  sortDir,
  listingsUrl,
  showEmbed = true,
  className,
  petfinderUrl,
  adoptAPetUrl,
  getbuddyUrl,
  rescueMeUrl,
  rockyKanakaUrl,
  labels = {},
}: PawPlacerEmbedProps) => {
  const domId = useId().replace(/:/g, "");
  const targetId = `pawplacer-pets-${domId}`;

  const {
    viewAllPrefix = "Or view all pets on",
    viewAllLink = "PawPlacer",
    listConjunction = " or ",
  } = labels;

  const openUrl = listingsUrl?.trim() || `https://www.pawplacer.com/shelters/${organizationId}`;
  const platforms = [
    { name: "PawPlacer", url: openUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(adoptAPetUrl ? [{ name: "Adopt-a-Pet", url: adoptAPetUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
    ...(rescueMeUrl ? [{ name: "Rescue Me", url: rescueMeUrl }] : []),
    ...(rockyKanakaUrl ? [{ name: "Rocky Kanaka", url: rockyKanakaUrl }] : []),
  ].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!showEmbed) return;

    const mount = () => {
      const options: PawPlacerEmbedOptions = {
        ...(species ? { species } : {}),
        ...(limit ? { limit } : {}),
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(sortDir ? { sort_dir: sortDir } : {}),
      };
      window.embedPawPlacerComponent?.(
        "pets",
        organizationId,
        targetId,
        Object.keys(options).length > 0 ? options : undefined,
      );
    };

    if (window.embedPawPlacerComponent) {
      mount();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${PAWPLACER_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", mount, { once: true });
      return () => existingScript.removeEventListener("load", mount);
    }

    const script = document.createElement("script");
    script.src = PAWPLACER_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", mount, { once: true });
    document.body.appendChild(script);
  }, [organizationId, species, limit, sortBy, sortDir, showEmbed, targetId]);

  return (
    <section className={className}>
      <div className="space-y-4">
        {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}

        {showEmbed ? <div id={targetId} className="min-h-[200px]" /> : null}

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

export default PawPlacerEmbed;
