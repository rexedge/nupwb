"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/admin/login/actions";
import { DashboardIcon, MenuListIcon, QrGlyphIcon, SettingsSlidersIcon } from "./NavIcons";
import { AkwateBand } from "@/components/site/AkwateBand";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", Icon: DashboardIcon },
  { label: "Menu", href: "/admin/items", Icon: MenuListIcon },
  { label: "QR", href: "/share", Icon: QrGlyphIcon },
  { label: "Settings", href: "/admin/settings", Icon: SettingsSlidersIcon },
] as const;

function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = initialsFromEmail(email);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#E0CD98] bg-[#FFFDF8] lg:flex">
        <div className="flex items-center gap-3 border-b border-[#E0CD98] px-5 py-5">
          <Image src="/assets/nupwb-logo.jpeg" alt="" width={40} height={34} className="h-9 w-auto mix-blend-multiply" />
          <div className="flex flex-col">
            <span className="font-display text-[17px] font-bold text-[#0E5C34]">Nwoke Udi</span>
            <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#6E6455]">Admin</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                isActive(item.href)
                  ? "border-l-[3px] border-[#D4A32C] bg-[#D4A32C]/10 text-[#0E5C34]"
                  : "border-l-[3px] border-transparent text-[#1E1B16] hover:bg-[#EFE7D6]"
              }`}
            >
              <item.Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-[#E0CD98] p-4">
          <div className="flex items-center gap-2 text-xs text-[#6E6455]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4A32C] bg-[#FBF6EC] text-[11px] font-bold text-[#0E5C34]">
              {initials}
            </span>
            <span className="truncate">{email}</span>
          </div>
          <Link
            href="/"
            className="rounded-md border border-[#D4A32C] px-4 py-2 text-center text-sm font-semibold text-[#0E5C34] hover:bg-[#D4A32C]/10"
          >
            View Site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md border border-[#B7202B]/50 px-4 py-2 text-sm font-semibold text-[#B7202B] hover:bg-[#B7202B]/5"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-full flex-1 flex-col pb-[64px] lg:pb-0">
        {/* Mobile header */}
        <header className="bg-[#083D22] px-4 py-3 text-[#FBF6EC] lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFDF8]">
                <Image src="/assets/nupwb-logo.jpeg" alt="" width={24} height={20} className="h-5 w-auto mix-blend-multiply" />
              </span>
              <span className="font-display text-[17px] font-bold">Admin</span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4A32C] bg-[#FBF6EC] text-[12px] font-bold text-[#0E5C34]"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-md border border-[#E0CD98] bg-[#FFFDF8] shadow-lg">
                  <Link
                    href="/"
                    className="block px-4 py-2.5 text-sm text-[#1E1B16] hover:bg-[#EFE7D6]"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Site
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#B7202B] hover:bg-[#B7202B]/5"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="lg:hidden">
          <AkwateBand variant="seal" />
        </div>

        <main className="flex flex-1 flex-col">{children}</main>

        {/* Mobile bottom tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#E0CD98] bg-[#FFFDF8] lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                isActive(item.href) ? "border-t-[3px] border-[#D4A32C] text-[#0E5C34]" : "border-t-[3px] border-transparent text-[#6E6455]"
              }`}
            >
              <item.Icon className={`h-5 w-5 ${isActive(item.href) ? "text-[#D4A32C]" : ""}`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
