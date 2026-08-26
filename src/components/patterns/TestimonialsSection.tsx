import { Fragment, useEffect, useMemo, useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { safeContentUrl } from "@/lib/safe-url";

export type TestimonialItem = {
  id: string;
  quote: string;
  author?: string;
  authorMeta?: string;
  emoji?: string;
  /**
   * Author-written short stand-in for `quote`, used by the `grid` and `featured`
   * layouts when the full quote is too long for a card. Falls back to `quote` when
   * omitted, so adding this field never changes an existing call site's output.
   * Deliberately NOT used by `longform`, which always renders the whole `quote` —
   * and deliberately author-written rather than code-truncated, because slicing a
   * string cuts mid-word, mangles non-English text, and hides content with no
   * no-JS-safe way to reveal it.
   */
  excerpt?: string;
  /**
   * `longform` only. Sentences lifted VERBATIM from `quote`, rendered as a
   * display-size pull quote above the body. Because it repeats body text it is
   * rendered `aria-hidden` — never put unique information here.
   */
  pullQuote?: string;
  /**
   * `longform` only. Optional link on the attribution (e.g. the author's
   * organization). Passed through `safeContentUrl`; a value with a scheme outside
   * http/https/mailto/tel renders as plain text instead of a link.
   */
  authorHref?: string;
};

export type TestimonialsLayout = "grid" | "featured" | "longform";

type TestimonialsSectionProps = {
  title?: string;
  description?: string;
  testimonials: TestimonialItem[];
  layout?: TestimonialsLayout;
  columns?: 1 | 2 | 3;
  /** `featured` only. Ignored by `grid` and `longform`. */
  featuredStrategy?: "first" | "randomOnLoad";
  /** Which single item `featured`/`longform` render. Clamped into range. */
  featuredIndex?: number;
  className?: string;
};

/**
 * Normalizes authored line endings and splits a long quote into paragraphs.
 *
 * - `\r\n` and lone `\r` are normalized to `\n` first (letters pasted out of
 *   Word/Outlook arrive CRLF).
 * - Whitespace immediately before or after any newline is dropped, so a line
 *   with trailing spaces ("...ours.  \n\n") still registers as a real blank-line
 *   boundary, and indentation carried in from a wrapped source doesn't leak in.
 * - One or more blank lines (`\n{2,}`, i.e. 3+ consecutive newlines too) collapse
 *   to exactly one paragraph boundary.
 * - A single surviving `\n` stays inside its paragraph and is rendered as a
 *   `<br />` — this is what keeps a run of consecutive one-line dialogue lines
 *   visually grouped as one block instead of exploding into N paragraphs.
 *
 * Exported for unit tests; call sites should not need it.
 */
export const splitQuoteParagraphs = (quote: string): string[] =>
  quote
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]*\n[^\S\n]*/g, "\n")
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const TestimonialsSection = ({
  title,
  description,
  testimonials,
  layout = "featured",
  columns = 1,
  featuredStrategy = "randomOnLoad",
  featuredIndex = 0,
  className,
}: TestimonialsSectionProps) => {
  const [clientFeaturedIndex, setClientFeaturedIndex] = useState(featuredIndex);

  useEffect(() => {
    // Deliberately client-only randomization, post-hydration: picking Math.random()
    // during render would desync the server-rendered and first client-rendered testimonial.
    if (layout !== "featured" || featuredStrategy !== "randomOnLoad" || testimonials.length <= 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientFeaturedIndex(featuredIndex);
      return;
    }

    const randomIndex = Math.floor(Math.random() * testimonials.length);
    setClientFeaturedIndex(randomIndex);
  }, [featuredIndex, featuredStrategy, layout, testimonials.length]);

  // `longform` and `grid` never read the randomized state at all — their selected
  // item is a pure function of props, so the prerendered HTML, the first client
  // render, and the JS-disabled render are provably the same node. `featured` keeps
  // its existing post-hydration behavior unchanged.
  const resolvedIndex = layout === "featured" ? clientFeaturedIndex : featuredIndex;

  const featuredItem = useMemo(() => {
    if (!testimonials.length) return null;
    const normalized = Math.max(0, Math.min(resolvedIndex, testimonials.length - 1));
    return testimonials[normalized];
  }, [resolvedIndex, testimonials]);

  const longformParagraphs = useMemo(
    () => (layout === "longform" && featuredItem ? splitQuoteParagraphs(featuredItem.quote) : []),
    [featuredItem, layout],
  );

  const longformAuthorHref = layout === "longform" ? safeContentUrl(featuredItem?.authorHref) : undefined;
  const longformAuthorIsExternal = Boolean(longformAuthorHref && /^https?:/i.test(longformAuthorHref));

  const gridColumnsClass = columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";

  if (!testimonials.length) return null;

  return (
    <section className={cn("my-8 rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {layout === "longform" && featuredItem ? (
        <figure className="mx-auto max-w-3xl">
          <Card className="relative overflow-hidden border-border/80 shadow-sm">
            <CardContent className="p-6 md:p-10 lg:p-12">
              <Quote
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-primary/10 md:h-32 md:w-32"
              />

              {featuredItem.pullQuote ? (
                // Verbatim repetition of sentences in the body below, so it is
                // decorative to assistive tech — hiding it prevents hearing the
                // same words twice.
                <p
                  aria-hidden="true"
                  className="relative z-10 mb-8 max-w-[46ch] border-l-4 border-primary/40 pl-5 text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl"
                >
                  {featuredItem.pullQuote}
                </p>
              ) : null}

              {/* No literal quote characters and no `italic`: at letter length an
                  italic face is a genuine legibility/dyslexia problem, and the
                  <figure>/<blockquote> pairing already conveys "this is a quote". */}
              <blockquote className="relative z-10 max-w-[68ch] space-y-5 text-base leading-7 text-foreground md:text-lg md:leading-8">
                {longformParagraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${featuredItem.id}-p${paragraphIndex}`}>
                    {paragraph.split("\n").map((line, lineIndex) => (
                      <Fragment key={`${featuredItem.id}-p${paragraphIndex}-l${lineIndex}`}>
                        {lineIndex > 0 ? <br /> : null}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </blockquote>

              {featuredItem.author || featuredItem.authorMeta || featuredItem.emoji ? (
                <figcaption className="relative z-10 mt-8 max-w-[68ch] border-t border-border pt-6">
                  {featuredItem.author || featuredItem.emoji ? (
                    <p className="text-base font-semibold text-foreground">
                      {featuredItem.author}
                      {featuredItem.emoji ? (
                        <span aria-hidden="true" className={featuredItem.author ? "ml-2" : undefined}>
                          {featuredItem.emoji}
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  {featuredItem.authorMeta ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {longformAuthorHref ? (
                        <a
                          href={longformAuthorHref}
                          className="underline underline-offset-4 hover:text-primary"
                          {...(longformAuthorIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {featuredItem.authorMeta}
                        </a>
                      ) : (
                        featuredItem.authorMeta
                      )}
                    </p>
                  ) : null}
                </figcaption>
              ) : null}
            </CardContent>
          </Card>
        </figure>
      ) : layout === "featured" && featuredItem ? (
        <div className="max-w-3xl">
          <Card className="relative border-border/80 shadow-sm">
            <CardContent className="p-8 md:p-10">
              <Quote className="pointer-events-none absolute left-6 top-6 h-10 w-10 text-primary/20" />
              <div className="relative z-10 space-y-5">
                <p className="whitespace-pre-line pl-8 text-base italic leading-7 text-foreground md:text-lg">
                  "{featuredItem.excerpt ?? featuredItem.quote}"
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
                <p className="whitespace-pre-line text-sm leading-6 text-foreground">
                  "{testimonial.excerpt ?? testimonial.quote}"
                </p>
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
      )}
    </section>
  );
};

export default TestimonialsSection;
