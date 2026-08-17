import { Helmet } from "react-helmet-async";
import { normalizePetfinderBaseUrl } from "@/components/patterns/petfinder-url";

type PetfinderScrollerEmbedProps = {
  title?: string;
  organizationIds: string[];
  className?: string;
  limit?: number;
  hideBreed?: boolean;
  petListTitle?: string;
  petfinderUrl?: string;
  getbuddyUrl?: string;
  adoptAPetUrl?: string;
  pawPlacerUrl?: string;
  rescueMeUrl?: string;
  rockyKanakaUrl?: string;
  apiBase?: string;
  s3Url?: string;
  showScriptTag?: boolean;
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    listConjunction?: string;
  };
};

const DEFAULT_SCRIPT_SRC = "https://www.petfinder.com/pet-scroller.bundle.js";
const DEFAULT_S3_URL = "https://dbw3zep4prcju.cloudfront.net/";
const DEFAULT_API_BASE = "https://psl.petfinder.com/graphql";
const DEFAULT_PETFINDER_URL = "https://www.petfinder.com/";

const PetfinderScrollerEmbed = ({
  title = "Adoptable Pets",
  organizationIds,
  className,
  limit = 24,
  hideBreed = false,
  petListTitle = "",
  petfinderUrl = DEFAULT_PETFINDER_URL,
  getbuddyUrl,
  adoptAPetUrl,
  pawPlacerUrl,
  rescueMeUrl,
  rockyKanakaUrl,
  apiBase = DEFAULT_API_BASE,
  s3Url = DEFAULT_S3_URL,
  showScriptTag = true,
  labels = {},
}: PetfinderScrollerEmbedProps) => {
  const {
    viewAllPrefix = "Or view all pets on",
    listConjunction = " or ",
  } = labels;

  const organizationJson = JSON.stringify(organizationIds);
  const widgetPetfinderUrl = normalizePetfinderBaseUrl(petfinderUrl);
  const platforms = [
    { name: "Petfinder", url: petfinderUrl },
    ...(adoptAPetUrl ? [{ name: "Adopt-a-Pet", url: adoptAPetUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
    ...(pawPlacerUrl ? [{ name: "PawPlacer", url: pawPlacerUrl }] : []),
    ...(rescueMeUrl ? [{ name: "Rescue Me", url: rescueMeUrl }] : []),
    ...(rockyKanakaUrl ? [{ name: "Rocky Kanaka", url: rockyKanakaUrl }] : []),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className={className}>
      {showScriptTag ? (
        <Helmet>
          <script src={DEFAULT_SCRIPT_SRC} />
        </Helmet>
      ) : null}

      <div className="space-y-4">
        {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}

        <pet-scroller
          s3Url={s3Url}
          apiBase={apiBase}
          organization={organizationJson}
          status="adoptable"
          petfinderUrl={widgetPetfinderUrl}
          hideBreed={hideBreed ? "true" : "false"}
          limit={String(limit)}
          petListTitle={petListTitle}
        />

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

export default PetfinderScrollerEmbed;
