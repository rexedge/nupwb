import { ImagePlaceholder } from "./ImagePlaceholder";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";

const RING = (inner: number, outer: number) =>
  `repeating-radial-gradient(circle at 50% 50%,transparent 0 ${inner}px,#E9C46A ${inner}px ${outer}px,transparent ${outer}px ${outer * 2}px)`;

export async function Hero() {
  const venue = await getVenueSettings();
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;

  return (
    <section className="relative h-[492px] overflow-hidden bg-palm-deep lg:h-[620px]">
      <ImagePlaceholder
        label="Hero — gourd & calabash cups on a wooden table"
        className="absolute inset-0"
      />

      {/* gradient scrim: bottom-weighted on mobile, left-weighted on desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg,rgba(8,61,34,.62) 0%,rgba(8,61,34,.74) 46%,rgba(8,61,34,.95) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(100deg,rgba(8,61,34,.94) 0%,rgba(8,61,34,.78) 46%,rgba(8,61,34,.42) 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-[60px] top-11 h-[340px] w-[340px] opacity-[.19] lg:hidden"
        style={{ backgroundImage: RING(28, 29) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[60px] top-[60px] hidden h-[520px] w-[520px] opacity-[.19] lg:block"
        style={{ backgroundImage: RING(40, 41) }}
      />

      <div className="absolute inset-0 flex flex-col justify-end gap-3.5 px-5.5 pb-7.5 lg:justify-center lg:pb-0">
        <div className="lg:mx-auto lg:flex lg:w-full lg:max-w-[1240px] lg:flex-col lg:gap-5 lg:px-10">
          <p className="text-[13px] font-semibold uppercase tracking-[.22em] text-cream-text-soft lg:text-[14px] lg:tracking-[.24em]">
            Awka · Nigeria
          </p>
          <h1 className="mt-3.5 font-display text-[46px] font-bold leading-[1.02] tracking-[-.01em] text-cream-text text-balance lg:mt-0 lg:text-[84px] lg:leading-[.98] lg:tracking-[-.015em]">
            Nwoke Udi
            <br />
            Palm Wine Bar
          </h1>
          <div className="mt-3.5 flex items-center gap-2 lg:mt-0 lg:w-[420px]">
            <span className="h-px w-[46px] bg-gold lg:w-[60px]" />
            <span className="h-[7px] w-[7px] rotate-45 bg-gold" />
            <span
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg,#D4A32C,rgba(212,163,44,0))" }}
            />
          </div>
          <p className="mt-3 font-display text-[22px] italic text-cream-text lg:mt-0 lg:text-[28px]">
            Nnọọ — the home of fresh palm wine
          </p>
          <p className="mt-1.5 max-w-[305px] text-[16px] leading-[1.55] text-cream-text-soft lg:mt-0 lg:max-w-[520px] lg:text-[19px] lg:leading-[1.6]">
            Tapped daily and served cold, with isi ewu, nkwobi and abacha from the kitchen.
          </p>

          <a
            href="/menu"
            className="mt-6 flex h-13 items-center justify-center rounded-md border border-gold bg-palm text-[17px] font-semibold text-cream-text! lg:hidden"
          >
            View Our Menu
          </a>

          <div className="mt-2 hidden gap-3.5 lg:flex">
            <a
              href="/menu"
              className="flex h-14 items-center rounded-md border border-gold bg-palm px-8 text-[18px] font-semibold text-cream-text!"
            >
              View Our Menu
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center rounded-md border border-gold px-8 text-[18px] font-semibold text-cream-text!"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
