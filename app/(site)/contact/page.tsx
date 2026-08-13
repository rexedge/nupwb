import { AkwateBand } from "@/components/site/AkwateBand";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import {
  getVenueSettings,
  whatsappDigits,
  todayKey,
  isOpenNow,
  DAY_LABELS,
  type OpeningHours,
} from "@/lib/venue";

// Reads venue settings + live open/closed status — must not be frozen at build time.
export const dynamic = "force-dynamic";

const DAY_ORDER: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function SocialCircle({ label, name, href }: { label: string; name: string; href: string | null }) {
  const classes =
    "flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#D4A32C] bg-[#FFFDF8] transition-colors";
  if (!href) {
    return (
      <span className={`${classes} opacity-50`} title={`${name} — coming soon`}>
        <span className="text-sm font-bold">{label}</span>
        <span className="text-[10px]">{name}</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} hover:bg-[#0E5C34] hover:text-[#FBF6EC]`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span className="text-[10px]">{name}</span>
    </a>
  );
}

export default async function ContactPage() {
  const venue = await getVenueSettings();
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;
  const telHref = `tel:${venue.phone.replace(/\s/g, "")}`;
  const mapsHref = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(venue.address);
  const today = todayKey();
  const open = isOpenNow(venue.openingHours);

  return (
    <div className="flex flex-1 flex-col bg-[#FBF6EC]">
      <section className="border-b border-[#D4A32C]/40 bg-[#083D22] px-6 py-14 text-center text-[#FBF6EC]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E7DFCB]">
            Club Road · Awka, Nigeria
          </span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Bịa Hụ Anyị</h1>
          <p className="font-display text-lg italic text-[#E7DFCB] sm:text-xl">
            Visit Us, Reservations &amp; Contact
          </p>
        </div>
      </section>

      <AkwateBand />

      <section className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg border border-[#D4A32C] bg-[#FFFDF8] p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-[#1E1B16]">Talk to us</h2>
            <div className="flex flex-col gap-3 text-sm text-[#1E1B16]">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#0E5C34]" />
                <div>
                  <strong className="block">Address:</strong>
                  <span className="text-[#6E6455]">{venue.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#B5562A]" />
                <div>
                  <strong className="block">Phone:</strong>
                  <a href={telHref} className="font-mono text-[#0E5C34] hover:underline">
                    {venue.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#D4A32C]" />
                <div>
                  <strong className="block">Email:</strong>
                  <a href={`mailto:${venue.email}`} className="text-[#0E5C34] hover:underline">
                    {venue.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md bg-[#0E5C34] py-3 text-sm font-semibold text-[#FBF6EC] transition-colors hover:bg-[#083D22]"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <a
                href={telHref}
                className="rounded-md border border-[#B5562A] py-2.5 text-center text-sm font-semibold text-[#B5562A] transition-colors hover:bg-[#B5562A]/10"
              >
                Call {venue.phone}
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm">
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-[#1E1B16]">Location &amp; Map</h2>
              <p className="text-xs text-[#6E6455]">
                Conveniently located on Club Road (Abakaliki Street), Awka.
              </p>
            </div>

            <div className="flex h-40 flex-col items-center justify-center rounded-md border border-[#D4A32C]/60 bg-[#EFE7D6] p-4 text-center">
              <span className="font-bold text-[#0E5C34]">Club Road (Abakaliki Street)</span>
              <span className="text-xs text-[#6E6455]">Awka, Anambra State</span>
            </div>

            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[#D4A32C] py-2.5 text-center text-sm font-semibold text-[#0E5C34] transition-colors hover:bg-[#D4A32C]/10"
            >
              Get Google Map Directions
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-lg bg-[#0E5C34] px-6 py-8 text-center text-[#FBF6EC] shadow-md">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            There is a gourd with your name on it
          </h2>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 rounded-md bg-[#D4A32C] px-6 py-3 text-sm font-semibold text-[#083D22] transition-colors hover:bg-[#E9C46A]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#1E1B16]">Opening Hours</h2>
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                open
                  ? "border-[#0E5C34]/30 bg-[#0E5C34]/10 text-[#0E5C34]"
                  : "border-[#B7202B]/30 bg-[#B7202B]/10 text-[#B7202B]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-[#0E5C34]" : "bg-[#B7202B]"}`} />
              {open ? "Open now" : "Closed"}
            </span>
          </div>

          <div className="divide-y divide-[#F0E6CF]">
            {DAY_ORDER.map((key) => {
              const isToday = key === today;
              const day = venue.openingHours[key];
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between py-3 text-sm sm:text-base ${
                    isToday ? "font-bold text-[#0E5C34]" : "text-[#1E1B16]"
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    {DAY_LABELS[key].full}
                    {isToday && (
                      <span className="rounded-full bg-[#0E5C34] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#FBF6EC]">
                        Today
                      </span>
                    )}
                  </span>
                  <span className={`font-mono ${isToday ? "text-[#0E5C34]" : "text-[#6E6455]"}`}>
                    {day.closed ? "Closed" : `${day.open} — ${day.close}`}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs italic text-[#6E6455]">
            * Kitchen closes 45 minutes before the bar closing time.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <h3 className="font-display text-xl font-bold text-[#1E1B16]">Find us on social media</h3>
          <div className="flex gap-4">
            <SocialCircle label="IG" name="Insta" href={venue.socialLinks.instagram} />
            <SocialCircle label="FB" name="Facebook" href={venue.socialLinks.facebook} />
            <SocialCircle label="TT" name="TikTok" href={venue.socialLinks.tiktok} />
          </div>
        </div>
      </section>
    </div>
  );
}
