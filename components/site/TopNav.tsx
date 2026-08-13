"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Design System Home" },
  { href: "/about", label: "About (Akụkọ Anyị)" },
  { href: "/drinks", label: "Drinks Menu" },
  { href: "/menu", label: "Food Menu" },
  { href: "/contact", label: "Contact & Hours" },
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/edit", label: "Admin Item Editor" },
  { href: "/share", label: "Share QR" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#083D22] text-[#FBF6EC] border-b border-[#D4A32C]/40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/nupwb-logo.jpeg"
            alt="NUPWB Logo"
            className="h-9 w-auto rounded border border-[#D4A32C]"
          />
          <div>
            <div className="font-serif font-bold text-lg text-[#FBF6EC] leading-tight">
              Nwoke Udi
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#E7DFCB]">
              Palm Wine Bar
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded transition-colors ${
                  isActive
                    ? "bg-[#0E5C34] text-[#FBF6EC] font-semibold border border-[#D4A32C]"
                    : "text-[#E7DFCB] hover:bg-[#0E5C34]/50 hover:text-[#FBF6EC]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
