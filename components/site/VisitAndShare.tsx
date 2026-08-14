import { ImagePlaceholder } from "./ImagePlaceholder";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { getVenueSettings, DAY_LABELS, todayKey, type OpeningHours } from "@/lib/venue";
import { SITE_URL, menuUrl } from "@/lib/site-url";

const DAY_ORDER: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/** Collapses consecutive days with identical hours into ranges, e.g. Mon–Thu / Fri–Sat / Sun. */
function collapseHours(hours: OpeningHours) {
  const rows: { key: string; from: keyof OpeningHours; to: keyof OpeningHours; label: string }[] = [];
  let i = 0;
  while (i < DAY_ORDER.length) {
    const start = DAY_ORDER[i];
    const sig = JSON.stringify(hours[start]);
    let j = i;
    while (j + 1 < DAY_ORDER.length && JSON.stringify(hours[DAY_ORDER[j + 1]]) === sig) j++;
    const day = hours[start];
    const label = day.closed ? "Closed" : `${day.open} — ${day.close === "00:00" ? "00:00" : day.close}`;
    rows.push({ key: start, from: start, to: DAY_ORDER[j], label });
    i = j + 1;
  }
  return rows;
}

function CornerFlourish() {
  return (
    <span
      aria-hidden
      className="absolute top-2 left-2 h-5.5 w-5.5 rounded-tl-[15px] border-t border-l border-gold"
    />
  );
}

function QRBox({ size }: { size: "sm" | "lg" }) {
  const isLg = size === "lg";
  const box = isLg ? "h-33 w-33 p-2.75" : "h-22 w-22 p-2";
  const corner = isLg ? "h-7 w-7 border-[5px]" : "h-5 w-5 border-4";
  const edge = isLg ? "top-3.5 right-3.5 bottom-3.5 left-3.5" : "top-2.5 right-2.5 bottom-2.5 left-2.5";
  const [top, right, bottom, left] = edge.split(" ");
  return (
    <div className={`relative flex-none border border-gold bg-white ${box}`}>
      <span
        aria-hidden
        className="absolute inset-2 opacity-60"
        style={{
          backgroundImage: "radial-gradient(#1E1B16 0 1.6px,transparent 1.8px)",
          backgroundSize: "8px 8px",
        }}
      />
      <span aria-hidden className={`absolute ${top} ${left} border-ink bg-white ${corner}`} />
      <span aria-hidden className={`absolute ${top} ${right} border-ink bg-white ${corner}`} />
      <span aria-hidden className={`absolute ${bottom} ${left} border-ink bg-white ${corner}`} />
    </div>
  );
}

function VisitUsCard({
  hours,
  address,
  mapsHref,
  mapEmbedSrc,
}: {
  hours: ReturnType<typeof collapseHours>;
  address: string;
  mapsHref: string;
  mapEmbedSrc: string | null;
}) {
  const today = todayKey();

  return (
    <div className="flex flex-col gap-4 rounded-md border border-[#E0CD98] bg-card p-0 lg:flex-1 lg:flex-[1.15] lg:gap-5.5 lg:p-8">
      <h2 className="font-display text-[30px] font-bold text-ink lg:text-[34px]">Visit Us</h2>

      <div className="rounded-md border border-[#E0CD98] px-4 pt-4 pb-1.5 lg:border-0 lg:p-0">
        {hours.map((row, i) => {
          const isToday = today >= row.from && today <= row.to;
          return (
            <div
              key={row.key}
              className={`flex justify-between py-2.25 ${i < hours.length - 1 ? "border-b border-[#F0E6CF]" : ""}`}
            >
              <span className={`text-[16px] lg:text-[17px] ${isToday ? "font-semibold text-palm" : "text-ink"}`}>
                <span className="lg:hidden">
                  {DAY_LABELS[row.from].full}
                  {row.from !== row.to ? ` – ${DAY_LABELS[row.to].full}` : ""}
                </span>
                <span className="hidden lg:inline">
                  {DAY_LABELS[row.from].short}
                  {row.from !== row.to ? ` – ${DAY_LABELS[row.to].short}` : ""}
                </span>
              </span>
              <span className={`text-[16px] tabular-nums lg:text-[17px] ${isToday ? "font-semibold text-palm" : "text-muted"}`}>
                {row.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2.75 lg:mt-1">
        <span
          aria-hidden
          className="mt-0.75 h-4.5 w-4.5 flex-none -rotate-45 bg-terracotta"
          style={{ borderRadius: "50% 50% 50% 0" }}
        />
        <p className="text-[16px] leading-[1.55] text-ink lg:text-[17px]">{address}</p>
      </div>

      <div className="relative h-37.5 overflow-hidden border border-[#E0CD98] bg-card p-1.25 lg:h-57.5 lg:min-h-57.5 lg:p-1.5">
        {mapEmbedSrc ? (
          <iframe
            src={mapEmbedSrc}
            title="Map"
            loading="lazy"
            className="absolute inset-1.25 h-[calc(100%-10px)] w-[calc(100%-10px)] border-0 lg:inset-1.5 lg:h-[calc(100%-12px)] lg:w-[calc(100%-12px)]"
          />
        ) : (
          <ImagePlaceholder label="Map preview" className="absolute inset-1.25 lg:inset-1.5" />
        )}
      </div>

      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-fit items-center justify-center rounded-md border border-gold px-6.5 text-[16px] font-semibold text-palm! lg:text-[17px]"
      >
        Open in Maps
      </a>
    </div>
  );
}

function ShareCard({ menuSlug, shareHref }: { menuSlug: string; shareHref: string }) {
  return (
    <div className="relative flex flex-col gap-4 rounded-md border border-[#E0CD98] bg-card p-4.5 lg:flex-1 lg:justify-center lg:gap-5 lg:p-8">
      <CornerFlourish />
      <div className="flex items-center gap-4 lg:gap-6">
        <QRBox size="sm" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-display text-[21px] font-semibold leading-[1.15] text-ink lg:text-[30px]">
            Scan or share
            <br className="hidden lg:block" /> our menu
          </p>
          <p className="text-[16px] text-muted lg:text-[17px]">
            {SITE_URL.replace(/^https?:\/\//, "")}/{menuSlug}
          </p>
        </div>
      </div>
      <p className="hidden text-[17px] leading-[1.6] text-muted lg:block">
        Every table carries this code. Point a phone at it and the full drinks and food list opens — no
        app, no download.
      </p>
      <a
        href={shareHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center gap-2.25 rounded-md border border-terracotta text-[16px] font-semibold text-terracotta! lg:w-fit lg:px-6 lg:text-[17px]"
      >
        <WhatsAppGlyph
          color="#B5562A"
          className="h-4 w-4.5 rounded-tl-[9px] rounded-tr-[9px] rounded-bl-[9px] rounded-br-xs"
        />
        Share on WhatsApp
      </a>
    </div>
  );
}

export async function VisitAndShare() {
  const venue = await getVenueSettings();
  const hours = collapseHours(venue.openingHours);
  const mapsHref =
    venue.mapUrl ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(venue.address);
  const mapEmbedSrc =
    venue.mapLat && venue.mapLng
      ? `https://www.google.com/maps?q=${venue.mapLat},${venue.mapLng}&z=16&output=embed`
      : null;
  const shareHref =
    "https://wa.me/?text=" +
    encodeURIComponent(`Check out the menu at ${venue.venueName}: ${menuUrl(venue.menuSlug)}`);

  return (
    <section className="bg-card-alt px-5 py-7.5 lg:px-10 lg:py-19">
      <div className="flex flex-col-reverse gap-5 lg:mx-auto lg:max-w-[1240px] lg:flex-row lg:items-stretch lg:gap-8">
        <VisitUsCard hours={hours} address={venue.address} mapsHref={mapsHref} mapEmbedSrc={mapEmbedSrc} />
        <ShareCard menuSlug={venue.menuSlug} shareHref={shareHref} />
      </div>
    </section>
  );
}
