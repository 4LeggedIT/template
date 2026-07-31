export type NavDropdownItem = {
  label: string;
  href: string;
  /** Optional section header this item is grouped under in the dropdown. Items without a group render at the top, ungrouped. */
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
      { label: "Overview", href: "/standards" },
      { label: "Adoptable Pets", href: "/standards/adoptable-pets", group: "Pets & Adoption" },
      { label: "Dog Spotlight", href: "/standards/dog-spotlight", group: "Pets & Adoption" },
      { label: "Found", href: "/standards/found", group: "Pets & Adoption" },
      { label: "Placement", href: "/standards/placement-help", group: "Pets & Adoption" },
      { label: "Events & News", href: "/standards/events-news", group: "Content & Engagement" },
      { label: "News Highlight", href: "/standards/news-highlight", group: "Content & Engagement" },
      { label: "Journey Timeline", href: "/standards/journey-timeline", group: "Content & Engagement" },
      { label: "Success Stories", href: "/standards/success-stories", group: "Content & Engagement" },
      { label: "Testimonials", href: "/standards/testimonials", group: "Content & Engagement" },
      { label: "Flyer Library", href: "/standards/flyer-library", group: "Content & Engagement" },
      { label: "Media Gallery", href: "/standards/media-gallery", group: "Content & Engagement" },
      { label: "FAQ", href: "/standards/faq-disclosure", group: "Content & Engagement" },
      { label: "FormEmbedModal", href: "/standards/form-embed-modal", group: "Forms & Payments" },
      { label: "PayPal Donate", href: "/standards/paypal-donate", group: "Forms & Payments" },
      { label: "Community Partners", href: "/standards/community-partners", group: "Community" },
      { label: "Kennel & Display Tools", href: "/standards/kennel-display-tools", group: "Tools" },
      { label: "Documents", href: "/standards/documents", group: "Tools" },
      { label: "Build & Validation", href: "/standards/workflow/build-validation", group: "Workflow" },
      { label: "CI Build Workflow", href: "/standards/workflow/ci-build", group: "Workflow" },
      { label: "No-JS Fallbacks", href: "/standards/workflow/no-js-fallbacks", group: "Workflow" },
    ],
  },
];
