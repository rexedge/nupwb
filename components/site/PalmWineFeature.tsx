import Link from "next/link";
import { AnkaraPattern } from "./AnkaraPattern";
import { ImagePlaceholder } from "./ImagePlaceholder";

function PriceChip({ label, price }: { label: string; price: string }) {
  return (
    <div className="flex items-baseline gap-2.5 rounded border border-gold-light/55 px-3 py-2 lg:gap-2.5 lg:px-4 lg:py-2.5">
      <span className="text-[16px] text-cream-text lg:text-[17px]">{label}</span>
      <span className="text-[17px] font-bold tabular-nums text-cream-text lg:text-[18px]">{price}</span>
    </div>
  );
}

export function PalmWineFeature() {
  return (
    <section className="relative overflow-hidden bg-palm">
      <AnkaraPattern opacity={0.08} />
      <div className="relative grid grid-cols-1 gap-4.5 px-5 py-7.5 lg:mx-auto lg:max-w-[1240px] lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-2.5 lg:col-start-1 lg:row-start-1 lg:gap-5.5">
          <p className="text-[13px] font-semibold uppercase tracking-[.22em] text-cream-text-soft lg:text-[14px] lg:tracking-[.24em]">
            The house speciality
          </p>
          <h2 className="font-display text-[34px] font-bold leading-[1.1] text-cream-text text-balance lg:text-[56px] lg:leading-[1.06]">
            Fresh Palm Wine,
            <br />
            Tapped Daily
          </h2>
          {/* House slogan for the akulu, supplied by the client. */}
          <p className="font-display text-[19px] italic text-gold-light lg:text-[22px]">
            Akulu Pammy — Nnaochie Di n&rsquo;mmanya
          </p>
        </div>

        <div className="relative h-53.5 border border-gold p-1.5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:h-110 lg:p-2">
          <ImagePlaceholder label="Clay gourd of palm wine" className="absolute inset-1.5 lg:inset-2" />
        </div>

        <div className="flex flex-col gap-4.5 lg:col-start-1 lg:row-start-2 lg:gap-5.5">
          <p className="text-[16px] leading-[1.6] text-cream-text-soft lg:max-w-130 lg:text-[19px] lg:leading-[1.65]">
            Our tappers bring it in every morning from the palm groves outside Awka — akulu for the
            strong drinkers, soft pammy for the sweet tooth.
            <span className="hidden lg:inline">
              {" "}
              Poured into calabash cups at your table, the way it should be.
            </span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            <PriceChip label="Akulu Pammy" price="₦6,000" />
            <PriceChip label="Soft Pammy" price="₦5,000" />
          </div>
          <Link
            href="/drinks"
            className="flex h-13 items-center justify-center rounded-md border border-gold text-[17px] font-semibold text-cream-text! lg:h-14 lg:w-fit lg:px-8 lg:text-[18px]"
          >
            See the Drinks Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
