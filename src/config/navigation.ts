export type NavDropdownItem = {
  label: string;
  href: string;
  /** i18next key under common.json's `nav` namespace, for items with translatable labels (currently just "Overview"). */
  labelKey?: string;
  /** Optional section header this item is grouped under in the dropdown — an i18next key under common.json's `groups` namespace. Items without a group render at the top, ungrouped. */
  group?: string;
};

export type NavItem = {
  label: string;
  /** i18next key under common.json's `nav` namespace; `label` is the English fallback. Pattern names inside the dropdown are technical/proper nouns and intentionally have no labelKey. */
  labelKey?: string;
  href?: string;
  dropdown?: NavDropdownItem[];
};

export const templateNavItems: NavItem[] = [
  { label: "Home", labelKey: "nav.home", href: "/" },
  {
    label: "Standards",
    labelKey: "nav.standards",
    dropdown: [
      { label: "Overview", labelKey: "nav.overview", href: "/standards" },
      { label: "Adoptable Pets", href: "/standards/adoptable-pets", group: "petsAdoption" },
      { label: "Dog Spotlight", href: "/standards/dog-spotlight", group: "petsAdoption" },
      { label: "Found", href: "/standards/found", group: "petsAdoption" },
      { label: "Placement", href: "/standards/placement-help", group: "petsAdoption" },
      { label: "Events & News", href: "/standards/events-news", group: "contentEngagement" },
      { label: "News Highlight", href: "/standards/news-highlight", group: "contentEngagement" },
      { label: "Blog", href: "/standards/blog", group: "contentEngagement" },
      { label: "Journey Timeline", href: "/standards/journey-timeline", group: "contentEngagement" },
      { label: "Success Stories", href: "/standards/success-stories", group: "contentEngagement" },
      { label: "Testimonials", href: "/standards/testimonials", group: "contentEngagement" },
      { label: "Flyer Library", href: "/standards/flyer-library", group: "contentEngagement" },
      { label: "Media Gallery", href: "/standards/media-gallery", group: "contentEngagement" },
      { label: "FAQ", href: "/standards/faq-disclosure", group: "contentEngagement" },
      { label: "FormEmbedModal", href: "/standards/form-embed-modal", group: "formsPayments" },
      { label: "PayPal Donate", href: "/standards/paypal-donate", group: "formsPayments" },
      { label: "Community Partners", href: "/standards/community-partners", group: "community" },
      { label: "Impact Stats", href: "/standards/impact-stats", group: "community" },
      { label: "Spend Breakdown", href: "/standards/spend-breakdown", group: "community" },
      { label: "Impact & Accountability", href: "/standards/impact-accountability", group: "community" },
      { label: "Kennel & Display Tools", href: "/standards/kennel-display-tools", group: "tools" },
      { label: "Documents", href: "/standards/documents", group: "tools" },
      { label: "Build & Validation", href: "/standards/workflow/build-validation", group: "workflow" },
      { label: "CI Build Workflow", href: "/standards/workflow/ci-build", group: "workflow" },
      { label: "No-JS Fallbacks", href: "/standards/workflow/no-js-fallbacks", group: "workflow" },
    ],
  },
];
