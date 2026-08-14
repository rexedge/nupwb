import Link from "next/link";
import { getDashboardMetrics, getRecentActivity } from "@/lib/queries";
import { getVenueSettings } from "@/lib/venue";
import { naira } from "@/lib/money";
import { relativeTime, greeting } from "@/lib/time";

function priceOrFinished(item: Awaited<ReturnType<typeof getRecentActivity>>[number]) {
  if (!item.available) {
    return (
      <span className="rounded-full bg-[#B7202B] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#FBF6EC]">
        Finished
      </span>
    );
  }
  if (item.variants.length === 1) return naira(item.variants[0].priceMinor);
  const min = Math.min(...item.variants.map((v) => v.priceMinor));
  return `from ${naira(min)}`;
}

export default async function AdminDashboardPage() {
  const [metrics, activity, venue] = await Promise.all([
    getDashboardMetrics(),
    getRecentActivity(5),
    getVenueSettings(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-8 lg:p-8">
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1E1B16] lg:text-3xl">{greeting()}</h1>
          <p className="text-sm text-[#6E6455]">
            {venue.venueName}
            <span className="hidden lg:inline"> · {venue.address}</span>
          </p>
        </div>
        <div className="hidden gap-3 lg:flex">
          <Link
            href="/admin/items/new"
            className="flex h-11 items-center gap-1.5 rounded-md bg-[#0E5C34] px-4 text-sm font-semibold text-[#FBF6EC] hover:bg-[#083D22]"
          >
            + Add Item
          </Link>
          <Link
            href="/admin/items"
            className="flex h-11 items-center rounded-md border border-[#D4A32C] px-4 text-sm font-semibold text-[#0E5C34] hover:bg-[#D4A32C]/10"
          >
            Edit Prices
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-5 shadow-sm">
          <span className="font-mono text-3xl font-bold text-[#1E1B16]">{metrics.totalItems}</span>
          <span className="text-xs text-[#6E6455]">Total items</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-5 shadow-sm">
          <span className="font-mono text-3xl font-bold text-[#1E1B16]">{metrics.totalCategories}</span>
          <span className="text-xs text-[#6E6455]">Categories</span>
        </div>
        {/* Clickable: the finished list is where you go to put items back on the menu. */}
        <Link
          href="/admin/items?filter=finished"
          className="flex flex-col gap-1 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-5 shadow-sm hover:border-[#D4A32C]"
        >
          <span className="flex items-center gap-1.5 font-mono text-3xl font-bold text-[#B7202B]">
            {metrics.finishedCount}
            <span className="h-2 w-2 rounded-full bg-[#B7202B]" />
          </span>
          <span className="text-xs text-[#6E6455]">
            Marked finished{metrics.finishedCount > 0 && <span className="text-[#0E5C34]"> · review</span>}
          </span>
        </Link>
        <div className="flex flex-col gap-1 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-5 shadow-sm">
          <span className="font-mono text-xl font-bold text-[#0E5C34]">
            {metrics.lastUpdatedAt ? relativeTime(metrics.lastUpdatedAt) : "—"}
          </span>
          <span className="text-xs text-[#6E6455]">Last updated</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "Add a New Item", href: "/admin/items/new", icon: "+" },
          { label: "Edit Prices", href: "/admin/items", icon: "₦" },
          { label: "Mark Items Finished", href: "/admin/items", icon: "−" },
          { label: "Restore Finished Items", href: "/admin/items?filter=finished", icon: "↺" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] px-5 py-4 shadow-sm hover:border-[#D4A32C]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E5C34]/10 text-lg font-bold text-[#0E5C34]">
                {action.icon}
              </span>
              <span className="text-[17px] font-semibold text-[#1E1B16]">{action.label}</span>
            </span>
            <span className="text-xl text-[#6E6455]">→</span>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6E6455]">
            Recently updated
          </h2>
          <Link href="/admin/items" className="text-sm font-semibold text-[#0E5C34] lg:font-semibold lg:text-[16px]">
            See all
          </Link>
        </div>
        <div className="divide-y divide-[#F0E6CF]">
          {activity.map((item) => (
            <div key={item.id}>
              {/* Mobile: name+time stacked left, price right */}
              <div className="flex items-center justify-between gap-4 py-3 lg:hidden">
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-[#1E1B16]">{item.name}</span>
                  <span className="text-xs text-[#6E6455]">
                    {relativeTime(item.updatedAt)}
                    {!item.available && " · marked finished"}
                  </span>
                </div>
                <span className="text-[15px] font-bold tabular-nums text-[#1E1B16]">
                  {priceOrFinished(item)}
                </span>
              </div>
              {/* Desktop: 3-column row */}
              <div className="hidden lg:grid lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-8 lg:py-3">
                <span className="text-[15px] font-semibold text-[#1E1B16]">{item.name}</span>
                <span className="text-[15px] text-[#6E6455]">{relativeTime(item.updatedAt)}</span>
                <span className="justify-self-end text-[15px] font-bold tabular-nums text-[#1E1B16]">
                  {priceOrFinished(item)}
                </span>
              </div>
            </div>
          ))}
          {activity.length === 0 && <p className="py-3 text-sm text-[#6E6455]">No activity yet.</p>}
        </div>
      </div>
    </div>
  );
}
