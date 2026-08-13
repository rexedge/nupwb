import { AkwateBand } from "@/components/site/AkwateBand";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import { MenuView } from "@/components/site/MenuView";
import { getMenu } from "@/lib/queries";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";

// Reads live menu data from the DB — admin edits (prices, availability) must show up immediately.
export const dynamic = "force-dynamic";

export default async function DrinksPage() {
  const [categories, venue] = await Promise.all([getMenu("DRINK"), getVenueSettings()]);
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-[#D4A32C]/40 bg-[#083D22] px-6 py-14 text-center text-[#FBF6EC]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E7DFCB]">
            {venue.venueName}
          </span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Mmanya Nwoke Udi</h1>
          <p className="font-display text-lg italic text-[#E7DFCB] sm:text-xl">
            Drinks Menu &amp; Palm Wine Selection
          </p>
        </div>
      </section>

      <AkwateBand />

      <MenuView
        categories={categories}
        kind="drinks"
        menuSlug={venue.menuSlug}
        venueName={venue.venueName}
        whatsappNumber={venue.whatsappNumber}
      />

      <div className="mx-auto w-full max-w-[1240px] px-4 pb-10 lg:px-10">
        <div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-lg bg-[#0E5C34] p-6 text-[#FBF6EC] shadow-md sm:flex-row">
          <div>
            <h3 className="font-display text-xl font-bold">Ready to order at your table?</h3>
            <p className="text-sm text-[#E7DFCB]">Order directly via WhatsApp or speak to our staff.</p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-shrink-0 items-center gap-2 rounded-md bg-[#D4A32C] px-5 py-2.5 text-sm font-semibold text-[#083D22] transition-colors hover:bg-[#E9C46A]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
