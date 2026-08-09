import { useTranslation } from "react-i18next";
import JourneyTimeline, { type JourneyTimelineStage } from "@/components/patterns/JourneyTimeline";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JourneyTimelineStandardPage = () => {
  const { t } = useTranslation(["journeyTimeline", "common"]);

  const stages: JourneyTimelineStage[] = [
    {
      label: t("journeyTimeline:stages.rescued.label"),
      date: t("journeyTimeline:stages.rescued.date"),
      description: t("journeyTimeline:stages.rescued.description"),
      imageSrc: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      imageAlt: t("journeyTimeline:stages.rescued.imageAlt"),
    },
    {
      label: t("journeyTimeline:stages.cleanBillOfHealth.label"),
      date: t("journeyTimeline:stages.cleanBillOfHealth.date"),
      description: t("journeyTimeline:stages.cleanBillOfHealth.description"),
    },
    {
      label: t("journeyTimeline:stages.today.label"),
      description: t("journeyTimeline:stages.today.description"),
      imageSrc: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      imageAlt: t("journeyTimeline:stages.today.imageAlt"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Journey Timeline Pattern"
        canonicalPath="/standards/journey-timeline"
        description="Vertical rescue-to-today timeline for an individual dog's own detail page."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("journeyTimeline:hero.title")}
        description={t("journeyTimeline:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("journeyTimeline:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("journeyTimeline:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("journeyTimeline:sections.example.part1")} <code>PageHero</code>
            {t("journeyTimeline:sections.example.part2")} <code>JourneyTimeline</code>{" "}
            {t("journeyTimeline:sections.example.part3")} <code>SuccessStoriesSection</code>{" "}
            {t("journeyTimeline:sections.example.part4")} <code>storyHref</code>{" "}
            {t("journeyTimeline:sections.example.part5")}
          </p>

          <Card className="overflow-hidden">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Badge>{t("journeyTimeline:example.badge")}</Badge>
                <h3 className="text-2xl font-semibold tracking-tight">{t("journeyTimeline:example.name")}</h3>
                <p className="text-sm text-muted-foreground">{t("journeyTimeline:example.summary")}</p>
              </div>

              <h4 className="text-base font-semibold">{t("journeyTimeline:example.journeySoFar")}</h4>
              <JourneyTimeline stages={stages} />

              <Card className="border-border/80 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">{t("journeyTimeline:example.ctaTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button size="sm">{t("journeyTimeline:example.applyFoster")}</Button>
                  <Button size="sm" variant="outline">
                    {t("journeyTimeline:example.applyAdopt")}
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("journeyTimeline:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <code>stages: JourneyTimelineStage[]</code> {t("journeyTimeline:standard.stagesType.after")}
            </p>
            <p>
              - {t("journeyTimeline:standard.optionalFields.before")} <code>label</code>/<code>description</code>{" "}
              {t("journeyTimeline:standard.optionalFields.mid1")} <code>date</code>{" "}
              {t("journeyTimeline:standard.optionalFields.mid2")} <code>imageSrc</code>/<code>videoSrc</code>{" "}
              {t("journeyTimeline:standard.optionalFields.mid3")}
            </p>
            <p>
              - <code>videoSrc</code> {t("journeyTimeline:standard.videoSrc.before")}{" "}
              <code>&lt;video controls playsInline poster=&#123;imageSrc&#125;&gt;</code>{" "}
              {t("journeyTimeline:standard.videoSrc.after")}
            </p>
            <p>- {t("journeyTimeline:standard.realContent")}</p>
            <p>
              - {t("journeyTimeline:standard.emptyState.before")} <code>stages</code>{" "}
              {t("journeyTimeline:standard.emptyState.after")}
            </p>
            <p>
              - {t("journeyTimeline:standard.pairsWith.before")} <code>SuccessStoriesSection</code>:{" "}
              {t("journeyTimeline:standard.pairsWith.mid")} <code>storyHref</code>{" "}
              {t("journeyTimeline:standard.pairsWith.after")}
            </p>
            <p>- {t("journeyTimeline:standard.rescueJourneys")}</p>
            <p>- {t("journeyTimeline:standard.component")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default JourneyTimelineStandardPage;
