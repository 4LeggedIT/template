import type { FaqAccordionItem, FaqAccordionSection } from "@/components/patterns/FaqAccordion";

// Flat mode — single card, no section titles
export const flatFaqItems: FaqAccordionItem[] = [
  {
    id: "faq-1",
    question: "Why use native details/summary?",
    answer: "It removes JS/hydration dependency for basic disclosure behavior and improves no-JS resilience.",
  },
  {
    id: "faq-2",
    question: "What should be checked after migration?",
    answer: "Expand/collapse behavior in JS browsers, no-JS readability, and visual spacing consistency.",
  },
  {
    id: "faq-3",
    question: "When is a custom accordion acceptable?",
    answer: "Avoid it for public FAQ/disclosure content unless there is a documented, reviewed exception.",
  },
];

// Sectioned mode — multiple titled cards, one per section
export const sectionedFaqItems: FaqAccordionSection[] = [
  {
    id: "general",
    title: "General",
    items: [
      {
        id: "what-is",
        question: "What is this organization?",
        answer: "A volunteer-led community rescue group focused on feeding, rescuing, and rehoming stray animals.",
      },
      {
        id: "area",
        question: "What area do you serve?",
        answer: "We primarily serve the local community and surrounding areas. Contact us for out-of-area resources.",
      },
    ],
  },
  {
    id: "adoption",
    title: "Adoption",
    items: [
      {
        id: "how-adopt",
        question: "How do I adopt?",
        answer: "Submit an application on the Adoption page. Our team reviews applications and follows up on potential matches.",
      },
      {
        id: "adoption-fee",
        question: "Is there an adoption fee?",
        answer: "Yes. Fees help offset vaccinations, spay/neuter surgery, and medical care costs.",
      },
    ],
  },
  {
    id: "volunteering",
    title: "Volunteering",
    items: [
      {
        id: "how-volunteer",
        question: "How can I volunteer?",
        answer: "Visit our Volunteer page or contact us directly. No prior experience is required.",
      },
    ],
  },
];
