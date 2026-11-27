import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FlyerBuilderSection, { type FlyerBuilderLabels, type FlyerLocale } from "@/components/patterns/FlyerBuilderSection";
import { lostDogFlyerSpec } from "@/components/patterns/FlyerBuilderSection.specs";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

// Hand-written on purpose (see HAND_WRITTEN_SNIPPET_OK): the labels are a mapping from the site's strings, not props
// a generator can print.
const snippetExample = `import FlyerBuilderSection, { type FlyerBuilderLabels } from "@/components/patterns/FlyerBuilderSection";
import { lostDogFlyerSpec } from "@/components/patterns/FlyerBuilderSection.specs";
import headlineFont from "@/assets/fonts/headline.woff2?url"; // optional, same-origin

// Every visible string comes from the site's own locale file.
const labels: FlyerBuilderLabels = {
  fields: {
    photo: { label: t("tool.photo.label"), hint: t("tool.photo.hint") },
    name: { label: t("tool.name.label") },
    description: { label: t("tool.description.label"), example: t("tool.description.example") },
    phone: { label: t("tool.phone.label"), hint: t("tool.phone.hint") },
  },
  photo: { choose: "Choose a photo", change: "Choose a different photo", privacy: "...", lowRes: "...", errors: { notImage: "...", tooBig: "...", unreadable: "..." } },
  description: { counter: "{{count}} of {{max}} characters", clipped: "..." },
  phoneError: "Please enter a 10-digit US phone number.",
  warnings: { address: "...", reward: "..." },
  previewTitle: "Preview",
  photoPlaceholder: "Your photo goes here",
  previewAlt: (name, phone) => (name ? \`Preview for \${name}. Phone: \${phone}\` : \`Preview. Phone: \${phone}\`),
  actions: { print: "Print flyer", download: "Download image", needMore: "...", working: "Preparing…", printError: "..." },
};

<FlyerBuilderSection
  spec={lostDogFlyerSpec} // or foundDogFlyerSpec, or { ...lostDogFlyerSpec, palette: { ... } }
  locale="en"
  labels={labels}
  headlineFontUrl={headlineFont}
  noScript={{ message: "This tool needs JavaScript.", links: [{ href: "/resources/blank-flyer-en.pdf", label: "Blank flyer (PDF)", lang: "en" }] }}
/>`;

const FlyerBuilderStandardPage = () => {
  const { t, i18n } = useTranslation(["flyerBuilder", "common"]);
  const locale: FlyerLocale = i18n.language.startsWith("es") ? "es" : "en";

  const labels: FlyerBuilderLabels = useMemo(
    () => ({
      fields: {
        photo: { label: t("flyerBuilder:tool.fields.photo.label"), hint: t("flyerBuilder:tool.fields.photo.hint") },
        name: { label: t("flyerBuilder:tool.fields.name.label"), note: t("flyerBuilder:tool.fields.name.note") },
        description: { label: t("flyerBuilder:tool.fields.description.label"), example: t("flyerBuilder:tool.fields.description.example") },
        phone: { label: t("flyerBuilder:tool.fields.phone.label"), hint: t("flyerBuilder:tool.fields.phone.hint") },
      },
      photo: {
        choose: t("flyerBuilder:tool.photo.choose"),
        change: t("flyerBuilder:tool.photo.change"),
        privacy: t("flyerBuilder:tool.photo.privacy"),
        lowRes: t("flyerBuilder:tool.photo.lowRes"),
        errors: {
          notImage: t("flyerBuilder:tool.photo.errors.notImage"),
          tooBig: t("flyerBuilder:tool.photo.errors.tooBig"),
          unreadable: t("flyerBuilder:tool.photo.errors.unreadable"),
        },
      },
      description: { counter: t("flyerBuilder:tool.description.counter"), clipped: t("flyerBuilder:tool.description.clipped") },
      phoneError: t("flyerBuilder:tool.phoneError"),
      warnings: { address: t("flyerBuilder:tool.warnings.address"), reward: t("flyerBuilder:tool.warnings.reward") },
      previewTitle: t("flyerBuilder:tool.previewTitle"),
      photoPlaceholder: t("flyerBuilder:tool.photoPlaceholder"),
      previewAlt: (name, phone) =>
        name ? t("flyerBuilder:tool.previewAltName", { name, phone }) : t("flyerBuilder:tool.previewAlt", { phone }),
      actions: {
        print: t("flyerBuilder:tool.actions.print"),
        download: t("flyerBuilder:tool.actions.download"),
        needMore: t("flyerBuilder:tool.actions.needMore"),
        working: t("flyerBuilder:tool.actions.working"),
        printError: t("flyerBuilder:tool.actions.printError"),
      },
    }),
    [t],
  );

  return (
    <>
      <SEOHead
        title="Flyer Builder Pattern"
        canonicalPath="/standards/flyer-builder"
        description="Standardized browser-only tool that turns a photo, a few details and a phone number into a printable flyer or image. Nothing is uploaded."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("flyerBuilder:hero.title")}
        description={t("flyerBuilder:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("flyerBuilder:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("flyerBuilder:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("flyerBuilder:sections.example.description")}</p>
          <FlyerBuilderSection spec={lostDogFlyerSpec} locale={locale} labels={labels} />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("flyerBuilder:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("flyerBuilder:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default FlyerBuilderStandardPage;
