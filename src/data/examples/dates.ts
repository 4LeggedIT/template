/** Example dates are always computed from today so a standards page never shows an expired or future-stale entry. */
const DAY_MS = 24 * 60 * 60 * 1000;

export const daysAgoISO = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString().slice(0, 10);

export const daysFromNowISO = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString().slice(0, 10);

/** A birth date `years` (and optional extra `months`) ago, so example ages never drift. */
export const yearsAgoISO = (years: number, months = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
};

/** The most recent `weekday` (0 = Sunday ... 6 = Saturday) on or before `daysAgo` days ago, as YYYY-MM-DD. */
export const weekdayOnOrBeforeISO = (weekday: number, daysAgo = 0) => {
  const d = new Date(Date.now() - daysAgo * DAY_MS);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() - weekday + 7) % 7));
  return d.toISOString().slice(0, 10);
};

/** The `day`th of the month `monthsAgo` months back, as YYYY-MM-DD. */
export const monthDayAgoISO = (day: number, monthsAgo = 0) => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - monthsAgo);
  return `${d.toISOString().slice(0, 8)}${String(day).padStart(2, "0")}`;
};

const atNoonUtc = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "March 1, 2026" for a YYYY-MM-DD date (English display text; bilingual sites format per locale instead). */
export const formatDateLabel = (iso: string) =>
  atNoonUtc(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "Saturday, March 1, 2026" for a YYYY-MM-DD date. */
export const formatLongDateLabel = (iso: string) =>
  atNoonUtc(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
