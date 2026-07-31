export type ContentLocale = "en" | "es";

export type LocalizedText = string | Record<ContentLocale, string>;

export const toContentLocale = (language?: string): ContentLocale =>
  language?.toLowerCase().startsWith("es") ? "es" : "en";

export function resolveText(value: LocalizedText, locale: ContentLocale): string;
export function resolveText(value: LocalizedText | undefined, locale: ContentLocale): string | undefined;
export function resolveText(value: LocalizedText | undefined, locale: ContentLocale): string | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? value : value[locale] ?? value.en;
}

const INTL_LOCALE_TAGS: Record<ContentLocale, string> = {
  en: "en-US",
  es: "es-US",
};

// BCP 47 tag for Intl.DateTimeFormat/NumberFormat, e.g. EventBanner's date/time display.
export const toIntlLocaleTag = (locale: ContentLocale): string => INTL_LOCALE_TAGS[locale];
