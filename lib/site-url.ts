/**
 * Public base URL for the deployed site (QR codes, share links, copy-link buttons).
 * Pure + client-safe — no server-only imports. Set NEXT_PUBLIC_BASE_URL per environment;
 * falls back to the live Vercel URL so links still work if it's ever unset.
 */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "https://nupwb.vercel.app").replace(/\/$/, "");

export function menuUrl(slug: string): string {
  return `${SITE_URL}/${slug}`;
}
