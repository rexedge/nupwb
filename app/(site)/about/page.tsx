import Link from "next/link";
import { AkwateBand } from "@/components/site/AkwateBand";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";
import { getVenueSettings, whatsappDigits, todayKey, DAY_LABELS, type OpeningHours } from "@/lib/venue";

// Reads venue settings from the DB — keep dynamic so admin edits show up without a redeploy.
export const dynamic = "force-dynamic";

const KNOWN_FOR = [
  {
    title: "Fresh Palm Wine",
    desc: "Tapped in the morning, on the table by afternoon. Akulu and soft pammy, by the gourd or the 4L can.",
  },
  {
    title: "Traditional Igbo Kitchen",
    desc: "Isi ewu, nkwobi, ugba and abacha, cooked to order. Nothing sits under a heat lamp waiting for you.",
  },
  {
    title: "Grills & Shisha",
    desc: "Barbecue croaker fish and whole roasted chicken off charcoal, with shisha at the back tables after dark.",
  },
];

const GALLERY_ITEMS = [
  { label: "Bar Interior", desc: "Warm evening light & wooden tables" },
  { label: "Palm Wine Service", desc: "Served cold in traditional clay gourds" },
  { label: "Isi Ewu", desc: "Goat head in potash palm oil sauce" },
  { label: "Nkwobi", desc: "Spiced cow foot cooked to order" },
  { label: "The Grill Station", desc: "Fresh fish & chicken off the coals" },
  { label: "Evening Guests", desc: "Good company until generators turn off" },
];

const DAY_ORDER: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default async function AboutPage() {
  const venue = await getVenueSettings();
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;
  const today = todayKey();

  return (
    <div className="flex flex-1 flex-col bg-[#FBF6EC]">
      <section className="relative overflow-hidden bg-[#083D22] px-6 py-16 text-[#FBF6EC] lg:py-24 lg:px-12">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E7DFCB]">
            Awka · Anambra State, Nigeria
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            Akụkọ Anyị <br />
            <span className="font-normal italic text-3xl text-[#E7DFCB] sm:text-5xl">Our Story</span>
          </h1>
          <div className="my-2 h-0.5 w-24 bg-[#D4A32C]" />
          <p className="max-w-2xl text-lg leading-relaxed text-[#E7DFCB] sm:text-xl">
            Nwoke Udi began with one tapper, one gourd and a bench under a zinc roof. People stopped
            for a cup on the way home and stayed until the generators went off.
          </p>
        </div>
      </section>

      <div className="relative h-56 sm:h-72">
        <ImagePlaceholder label="Nwoke Udi — bar frontage at golden hour" className="absolute inset-0" />
      </div>

      <AkwateBand />

      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 text-[#1E1B16]">
        <div className="flex flex-col items-start gap-6 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm sm:flex-row">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-[#D4A32C] bg-[#0E5C34]/10 font-display text-2xl font-bold text-[#0E5C34]">
            Udi
          </div>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-[#6E6455] sm:text-lg">
            <p>
              The bench became a bar, and the bar became a kitchen. The palm still arrives the same
              way it always has — carried in before noon from the groves outside Awka, poured the
              same afternoon, never kept overnight. <strong className="text-[#0E5C34]">Akulu</strong>{" "}
              for the ones who want it strong. <strong className="text-[#0E5C34]">Soft pammy</strong>{" "}
              for everyone else.
            </p>
            <p>
              What we serve beside it has not changed much either. Isi ewu the way our mothers cut
              it, nkwobi in palm oil that tastes of the pot it was made in, abacha sixteen different
              ways. Come hungry, come early, and do not plan anything for afterwards.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <h2 className="font-display text-2xl font-bold text-[#1E1B16] sm:text-3xl">
            What we&apos;re known for
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {KNOWN_FOR.map((item, i) => (
              <div
                key={item.title}
                className="relative flex flex-col gap-3 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A32C] bg-[#0E5C34] text-sm font-bold text-[#FBF6EC]">
                  0{i + 1}
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E1B16]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#6E6455]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-[#1E1B16] sm:text-3xl">The Place</h2>
            <span className="text-sm text-[#6E6455]">Life at Club Road</span>
          </div>
          <GalleryLightbox shots={GALLERY_ITEMS} />
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-2xl font-bold text-[#1E1B16]">Opening Hours</h2>
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
          <p className="mt-2 text-xs italic text-[#6E6455]">* Kitchen closes 45 minutes before the bar.</p>
        </div>
      </section>

      <AkwateBand />

      <section className="bg-[#0E5C34] px-6 py-12 text-center text-[#FBF6EC]">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <h2 className="font-display text-3xl font-bold">Bịa nọdụ</h2>
          <p className="font-display text-lg italic text-[#E7DFCB]">Come and sit with us</p>
          <p className="text-sm text-[#E7DFCB]">{venue.address}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md border border-[#D4A32C] bg-[#083D22] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#0E5C34]"
            >
              Get Directions
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-[#D4A32C] px-6 py-3 text-sm font-semibold text-[#083D22] transition-colors hover:bg-[#E9C46A]"
            >
              <WhatsAppGlyph className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
