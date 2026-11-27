/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/printable-doc-config.ts
 * Change it there, then sync it to every site.
 */
export type PrintableDocConfig = {
  orgName: string;
  orgTagline?: string;
  logoSrc: string;
  adoptUrl: string;
  fosterUrl?: string;
  contact: {
    phone?: string;
    phoneDisplay?: string;
    email?: string;
    website: string;
    city?: string;
    state?: string;
  };
  donation?: {
    venmoQrSrc?: string;
    zelleQrSrc?: string;
    venmoHandle?: string;
    zelleEmailOrPhone?: string;
    zelleLabel?: string;
    donationUses?: string[];
  };
  social?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  /** Optional CTA copy shown on the "single" business-card layout's QR side (e.g. "Scan to visit our website!"). Freely editable per site; renders nothing if unset. */
  businessCardCta?: string;
};
