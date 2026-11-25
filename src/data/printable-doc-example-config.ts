import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";

// Generic example org, not a real rescue — used only to demonstrate the Printable Material Module's
// document components with a realistic-looking config shape.
export const printableDocExampleConfig: PrintableDocConfig = {
  orgName: "Example Rescue",
  orgTagline: "Every Animal Deserves a Home",
  logoSrc: "https://placehold.co/200x200?text=Logo",
  adoptUrl: "https://example.org/adopt",
  fosterUrl: "https://example.org/foster",
  contact: {
    email: "hello@example.org",
    website: "https://example.org",
    city: "Example City",
    state: "ST",
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  businessCardCta: "Scan to visit our website!",
};
