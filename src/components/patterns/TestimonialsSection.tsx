import { useEffect, useMemo, useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type TestimonialItem = {
  id: string;
  quote: string;
  author?: string;
  authorMeta?: string;
  emoji?: string;
};

type TestimonialsSectionProps = {
  title: string;
  description?: string;
  testimonials: TestimonialItem[];
  layout?: "grid" | "featured";
  columns?: 2 | 3;
  featuredStrategy?: "first" | "randomOnLoad";
  featuredIndex?: number;
  emptyMessage?: string;
  className?: string;
};

const TestimonialsSection = ({
  title,
  description,
  testimonials,
  layout = "grid",
  columns = 2,
  featuredStrategy = "first",
  featuredIndex = 0,
  emptyMessage = "Testimonials coming soon.",
  className,
}: TestimonialsSectionProps) => {
  const [clientFeaturedIndex, setClientFeaturedIndex] = useState(featuredIndex);

  useEffect(() => {
    if (layout !== "featured" || featuredStrategy !== "randomOnLoad" || testimonials.length <= 1) {
      setClientFeaturedIndex(featuredIndex);
      return;
    }

    const randomIndex = Math.floor(Math.random() * testimonials.length);
    setClientFeaturedIndex(randomIndex);
  }, [featuredIndex, featuredStrategy, layout, testimonials.length]);

  const featuredItem = useMemo(() => {
    if (!testimonials.length) return null;
    const normalized = Math.max(0, Math.min(clientFeaturedIndex, testimonials.length - 1));
    return testimonials[normalized];
  }, [clientFeaturedIndex, testimonials]);

  const gridColumnsClass = columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>

      {testimonials.length ? (
        layout === "featured" && featuredItem ? (
          <div className="max-w-3xl">
            <Card className="relative border-border/80 shadow-sm">
              <CardContent className="p-8 md:p-10">
                <Quote className="pointer-events-none absolute left-6 top-6 h-10 w-10 text-primary/20" />
                <div className="relative z-10 space-y-5">
                  <p className="whitespace-pre-line pl-8 text-base italic leading-7 text-foreground md:text-lg">
                    “{featuredItem.quote}”
                  </p>
                  {(featuredItem.author || featuredItem.authorMeta || featuredItem.emoji) ? (
                    <div className="flex flex-wrap items-center gap-2 pl-8 text-sm text-muted-foreground">
                      {featuredItem.author ? (
                        <span className="font-semibold text-foreground">— {featuredItem.author}</span>
                      ) : null}
                      {featuredItem.authorMeta ? <span>{featuredItem.authorMeta}</span> : null}
                      {featuredItem.emoji ? <span aria-hidden="true">{featuredItem.emoji}</span> : null}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className={cn("grid gap-4", gridColumnsClass)}>
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full border-border/80">
                <CardHeader className="pb-2">
                  <Quote className="h-5 w-5 text-primary/50" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="whitespace-pre-line text-sm leading-6 text-foreground">“{testimonial.quote}”</p>
                  {(testimonial.author || testimonial.authorMeta || testimonial.emoji) ? (
                    <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                      {testimonial.author ? (
                        <p className="font-medium text-foreground">{testimonial.author}</p>
                      ) : null}
                      {testimonial.authorMeta ? <p>{testimonial.authorMeta}</p> : null}
                      {testimonial.emoji ? <span aria-hidden="true">{testimonial.emoji}</span> : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default TestimonialsSection;
