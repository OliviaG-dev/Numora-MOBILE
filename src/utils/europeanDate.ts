/** Format affiché : JJ-MM-AAAA */
export const EU_DATE_FORMAT_LABEL = "JJ-MM-AAAA";
export const EU_DATE_PLACEHOLDER = "14-05-1990";

/**
 * Formate la saisie utilisateur vers JJ-MM-AAAA (chiffres + tirets).
 */
export function formatEuropeanDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function isValidIsoParts(year: number, month: number, day: number): boolean {
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function toIsoString(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * Convertit JJ-MM-AAAA (ou AAAA-MM-JJ collé) en AAAA-MM-JJ pour l'API.
 */
export function parseDateInputToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const european = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
  if (european) {
    const day = Number(european[1]);
    const month = Number(european[2]);
    const year = Number(european[3]);
    if (!isValidIsoParts(year, month, day)) {
      return null;
    }
    return toIsoString(year, month, day);
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (!isValidIsoParts(year, month, day)) {
      return null;
    }
    return toIsoString(year, month, day);
  }

  return null;
}

export function isValidEuropeanDateInput(value: string): boolean {
  return parseDateInputToIso(value) !== null;
}

/**
 * Affiche une date API (ISO) au format JJ-MM-AAAA.
 */
export function formatIsoToEuropean(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!match) {
    return iso;
  }
  return `${match[3]}-${match[2]}-${match[1]}`;
}

/** Date du jour au format API (AAAA-MM-JJ). */
export function getTodayIso(): string {
  const now = new Date();
  return toIsoString(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
