import { useTranslation } from "react-i18next";
import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 4leggedIT's own public post (its oEmbed check passes); swap for the site's own when copying this example.
const EXAMPLE_POST_URL =
  "https://www.facebook.com/4leggedIT/posts/pfbid0ijdsw58B9RRFNyXkkdGksAvbuapsScqNETdiMCw1F5WjTGqNstbVVv53YVdoXyKRl";

const snippetExample = `import { useCallback, useState } from "react";
import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";

// Any public post, photo, video or reel URL.
const [shown, setShown] = useState(true);
const hide = useCallback(() => setShown(false), []); // keep this stable

{shown ? (
  <FacebookPostEmbed
    url="https://www.facebook.com/reel/123"
    linkLabel="View on Facebook"      // plain no-JS link under the embed; localize it
    onUnavailable={hide}              // post deleted, or Facebook refuses to embed it
    knownGone={confirmedDeletedUrls}  // optional ReadonlySet<string> seed list, no network call
  />
) : null}`;

const FacebookPostEmbedStandardPage = () => {
  const { t } = useTranslation(["facebookPostEmbed", "common"]);

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
