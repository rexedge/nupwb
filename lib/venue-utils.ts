/**
 * Pure venue helpers with NO server-only imports (no Prisma/pg). Safe to import from Client
 * Components. `lib/venue.ts` re-exports these plus the DB-backed `getVenueSettings()` — but
 * client components must import from THIS file directly, never from `lib/venue.ts`, or the
 * Prisma/pg import chain gets pulled into the browser bundle and the build fails.
 */

export type DayHours = { open: string; close: string; closed: boolean };
export type OpeningHours = Record<
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  DayHours
>;

/** wa.me needs digits only, no "+". */
export function whatsappDigits(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

const DAY_ORDER: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/** Returns today's day key in the venue's local sense (server clock — fine for a single-timezone NG venue). */
export function todayKey(): keyof OpeningHours {
  const jsDay = new Date().getDay(); // 0 = Sunday
  return DAY_ORDER[(jsDay + 6) % 7];
}

export function isOpenNow(hours: OpeningHours): boolean {
  const key = todayKey();
  const today = hours[key];
  if (today.closed) return false;

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60; // crosses midnight
  return minutes >= openMinutes && minutes < closeMinutes;
}

export const DAY_LABELS: Record<keyof OpeningHours, { short: string; full: string }> = {
  monday: { short: "Mon", full: "Monday" },
  tuesday: { short: "Tue", full: "Tuesday" },
  wednesday: { short: "Wed", full: "Wednesday" },
  thursday: { short: "Thu", full: "Thursday" },
  friday: { short: "Fri", full: "Friday" },
  saturday: { short: "Sat", full: "Saturday" },
  sunday: { short: "Sun", full: "Sunday" },
};
