import type { ReactElement, ReactNode } from "react";
import type { FaqAccordionSection } from "@/components/patterns/FaqAccordion";

// Raw i18n strings use react-i18next's <Trans> numbered-tag markup for the linked segments
// (e.g. "...on the <0>Adopt page</0>.") — strip the tags but keep the inner text.
const stripInlineMarkup = (text: string) => text.replace(/<\/?\d+>/g, "").replace(/\s+/g, " ").trim();

type TransLikeProps = { i18nKey: string; t: (key: string) => string };

// FaqAccordionItem.answer is a ReactNode — a plain string for most items, but items that link out
// to another page wrap their translated text in <Trans t={t} i18nKey="..." components={[<Link />]} />
// (see the per-site data/faq.tsx adapter). <Trans> has no `children` prop carrying the resolved text
// — it resolves the string internally from `i18nKey` via `t` — so rather than rendering it, this
// reaches into those same props directly and calls `t(i18nKey)` to get the identical raw translation
// string (markup and all), then strips the <0>...</0> tags to get plain text.
const isTransElement = (node: ReactNode): node is ReactElement<TransLikeProps> => {
  if (typeof node !== "object" || node === null || !("props" in node)) return false;
  const props = (node as ReactElement).props;
  return (
    typeof props === "object" &&
    props !== null &&
    typeof (props as Partial<TransLikeProps>).i18nKey === "string" &&
    typeof (props as Partial<TransLikeProps>).t === "function"
  );
};

// Some sites don't use <Trans> — they compose an answer as a plain fragment interleaving t()
// strings with inline elements, e.g. <>{t("a")} <Link>{t("b")}</Link> {t("c")}</> (see
// feedingperrisstrays' data/faq equivalent). collectPlainText walks any such ReactNode tree,
// concatenating string content (including inline elements' own children) while preserving
// whitespace between pieces — whitespace is only collapsed once, in toPlainText below, so an
// inner fragment's own trim doesn't eat the space that separates it from a sibling.
const collectPlainText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectPlainText).join("");
  if (isTransElement(node)) return node.props.t(node.props.i18nKey);
  if (typeof node === "object" && "props" in node) {
    return collectPlainText((node as ReactElement<{ children?: ReactNode }>).props?.children);
  }
  return "";
};

const toPlainText = (node: ReactNode): string => stripInlineMarkup(collectPlainText(node));

// Builds a schema.org FAQPage object from the same FaqAccordionSection[] the page renders, so the
// structured data always matches what's actually on the page. Never hand-author a second, parallel
// Q&A array for JSON-LD — see docs/governance/faq-module-wiring-contract.md §3.
export const buildFaqJsonLd = (sections: FaqAccordionSection[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: toPlainText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(item.answer),
      },
    })),
  ),
});
