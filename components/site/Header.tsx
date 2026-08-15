"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AkwateBand } from "./AkwateBand";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Drinks", href: "/menu" },
  { label: "Food", href: "/food" },
  { label: "Contact", href: "/contact" },
] as const;

const WHATSAPP_HREF = "https://wa.me/2348063326573";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8] shadow-[0_2px_10px_rgba(30,27,22,.10)]">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-10 lg:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 lg:gap-3">
          <Image
            src="/assets/nupwb-logo.jpeg"
            alt="Nwoke Udi Palm Wine Bar"
            width={180}
            height={150}
            priority
            className="block h-11 w-auto mix-blend-multiply lg:h-14"
          />
          <span className="flex min-w-0 flex-col gap-px">
            <span className="font-display text-[18px] font-bold leading-[1.05] text-[#0E5C34] lg:text-[22px]">
              Nwoke Udi
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#6E6455] lg:text-[11px] lg:tracking-[.2em]">
              Palm Wine Bar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 py-1 text-[16px] transition-colors ${
                  isActive
                    ? "border-[#D4A32C] font-semibold text-[#0E5C34]"
                    : "border-transparent text-[#1E1B16] hover:border-[#D4A32C]/60 hover:text-[#0E5C34]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-md bg-[#0E5C34] px-4 text-[15px] font-semibold text-[#FBF6EC] hover:bg-[#083D22] transition-colors"
          >
            <WhatsAppGlyph className="h-4 w-[19px]" />
            Chat on WhatsApp
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E5C34] text-[#FBF6EC]"
          >
            <WhatsAppGlyph className="h-4 w-[19px]" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-[#E4D8BC]"
          >
            <span className="h-0.5 w-5 bg-[#0E5C34]" />
            <span className="h-0.5 w-5 bg-[#0E5C34]" />
            <span className="h-0.5 w-3.5 bg-[#0E5C34]" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-[#E4D8BC] bg-[#FBF6EC] px-4 py-3 flex flex-col gap-2 lg:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded text-[16px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#0E5C34] text-[#FBF6EC] font-semibold"
                    : "text-[#1E1B16] hover:bg-[#E0CD98]/30"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      <AkwateBand variant="seal" />
    </header>
  );
}
