import { ChevronDown } from "lucide-react";

type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqAccordionItem[];
  title?: string;
  defaultOpen?: boolean;
};

const FaqAccordion = ({ items, title = "FAQ", defaultOpen = true }: FaqAccordionProps) => {
  return (
    <section aria-label={title} className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4">
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
      </div>
    </section>
  );
};

export default FaqAccordion;
