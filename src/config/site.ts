export type SiteConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  assets: {
    faviconPngUrl?: string;
    faviconIcoUrl?: string;
    logoUrl?: string;
    ogImageUrl?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    petfinderUrl?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    phoneDisplay?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  organization?: {
    type?: string;
    legalName?: string;
    alternateName?: string;
    ein?: string;
    location?: string;
  };
  /** Max upcoming events shown at once in the homepage `EventBanner` strip. Defaults to 2 (`EventBanner`'s own default) when unset. */
  eventBannerMaxVisible?: number;
  name: string;
  description: string;
};

export const siteConfig: SiteConfig = {
  siteName: "Website Template",
  siteUrl: "https://template.4leggedit.com",
  defaultTitle: "Website Template",
  defaultDescription: "Standardized website template for reusable patterns and component verification.",
  assets: {
    faviconPngUrl: "/favicon.png",
    faviconIcoUrl: "/favicon.ico",
    logoUrl: "/favicon.png",
    ogImageUrl: "/og-image.jpg",
  },
  social: {
    petfinderUrl: "",
  },
  contact: {},
  organization: {
    type: "NonprofitOrganization",
    legalName: "",
    location: "",
  },
  name: "Website Template",
  description: "Standardized website template for reusable patterns and component verification.",
};
