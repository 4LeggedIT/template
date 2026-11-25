import type { FaqAccordionSection } from "@/components/patterns/FaqAccordion";

// Reference implementation for a non-i18n site. Content is generic/illustrative — a real site
// replaces every answer with its own organization's actual policies. i18n sites should not copy
// this file directly; see the i18n adapter pattern documented at /standards/faq-accordion.
export const faqSections: FaqAccordionSection[] = [
  {
    id: "adoption",
    title: "Adoption",
    items: [
      {
        id: "adoption-1",
        question: "How do I start the adoption process?",
        answer: "Browse our adoptable pets, then submit an adoption application. Our team reviews every application and follows up to schedule a meet-and-greet.",
      },
      {
        id: "adoption-2",
        question: "What does the adoption fee cover?",
        answer: "Spay/neuter surgery, age-appropriate vaccinations, microchipping, and a health check by our veterinary partner.",
      },
    ],
  },
  {
    id: "fostering",
    title: "Fostering",
    items: [
      {
        id: "foster-1",
        question: "What does fostering involve?",
        answer: "Fosters provide a temporary home, food, and love — we cover veterinary care and supplies for every foster animal.",
      },
    ],
  },
  {
    id: "donations",
    title: "Donations",
    items: [
      {
        id: "donate-1",
        question: "Is my donation tax-deductible?",
        answer: "Yes — we're a registered 501(c)(3) nonprofit, and all donations are tax-deductible to the extent allowed by law.",
      },
    ],
  },
];
