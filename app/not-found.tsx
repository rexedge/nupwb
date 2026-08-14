import Link from "next/link";
import { Header } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AnkaraPattern } from "@/components/site/AnkaraPattern";

const LINKS = [
  { label: "Home", href: "/", desc: "Start from the top" },
  { label: "Drinks Menu", href: "/drinks", desc: "Palm wine, beer, cocktails" },
  { label: "Food Menu", href: "/menu", desc: "Isi ewu, nkwobi, abacha, grills" },
  { label: "Contact", href: "/contact", desc: "Hours, directions, WhatsApp" },
] as const;

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-card-alt px-5 py-16 text-center lg:py-24">
        <AnkaraPattern opacity={0.05} className="fixed" />

        <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-3">
          <span className="font-display text-[96px] font-bold leading-none text-palm/15 lg:text-[140px]">
            404
          </span>
          <h1 className="font-display -mt-6 text-[32px] font-bold text-ink lg:text-[40px]">
            Achọtaghị m ya
          </h1>
          <p className="font-display text-[19px] italic text-muted lg:text-[22px]">
            We couldn&apos;t find that page.
          </p>
          <p className="mt-1 max-w-sm text-[16px] leading-[1.6] text-muted">
            The gourd you&apos;re looking for isn&apos;t on this table. Try one of these instead.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-4 rounded-md border border-[#E0CD98] bg-card px-5 py-4 text-left text-ink! transition-colors hover:border-gold hover:bg-[#0E5C34] hover:text-cream-text!"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-[17px] font-semibold">{link.label}</span>
                  <span className="text-[14px] text-muted">{link.desc}</span>
                </span>
                <span className="text-xl">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
