import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

export type FaqAccordionSection = {
  id: string;
  title: string;
  items: FaqAccordionItem[];
};

type FaqAccordionProps = {
  items?: FaqAccordionItem[];
  sections?: FaqAccordionSection[];
  title?: string;
  defaultOpen?: boolean;
};

const FaqItems = ({ items, defaultOpen }: { items: FaqAccordionItem[]; defaultOpen: boolean }) => (
  <>
    {items.map((item) => (
      <details key={item.id} open={defaultOpen} className="border-b border-border last:border-b-0 py-2">
        <summary className="py-2 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-4 font-medium">
            <span>{item.question}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
          </span>
        </summary>
        <div className="text-muted-foreground pb-2">{item.answer}</div>
      </details>
    ))}
  </>
);

const FaqAccordion = ({ items, sections, title = "FAQ", defaultOpen = true }: FaqAccordionProps) => {
  if (sections?.length) {
    return (
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.id} aria-label={section.title}>
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
              <FaqItems items={section.items} defaultOpen={defaultOpen} />
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <section aria-label={title} className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <FaqItems items={items ?? []} defaultOpen={defaultOpen} />
      </div>
    </section>
  );
};

export default FaqAccordion;
