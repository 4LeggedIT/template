import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import SocialPostEmbed from "@/components/patterns/SocialPostEmbed";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Public posts used only as examples; swap for the site's own when copying this example.
// Facebook: 4leggedIT's own post. Instagram and TikTok: public posts that pass the live checks
// (TikTok's own documentation example). The pattern drops any of them if it later goes away.
const EXAMPLES = [
  { key: "facebook", url: "https://www.facebook.com/4leggedIT/posts/pfbid0ijdsw58B9RRFNyXkkdGksAvbuapsScqNETdiMCw1F5WjTGqNstbVVv53YVdoXyKRl" },
  { key: "instagram", url: "https://www.instagram.com/p/CuE2WNQs6vH/" },
  { key: "tiktok", url: "https://www.tiktok.com/@scout2015/video/6718335390845095173" },
] as const;

const snippetExample = `import { useCallback, useState } from "react";
import SocialPostEmbed from "@/components/patterns/SocialPostEmbed";

// Any public Facebook, Instagram or TikTok post, photo, reel or video URL.
const [shown, setShown] = useState(true);
const hide = useCallback(() => setShown(false), []); // keep this stable

{shown ? (
  <SocialPostEmbed
    url="https://www.instagram.com/reel/DfpV7lVqnfz/"
    linkLabel={t("viewOriginalPost")} // plain no-JS link under the embed; localize it
    onUnavailable={hide}              // post deleted, private, or the platform refuses to embed it
    knownGone={confirmedGoneUrls}     // optional ReadonlySet<string> seed list, no network call
  />
) : null}

// In a JourneyTimeline stage: { label, description, embedUrl: "<any URL above>" }
// and <JourneyTimeline stages={...} embedLinkLabel={t("viewOriginalPost")} />`;

const Example = ({ url, title, linkLabel, dropped }: { url: string; title: string; linkLabel: string; dropped: string }) => {
  const [gone, setGone] = useState(false);
  const onUnavailable = useCallback(() => setGone(true), []);
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {gone ? <p className="text-sm text-muted-foreground">{dropped}</p> : <SocialPostEmbed url={url} linkLabel={linkLabel} onUnavailable={onUnavailable} />}
    </div>
  );
};

const SocialPostEmbedStandardPage = () => {
  const { t } = useTranslation(["socialPostEmbed", "common"]);

  return (
    <>
      <SEOHead
        title="Social Post Embed Pattern"
        canonicalPath="/standards/social-post-embed"
        description="Standardized pattern for showing a public Facebook, Instagram or TikTok post, reel or video, with live detection of deleted, private or un-embeddable posts."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("socialPostEmbed:hero.title")}
        description={t("socialPostEmbed:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("socialPostEmbed:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          {EXAMPLES.map((example) => (
            <Example
              key={example.key}
              url={example.url}
              title={t(`socialPostEmbed:example.${example.key}Title`)}
              linkLabel={t("socialPostEmbed:example.linkLabel")}
              dropped={t("socialPostEmbed:example.dropped")}
            />
          ))}
        </div>

        <StandardSnippet code={snippetExample} />

        <Card>
          <CardHeader>
            <CardTitle>{t("socialPostEmbed:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("socialPostEmbed:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SocialPostEmbedStandardPage;
