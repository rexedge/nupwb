import { getSettings } from "@/lib/queries";
import { venueSettings as defaults } from "@/lib/seed-data";
import type { OpeningHours } from "@/lib/venue-utils";

export type { DayHours, OpeningHours } from "@/lib/venue-utils";
export { whatsappDigits, todayKey, isOpenNow, DAY_LABELS } from "@/lib/venue-utils";

export type VenueSettings = {
  venueName: string;
  shortName: string;
  tagline: string;
  menuSlug: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  mapUrl: string;
  mapLat: number | null;
  mapLng: number | null;
  socialLinks: { instagram: string | null; facebook: string | null; tiktok: string | null };
  openingHours: OpeningHours;
  showFinishedItems: boolean;
};

/** Reads venue settings from the DB Setting table, falling back to seed defaults for any missing key. */
export async function getVenueSettings(): Promise<VenueSettings> {
  const rows = await getSettings();
  const str = (key: keyof typeof defaults, fallback: string) =>
    rows[key] ?? (defaults[key as keyof typeof defaults] as string) ?? fallback;

  return {
    venueName: rows.venueName ?? defaults.venueName,
    shortName: rows.shortName ?? defaults.shortName,
    tagline: rows.tagline ?? defaults.tagline,
    menuSlug: rows.menuSlug ?? defaults.menuSlug,
    address: str("address", defaults.address),
    phone: str("phone", defaults.phone),
    whatsappNumber: str("whatsappNumber", defaults.whatsappNumber),
    email: str("email", defaults.email),
    mapUrl: str("mapUrl", defaults.mapUrl),
    mapLat: rows.mapLat ? Number(rows.mapLat) : (defaults.mapLat ?? null),
    mapLng: rows.mapLng ? Number(rows.mapLng) : (defaults.mapLng ?? null),
    socialLinks: rows.socialLinks ? JSON.parse(rows.socialLinks) : defaults.socialLinks,
    openingHours: rows.openingHours ? JSON.parse(rows.openingHours) : defaults.openingHours,
    showFinishedItems: rows.showFinishedItems ? rows.showFinishedItems === "true" : defaults.showFinishedItems,
  };
}
