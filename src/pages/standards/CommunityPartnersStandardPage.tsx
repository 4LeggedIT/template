import CommunityPartnersSection, {
  type CommunityPartner,
  type CommunityPartnersCategorySection,
} from "@/components/patterns/CommunityPartnersSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections: CommunityPartnersCategorySection[] = [
  {
    category: "rescuePartners",
    title: "Rescue & Field-Based Partners",
    description: "Fellow rescues and animal welfare organizations we work alongside.",
  },
  {
    category: "veterinaryPartners",
    title: "Veterinary & Medical Partners",
    description: "Trusted clinics and professionals who help keep our dogs healthy.",
  },
  {
    category: "businessPartners",
    title: "Community Business Partners",
    description:
      "Local businesses generously supporting our work. Recognition here reflects our appreciation for their generosity and does not constitute an endorsement of any product or service.",
  },
  {
    category: "technologyPartners",
    title: "Technology Partners",
    description: "The team behind this site's platform and ongoing technical support.",
  },
];

const samplePartners: CommunityPartner[] = [
  {
    id: "cedar-hollow-animal-sanctuary",
    name: "Cedar Hollow Animal Sanctuary",
    category: "rescuePartners",
    description: "A safe haven providing lifetime care and rehabilitation, coordinating placements with us.",
  },
  {
    id: "bright-meadow-rescue-network",
    name: "Bright Meadow Rescue Network",
    category: "rescuePartners",
    description: "Fellow rescue we network dogs with for intake, fostering, and transport support.",
  },
  {
    id: "example-veterinary-clinic",
    name: "Example Veterinary Clinic",
    category: "veterinaryPartners",
    description: "Provides spay/neuter, vaccinations, and discounted emergency care for dogs in our program.",
    url: "https://example.com",
  },
  {
    id: "example-sandwich-co",
    name: "Example Sandwich Co.",
    category: "businessPartners",
    description: "Treats every newly approved foster to a free sandwich as a thank-you for opening their home.",
    url: "https://example.com",
  },
  {
    id: "4leggedit",
    name: "4leggedIT",
    category: "technologyPartners",
    description:
      "Provides free technology support for rescue organizations — clear websites, forms, and workflow systems that reduce missed messages and manual work.",
    logoSrc: "https://www.4leggedit.com/assets/logo-BEMpJuuD.webp",
    url: "https://www.4leggedit.com",
  },
];

const CommunityPartnersStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Community Partners Pattern"
        canonicalPath="/standards/community-partners"
        description="Standardized pattern for thanking rescue collaborators and local business supporters without implying favoritism."
      />
      <PageHero
        eyebrow="Standards"
        title="Community partners pattern"
        description="Use CommunityPartnersSection to publicly acknowledge fellow rescues and local businesses supporting the org."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Community Partners Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <CommunityPartnersSection
            partners={samplePartners}
            sections={sections}
            ctaTitle="Want to Partner With Us?"
            ctaDescription="If your organization or business would like to support our mission, we'd love to hear from you."
            ctaLabel="Get in Touch"
            ctaHref="/contact"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">One category, no CTA</h2>
          <p className="text-sm text-muted-foreground">
            Only partners in the <code>businessPartners</code> category, and no <code>ctaHref</code> passed.
            Categories with zero matching partners (<code>rescuePartners</code>, <code>veterinaryPartners</code>{" "}
            here) render nothing — no heading, no placeholder — and the trailing CTA card is omitted entirely
            rather than shown empty.
          </p>
          <CommunityPartnersSection
            partners={samplePartners.filter((p) => p.category === "businessPartners")}
            sections={sections}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- `category` distinguishes rescue/animal-welfare collaborators (`rescuePartners`) from commercial businesses (`businessPartners`) — these are two genuinely different relationships, not a ranking. A site may define its own category keys as long as `sections` and `partners` use matching values.</p>
            <p>- `veterinaryPartners` ("Veterinary & Medical Partners") is a recommended third category for clinics and medical professionals — a genuinely distinct relationship from both general rescue collaboration and general commercial support, so it gets its own heading rather than being folded into `businessPartners`. It's still governed by the `businessPartners` compliance rule below when the partner is a for-profit clinic: keep the description neutral/factual.</p>
            <p>- **No favoritism, ever.** The component always sorts partners alphabetically by name within a category — never by date added, never manually. Don't add a `featured`/`order` field to work around this; if a site wants a formal tiered sponsorship program, that requires a defined objective threshold (e.g. a real dollar-value giving program) and is out of scope for this pattern.</p>
            <p>- **A category with zero matching partners renders nothing** — no heading, no "coming soon" placeholder. This avoids a dead subsection sitting next to real content; the section appears automatically once the site's data file gets its first entry in that category.</p>
            <p>- The trailing CTA card only renders when `ctaHref` is provided, and shows regardless of which category sections are populated.</p>
            <p>- For `businessPartners` and `veterinaryPartners` (any category naming a for-profit business) specifically: every partner's `description` must stay neutral and factual — no comparative or qualitative language ("best," "highest quality"), no pricing, no purchase inducements. This is the actual compliance mechanism: the IRS qualified-sponsorship rule (26 U.S.C. §513(i)) turns on the acknowledgment's content, not on the presence of a disclaimer sentence — there's no magic-words requirement. A category's `sections[].description` may optionally add a "not an endorsement" note for extra clarity (useful mainly to keep a partner business from treating the listing as marketing copy), but it's editorial, not legally required, and can be dropped if it clashes with the page's tone. Rescue-partner collaboration doesn't need this treatment at all (mutual nonprofit aid isn't a UBIT/advertising concern).</p>
            <p>- Never invent a partner. Every entry must be a real, sourced relationship — a name mentioned once in a single event post is not the same as a standing partnership worth a permanent listing.</p>
            <p>- `logoSrc` and `url` are both optional; the card degrades gracefully to a name-only treatment when a logo isn't available yet. When `url` is set, the logo links to it (if a logo exists) and the "Visit Website" text link is omitted (one link surface is enough); the text link only renders as a fallback when there's a `url` but no `logoSrc`.</p>
            <p>- `logoBackgroundClassName` is an optional backing color (e.g. `"bg-slate-900"`) for logos whose artwork needs a specific background to stay legible — a light or white mark disappears on the card's default background otherwise. Omit it for logos that already read fine as-is; most won't need it.</p>
            <p>- Component: `template/src/components/patterns/CommunityPartnersSection.tsx`</p>
            <p>- First live site: `the-comeback-pack` (`src/pages/Partners.tsx`, `src/data/partners.ts`) — reference implementation for the per-site data file and page wiring.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default CommunityPartnersStandardPage;
