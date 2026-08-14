import { notFound, redirect } from "next/navigation";
import { getVenueSettings } from "@/lib/venue";

// Table QR codes and share links point at /{menuSlug} (e.g. /nwoke-udi). That slug isn't a
// real page — it's a stable, print-safe address that always forwards to the current menu, so
// printed table tents/QR codes never need reprinting even if the site's page structure changes.
export const dynamic = "force-dynamic";

export default async function MenuSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await getVenueSettings();

  if (slug.toLowerCase() !== venue.menuSlug.toLowerCase()) notFound();

  redirect("/menu");
}
