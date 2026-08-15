import { AkwateBand } from "@/components/site/AkwateBand";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import { MenuView } from "@/components/site/MenuView";
import { getMenu } from "@/lib/queries";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";

// Reads live menu data from the DB — admin edits (prices, availability) must show up immediately.
export const dynamic = "force-dynamic";

export default async function FoodMenuPage() {
  const [categories, venue] = await Promise.all([getMenu("FOOD"), getVenueSettings()]);
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact on phones so the Home/Drinks/Food switcher inside MenuView is on screen for a
          guest who has just scanned a table QR code, with no scrolling. */}
      <section className="border-b border-[#D4A32C]/40 bg-[#083D22] px-6 py-8 text-center text-[#FBF6EC] lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E7DFCB]">
            {venue.venueName}
          </span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Nri na Ihe Ọṅụṅụ</h1>
          <p className="font-display text-lg italic text-[#E7DFCB] sm:text-xl">
            Igbo Delicacies &amp; Traditional Food Menu
          </p>
        </div>
      </section>

      <AkwateBand />

      <MenuView
        categories={categories}
        kind="food"
        menuSlug={venue.menuSlug}
        venueName={venue.venueName}
        showFinished={venue.showFinishedItems}
      />

      <div className="mx-auto w-full max-w-[1240px] px-4 pb-10 lg:px-10">
        <div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-lg bg-[#0E5C34] p-6 text-[#FBF6EC] shadow-md sm:flex-row">
          <div>
            <h3 className="font-display text-xl font-bold">Have a special food order or group table?</h3>
            <p className="text-sm text-[#E7DFCB]">We prepare fresh dishes to order. Message us on WhatsApp.</p>
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
