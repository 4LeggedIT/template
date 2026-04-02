export type PetAgeInput = {
  ageLabel?: string;
  ageLabelOverride?: string;
  birthDate?: string; // YYYY-MM-DD
  ageAtReferenceMonths?: number;
  ageReferenceDate?: string; // YYYY-MM-DD
};

const parseIsoDate = (isoDate: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
};

const daysBetween = (fromISO: string, toDate: Date) => {
  const parsed = parseIsoDate(fromISO);
  if (!parsed) return 0;

  const fromUtc = Date.UTC(parsed.year, parsed.month - 1, parsed.day);
  const toUtc = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const diff = Math.floor((toUtc - fromUtc) / 86_400_000);
  return Math.max(diff, 0);
};

const monthsBetween = (fromISO: string, toDate: Date) => {
  const from = new Date(`${fromISO}T00:00:00`);
  if (Number.isNaN(from.getTime())) return 0;

  const years = toDate.getFullYear() - from.getFullYear();
  const months = toDate.getMonth() - from.getMonth();
  let totalMonths = years * 12 + months;

  if (toDate.getDate() < from.getDate()) {
    totalMonths -= 1;
  }

  return Math.max(totalMonths, 0);
};

const formatAgeFromMonths = (months: number) => {
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (!remainingMonths) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
};

export const resolvePetAgeLabel = (input: PetAgeInput, now = new Date()) => {
  if (input.ageLabelOverride) return input.ageLabelOverride;
  if (input.birthDate) {
    const weeks = Math.floor(daysBetween(input.birthDate, now) / 7);
    if (weeks < 16) {
      return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
    }
    return formatAgeFromMonths(monthsBetween(input.birthDate, now));
  }
  if (typeof input.ageAtReferenceMonths === "number" && input.ageReferenceDate) {
    const delta = monthsBetween(input.ageReferenceDate, now);
    return formatAgeFromMonths(Math.max(input.ageAtReferenceMonths + delta, 0));
  }
  return input.ageLabel;
};
