export type NavItem = {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
};

export const templateNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Examples",
    dropdown: [
      { label: "Overview", href: "/examples" },
      { label: "Adoptable Pets", href: "/examples/adoptable-pets" },
      { label: "Events & News", href: "/examples/events-news" },
      { label: "Form Embed Modal", href: "/examples/form-embed-modal" },
      { label: "Found", href: "/examples/found" },
      { label: "FAQ / Disclosure", href: "/examples/faq-disclosure" },
      { label: "Media Gallery", href: "/examples/media-gallery" },
      { label: "Placement", href: "/examples/placement-help" },
      { label: "PayPal Donate", href: "/examples/paypal-donate" },
      { label: "Success Stories", href: "/examples/success-stories" },
      { label: "Testimonials", href: "/examples/testimonials" },
      { label: "No-JS Fallbacks", href: "/examples/no-js-fallbacks" },
    ],
  },
  {
    label: "Docs",
    dropdown: [
      { label: "Overview", href: "/docs" },
      { label: "Adoptable Pets", href: "/docs/standards/adoptable-pets" },
      { label: "Events & News", href: "/docs/standards/events-news" },
      { label: "FAQ / Disclosure", href: "/docs/standards/faq-disclosure" },
      { label: "FormEmbedModal", href: "/docs/standards/form-embed-modal" },
      { label: "Media Gallery", href: "/docs/standards/media-gallery" },
      { label: "Placement", href: "/docs/standards/placement-help" },
      { label: "PayPal Donate", href: "/docs/standards/paypal-donate" },
      { label: "Testimonials", href: "/docs/standards/testimonials" },
      { label: "Build & Validation", href: "/docs/workflow/build-validation" },
      { label: "CI Build Workflow", href: "/docs/workflow/ci-build" },
    ],
  },
];
