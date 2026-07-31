import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "Adoptable Pets Slideshow",
    href: "/tools/adoptable-slideshow",
    component: "AdoptableSlideshowSection.tsx",
    description:
      "Full-screen, auto-advancing slideshow of adoptable pets with photo, bio, and a QR code to the adopt URL — for a lobby TV or kiosk display. Includes play/pause and a native fullscreen toggle.",
  },
  {
    title: "Kennel Binder Cards (2-Up)",
    href: "/tools/kennel-binder-2up",
    component: "KennelBinder2UpSection.tsx",
    description:
      "Pick up to two dogs from the manifest and print one letter page with two kennel binder cards side by side, ready for a physical binder at the shelter.",
  },
  {
    title: "Kennel Cards (2-Up)",
    href: "/tools/kennel-cards-2up",
    component: "KennelCards2UpSection.tsx",
    description:
      "Fill in a dog's details manually or load one from the manifest, then print two kennel cards on a single letter page with a cut line between them.",
  },
];

const KennelDisplayToolsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Kennel & Display Tools Pattern"
        canonicalPath="/standards/kennel-display-tools"
        description="Standalone, full-viewport print and kiosk-display tools for shelter/kennel use — slideshow display and 2-up print sheets."
      />
      <PageHero
        eyebrow="Standards"
        title="Kennel & display tools pattern"
        description="Standalone print and kiosk-display tools, separate from the public site — not embedded in a page like other patterns."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Kennel & Display Tools Pattern" },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.href}>
              <CardHeader>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <Link className="text-sm underline underline-offset-4" to={tool.href}>
                  Open live tool
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- These three components are self-contained, full-viewport pages with their own header and `@media print` rules — unlike every other pattern in this template, they are not meant to be embedded inside a normal page layout or previewed inline on a standards page.</p>
            <p>- Their routes (`/tools/*`) are deliberately mounted outside the shared `SiteLayout`/`AppShell` wrapper, so no site header or footer renders around them — that chrome would print alongside the card/slideshow output otherwise.</p>
            <p>- All three take the same core props: `pets` (`PetCardItem[]`), `orgName`, optional `orgLogoSrc`, and `adoptUrl` (encoded into an on-page QR code).</p>
            <p>- Data source is source-agnostic — pass in `PetCardItem[]` from a local manifest, curated array, or any adapter that maps to that shape; these components have no opinion on where the pets come from.</p>
            <p>- `AdoptableSlideshowSection` cycles automatically (`slideIntervalMs`, default 6000ms) and exposes a native Fullscreen API toggle — intended for a lobby TV or kiosk, not for embedding in page content.</p>
            <p>- `KennelBinder2UpSection` and `KennelCards2UpSection` both target US Letter portrait (`@page {"{"} size: letter portrait {"}"}`) and lay out exactly 2 cards per printed page; use the browser's native print dialog (`window.print()`, wired to each page's print button).</p>
            <p>- `KennelCards2UpSection` additionally lets staff hand-fill or photo-upload a card without a manifest entry (e.g. for a same-day intake at an event), unlike `KennelBinder2UpSection`, which only pulls from `pets`.</p>
            <p>- All labels are overridable via each component's `labels` prop for i18n/site customization.</p>
            <p>- Components: `template/src/components/patterns/AdoptableSlideshowSection.tsx`, `KennelBinder2UpSection.tsx`, `KennelCards2UpSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default KennelDisplayToolsStandardPage;
