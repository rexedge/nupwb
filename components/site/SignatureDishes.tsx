import { ImagePlaceholder } from "./ImagePlaceholder";
import { getFeaturedItems } from "@/lib/queries";
import { naira } from "@/lib/money";

function priceLabel(variants: { priceMinor: number }[]): string {
  if (variants.length === 0) return "";
  const min = Math.min(...variants.map((v) => v.priceMinor));
  return variants.length > 1 ? `from ${naira(min)}` : naira(min);
}

function DishCard({ name, desc, price }: { name: string; desc: string; price: string }) {
  return (
    <div className="relative flex-none w-54.5 overflow-hidden rounded-md border border-[#E0CD98] bg-card lg:w-auto">
      <span
        aria-hidden
        className="absolute top-2 left-2 z-10 h-5.5 w-5.5 rounded-tl-[15px] border-t border-l border-gold lg:top-2 lg:left-2"
      />
      <div className="relative h-37.5 lg:h-52.5">
        <ImagePlaceholder label={name} className="absolute inset-0" />
      </div>
      <div className="flex flex-col gap-1.25 px-3.25 pt-3 pb-3.5 lg:gap-1.75 lg:px-5 lg:pt-4.5 lg:pb-5.5">
        <h3 className="font-display text-[20px] font-semibold text-ink lg:text-[24px]">{name}</h3>
        <p className="text-[16px] leading-[1.45] text-muted lg:text-[17px] lg:leading-[1.5]">{desc}</p>
        <p className="mt-0.5 text-[18px] font-bold tabular-nums text-terracotta lg:text-[20px]">{price}</p>
      </div>
    </div>
  );
}

export async function SignatureDishes() {
  const items = await getFeaturedItems(4);

  return (
    <section className="bg-card-alt pb-5.5 lg:pb-18">
      <div className="flex flex-col gap-4 pt-5.5 lg:mx-auto lg:max-w-[1240px] lg:gap-7 lg:pt-0 lg:px-10">
        <div className="flex items-end justify-between gap-3 px-5 lg:px-0">
          <h2 className="font-display text-[28px] font-bold text-ink lg:text-[42px]">Signature Dishes</h2>
          <a href="/menu" className="whitespace-nowrap text-[16px] font-semibold text-palm! lg:text-[18px]">
            All food →
          </a>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-5 pt-0.5 pb-2 [scrollbar-width:thin] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {items.map((item) => (
            <DishCard
              key={item.id}
              name={item.name}
              desc={item.description ?? ""}
              price={priceLabel(item.variants)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
