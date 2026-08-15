import Link from "next/link";

/**
 * Home / Drinks / Food selector.
 *
 * Table QR codes land a guest straight on one menu (see app/(site)/[slug]/page.tsx). Without
 * this row the only way across to the other menu on a phone is the hamburger, which guests
 * don't open. It lives at the top of MenuView's sticky bar so it is on screen when the page
 * loads AND stays pinned for the whole scroll.
 */
export function MenuSwitch({ current }: { current: "drinks" | "food" }) {
  const base =
    "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border text-[15px] font-semibold transition-colors";
  const active = "border-palm bg-palm text-cream-text!";
  const idle = "border-gold bg-card text-ink!";

  return (
    <nav aria-label="Menu sections" className="flex gap-2">
      <Link href="/" className={`${base} ${idle} max-w-[92px]`}>
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8.5 10 3l7 5.5V16a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V8.5Z" strokeLinejoin="round" />
        </svg>
        Home
      </Link>
      <Link href="/menu" className={`${base} ${current === "drinks" ? active : idle}`} aria-current={current === "drinks" ? "page" : undefined}>
        Drinks
      </Link>
      <Link href="/food" className={`${base} ${current === "food" ? active : idle}`} aria-current={current === "food" ? "page" : undefined}>
        Food
      </Link>
    </nav>
  );
}
