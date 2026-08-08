import { siteConfig } from "@/config/site";

// Contact/social field shape varies slightly per site (e.g. `region` vs `state`,
// some sites omit `addressLine1`/`postalCode`/`tiktok` entirely) — cast defensively
// so this module can be copied verbatim across every site's siteConfig.
const contact = siteConfig.contact as
  | {
      email?: string;
      phone?: string;
      addressLine1?: string;
      city?: string;
      region?: string;
      state?: string;
      postalCode?: string;
    }
  | undefined;

const social = siteConfig.social as
  | {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      petfinderUrl?: string;
    }
  | undefined;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": siteConfig.organization?.type || "NonprofitOrganization",
  name: siteConfig.organization?.legalName ?? siteConfig.siteName,
  ...(siteConfig.organization?.alternateName
    ? { alternateName: siteConfig.organization.alternateName }
    : {}),
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}${siteConfig.assets.logoUrl}`,
  description: siteConfig.defaultDescription,
  ...(contact?.email ? { email: contact.email } : {}),
  ...(contact?.phone ? { telephone: contact.phone } : {}),
  ...(contact?.addressLine1
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.addressLine1,
          addressLocality: contact.city,
          addressRegion: contact.region ?? contact.state,
          postalCode: contact.postalCode,
        },
      }
    : {}),
  ...(siteConfig.organization?.ein ? { taxID: siteConfig.organization.ein } : {}),
  sameAs: [
    social?.facebook,
    social?.instagram,
    social?.tiktok,
    social?.petfinderUrl,
  ].filter((value): value is string => Boolean(value)),
};
