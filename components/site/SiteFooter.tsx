import Image from "next/image";
import { AnkaraPattern } from "./AnkaraPattern";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { getVenueSettings, whatsappDigits } from "@/lib/venue";

function SocialCircle({ label, name, href }: { label: string; name: string; href: string | null }) {
  const classes =
    "flex h-11 w-11 items-center justify-center rounded-full border border-gold text-[15px] font-bold text-cream-text lg:h-12 lg:w-12";
  if (!href) {
    return (
      <span aria-hidden className={`${classes} opacity-50`} title={`${name} — coming soon`}>
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={`${classes} hover:bg-palm transition-colors`}
    >
      {label}
    </a>
  );
}

export async function SiteFooter() {
  const venue = await getVenueSettings();
  const waHref = `https://wa.me/${whatsappDigits(venue.whatsappNumber)}`;

  return (
    <footer className="relative overflow-hidden bg-palm-deep">
      <AnkaraPattern opacity={0.08} corners={false} />
      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-4.5 px-5 pt-8 pb-7 text-center lg:gap-9 lg:px-10 lg:pt-14 lg:pb-10">
        <div className="rounded-md border border-gold bg-card px-4 py-2.5 lg:px-4 lg:py-2.5">
          <Image
            src="/nupwb-logo.jpeg"
            alt="Nwoke Udi Palm Wine Bar"
            width={200}
            height={172}
            className="block h-20.5 w-auto mix-blend-multiply lg:h-27.5"
          />
        </div>

        <p className="text-[16px] leading-[1.65] text-cream-text-soft lg:hidden">{venue.address}</p>

        <div className="flex w-full flex-col gap-2.25 lg:hidden">
          <a
            href={`tel:${venue.phone.replace(/\s/g, "")}`}
            className="flex h-12 items-center justify-center rounded-md border border-gold-light/50 bg-palm text-[16px] font-semibold text-cream-text!"
          >
            {venue.phone}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2.25 rounded-md border border-gold text-[16px] font-semibold text-cream-text!"
          >
            <WhatsAppGlyph className="h-4 w-4.5 rounded-tl-[9px] rounded-tr-[9px] rounded-bl-[9px] rounded-br-xs" />
            WhatsApp us
          </a>
        </div>

        <p className="text-[16px] leading-[1.6] text-cream-text-soft lg:hidden">
          Open daily 12:00 — 23:00
          <br />
          Fri &amp; Sat until midnight
        </p>

        <div className="hidden w-full grid-cols-3 gap-10 lg:grid">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[.2em] text-cream-text-soft/70">
              Find us
            </p>
            <p className="text-[17px] leading-[1.65] text-cream-text-soft">{venue.address}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[.2em] text-cream-text-soft/70">
              Talk to us
            </p>
            <p className="text-[17px] leading-[1.65] text-cream-text-soft">
              {venue.phone}
              <br />
              WhatsApp · {venue.email}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[.2em] text-cream-text-soft/70">
              Opening hours
            </p>
            <p className="text-[17px] leading-[1.65] text-cream-text-soft">
              Daily 12:00 — 23:00
              <br />
              Fri &amp; Sat until midnight
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 lg:gap-3.5">
          <SocialCircle label="IG" name="Instagram" href={venue.socialLinks.instagram} />
          <SocialCircle label="FB" name="Facebook" href={venue.socialLinks.facebook} />
          <SocialCircle label="TT" name="TikTok" href={venue.socialLinks.tiktok} />
        </div>

        <div
          aria-hidden
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg,rgba(212,163,44,0),#D4A32C,rgba(212,163,44,0))" }}
        />

        <p className="text-[14px] text-cream-text-soft/80 lg:text-[15px]">
          © 2026 {venue.venueName} · Awka, Nigeria
        </p>
      </div>
    </footer>
  );
}
