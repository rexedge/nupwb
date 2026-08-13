/** Formats integer kobo as a Naira display string, e.g. 150000 -> "₦1,500". */
export function naira(minor: number): string {
  return `₦${Math.round(minor / 100).toLocaleString("en-NG")}`;
}

/** Naira -> kobo, for form inputs where the admin types whole-naira amounts. */
export function toMinor(nairaAmount: number): number {
  return Math.round(nairaAmount * 100);
}

/** Kobo -> whole-naira number, for pre-filling form inputs. */
export function toNaira(minor: number): number {
  return Math.round(minor / 100);
}
