import { AkwateBand } from "@/components/site/AkwateBand";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";
import { ShareClient } from "./ShareClient";

// Reads venue settings from the DB — keep dynamic so admin edits show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function ShareQrPage() {
  const venue = await getVenueSettings();
  const menuUrl = `https://nupwb.ng/${venue.menuSlug}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(`Check out the ${venue.venueName} menu: ${menuUrl}`)}`;

  return (
    <div className="flex flex-1 flex-col bg-[#FBF6EC]">
      <section className="border-b border-[#D4A32C]/40 bg-[#083D22] px-6 py-14 text-center text-[#FBF6EC]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E7DFCB]">
            {venue.venueName}
          </span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Kesaa Anyị</h1>
          <p className="font-display text-lg italic text-[#E7DFCB] sm:text-xl">
            Share Our Menu &amp; QR Code
          </p>
        </div>
      </section>

      <AkwateBand />

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6">
        <ShareClient menuUrl={menuUrl} waHref={waHref} venueName={venue.venueName} />

        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm sm:flex-row">
          <div>
            <h3 className="font-display text-lg font-bold text-[#1E1B16]">Guest Wi-Fi Access</h3>
            <p className="text-xs text-[#6E6455]">Free high-speed Wi-Fi for all patrons.</p>
          </div>
          <div className="flex gap-4 rounded border border-[#E0CD98] bg-[#FBF6EC] px-4 py-2 font-mono text-xs text-[#1E1B16]">
            <span>
              SSID: <strong>NwokeUdi_Guest</strong>
            </span>
            <span>
              Key: <strong>Pammy2026</strong>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
