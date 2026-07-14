const DEFAULT_PETFINDER_URL = "https://www.petfinder.com/";

export function normalizePetfinderBaseUrl(value?: string) {
  if (!value) return DEFAULT_PETFINDER_URL;
  try {
    const parsed = new URL(value);
    return `${parsed.origin}/`;
  } catch {
    return DEFAULT_PETFINDER_URL;
  }
}
