"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { naira } from "@/lib/money";
import { whatsappDigits } from "@/lib/venue-utils";
import { menuUrl as buildMenuUrl } from "@/lib/site-url";
import type { CategoryWithItems } from "@/lib/queries";

function stripPrefix(name: string, prefix?: string | null): string {
  if (!prefix) return name;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

function VariantRow({ label, priceMinor, dim }: { label: string; priceMinor: number; dim: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-1 pl-4 text-[15px] ${dim ? "opacity-50" : ""}`}>
      <span className="text-ink">{label}</span>
      <span className="tabular-nums font-semibold text-ink">{naira(priceMinor)}</span>
    </div>
  );
}

function ItemRow({ item, labelPrefix }: { item: CategoryWithItems["items"][number]; labelPrefix?: string | null }) {
  const dim = !item.available;
  const name = stripPrefix(item.name, labelPrefix);
  const single = item.variants.length === 1 && item.variants[0].label === null;

  let priceNode: React.ReactNode = null;
  if (single) {
    const v = item.variants[0];
    const strike = dim && v.priceMinor > 0;
    priceNode = (
      <span className={`tabular-nums font-semibold text-ink ${strike ? "line-through" : ""}`}>
        {v.priceMinor > 0 ? naira(v.priceMinor) : "—"}
      </span>
    );
  }

  return (
    <div className={`border-b border-[#F0E6CF] py-2.5 last:border-b-0 ${dim ? "opacity-60" : ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-baseline gap-2 text-[16px] font-semibold text-ink">
          {name}
          {dim && (
            <span className="rounded-full bg-[#B7202B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream-text">
              Finished
            </span>
          )}
        </span>
        {single && priceNode}
      </div>
      {item.description && <p className="mt-0.5 text-[14px] text-muted">{item.description}</p>}
      {!single &&
        item.variants.map((v) => (
          <VariantRow key={v.id} label={v.label ?? ""} priceMinor={v.priceMinor} dim={dim} />
        ))}
    </div>
  );
}

export function MenuView({
  categories,
  kind,
  menuSlug,
  venueName,
  whatsappNumber,
}: {
  categories: CategoryWithItems[];
  kind: "drinks" | "food";
  menuSlug: string;
  venueName: string;
  whatsappNumber: string;
}) {
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => i.name.toLowerCase().includes(q)),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, q]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.getAttribute("data-slug") ?? "");
            break;
          }
        }
      },
      { rootMargin: "-140px 0px -70% 0px" },
    );
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [filtered]);

  function jump(slug: string) {
    sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const menuUrl = buildMenuUrl(menuSlug);
  const waHref = `https://wa.me/${whatsappDigits(whatsappNumber)}`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(`Check out the ${kind} menu at ${venueName}: ${menuUrl}`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore, Copy Link is a convenience action
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-card-alt">
      {/* top offset must match Header's rendered height (logo row + padding + Akwete seal strip):
          75px mobile (44px logo + 20px py-2.5 + 11px seal), 93px desktop (56px logo + 24px lg:py-3 + 13px seal) */}
      <div className="sticky top-[75px] z-20 flex flex-col gap-2.5 border-b border-[#E0CD98] bg-card-alt px-4 py-3 lg:top-[93px] lg:px-10">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${kind}…`}
              className="w-full rounded-md border border-[#E0CD98] bg-card px-4 py-2.5 text-[16px] text-ink placeholder:text-muted focus:border-palm focus:outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#E0CD98] text-sm font-bold text-ink"
              >
                ×
              </button>
            )}
          </div>
          <div className="mt-2.5 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => jump(c.slug)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${
                  activeSlug === c.slug
                    ? "border-terracotta bg-terracotta text-cream-text"
                    : "border-gold bg-card text-ink"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-4 py-6 lg:px-10 lg:py-10">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="font-display text-[20px] font-semibold text-ink">
              Nothing matches &ldquo;{query}&rdquo;
            </p>
            <p className="text-[15px] text-muted">Try a shorter word, or ask any of our staff.</p>
          </div>
        )}

        {filtered.map((category) => (
          <section
            key={category.id}
            data-slug={category.slug}
            ref={(el) => {
              sectionRefs.current[category.slug] = el;
            }}
            className="scroll-mt-[220px] lg:scroll-mt-[240px]"
          >
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[24px] font-bold text-ink lg:text-[28px]">{category.name}</h2>
            </div>
            {category.note && <p className="mb-3 text-[14px] text-muted">{category.note}</p>}
            <div className="rounded-md border border-[#E0CD98] bg-card px-4">
              {category.items.map((item) => (
                <ItemRow key={item.id} item={item} labelPrefix={category.labelPrefix} />
              ))}
            </div>
          </section>
        ))}

        <div className="relative overflow-hidden rounded-md border border-[#E0CD98] bg-card p-5">
          <h3 className="font-display text-[20px] font-semibold text-ink">Share this menu</h3>
          <p className="mt-1 hidden text-[15px] text-muted lg:block">
            {menuUrl.replace(/^https?:\/\//, "")} — the same list your table code opens.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <a
              href={shareHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-md border border-terracotta px-4 text-[15px] font-semibold text-terracotta!"
            >
              <WhatsAppGlyph color="#B5562A" className="h-4 w-4.5" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="h-11 rounded-md border border-gold px-4 text-[15px] font-semibold text-palm"
            >
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-muted">
          Prices include VAT. Please ask staff about today&rsquo;s specials.
        </p>
      </div>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-palm text-[11px] font-bold text-cream-text shadow-lg lg:hidden"
        >
          TOP
        </button>
      )}
    </div>
  );
}
