export const addMonthsUtc = (date: Date, months: number): Date => {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

export const parseYmdUtc = (value?: string): Date | null => {
  if (!value) return null;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

export const toExpiryMs = (
  pet: { postedAt?: string; expiresAt?: string },
  defaultExpiryMonths: number,
): number | null => {
  const explicit = parseYmdUtc(pet.expiresAt);
  if (explicit) return explicit.getTime();
  const posted = parseYmdUtc(pet.postedAt);
  if (!posted) return null;
  return addMonthsUtc(posted, defaultExpiryMonths).getTime();
};
