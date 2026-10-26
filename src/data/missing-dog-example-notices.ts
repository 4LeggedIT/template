import type { MissingListing } from "@/components/patterns/MissingListingsSection";
import { type ContentLocale, type LocalizedText, resolveText } from "@/lib/localized-content";

/**
 * Example missing-dog notices for the `/standards/missing` demo, in the shape a real site authors them:
 * `{ en, es }` text, a required plain ISO date (the card prints it in the page's locale), and an inline `// Source:` comment
 * above every entry saying where the notice came from. The source is NEVER rendered: the pattern has no field
 * for it, so the card links nowhere. See `docs/governance/facebook-source-attribution.md` in internal-tools.
 *
 * When a dog is home, flip `status` to `"found"` instead of deleting the entry (it stays here as the record).
 */
type SampleMissingNotice = {
  id: string;
  name: string;
  status: MissingListing["status"];
  /** Required plain ISO date (YYYY-MM-DD) the notice was posted; starts the expiry clock. */
  reportedAtISO: string;
  expiresAt?: string;
  /** Link to the original post (Facebook or another source); the card shows a "view original post" link when set. */
  sourceUrl?: string;
  sourceName?: string;
  area?: LocalizedText;
  safetyNote?: LocalizedText;
  notes: LocalizedText;
  /** Where to send sightings, shown as a text-message link. */
  sightingsPhone?: { display: string; href: string };
  media: { src: string; alt: LocalizedText; featured?: boolean }[];
};

// Dated relative to today so the demo notice never ages past the default 60-day expiry.
const daysAgoISO = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export const sampleMissingNotices: SampleMissingNotice[] = [
  // Source: Facebook post 2026-03-26 (sample missing dog flyer, not a real post; replace with the real post's date and
  // a short lowercase description) —
  // https://www.facebook.com/example/posts/SAMPLE
  {
    id: "sample-missing-biscuit",
    name: "Biscuit",
    status: "missing",
    reportedAtISO: daysAgoISO(10),
    sourceUrl: "https://www.facebook.com",
    sourceName: "Facebook",
    area: { en: "Near Juniper Ave in Eastgate", es: "Cerca de Juniper Ave en Eastgate" },
    safetyNote: {
      en: "Very fearful. Please do not chase.",
      es: "Muy temeroso. Por favor, no lo persigas.",
    },
    notes: {
      en: "Biscuit slipped out of a gate on Tuesday evening. If you see him, please text the number below with the time, the location and the direction he was heading.",
      es: "Biscuit se salió por un portón el martes por la tarde. Si lo ves, por favor envía un mensaje de texto al número de abajo con la hora, el lugar y la dirección en la que iba.",
    },
    sightingsPhone: { display: "(555) 555-0100", href: "sms:+15555550100" },
    // Several images are fine: one shows plain, two or more become a carousel with arrows and a count.
    media: [
      {
        src: "https://placehold.co/900x1200?text=Sample+Missing+Dog+Flyer",
        alt: {
          en: "Sample missing dog flyer for Biscuit",
          es: "Volante de ejemplo de perro perdido de Biscuit",
        },
        featured: true,
      },
      {
        src: "https://placehold.co/1200x800?text=Sample+Photo+of+Biscuit",
        alt: { en: "Sample photo of Biscuit", es: "Foto de ejemplo de Biscuit" },
      },
      {
        src: "https://placehold.co/1200x800?text=Sample+Photo+of+Biscuit+2",
        alt: { en: "Second sample photo of Biscuit", es: "Segunda foto de ejemplo de Biscuit" },
      },
    ],
  },
  // Source: flyer image pasted directly by the operator, 2026-03-20 (sample; no Facebook permalink for the flyer
  // itself). This dog is home, so the notice is kept and its status flipped to "found" rather than deleted.
  {
    id: "sample-home-maple",
    name: "Maple",
    status: "found",
    reportedAtISO: "2026-03-20",
    area: { en: "Near Olive Dr in North Hills", es: "Cerca de Olive Dr en North Hills" },
    notes: {
      en: "Maple is home safe. Thank you to everyone who shared her notice.",
      es: "Maple ya está en casa sana y salva. Gracias a todos los que compartieron su aviso.",
    },
    media: [
      {
        src: "https://placehold.co/900x1200?text=Sample+Home+Dog+Flyer",
        alt: { en: "Sample flyer for Maple", es: "Volante de ejemplo de Maple" },
      },
    ],
  },
];

/** `sightingsLabel` turns the phone number into the final button text (the page owns that copy). */
export const getLocalizedSampleMissingNotices = (
  locale: ContentLocale,
  sightingsLabel: (phone: string) => string,
): MissingListing[] =>
  sampleMissingNotices.map(({ area, safetyNote, notes, sightingsPhone, media, ...rest }) => ({
    ...rest,
    area: resolveText(area, locale),
    safetyNote: resolveText(safetyNote, locale),
    notes: resolveText(notes, locale),
    sightingsAction: sightingsPhone && { label: sightingsLabel(sightingsPhone.display), href: sightingsPhone.href },
    media: media.map((item) => ({ ...item, alt: resolveText(item.alt, locale) })),
  }));
