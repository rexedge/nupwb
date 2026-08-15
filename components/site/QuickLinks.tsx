import Link from "next/link";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";

function DrinksIcon() {
  return (
    <span aria-hidden className="relative h-8 w-6.5 flex-none lg:h-8 lg:w-6.5">
      <span className="absolute -top-1.5 left-2.5 h-2 w-2 rounded-xs bg-terracotta" />
      <span
        className="absolute inset-0 bg-terracotta"
        style={{ borderRadius: "50% 50% 46% 46% / 62% 62% 38% 38%" }}
      />
    </span>
  );
}

function FoodIcon() {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-[3px] border-palm"
    >
      <span className="h-3.5 w-3.5 rounded-full bg-terracotta" />
    </span>
  );
}

export async function QuickLinks() {
  const venue = await getVenueSettings();
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;

  return (
    <div className="bg-card-alt px-4 pt-5 pb-5.5 lg:px-10 lg:pt-7 lg:pb-8.5">
      <div className="grid grid-cols-2 gap-3 lg:mx-auto lg:max-w-[1240px] lg:grid-cols-3 lg:gap-5">
        <Link
          href="/menu"
          className="flex h-26 flex-col items-center justify-center gap-2.5 rounded-md border border-[#E0CD98] bg-card text-ink! lg:h-24 lg:flex-row lg:justify-start lg:gap-4 lg:px-6"
        >
          <DrinksIcon />
          <span className="flex flex-col items-center gap-0.5 lg:items-start">
            <span className="text-[16px] font-semibold lg:text-[19px]">Drinks Menu</span>
            <span className="hidden text-[16px] text-muted lg:block">Palm wine, beer, cocktails</span>
          </span>
        </Link>

        <Link
          href="/food"
          className="flex h-26 flex-col items-center justify-center gap-2.5 rounded-md border border-[#E0CD98] bg-card text-ink! lg:h-24 lg:flex-row lg:justify-start lg:gap-4 lg:px-6"
        >
          <FoodIcon />
          <span className="flex flex-col items-center gap-0.5 lg:items-start">
            <span className="text-[16px] font-semibold lg:text-[19px]">Food Menu</span>
            <span className="hidden text-[16px] text-muted lg:block">Isi ewu, nkwobi, abacha, grills</span>
          </span>
        </Link>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 flex h-14 items-center justify-center gap-2.5 rounded-md border border-[#E0CD98] bg-card text-ink! lg:col-span-1 lg:h-24 lg:justify-start lg:gap-4 lg:px-6"
        >
          <WhatsAppGlyph
            color="#0E5C34"
            className="h-5 w-6 rounded-tl-[11px] rounded-tr-[11px] rounded-bl-[11px] rounded-br-xs lg:h-6 lg:w-7 lg:rounded-tl-[14px] lg:rounded-tr-[14px] lg:rounded-bl-[14px]"
          />
          <span className="flex flex-col items-center gap-0.5 lg:items-start">
            <span className="text-[16px] font-semibold lg:text-[19px]">Chat on WhatsApp</span>
            <span className="hidden text-[16px] text-muted lg:block">Reserve a table, ask anything</span>
          </span>
        </a>
      </div>
    </div>
  );
}
