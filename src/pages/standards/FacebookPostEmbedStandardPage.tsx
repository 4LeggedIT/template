import { useTranslation } from "react-i18next";
import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";
import JourneyTimeline, { type JourneyTimelineStage } from "@/components/patterns/JourneyTimeline";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 4leggedIT's own public post (its oEmbed check passes); swap for the site's own when copying this example.
const EXAMPLE_POST_URL =
  "https://www.facebook.com/4leggedIT/posts/pfbid0ijdsw58B9RRFNyXkkdGksAvbuapsScqNETdiMCw1F5WjTGqNstbVVv53YVdoXyKRl";

const snippetExample = `import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";

// Standalone: any public post, photo, video or reel URL.
const [shown, setShown] = useState(true);
const hide = useCallback(() => setShown(false), []); // keep this stable
{shown ? <FacebookPostEmbed url="https://www.facebook.com/reel/123" onUnavailable={hide} /> : null}

// On a JourneyTimeline stage: the post replaces the stored copy, and the whole
// stage is dropped when the post is deleted or Facebook refuses to embed it.
<JourneyTimeline
  stages={[{ label: "Rescued", date: "July 17, 2026", description: "Fallback copy kept as the record.",
             embedUrl: "https://www.facebook.com/reel/123" }]}
  knownUnavailableEmbeds={unavailablePosts} // optional seed list: src/data/fb-unavailable-posts.ts
/>`;

const FacebookPostEmbedStandardPage = () => {
  const { t } = useTranslation(["facebookPostEmbed", "common"]);

  const stages: JourneyTimelineStage[] = [
    {
      label: t("facebookPostEmbed:example.stage.label"),
      date: t("facebookPostEmbed:example.stage.date"),
      description: t("facebookPostEmbed:example.stage.fallback"),
      embedUrl: EXAMPLE_POST_URL,
    },
    {
      label: t("facebookPostEmbed:example.plainStage.label"),
      description: t("facebookPostEmbed:example.plainStage.description"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Facebook Post Embed Pattern"
        canonicalPath="/standards/facebook-post-embed"
        description="Standardized pattern for showing a public Facebook post or reel, with live detection of deleted or un-embeddable posts."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("facebookPostEmbed:hero.title")}
        description={t("facebookPostEmbed:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("facebookPostEmbed:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("facebookPostEmbed:example.standaloneTitle")}</h2>
          <FacebookPostEmbed url={EXAMPLE_POST_URL} linkLabel={t("facebookPostEmbed:example.linkLabel")} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("facebookPostEmbed:example.timelineTitle")}</h2>
          <JourneyTimeline stages={stages} />
        </div>

        <StandardSnippet code={snippetExample} />

        <Card>
          <CardHeader>
            <CardTitle>{t("facebookPostEmbed:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("facebookPostEmbed:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FacebookPostEmbedStandardPage;
